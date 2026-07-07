import type { Quote, QuoteRequest } from "./types";

// The §12 Quote Engine Contract (docs/smart_calculator_architecture.md):
// the UI depends on exactly this interface, never on a concrete
// implementation. Same shape already proven by ContentProvider/
// StaticContentProvider in this repo. Two implementations are anticipated:
// LocalQuoteEngine (development/prototype, Sprint A) and a Backend HTTP
// implementation calling the real /api/v1/quotes contract (production,
// once open question #1 — where the engine lives — is resolved). Swapping
// them must be a single change at the composition root, zero changes to
// any consuming component.
export interface QuoteEngineProvider {
  getQuote(request: QuoteRequest): Promise<Quote>;
}
