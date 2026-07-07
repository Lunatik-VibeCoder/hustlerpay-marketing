import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

export const metadata: Metadata = {
  title: "Conditions d'utilisation — HustlerPay",
  description: "Conditions d'utilisation de la plateforme HustlerPay.",
};

// Draft, flagged for legal review — same reasoning as Privacy: real
// regulatory/liability language needs an actual legal review, this
// covers the real platform mechanics accurately without overclaiming.
export default function TermsPage() {
  return (
    <LegalPageLayout title="Conditions d'utilisation" draftNotice>
      <section>
        <h2>Utilisation de la plateforme</h2>
        <p>
          L&apos;accès à HustlerPay est réservé aux organisations et utilisateurs autorisés. Chaque compte est
          associé à un rôle définissant les actions autorisées (lecture, écriture, gestion).
        </p>
      </section>
      <section>
        <h2>Organisations</h2>
        <p>
          Une organisation regroupe les utilisateurs, appareils et bénéficiaires d&apos;une même entreprise. Les
          données d&apos;une organisation ne sont accessibles qu&apos;à ses propres membres, sauf disposition
          contraire prévue par un accès administrateur de plateforme.
        </p>
      </section>
      <section>
        <h2>API et développeurs</h2>
        <p>
          Un accès programmatique à la plateforme (API) est prévu pour les intégrations futures. L&apos;usage de
          l&apos;API sera soumis à des conditions spécifiques, communiquées lors de l&apos;ouverture de cet accès.
        </p>
      </section>
      <section>
        <h2>Responsabilités</h2>
        <p>
          HustlerPay orchestre l&apos;exécution d&apos;opérations Mobile Money à partir des instructions fournies
          par l&apos;organisation utilisatrice. La responsabilité de la justesse des informations saisies
          (montants, numéros de téléphone, bénéficiaires) incombe à l&apos;organisation et à ses utilisateurs.
        </p>
      </section>
    </LegalPageLayout>
  );
}
