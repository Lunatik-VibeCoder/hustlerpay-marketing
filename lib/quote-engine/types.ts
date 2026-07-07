// Quote Engine — UI-facing domain types (WEB-CALC-3 Sprint A).
// Mirrors docs/smart_calculator_architecture.md §4 (Domain Model) and §12
// (Quote Engine Contract). No formulas, no persistence — types only.

/** All modes the registry knows about (§3). Only moneyTransfer is enabled
 * this sprint — the others are named now so MODE_REGISTRY can carry
 * explicit enabled flags instead of being restructured at activation. */
export type CalculatorMode = "moneyTransfer" | "currencyConversion" | "fees";

/** Which engine produced a Quote — "local-demo" is the only value in
 * Sprint A. Written as a union ready to grow ("backend" | "partner" |
 * "cached" are anticipated, §12) so Dashboard/logs/tests can always tell
 * where a result came from. */
export type QuoteEngineId = "local-demo";

export type CountryCode = "GH" | "BJ";

export interface Country {
  code: CountryCode;
  currency: string;
  label: string;
  /** Not displayed this sprint — carried in the model because every
   * future portal (Dashboard, Partners, mobile) will need it. */
  flag: string;
}

// Exactly the countries HustlerPay operates in today (§4 — do not extend
// to Togo/Côte d'Ivoire/Burkina Faso for calculation purposes).
export const COUNTRIES: readonly Country[] = [
  { code: "GH", currency: "GHS", label: "Ghana", flag: "🇬🇭" },
  { code: "BJ", currency: "XOF", label: "Bénin", flag: "🇧🇯" },
];

export function getCountry(code: CountryCode): Country {
  const found = COUNTRIES.find((c) => c.code === code);
  if (!found) throw new Error(`Unknown country code: ${code}`);
  return found;
}

/** Directional pair (§4) — A→B and B→A are distinct corridors. */
export interface Corridor {
  origin: CountryCode;
  destination: CountryCode;
}

export interface QuoteRequest {
  mode: CalculatorMode;
  corridor: Corridor;
  /** Raw user input, kept as string (CurrencyInput's own contract). */
  amount: string;
  /** Always derived from the origin country — never independent state. */
  currency: string;
}

export interface QuoteLine {
  label: string;
  value: string;
  emphasize?: boolean;
}

export interface Quote {
  request: QuoteRequest;
  lines: QuoteLine[];
  footnote: string;
  /** Literal `true` in Sprint A — makes it impossible to construct a
   * "real-looking" quote from this type. Sprint B's real engine changes
   * the type itself, not just the data. */
  demo: true;
  engine: QuoteEngineId;
  /** ISO8601, set at generation time. Nothing is persisted today, but a
   * future "Quote générée le…" display needs no contract change. */
  generatedAt: string;
}
