import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

export const metadata: Metadata = {
  title: "Politique de cookies — HustlerPay",
  description: "Utilisation des cookies sur le site HustlerPay.",
};

// Simple, honest — this site genuinely doesn't use tracking/analytics
// cookies today, so the policy says exactly that, not a boilerplate
// cookie-consent template describing categories that don't apply yet.
export default function CookiesPage() {
  return (
    <LegalPageLayout title="Politique de cookies">
      <section>
        <p>
          Le site public HustlerPay n&apos;utilise actuellement aucun cookie de suivi ou d&apos;analyse. Si cela
          venait à changer (par exemple pour des besoins de mesure d&apos;audience), cette politique sera mise à
          jour en conséquence avant tout déploiement.
        </p>
        <p>
          L&apos;application Dashboard (app.hustlerpay.com) utilise un cookie technique nécessaire au
          fonctionnement de la session de connexion — ce cookie n&apos;est pas utilisé à des fins de suivi
          publicitaire.
        </p>
      </section>
    </LegalPageLayout>
  );
}
