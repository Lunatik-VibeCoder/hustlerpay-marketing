import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Conditions d'utilisation — HustlerPay",
  description: "Conditions d'utilisation de la plateforme HustlerPay.",
  path: "/terms",
});

// Draft, flagged for legal review — same reasoning as Privacy: real
// regulatory/liability language needs an actual legal review, this
// covers the real platform mechanics accurately without overclaiming.
export default function TermsPage() {
  return (
    <LegalPageLayout title="Conditions d'utilisation" draftNotice>
      <section>
        <h2>Organisations</h2>
        <p>
          Une organisation regroupe les utilisateurs, appareils et bénéficiaires d&apos;une même entreprise. Les
          données d&apos;une organisation ne sont accessibles qu&apos;à ses propres membres, sauf disposition
          contraire prévue par un accès administrateur de plateforme.
        </p>
      </section>
      <section>
        <h2>Développeurs et usage de l&apos;API</h2>
        <p>
          Un accès programmatique à la plateforme (API) est prévu pour les intégrations futures. L&apos;usage de
          l&apos;API sera soumis à des conditions spécifiques, communiquées lors de l&apos;ouverture de cet accès.
        </p>
      </section>
      <section>
        <h2>Utilisation acceptable</h2>
        <p>
          La plateforme doit être utilisée conformément à sa finalité — l&apos;orchestration d&apos;opérations
          Mobile Money légitimes pour le compte d&apos;une organisation autorisée. Toute utilisation frauduleuse ou
          détournée est interdite.
        </p>
      </section>
      <section>
        <h2>Disponibilité du service</h2>
        <p>
          HustlerPay s&apos;efforce de maintenir une disponibilité continue de la plateforme, sans garantie
          d&apos;absence totale d&apos;interruption. Des opérations de maintenance planifiées peuvent
          occasionnellement affecter la disponibilité.
        </p>
      </section>
      <section>
        <h2>Fonctionnalités en bêta</h2>
        <p>
          Certaines fonctionnalités peuvent être proposées en accès anticipé ou en bêta, avec un niveau de
          stabilité et de support réduit par rapport aux fonctionnalités générales de la plateforme.
        </p>
      </section>
      <section>
        <h2>Responsabilité</h2>
        <p>
          HustlerPay orchestre l&apos;exécution d&apos;opérations Mobile Money à partir des instructions fournies
          par l&apos;organisation utilisatrice. La responsabilité de la justesse des informations saisies
          (montants, numéros de téléphone, bénéficiaires) incombe à l&apos;organisation et à ses utilisateurs.
        </p>
      </section>
      <section>
        <h2>Suspension de compte</h2>
        <p>
          HustlerPay se réserve le droit de suspendre l&apos;accès d&apos;un compte ou d&apos;une organisation en
          cas de violation de ces conditions, d&apos;activité suspecte, ou de non-respect des obligations
          contractuelles.
        </p>
      </section>
    </LegalPageLayout>
  );
}
