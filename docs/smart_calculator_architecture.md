# Smart Calculator — Architecture (WEB-CALC-3 Sprint 0)

Status: **design document, no code, no components, no implementation.**
This is the deliverable for WEB-CALC-3 Sprint 0, the mandatory
architecture gate before Sprint A (Calculator UI) starts — same
discipline already applied to Dashboard RC1 and Runtime V2: Audit →
Architecture → Implementation, never the reverse.

Frozen scope note: like `docs/runtime_v2_architecture.md` on the Android
side, this document is a snapshot of the architecture as decided at
Sprint 0 time. If a later sprint changes a decision recorded here, that
change belongs in a new document or a clearly-dated addendum, not a
silent rewrite of this one.

Revision note (still Sprint 0, before freeze): this version incorporates
the 8 fixes from the independent Architecture Review that was run
against the first draft — an auth contradiction between §2/§8, an
explicit Sprint A data-policy entry criterion, "Mode" added to the
Domain Model, §9's partner pricing question folded into open question
#2 instead of being hedged separately, a citation-drift fix in §11, a
clarified §11 major-version definition (rule *shape* vs. current
*values*), the engine name unified to "Quote Engine" everywhere, and two
additional flagged items (a Dashboard-migration question, and §6's SEO
value being dependent on open question #1). This is the version Sprint A
is gated on.

## Framing

The Smart Calculator is not a marketing-site widget. It is the first
real SaaS product surface of the HustlerPay ecosystem, built around a
reusable business engine:

```
Marketing Website
        │
        ▼
Smart Calculator (UI)
        │
        ▼
Quote Engine (business logic — lives once, called by everyone)
        │
        ├── Website
        ├── Dashboard
        ├── Public API
        ├── Developers SDK
        ├── Partners Portal
        └── Mobile Apps
```

Everything below is written against that framing. Wherever a decision
would only make sense for a marketing widget (e.g. "just compute it in
a client component"), that option is flagged as such and rejected.

---

## 1. Product Goals

**Problems it solves:**
- For a **public visitor**: get a real, trustworthy estimate of a Mobile
  Money transfer/fee before ever talking to sales — proof the product
  works, not just marketing copy claiming it does.
- For an **existing customer** (inside Dashboard): estimate a fee/quote
  without leaving their authenticated workflow, using the exact same
  numbers the public site would show for the same inputs — consistency
  is the whole point, not a nice-to-have.
- For a **future partner**: embed the same quoting logic into their own
  product surface (their own branding, HustlerPay's math) instead of
  reimplementing fee/rate rules themselves.
- For a **future API consumer / developer**: a documented, versioned
  quote endpoint as a real product, not a scraped implementation detail
  of the marketing page.

**Target users**, all real, all named explicitly (no "and more" catch-all):
1. Public visitors — anonymous, top-of-funnel.
2. Existing customers — authenticated, inside Dashboard.
3. Future partners — embedding via SDK/iframe/API, own branding.
4. Future API consumers / developers — need a stable, versioned contract.

---

## 2. User Journeys

| Journey | Entry point | Auth | Notes |
|---|---|---|---|
| Visitor requests a quote | `/calculator` (or homepage teaser link) | none | Core journey — corridor + amount in, Quote out. |
| Visitor compares corridors | `/calculator` | none | Needs to hold 2+ quotes side by side without losing either — a UI/state requirement, not just "run the calculation twice." |
| Visitor decides to contact us | Quote result → `/contact` | none | The Quote's context (corridor, amount) should carry into the Contact form so the conversation starts warm, not from zero. Concrete mechanism (query params, local state) is an Sprint A decision, not this document's. |
| Existing customer opens Dashboard | Dashboard's own calculator surface | authenticated | Open question, not answered here: does an authenticated customer ever see a *different* rate/fee than the public visitor (negotiated/account-specific pricing)? If yes, the engine needs a notion of "pricing context" from day one — deciding this **after** Sprint B would mean reworking the engine's contract. This is flagged as a required decision before Sprint B starts. |
| Future partner embeds the calculator | Partner's own page, via SDK/iframe/API | **not yet decided** — see §8, open question #5 | Must not require pulling in Marketing's own chrome (Header/Footer/nav) — the calculator's UI shell and the engine must be separable. |

---

## 3. Calculator Modes

Not a single calculator. Modes are **independent domain modules at the
engine level**; "tabs" are a **Marketing-site-specific UI presentation**
of a subset of those modules — this distinction matters architecturally
(see §5). An SDK/API consumer of one mode should never need to know
"tabs" exist at all.

| Mode | Real domain grounding today | Sprint 0 recommendation |
|---|---|---|
| **Money Transfer** | Yes — this is HustlerPay's actual business (Cash In/Out orchestration across corridors). | Build first. The only mode with real rules to eventually plug in. |
| **Currency Conversion** | Partial — a natural sub-concern of Money Transfer (the rate/spread part in isolation). | Could ship as a thin view over the same engine rather than a separate module — decide in Sprint A, not here. |
| **Fees** | Partial — isolating "what would this cost" without simulating a full transfer. | Likely the same engine call as Money Transfer with a "fee-only" result view, not a separate calculation path. |
| **Delivery Estimation** | **No real operational data exists today** (no SLA/timing rules defined anywhere in this ecosystem). | Named as a future mode only. Do not stub with invented timing numbers — same "never fabricate" rule already enforced on Dashboard, Android, and this repo's own homepage (Stats/Testimonials deliberately omitted). |
| **Travel** | **No real rules** — TGA itself never shipped this (its own "Voyage" tab was a permanent stub). | Named as a future mode only, lowest priority. Building it would mean inventing a business HustlerPay doesn't have evidence of operating yet. |
| **Future Services** | N/A by definition | The architecture must support registering an Nth mode without redesigning the engine or the UI shell — mirrors the `SectionRenderer`/`ICON_REGISTRY` registry pattern already proven in this repo, applied to modes instead of sections/icons. |

**Recommendation for Sprint A–D**: implement only Money Transfer (with
Fees/Currency Conversion as views over it, if Sprint A finds that
natural). Delivery Estimation, Travel, and Future Services remain named,
reserved extension points — not built, not stubbed.

---

## 4. Domain Model

Concepts only — no formulas, no persistence schema, no code.

- **Mode** — which kind of calculation is being requested (Money
  Transfer, Currency Conversion, Fees, ... per §3's registry). Every
  Fee/Rate resolution (§5) is scoped by Mode as well as by Corridor —
  the same corridor can have different applicable rules depending on
  which Mode is being calculated (e.g. a Money Transfer fee schedule
  need not be the same shape as a Fees-only lookup for that corridor).
- **Country** — a real-world country HustlerPay actually operates in
  today (Ghana, Bénin). Do not extend this model to Togo/Côte d'Ivoire/
  Burkina Faso for calculation purposes — those exist elsewhere in the
  ecosystem only as country-level detection with no real operational
  rules, and the calculator must not imply otherwise.
- **Currency** — tied to Country (GHS for Ghana, XOF for Bénin), not to
  Network.
- **Network** — a Mobile Money operator (MTN, Moov, ...) within a
  Country. Reuses the same Country/Operator/NetworkProfile concept
  already real elsewhere in the ecosystem — not reinvented here.
- **Corridor** — a *directional* pair (origin Country/Network →
  destination Country/Network). A→B and B→A are distinct corridors and
  may carry different rules.
- **Quote** — the output of one calculation: source amount + currency,
  destination amount + currency, fee breakdown, effective rate, the
  corridor used, a timestamp, and (if the persistence question in §5/§6
  is resolved toward "yes") a stable reference/id. A Quote is an
  **estimate**, never itself a transaction — it never moves money and
  is never confused with `Transaction` from the rest of the ecosystem.
- **Fee** — a charge applied to a transfer. Shape only: a fee has a
  *type* (flat / percentage / tiered-by-amount / combination) and
  *applies-to* scope (which corridor/mode). **No actual fee rule is
  defined in this document** — none exist yet to describe truthfully.
- **Rate** — the exchange rate applied for a given Quote's currency
  conversion. **Open question, not resolved here**: where does a real
  rate come from — a live FX data source, or an internally-set
  HustlerPay rate? This is a business decision, not an engineering one,
  and blocks Sprint B until answered.
- **Spread** — any margin HustlerPay applies on top of/below a raw
  market rate. Same status as Fee: a modeled concept, no real value
  defined yet.
- **Limits** — min/max transferable amount per Corridor. Source of truth
  (real operator/regulatory limits vs. HustlerPay's own risk limits) is
  another open question, not resolved here.

---

## 5. Quote Engine — Responsibilities

(Named consistently as **Quote Engine** throughout this document —
matches the Framing diagram; earlier drafts also used "Calculation
Engine" and "Calculator Engine" for the same thing, now unified to one
name.)

Architecture only — no formulas.

1. **Validate** an incoming quote request against the Domain Model
   (resolvable corridor, resolvable currency pair, amount within
   Limits).
2. **Resolve** the applicable Rate/Spread for the corridor at
   calculation time.
3. **Resolve** the applicable Fee rule(s) for the corridor/amount/mode
   combination.
4. **Produce a Quote** — this is the engine's *core* responsibility, and
   it must be a pure computation: same inputs, same point in time →
   same Quote, no side effects (no sending money, no required
   persistence).
5. **Persistence is a separate, optional responsibility**, not part of
   the core calculation — only needed if a specific journey (a
   shareable quote link, §6) requires recalling an exact past result.
   Different consumers may need this differently: Marketing might
   persist for shareable links; a Dashboard-embedded or SDK call might
   never need to.
6. **Never initiates a real transaction.** Converting a Quote into an
   actual transfer is a completely separate domain (the real HustlerPay
   backend / MoMo Assistant Runtime) — explicitly out of scope for this
   engine, mirroring the existing ecosystem-wide rule that an estimate
   is never conflated with a completed transaction.
7. **Rule versioning is a required consideration.** Fee/Rate rules will
   change over time; a Quote should record *which rule-set version*
   produced it, so a shared link either honestly flags "rates may have
   changed since" or is reproducible against its original ruleset. This
   document flags the requirement — it does not design the mechanism.

**Where does this engine live?** Not decided here, but named as the
single most consequential open question before Sprint B starts: if the
engine is built inside `hustlerpay-marketing` (a pure frontend repo with
zero backend/business-logic history), it will need to be extracted the
moment Dashboard or a Partner needs it too — i.e., building it here
guarantees rework, not just risks it. The architecturally correct home
is almost certainly the real HustlerPay backend. This decision blocks
Sprint B and should be made explicitly, not by default/inertia.

---

## 6. SEO

This is treated as a first-class design constraint, not an
afterthought — the user's own framing: *the Calculator should become an
SEO entry point, not just a widget.*

- **Dedicated route**: `/calculator`, not embedded only in the
  homepage. A homepage-only widget cannot be deep-linked to a specific
  corridor, dilutes the homepage's own primary keyword targeting, and
  blocks future corridor-specific landing pages (e.g.
  `/calculator/ghana-benin`).
- **URL strategy**: a base `/calculator` (default/empty state) *plus*
  a parameterized state via query string (e.g.
  `/calculator?from=GH&to=BJ&amount=100`) — a specific configuration
  must be a real, bookmarkable, shareable URL, not client-only state
  lost on refresh.
- **Deep linking**: any "share this" or "link to this" journey must be
  resolvable from the URL alone, with no required server session — this
  is the actual test of "genuinely deep-linkable" versus "looks
  deep-linkable but only works if the tab is still open."
- **Shareable URLs — two distinct concepts, do not conflate them:**
  - *Share this configuration* (`/calculator?from=..&to=..&amount=..`)
    — always recalculated against **current** rates when opened.
  - *Share this specific result* (a hypothetical future
    `/calculator/q/{quoteId}`) — a **frozen** historical Quote, only
    possible if persistence (§5) is built. Whether HustlerPay wants
    "always current" or "frozen at share time" links is a real product
    decision, not resolved in this document.
- **Metadata strategy**: `/calculator` gets the same `buildMetadata()`
  treatment as every other real page today (title/description/
  canonical/OpenGraph). Parameterized states should **not** get their
  own indexed canonical — canonical points back to the base
  `/calculator` unless/until dedicated per-corridor static pages become
  a deliberate future SEO play (a legitimate future direction, out of
  scope here).
- **Indexing strategy**: index the base `/calculator` route; do not let
  every possible amount/corridor query-string combination be crawled as
  its own "page" — that produces thin/duplicate-content SEO penalties,
  the opposite of the goal.
- **Dependency on §5's open question, stated explicitly**: the URL/
  query-string strategy above makes a link *bookmarkable* regardless of
  where the Quote Engine lives. But if the goal is for a crawler to see
  **real, server-rendered quote content** (not just an empty shell that
  fills in client-side) — which is what makes `/calculator` genuinely
  valuable as an SEO entry point rather than just a deep-linkable widget
  — the page must be able to call the Quote Engine synchronously at
  render time. That requires the engine to already be a deployed,
  network-reachable service, which is exactly what open question #1
  (§5, where the engine lives) has not yet decided. This SEO section's
  full value is gated on that decision, not independent of it.

---

## 7. Components — `packages/ui` vs. Marketing-specific

**Candidates for `packages/ui`** (generic, meant to live in every future
portal — Dashboard/Admin/Partners/Developers — not calculator-specific):
- `CurrencyInput`, `CountrySelector`, `QuoteCard`, `Tabs` — already
  exist today, but per the Architecture Checkpoint, treat as **"V1, to
  be proven,"** not finished. They've only ever been exercised in the
  static, noindex `/design-system` demo, never a real interactive flow.
  Expect real hardening (validation states, error styling, keyboard
  edge cases) once the Calculator wires them up for real.
- A likely-new, genuinely generic **fee/result breakdown display**
  ("a list of line items summing to a total") — this is useful well
  beyond the calculator (e.g. Dashboard's own transaction receipts), so
  it belongs in `packages/ui`, not built calculator-specific and copied
  later.

**Stay Marketing-specific** (compose the above, but are not themselves
reusable UI atoms):
- The Calculator *page* itself — its tab arrangement, its surrounding
  marketing copy, the homepage teaser's "Bientôt disponible" badge
  treatment. These are `hustlerpay-marketing` page composition, not
  design-system primitives.

---

## 8. API Surface (contracts only — no implementation)

Illustrative shape, not a committed schema:

- `POST /api/v1/quotes` — request: `{ mode, corridor: { origin, destination }, amount, currency }`. Response: a Quote (§4 shape).
- `GET /api/v1/quotes/{id}` — retrieve a previously computed/persisted Quote, only if §5/§6's persistence question is answered "yes."
- `GET /api/v1/corridors` — list available corridors/networks/currencies, so the UI never hardcodes this list client-side.

**Versioning**: `/api/v1/...` from day one — consistent with the real
HustlerPay Runtime API's own existing convention (`/api/v1/runtime/...`).

**Auth — an open design question, not resolved here**: the public
Marketing usage is anonymous by nature; a future Partner/Developer
consumer of the *same* endpoint would need real API-key/token auth
(mirroring the Device Bearer Token pattern already used elsewhere in
this ecosystem). "One endpoint, two auth postures depending on
consumer" is flagged as a requirement to design deliberately, not
something this document resolves.

---

## 9. Future Integration — one engine, many consumers

| Consumer | How it uses the engine |
|---|---|
| Marketing | Calls the engine's public (anonymous) API surface to power `/calculator`. |
| Dashboard | Calls the **same** engine (authenticated variant of the same API, or direct call if co-located). Must never show a different number than Marketing for the same inputs — same engine, not a second implementation. **Open question, not assumed**: does Dashboard already compute quotes/fees somewhere in its existing codebase today? If so, "Dashboard calls the same engine" is a migration of existing logic onto the shared engine, not a greenfield integration — this document assumes greenfield only because no evidence of an existing Dashboard quote/fee implementation was checked; confirm before Sprint B treats this as a clean build. |
| Developers Portal | Publishes the `/api/v1/quotes` contract as a real, documented public API product. |
| Partner Portal | Consumes the same API, possibly with partner-specific rate/fee overrides applied *server-side* as configuration — never as a forked copy of the engine's logic. **This is the same class of open question as #2** (does any non-anonymous consumer ever see different pricing than the anonymous public visitor?) — not a separate, lesser-priority question just because it's phrased "possibly" here. |
| Public API | The same surface the Developers Portal documents, actually running. |
| SDK | A thin HTTP client wrapping `/api/v1/quotes` — must not reimplement fee/rate math client-side. An SDK that recalculates locally will drift from the server's real rules the moment those rules change. |
| Mobile Apps | Same principle — call the API, never re-derive calculation logic locally. |

**Central principle, stated explicitly**: exactly **one** real
implementation of calculation logic should ever exist. Every consumer
above calls that one engine; none of them re-derive fee/rate math
independently. This is the direct, literal consequence of "moteur
métier réutilisable, pas un widget."

---

## 10. Risks

- **Architecture risk** — building the engine inside
  `hustlerpay-marketing` (a pure frontend repo, zero backend/business-
  logic history) guarantees an extraction/rework the moment Dashboard or
  a Partner needs it. This should be decided explicitly before Sprint B,
  not defaulted into by writing frontend code first because it's the
  path of least resistance this sprint.
- **Scalability risk** — hardcoding a fixed number of tabs instead of a
  mode-registry (§3) would repeat the exact "flat, hand-maintained
  structure" scalability finding the Architecture Checkpoint already
  flagged for `navigation.ts` — same anti-pattern, different file.
- **UX risk** — presenting a Quote with unwarranted confidence (a
  specific-looking number) before real Fee/Rate rules exist would break
  the "never fabricate data" discipline already enforced everywhere
  else in this ecosystem (Dashboard, Android, this repo's own homepage
  Stats/Testimonials omission). Any interim/demo state must visibly say
  "estimate, subject to change," never present invented numbers as
  authoritative.
- **SEO risk (highest priority to design against)** — if quote state
  lives only in client-side React state with no URL sync, the entire
  "SEO entry point" goal fails: crawlers and shared links would only
  ever see the calculator's empty default state, never a specific
  meaningful result.
- **Cross-portal risk** — the same divergence risk already found and
  documented for `packages/theme` (see DESIGN-SYSTEM-2) applies
  structurally to a calculation engine: if Dashboard and Marketing each
  get their own copy of fee logic instead of calling one real shared
  engine/API, they will silently diverge exactly as the `destructive`
  color token already did — except here, drift means showing a
  customer two different numbers for the same transfer, a materially
  higher-stakes failure than a mismatched color.

---

## 11. Calculator Versioning

Added per explicit user requirement: the **Engine's** version must be
independent of the **Site's** version. A Marketing deploy (new copy, new
layout, a new section on the homepage) must never imply a new engine
version, and a new engine version must never be silently forced onto
every consumer at once. The consumers named in the Framing diagram at
the top of this document (Website, Dashboard, Public API, Developers
SDK, Partners Portal, Mobile Apps) — expanded to 7 distinct roles in
§9's own table — cannot all redeploy in lockstep every time a corridor
or calculation method changes; the architecture must assume they won't.

**Two independent version axes, never conflated:**
- **Site version** — `hustlerpay-marketing`'s own deploys. Ships UI,
  copy, layout. Has no bearing on calculation correctness.
- **Engine version** (`Quote Engine v1` → `v2` → `v3`, per the user's
  own framing) — governs the calculation *contract*: which request/
  response shape, which corridors/networks are recognized, and **which
  category/shape of Fee/Rate rule the contract is capable of
  expressing** (e.g. "flat fee" vs. "tiered-by-amount fee" as
  *representable shapes* — not the specific numeric values currently
  loaded, which is a separate axis, see below). This is what actually
  needs stability guarantees for external consumers (Partners, SDK,
  Developers API) who cannot redeploy the instant HustlerPay changes
  something.

**What forces a new Engine major version** (illustrative, not
exhaustive — decided for real once Sprint B defines the actual
contract): a breaking change to the request/response shape; removing a
previously-supported corridor/network; introducing a genuinely new
*kind* of Fee/Rate rule the current contract shape cannot represent; a
change to how a Quote's `metadata` (rule-set version, per §5 point 7) is
represented. **What does NOT force a new major version**: adding a new
corridor/network (additive), adding a new optional field to the
response, or **loading different current values for an existing rule
shape** (e.g. changing a percentage-fee's actual percentage, or which
rate-set is active today) while keeping the same request/response
contract — that kind of change is exactly what the per-Quote rule-set
reference below exists to track, and does not need a new Engine version
to do so.

**Every Quote already carries a rule-set reference by design** (§5,
point 7) — Calculator Versioning is the *contract-shape* counterpart to
that: rule-set versioning is "which numbers were used," Engine
versioning is "which shape of request/response was used." The two are
related but distinct, and both need to be readable from a Quote after
the fact.

**One clarification this document does make**: only a *major* axis is
defined above (`v1`/`v2`/`v3`). Every non-major change described (new
corridor, new optional field, new current rule values) is absorbed
silently, with no version-number signal at all — the per-Quote rule-set
reference is what carries visibility for those, not a minor/patch
version number. Whether a finer-grained minor/patch axis is ever needed
on top of that is left for Sprint B to decide if the rule-set reference
alone proves insufficient.

**Consistency with the rest of the ecosystem**: this is the same
discipline already applied to the real HustlerPay Runtime API
(`/api/v1/runtime/...`, §8's own `/api/v1/quotes` convention) — a
versioned path segment is the minimum bar, not a new idea introduced
here. What Sprint 0 adds beyond that existing convention is naming the
requirement to *decouple* the engine's own version from the site's, and
from the rule-set/data version living inside individual Quotes.

**Deliberately not decided here** (a 7th item to fold into the open
questions below, not resolved in this document): how long an old Engine
major version stays supported after a new one ships (a deprecation
policy), and whether that policy differs per consumer (a Partner
integration plausibly needs a longer support window than the Marketing
site itself, which redeploys on every push). This is a business/support
decision, not an engineering one — flagged, not answered.

---

## Open questions this document deliberately does not answer

Listed together so none get lost before Sprint A:

1. Where does the engine live — this repo, or the real HustlerPay
   backend? (§5, blocks Sprint B)
2. **Does any non-anonymous consumer — an authenticated Dashboard
   customer, or a Partner — ever see different pricing than an
   anonymous public visitor** (negotiated/account-specific rates,
   partner-specific overrides)? Broadened from "authenticated customer"
   only, after the review found the Partner-side version of this exact
   question (§9) was being treated as a lesser, hedged concern instead
   of the same blocking question. Blocks Sprint B's request/response
   shape either way. (§2, §9)
3. Where do real exchange rates come from? (§4, a business decision)
4. Is a shared calculator link "always current rates" or "frozen at
   share time" — or both, as distinct concepts? (§6)
5. Auth model for non-Marketing API consumers. (§8)
6. Engine deprecation policy — how long an old major version stays
   supported after a new one ships, and whether that differs per
   consumer (Partner vs. Marketing itself). (§11)
7. Does Dashboard already compute quotes/fees somewhere in its existing
   codebase today? If so, integrating it with the Quote Engine is a
   migration, not a greenfield build — not yet checked. (§9)

## Sprint A entry criteria (added after the independent Architecture Review)

The review's own conclusion: of the 7 open questions above, only #1 has
direct bearing on Sprint A (Calculator UI) — and only if Sprint A
follows the constraint below, which this document previously left
implied rather than stated:

- **Sprint A must build against the §8 contract shape using clearly-
  labeled placeholder/mock data.** No UI built in Sprint A may compute
  or display a real-looking fee/rate number client-side, because no real
  Quote Engine will exist yet (open question #1 isn't resolved). This is
  a hard entry condition, not a suggestion — it's what keeps Sprint A
  from producing UI that quietly assumes an answer to a question this
  document deliberately left open.
- **Narrow watch-items, not blockers**: don't lock any shared
  `packages/ui` component's prop shape around an anonymous-only,
  single-price assumption (in case open question #2 resolves toward
  differentiated pricing later); don't build any UI affordance implying
  a persisted/frozen quote link (open question #4's "frozen" case) until
  persistence is actually decided — the "share this configuration" query-
  string flow (§6) is safe to build now.
- Open questions #3, #5, #6, #7 are correctly irrelevant to a UI-only
  sprint and can be deferred without any Sprint A precaution.

## Naming note (recorded, not a decision made here)

The user's own observation from the Architecture Checkpoint: `packages/
ui` — not `SectionRenderer`/the Content Framework — is the real
cross-portal foundation, since Sections are Marketing-specific but UI
components are meant to live in Dashboard/Admin/Partners/Developers too.
The user intends to formalize this as `HP-UI` / `@hustlerpay/ui` as an
official shared library **after** WEB-CALC-3, tied to the already-
tracked DESIGN-SYSTEM-2 ticket. Not started here.
