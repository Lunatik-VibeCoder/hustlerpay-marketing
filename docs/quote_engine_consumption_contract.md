# Quote Engine — Consumption Contract (WEB-CALC-3 Sprint C0)

Status: **design document, no code.** Sprint C (building
`BackendQuoteEngine`) starts only after this is reviewed and approved —
same discipline as Sprint B0. Companion to
`docs/smart_calculator_architecture.md` (Sprint 0) and
`docs/quote_engine_decisions.md` (Sprint B0, the Quote Engine charter —
lives in the Backend repo). This document is about the **consumer
side**: how anything that implements `QuoteEngineProvider` against the
real `/api/v1/quotes` HTTP contract should behave when the network, or
the backend itself, doesn't cooperate.

## Framing

Sprint B shipped a real, production-verified backend contract:
`POST /api/v1/quotes` returns a `Quote` with `status: 'QUOTED' |
'RATE_UNAVAILABLE'` — both are *successful HTTP responses*, the backend
answered, it just may not have a rate yet. This document is about
everything **that isn't that**: the request never reaches the backend,
times out, or the backend itself is down (5xx, unreachable). None of
that is a `RATE_UNAVAILABLE` — conflating them would hide a real outage
behind the same UI as "no administered rate yet," which is dishonest in
the opposite direction from fabricating a number.

---

## 1. Network error taxonomy — a third status, client-side only

The backend's `Quote.status` union (`QUOTED | RATE_UNAVAILABLE`) is a
statement about what the *backend* knows. It cannot express "I never
heard back from the backend" — that's not a backend concern, it's a
consumer concern. Introducing a client-side wrapper avoids polluting
the backend's own contract with client-specific failure modes:

```
QuoteEngineResult
  = { kind: "ok",  quote: Quote }                    // backend answered — QUOTED or RATE_UNAVAILABLE, both real
  | { kind: "unreachable", reason: NetworkFailureReason }  // never got a backend answer at all
```

`NetworkFailureReason` (illustrative, not exhaustive — exact values are
a Sprint C implementation detail): `timeout`, `connection_failed`,
`server_error` (5xx), `unexpected_response` (2xx but doesn't parse as a
`Quote` — a contract-drift canary, not silently swallowed).

**Every `QuoteEngineProvider` implementation returns this wrapper, not
a bare `Quote`.** This is an additive change to §12's interface
(`getQuote(): Promise<QuoteEngineResult>` instead of
`Promise<Quote>`) — flagged explicitly since it touches an already-
approved contract; approving this document approves that change.
`LocalQuoteEngine` (Sprint A) always returns `{ kind: "ok", quote }` —
it has no network to fail.

---

## 2. Timeout policy

**No real backend latency data exists yet** (Sprint B's own production
verification measured single manual requests, not load) — so a timeout
value here is a *client-side UX budget*, not a claim about backend SLA.
Proposed: **10 seconds**, chosen for the same reason a calculator
interaction should never leave a visitor staring at a spinner longer
than that, not because the backend is expected to take that long.
Revisit once real traffic/latency data exists (a client-side constant,
one line to change — not an architectural commitment).

---

## 3. Retry policy

Quote generation has **no side effects** in v1 (no persistence, no
state mutation — confirmed by Sprint B.5's audit) — a retry can never
double-charge, double-book, or duplicate anything. This makes retrying
safe in a way a transaction-initiating call never would be.

**Proposed**: retry only `NetworkFailureReason` cases that are
plausibly transient (`timeout`, `connection_failed`, `server_error`) —
never retry a 4xx (a validation error, ADR-2's rejected `pricingContext`
smuggling, an unsupported corridor — retrying a client mistake wastes a
round-trip and delays the honest error message). Bounded: **1 retry**,
short fixed delay (proposed 500ms — not exponential backoff, since a
single quote request isn't a background job competing for a
rate-limited resource; this mirrors the simplicity of the pass-through
providers themselves, not the Runtime V2 WebSocket reconnect logic,
which solves a different problem — a long-lived connection, not a
single request).

---

## 4. Backend unavailability & the Local/Backend boundary

**The most important rule in this document, stated explicitly because
it's easy to get subtly wrong**: when the backend is unreachable, the
UI must show an honest "temporarily unavailable" state — **it must
never silently fall back to `LocalQuoteEngine`'s demo data.** §12's
composition root already prevents this by construction (one
implementation is wired per build, never both), but this document
names the failure mode explicitly so a future "just fall back to local
if backend is down" convenience patch is recognized immediately as a
violation, not an optimization: a demo number appearing where a real
attempt just failed is indistinguishable from a real number to a
visitor, which is exactly the fabrication the entire charter exists to
prevent.

`{ kind: "unreachable" }` is a **terminal UI state for that request**,
not a trigger to substitute anything.

---

## 5. User-facing messaging — three states, not one

The Calculator UI (Sprint A ships the shell; Sprint C wires it to real
results) must distinguish three states, because they mean different
things to a visitor:

| `QuoteEngineResult` | Meaning | Illustrative message |
|---|---|---|
| `ok` + `status: QUOTED` | Real rate applied | Show the real numbers |
| `ok` + `status: RATE_UNAVAILABLE` | Backend answered: no administered rate for this corridor yet | "Ce corridor n'est pas encore disponible pour une estimation." |
| `unreachable` | Never got a backend answer | "Le service est temporairement indisponible. Réessayez dans un instant." |

Collapsing the last two into one message would tell a visitor "not
available" for two different reasons (one permanent-for-now, one
transient) — worth keeping distinct even if Sprint C's first UI pass
reuses similar visual treatment for both.

---

## 6. Caching — not yet, and here's the actual reasoning

No cache is proposed for Sprint C. Not because caching is bad, but
because there is nothing valuable to cache yet: v1 has zero
administered rates (every real request currently returns
`RATE_UNAVAILABLE`), so a cache today would only cache "unavailable"
responses — which is both low-value and adds real invalidation
complexity (a cached rate must be invalidated the moment the
administered Treasury Rate changes, per Sprint 0's rule-set-reference
mechanism; building that invalidation path before real rates exist
means designing it against a hypothesis, not a real access pattern).
This follows the same anti-premature-optimization precedent already
set for this ecosystem (REPORT-CONNECTORS parked, DESIGN-SYSTEM-2
deferred, ADR-3's Market Feed/Reference FX layers deliberately not
wired). Revisit once real rates and real traffic exist together.

---

## 7. SDK evolution path

Per Sprint 0 §9 (already decided, restated here for this document's
completeness): a future SDK is a **thin HTTP client** wrapping
`/api/v1/quotes`/`/api/v1/corridors`, never a second implementation of
business logic. Concretely: the SDK should depend on the **request/
response type shapes** already defined in the backend
(`quote.interfaces.ts`'s `Quote`, `QuoteRequestInput`, etc.) as its
contract source of truth — either via a published types package, or by
the SDK simply mirroring them by hand initially with an explicit
comment tying it back to the backend source (the same discipline
already used for the Android `ReferenceGenerator` → `HP-<ORG>-<TYPE>-…`
relationship: one real source, documented followers). `BackendQuoteEngine`
(Marketing's own implementation, Sprint C) is **not** the SDK and
should not be positioned as a reusable package — it's allowed to carry
Marketing-specific concerns (its own env var for the API base URL, its
own fetch wrapper conventions) that a public SDK must not.

---

## 8. Cross-portal compatibility (Dashboard / Partners / Developers)

**The composition-root pattern (§12) already solves this — stated here
so it isn't re-litigated per portal.** Every consumer builds its *own*
concrete `QuoteEngineProvider` implementation and wires it at its *own*
composition root:

- **Marketing**: anonymous requests, no auth header — `BackendQuoteEngine` (Sprint C).
- **Dashboard**: authenticated requests — its own implementation attaches the session's JWT; server resolves `pricingContext` from that token (ADR-2's own stated evolution path, ADR-2 already anticipates this, no engine change needed).
- **Partners/Developers**: their own SDK-based implementation (see §7), with partner API-key auth (Sprint 0's open question #5 — still open, this document doesn't resolve it, only notes that whichever auth model is chosen slots into this same per-consumer-implementation pattern without touching the interface).

The `QuoteEngineProvider` interface itself never grows portal-specific
branches — auth is a construction-time concern of each concrete
implementation, never a runtime parameter the interface exposes
generically (that would leak "which portal is calling" into the
contract, which is exactly the kind of coupling §12 was designed to
prevent).

---

## Open questions this document deliberately does not answer

1. Exact `NetworkFailureReason` enum values and their wire
   representation — a Sprint C implementation detail once this
   document's shape is approved.
2. Whether `unreachable` should also apply a bounded UI-level retry
   button (user-initiated) vs. only the automatic 1-retry in §3 — a
   Sprint C UX decision, not an architecture one.
3. Real backend latency data to validate/adjust the 10s timeout budget
   — needs real traffic, doesn't exist yet.
4. Sprint 0's open question #5 (non-Marketing auth model) — unchanged,
   still open, §8 above only confirms it doesn't block this document's
   own conclusions.

## What Sprint C looks like once this is approved

1. Marketing: `BackendQuoteEngine implements QuoteEngineProvider`
   (returns `QuoteEngineResult`, §1) — calls `/api/v1/quotes`, applies
   the §2/§3 timeout/retry policy, maps network failures to
   `unreachable` per §1, never falls back to `LocalQuoteEngine` (§4).
   Composition-root swap in `CalculatorClient.tsx` — the one line §12
   always intended.
2. `CalculatorClient`/`page.tsx` UI updated to branch on the three
   states in §5 — the only UI-facing change; `packages/ui` components
   (`QuoteCard` etc.) need no shape change, they already take computed
   `lines`.
3. `/calculator` stays noindex (Sprint A decision, unchanged) until
   real Treasury Rates exist — a wired `BackendQuoteEngine` still
   returns `RATE_UNAVAILABLE` for every real request today; indexing
   remains gated on real rates existing, not on this integration
   shipping.
