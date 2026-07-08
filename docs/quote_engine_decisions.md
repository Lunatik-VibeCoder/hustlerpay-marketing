# Quote Engine — Architecture Decision Package (WEB-CALC-3 Sprint B0)

Status: **FINALIZED (2026-07-08) — Sprint B0 closed.** All four ADRs
approved by the user, including the final refinements (Treasury Rate
commitment sentence, `PUB` as a Reserved Organization Identifier, the
platform reference-type registry). This document is the reference
record ("la charte du Quote Engine") for Sprint B and every future
Quote Engine consumer. History of how it got here — direction approved
2026-07-08: **ADR-1 ✅ approved** (Backend Quote Engine — "un moteur
embarqué dans le frontend créerait deux sources de vérité"), **ADR-2 ✅
approved** (server-resolved pricing context — "le client ne dit jamais
quel pricing il veut, le backend décide"), **ADR-3 ✅ approved with one
amendment applied** (the pipeline's components are now named explicitly,
including the Treasury Rate layer), **ADR-4 revised per user decision**
(quote references join the platform-wide `HP-<ORG>-<TYPE>-…` hierarchy
instead of standalone `QP-`/`QT-` prefixes). **INFRA-CI-1 stays
deferred** to the planned infrastructure maintenance window (with
INFRA-GIT-1) — Sprint B backend commits will simply be made
deploy-ready, accepting the deploy-on-every-push reality until then.
Sprint B implementation starts only after this document is pushed as
the approved record. Same discipline as Sprint 0: architecture →
validation → implementation.

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

**Operational note — decided (2026-07-08):** the backend repo's
`deployment.yml` currently deploys to Railway on *every* push to `main`
(no `paths:` filter — the exact gap INFRA-CI-1 will close). The user
explicitly chose **not** to pull INFRA-CI-1 forward: Sprint B backend
work will be committed in deliberate, deploy-ready increments, and
INFRA-CI-1 executes together with INFRA-GIT-1 during the already-planned
dedicated infrastructure maintenance window. The risk is real but
managed.

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

### The layered pipeline (approved shape — components named explicitly, per user amendment)

```
Market Feed      (external market data source, e.g. an FX data provider)   ← not wired in v1
        ↓
Reference FX     (HustlerPay's chosen reference rate for a currency pair)  ← not wired in v1
        ↓
Treasury Rate    (the rate HustlerPay actually commits to transact at)     ← v1: the administered table IS this layer
        ↓
Business Rules   (spread, rounding, min/max clamping)                      ← v1: minimal (rounding only), a named seam
        ↓
Partner Rules    (per-partner/per-context overrides, ADR-2's context)      ← reserved, empty in v1
        ↓
Quote
```

Each of the five layers is a **named seam in the engine's code from day
one**, even where a layer is a no-op in v1 — HustlerPay sells a
commercial commitment (the Treasury Rate), not a mirror of the market;
the layers above Treasury Rate exist so that, when a Market Feed is
eventually wired, it *informs* the administered rate rather than
bypassing it straight to the customer.

> **Treasury Rate is the first business-owned commitment. Everything
> above it is informational. Everything below it is contractual.**

(The platform's philosophy in one sentence: the market informs, the
treasury decides, the Quote Engine commits.)

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

### Decision (revised per user, 2026-07-08 — supersedes the original standalone-prefix proposal)

Quote references join the **platform-wide HustlerPay reference
hierarchy** rather than introducing standalone `QP-`/`QT-` prefixes as
the long-term canonical format:

```
HP - <ORG> - <TYPE> - yyMMdd - <unique suffix>

HP-TGA-QP-250708-8F3K91     (Quote Preview, org TGA)
HP-TGA-QT-250708-X9K4PL     (real Quote, org TGA — future)
```

Five segments, each immediately identifying one thing:
- **`HP`** — the platform (HustlerPay). Consistent with the already-
  reserved `ReferenceProduct.HUSTLERPAY = "HP"` in the shipped Android
  `ReferenceGenerator`, and with the wider `HP-<ORG>-…` reference
  strategy for transactions.
- **`<ORG>`** — the organization the quote belongs to (e.g. `TGA`).
  For anonymous public quotes (a Marketing visitor has no
  organization), the segment is **`PUB` — confirmed 2026-07-08**.
  `PUB` is **not an organization**: it is a **Reserved Organization
  Identifier** representing the Anonymous Public Context, and must
  never be assignable to a real company — the backend's organization
  layer must treat `PUB` (and any future reserved identifier) as a
  forbidden organization code at creation time, so no real org can
  ever collide with it. It is a single fixed constant, never
  inferred/guessed per request.
- **`<TYPE>`** — the object type. Registry of platform reference type
  codes (this document is the reference for the whole platform, not
  just quotes — only `QP`/`QT` ship with the Quote Engine; the others
  are reserved so future domains align instead of inventing formats):

  | Type | Meaning | Status |
  |---|---|---|
  | `QP` | Quote Preview (demo/preview engines, e.g. `LocalQuoteEngine`) | Ships with Sprint A/B |
  | `QT` | Quote (real backend engine) | Ships with Sprint B |
  | `TX` | Transaction | Reserved |
  | `RF` | Refund | Reserved |
  | *…* | Future object types (Jobs, Runtime, Ledger, Audit, …) | Reserved — added here first, never improvised |
- **`yyMMdd`** — generation date, same convention as the shipped
  `MA-yyMMdd-XXXXXX` format.
- **unique suffix** — 6 random alphanumeric characters, same mechanics
  as the shipped `ReferenceGenerator`.

Unchanged from the original proposal (these carry over as-is):
- `Quote.reference` is a required contract field, generated **by the
  engine** at generation time — the engine is the identity authority; a
  reference is proof a specific engine produced a specific result.
  Client-generated IDs would be meaningless for support/debugging.
- Sprint A's `LocalQuoteEngine` can adopt `HP-PUB-QP-…` immediately
  (`PUB` confirmed) — even a demo screenshot then carries a citable
  identity.
- A reference is **not** persistence: it identifies a generation event
  (logs, screenshots, support); whether a `QT` quote is *retrievable
  later* remains governed by open question #4 (frozen links), untouched
  here.

**Honest precedent note**: the only reference format actually shipped
in the ecosystem today is the Android `MA-yyMMdd-XXXXXX` (product
prefix + date + suffix, no org segment) — the fuller
`HP-<ORG>-<TYPE>-…` hierarchy is the platform's declared direction (and
`HP` is already reserved for it), but quote references will be its
first shipped implementation. If transactions later adopt the same
hierarchy, quotes will already be aligned instead of needing a rename.

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
   `/api/v1/corridors`), Prisma models for the administered Treasury
   Rate/fee tables (empty until the business decides real values), the
   five-layer resolution skeleton (ADR-3), server-resolved pricing
   context (ADR-2), `HP-<ORG>-QT-…` references (ADR-4). Anonymous
   access for the quote endpoint (Marketing's consumer), token auth
   deferred with open question #5.
2. Marketing: `BackendQuoteEngine implements QuoteEngineProvider` — the
   §12 one-line composition-root swap, plus `HP-PUB-QP-…` references in
   `LocalQuoteEngine` (`PUB` confirmed, ADR-4).
3. **No real numbers displayed publicly** until the ADR-3 rate table has
   real, business-committed values — the demo banner and noindex stay
   until then (the N1 decision is part of that same activation
   checklist).
