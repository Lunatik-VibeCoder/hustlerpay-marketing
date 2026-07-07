import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Politique de cookies — HustlerPay",
  description: "Utilisation des cookies sur le site et la plateforme HustlerPay.",
  path: "/cookies",
});

export default function CookiesPage() {
  return (
    <LegalPageLayout title="Politique de cookies">
      <section>
        <h2>Cookies essentiels</h2>
        <p>
          Ce site public n&apos;utilise aucun cookie essentiel au-delà de ce qui est strictement nécessaire à son
          fonctionnement de base.
        </p>
      </section>
      <section>
        <h2>Authentification</h2>
        <p>
          L&apos;application Dashboard (app.hustlerpay.com) utilise un cookie technique nécessaire au
          fonctionnement de la session de connexion. Ce cookie n&apos;est pas utilisé à des fins de suivi
          publicitaire et n&apos;est présent que sur l&apos;application, pas sur ce site public.
        </p>
      </section>
      <section>
        <h2>Préférences</h2>
        <p>
          Aucune préférence utilisateur (langue, thème) n&apos;est aujourd&apos;hui mémorisée par cookie sur ce
          site public.
        </p>
      </section>
      <section>
        <h2>Analyse d&apos;audience</h2>
        <p>
          Aucun cookie d&apos;analyse ou de mesure d&apos;audience n&apos;est utilisé aujourd&apos;hui. Si cela
          venait à changer, cette politique sera mise à jour avant tout déploiement, avec le mécanisme de
          consentement approprié.
        </p>
      </section>
    </LegalPageLayout>
  );
}
