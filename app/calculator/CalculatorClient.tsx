"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftRight, Link as LinkIcon } from "lucide-react";
import { Badge } from "@ui/Badge";
import { Button } from "@ui/Button";
import { CountrySelector } from "@ui/CountrySelector";
import { CurrencyInput } from "@ui/CurrencyInput";
import { QuoteCard } from "@ui/QuoteCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@ui/Tabs";
import type { QuoteEngineProvider } from "@/lib/quote-engine/QuoteEngineProvider";
import { LocalQuoteEngine } from "@/lib/quote-engine/LocalQuoteEngine";
import { COUNTRIES, getCountry, type CalculatorMode, type CountryCode, type Quote } from "@/lib/quote-engine/types";

// Composition root (§12) — the single line Sprint B/C swaps for the
// Backend HTTP implementation. No consuming code below references
// LocalQuoteEngine directly.
const quoteEngine: QuoteEngineProvider = new LocalQuoteEngine();

// Mode registry (§3) — activation of a future mode is flipping
// `enabled: true`, never a structural change. Tabs are only this
// Marketing page's presentation of the registry; the engine itself
// never knows tabs exist.
const MODE_REGISTRY: { id: CalculatorMode; label: string; enabled: boolean }[] = [
  { id: "moneyTransfer", label: "Transfert d'argent", enabled: true },
  { id: "currencyConversion", label: "Conversion de devises", enabled: false },
  { id: "fees", label: "Frais", enabled: false },
];

const COUNTRY_OPTIONS = COUNTRIES.map((c) => ({ code: c.code, label: c.label }));

function isCountryCode(value: string | null): value is CountryCode {
  return COUNTRIES.some((c) => c.code === value);
}

export function CalculatorClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [origin, setOrigin] = useState<CountryCode>(() => {
    const from = searchParams.get("from");
    return isCountryCode(from) ? from : "GH";
  });
  const [destination, setDestination] = useState<CountryCode>(() => {
    const to = searchParams.get("to");
    return isCountryCode(to) ? to : "BJ";
  });
  const [amount, setAmount] = useState(() => searchParams.get("amount") ?? "");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Currency is never independent state — always derived from the origin
  // country, so swapping origin/destination inherently swaps the currency
  // too: "Origin BJ / Currency GHS" is impossible by construction.
  const currency = getCountry(origin).currency;

  // URL-driven state (§6) — a specific configuration is a real,
  // bookmarkable, shareable URL. Empty params are omitted entirely
  // (never `amount=`): /calculator → ?from=GH → ?from=GH&to=BJ&amount=50.
  useEffect(() => {
    const params = new URLSearchParams();
    if (origin) params.set("from", origin);
    if (destination) params.set("to", destination);
    if (amount) params.set("amount", amount);
    const query = params.toString();
    router.replace(query ? `/calculator?${query}` : "/calculator", { scroll: false });
  }, [origin, destination, amount, router]);

  const handleSwap = useCallback(() => {
    setOrigin(destination);
    setDestination(origin);
    setQuote(null);
  }, [origin, destination]);

  const handleSubmit = useCallback(async () => {
    const result = await quoteEngine.getQuote({
      mode: "moneyTransfer",
      corridor: { origin, destination },
      amount,
      currency,
    });
    setQuote(result);
  }, [origin, destination, amount, currency]);

  const handleCopyLink = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  }, []);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="moneyTransfer">
        <TabsList>
          {MODE_REGISTRY.map((mode) => (
            <TabsTrigger key={mode.id} value={mode.id} disabled={!mode.enabled}>
              {mode.label}
              {!mode.enabled && (
                <Badge variant="default" className="ml-1.5">
                  Bientôt
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="moneyTransfer">
          <div className="space-y-4 rounded-lg border border-border bg-card p-6">
            <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
              <div className="space-y-1.5">
                <label htmlFor="calc-origin" className="text-xs font-semibold text-muted-foreground uppercase">
                  Pays d&apos;envoi
                </label>
                <CountrySelector
                  id="calc-origin"
                  options={COUNTRY_OPTIONS}
                  value={origin}
                  onChange={(code) => {
                    setOrigin(code as CountryCode);
                    setQuote(null);
                  }}
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={handleSwap}
                aria-label="Inverser les pays"
                className="mb-0.5 h-10 w-10 justify-self-center px-0"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
              <div className="space-y-1.5">
                <label htmlFor="calc-destination" className="text-xs font-semibold text-muted-foreground uppercase">
                  Pays de réception
                </label>
                <CountrySelector
                  id="calc-destination"
                  options={COUNTRY_OPTIONS}
                  value={destination}
                  onChange={(code) => {
                    setDestination(code as CountryCode);
                    setQuote(null);
                  }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="calc-amount" className="text-xs font-semibold text-muted-foreground uppercase">
                Montant
              </label>
              <CurrencyInput
                id="calc-amount"
                currency={currency}
                value={amount}
                onChange={(value) => {
                  setAmount(value);
                  setQuote(null);
                }}
                placeholder="0"
              />
            </div>

            <Button type="button" onClick={handleSubmit} disabled={!amount}>
              Obtenir un aperçu
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {quote && (
        <div className="space-y-3">
          <QuoteCard title="Aperçu (démonstration)" lines={quote.lines} footnote={quote.footnote} />
          <div className="space-y-1.5">
            <Button type="button" variant="secondary" onClick={handleCopyLink}>
              <LinkIcon className="mr-2 h-4 w-4" />
              {linkCopied ? "Lien copié" : "Copier le lien"}
            </Button>
            <p className="text-xs text-muted-foreground">
              Ce lien partage uniquement la configuration sélectionnée. Il ne contient aucun résultat.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
