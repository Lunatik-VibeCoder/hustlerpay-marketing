import type { QuoteEngineProvider } from "./QuoteEngineProvider";
import type { Quote, QuoteRequest } from "./types";
import { getCountry } from "./types";

/**
 * Sprint A: Local development implementation only.
 *
 * Production must resolve QuoteEngineProvider through the backend
 * composition root — never wire LocalQuoteEngine into a production
 * build's quote path once a real engine exists.
 *
 * This implementation deliberately displays NO fabricated numbers
 * (Sprint A entry criterion, docs/smart_calculator_architecture.md):
 * the only number anywhere in its output is the user's own entered
 * amount, echoed back. Rate/fees/received-amount are em-dash
 * placeholders — the structure is demonstrated, nothing is invented.
 */
export class LocalQuoteEngine implements QuoteEngineProvider {
  async getQuote(request: QuoteRequest): Promise<Quote> {
    const origin = getCountry(request.corridor.origin);
    return {
      request,
      lines: [
        { label: "Montant", value: `${request.amount} ${origin.currency}` },
        { label: "Taux", value: "—" },
        { label: "Frais", value: "—" },
        { label: "Montant reçu", value: "—", emphasize: true },
      ],
      footnote: "Disponible au lancement.",
      demo: true,
      engine: "local-demo",
      generatedAt: new Date().toISOString(),
    };
  }
}
