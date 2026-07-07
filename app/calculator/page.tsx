import { Suspense } from "react";
import { TriangleAlert } from "lucide-react";
import { buildNoIndexMetadata } from "@/lib/seo";
import { CalculatorClient } from "./CalculatorClient";

// WEB-CALC-3 Sprint A — deliberately noindex (explicit decision): the
// page ships with demo data only (no real engine yet), and the SEO plan
// (docs/smart_calculator_architecture.md §6) is about the REAL calculator
// being a search entry point. Flip to buildMetadata + sitemap entry +
// robots allow the day real quotes ship — three changes, all flagged.
export const metadata = buildNoIndexMetadata({
  title: "Smart Calculator (aperçu) — HustlerPay",
  description: "Aperçu de l'interface du Smart Calculator HustlerPay — démonstration, aucun calcul réel.",
});

export default function CalculatorPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-foreground">Smart Calculator</h1>
      <p className="text-muted-foreground mt-2">
        Estimez vos transferts Mobile Money entre le Ghana et le Bénin.
      </p>

      {/* Demo banner — full explicit block, impossible to misread (user's
          own wording requirement, not a one-liner footnote). */}
      <div className="mt-6 rounded-lg border border-warning/40 bg-warning/10 p-4">
        <div className="flex items-start gap-3">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" />
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-foreground">Aperçu du Smart Calculator</p>
            <p className="text-muted-foreground">
              Cette page présente uniquement l&apos;interface utilisateur. Aucun taux réel, aucun frais réel,
              aucun calcul réel n&apos;est utilisé. Les résultats affichés servent uniquement à démontrer
              l&apos;expérience utilisateur.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {/* Suspense required: CalculatorClient uses useSearchParams — this
            keeps the route statically renderable (the page itself never
            reads searchParams server-side; canonical/metadata never depend
            on params, per §6). */}
        <Suspense>
          <CalculatorClient />
        </Suspense>
      </div>
    </main>
  );
}
