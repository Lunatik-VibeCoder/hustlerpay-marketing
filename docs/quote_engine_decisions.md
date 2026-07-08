# Quote Engine — Architecture Decision Package (WEB-CALC-3 Sprint B0)

Status: **decision package for review — nothing here is decided yet.**
Sprint B (the first real Quote Engine implementation) starts only after
each ADR below is explicitly approved, amended, or rejected. Same
discipline as Sprint 0: architecture → validation → implementation.

Companion to `docs/smart_calculator_architecture.md` (Sprint 0, frozen).
This document exists because Sprint 0 deliberately left open questions
#1–#5 unresolved, and three of them (#1, #2, #3) block Sprint B's
contract design. A fourth decision (Quote identity) was raised
explicitly at Sprint A close-out and is packaged here as ADR-4.

## New evidence gathered for this package (2026-07-08, read-only)

**Open question #7 is now answered: greenfield, definitively.** Direct
grep of both repos:
- HustlerPay Backend (`src/`, all modules + `prisma/schema.prisma`):
  zero quote/fee/rate/FX logic. The only "quote" matches are RFC 4180
  CSV string-quoting utilities; no `Fee`/`Rate`/`Quote` Prisma model
  exists (the schema's only "fee" mention is a comment about future
  platform fee revenue on an account).
- HustlerPay Dashboard (`src/`): zero. All matches are "feedback"/"feed"
  substrings in execution components.

Consequence: "Dashboard calls the same engine" (§9) is a clean
greenfield integration, not a migration — and ADR-1 can be decided
without a data-migration constraint.

---

## ADR-1 — Where does the Quote Engine live?

**Question:** which codebase/deployment hosts the single real
implementation of quote calculation?

### Options

| Option | For | Against |
|---|---|---|
| **A. Embedded in Marketing** (`hustlerpay-marketing`) | Fastest to ship; no cross-repo work | Guaranteed extraction/rework the moment Dashboard or a Partner needs it — Sprint 0 §5/§10 already names this as the one path that *guarantees* (not risks) rework. A pure frontend repo with zero business-logic history is the wrong home for the ecosystem's first business engine. |
| **B. HustlerPay Backend** (new NestJS `quotes` module, `/api/v1/quotes`) | The backend already hosts every real business domain (transactions, treasury, beneficiaries, runtime); auth/RBAC/audit/Prisma/deploy pipeline all exist; `/api/v1/...` convention already established; one deploy, one source of truth; Dashboard and future portals already talk to this API | Couples quote availability to the backend's uptime; backend pushes auto-deploy production (see operational note below) |
| **C. Dedicated microservice** | Independent scaling/deploy; theoretically cleanest isolation | Premature: no scaling evidence justifies a second service; doubles infra surface (deploy, monitoring, auth propagation) for a domain with zero traffic today; violates the ecosystem's own pattern of building abstractions only when a second real consumer exists |
| **D. Hybrid (local cache + backend)** | Best perceived latency later | This is an *optimization layer on top of* B, not an alternative location — deciding "hybrid" now would be designing a cache before the thing it caches exists |

### Recommendation: **B — HustlerPay Backend**, as a new `quotes` module.

Rationale: it is the only option consistent with Sprint 0's own §9
("one engine, many consumers" — all consumers already reach this API),
with §12 (the Backend HTTP `QuoteEngineProvider` implementation was
designed for exactly this), and with the ecosystem's anti-premature-
abstraction track record (C is a REPORT-CONNECTORS-style future
extraction if scale ever demands it; D is a later optimization).

**Operational note, not a blocker:** the backend repo's
`deployment.yml` currently deploys to Railway on *every* push to `main`
(no `paths:` filter — the exact gap INFRA-CI-1 will close, currently
deferred with INFRA-GIT-1). Sprint B backend work should be committed
in deliberate, deploy-ready increments, or INFRA-CI-1 could be pulled
forward as a 15-minute pre-Sprint-B step. Flagged for the user to
choose; either works.

---

## ADR-2 — Differential pricing model

**Question:** do different consumers (anonymous visitor, authenticated
customer, partner, API developer, organization) ever see different
prices for the same corridor/amount — and how does the contract carry
that without breaking the UI?

### The contract principle (proposed regardless of the business answer)

`pricingContext` becomes a **server-resolved** concept: derived from
authentication (anonymous / customer org / partner key), **never
asserted by the client**. The `QuoteRequest` the UI sends carries no
pricing tier; the `Quote` response may carry an informational
`pricingContext` field. The UI renders whatever lines the engine
returns — it already does exactly this (`QuoteCard` takes computed
`lines`, Sprint A) — so differential pricing changes *zero* UI code by
construction. This satisfies Sprint 0's watch-item ("don't lock UI
around a single-price assumption") permanently.

### Options for v1 behavior

| Option | Description |
|---|---|
| **A. Single public price in v1, context reserved in contract** | Everyone gets the same rates/fees at launch; the contract shape (server-resolved context) is built from day one so differential pricing later is a rules change, not a contract change |
| **B. Full differential pricing in v1** | Build tier-specific rule resolution now |

### Recommendation: **A.**

No real differentiated pricing rule exists today (no partner agreement,
no negotiated customer rate — nothing to encode truthfully). Building B
now would mean inventing tiers, violating the never-fabricate rule.
A costs one field in the contract and zero speculative logic.

---

## ADR-3 — Rate source hierarchy

**Question:** where does the exchange rate in a Quote actually come
from?

### The layered model (proposed as the *shape*, per the user's own sketch)

```
Market Source (external FX feed)      ← not wired in v1
        ↓
FX Source (HustlerPay's chosen ref)   ← not wired in v1
        ↓
Business Rules (spread, rounding)     ← v1: the administered rate IS this layer
        ↓
Partner Rules (overrides)             ← reserved (ADR-2 context), empty in v1
        ↓
Quote Engine
```

The hierarchy is adopted as the engine's internal resolution order from
day one — each layer is a named seam, even when a layer is a no-op.

### Options for v1's actual source

| Option | For | Against |
|---|---|---|
| **A. Internally-administered rate table** (set by HustlerPay staff, stored in the backend DB, full audit trail on changes) | Every displayed rate is a rate someone at HustlerPay explicitly decided and is accountable for; auditable; zero external dependency; consistent with never-fabricate (a rate is a *business commitment*, not a data feed) | Manual upkeep; stale if neglected (mitigable: `generatedAt` + rule-set reference already in the contract, plus a max-age warning rule later) |
| **B. Live external FX feed** | Always fresh | A raw market rate is NOT the rate HustlerPay transacts at — displaying it without defined spread rules produces authoritative-looking numbers no one committed to; adds an external dependency + failure mode; spread rules don't exist yet to layer on top |
| **C. Hybrid (feed + spread rules)** | The eventual end-state | Requires the spread/business-rules layer to exist first — it doesn't; this is the natural v2 once A's business rules are formalized |

### Recommendation: **A for v1**, with the layered hierarchy as the
implementation skeleton so C is a wiring change later, not a redesign.
The genuinely business-side sub-decision the user must make before
Sprint B ships real numbers: *who* administers the rate table and what
the update cadence/commitment is — the engine can be built and tested
against an empty/seeded table before that's settled, but nothing real
should be displayed publicly until it is.

---

## ADR-4 — Quote identity & reference strategy

**Question:** every Quote gets an identity — even non-persisted ones —
for debugging, logs, screenshots, support, tests, comparisons.

### Ecosystem precedent (real, already shipped)

MoMo Assistant's `ReferenceGenerator` (Android, CLAUDE.md §5) already
established the platform format: **`<product prefix>-yyMMdd-XXXXXX`**
(6 random hex chars), e.g. `MA-250629-A84F92` — and its
`ReferenceProduct` enum already declares `HUSTLERPAY = "HP"`, reserved
and unused. Quote references should join this family, not invent a
third format.

### Proposal

- `Quote.reference` becomes a required contract field, generated **by
  the engine** at generation time (the engine is the identity
  authority — a reference is proof a specific engine produced a
  specific result; client-generated IDs would be meaningless for
  support/debugging).
- Two prefixes, matching the two engine classes that exist/are planned:
  - **`QP-`** (Quote Preview) — emitted by `LocalQuoteEngine` and any
    future demo/preview path. Sprint A's local engine can adopt this
    immediately (a one-line addition) — even a demo screenshot then
    carries a citable identity.
  - **`QT-`** (Quote) — emitted by the real backend engine for genuine
    quotes. (The user's sketch suggested `QQ`; `QT` is proposed instead
    purely for legibility — a doubled letter is easy to mis-say/mis-type
    in support contexts — but this is cosmetic; either is fine and the
    choice is the user's.)
- Format: `QP-yyMMdd-XXXXXX` / `QT-yyMMdd-XXXXXX` — identical mechanics
  to the shipped `ReferenceGenerator`, so any future "HP-TGA-QUOTE-…"
  style organizational namespacing (the user's longer-term sketch) can
  be layered as a display/export concern without changing the stored
  reference.
- A reference is **not** persistence: `QP-`/`QT-` identify a generation
  event (logs, screenshots); whether a `QT-` quote is *retrievable
  later* remains governed by open question #4 (frozen links), untouched
  here.

### Recommendation: adopt as proposed (with `QQ` vs `QT` left to the user).

---

## Carried items from the Sprint A review (not ADRs, must not be lost)

- **N1 (decision required before indexing flips on):** bare
  `/calculator` self-rewrites to `?from=GH&to=BJ` on mount — the clean
  base URL never persists. Before `buildMetadata`/sitemap/nav activation,
  choose: omit params that equal defaults, or only write the URL after
  the first user interaction. (Recommendation when the time comes:
  omit-defaults — keeps deep links working and the base URL canonical.)
- N3: URL→state sync is one-directional by design; document as the
  pattern or revisit if back/forward desync ever bites.
- N4: clipboard error handling + timer cleanup in `handleCopyLink`.
- N5: converge the two structurally-identical `QuoteLine` types when
  §7's shared breakdown component lands.

## What Sprint B looks like once this package is approved

1. Backend: new `quotes` NestJS module (`/api/v1/quotes`,
   `/api/v1/corridors`), Prisma models for the administered rate/fee
   tables (empty until the business decides real values), the layered
   resolution skeleton (ADR-3), server-resolved pricing context (ADR-2),
   `QT-` references (ADR-4). Anonymous access for the quote endpoint
   (Marketing's consumer), token auth deferred with open question #5.
2. Marketing: `BackendQuoteEngine implements QuoteEngineProvider` — the
   §12 one-line composition-root swap, plus `QP-` references in
   `LocalQuoteEngine`.
3. **No real numbers displayed publicly** until the ADR-3 rate table has
   real, business-committed values — the demo banner and noindex stay
   until then (the N1 decision is part of that same activation
   checklist).
