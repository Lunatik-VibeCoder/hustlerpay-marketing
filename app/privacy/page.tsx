import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Politique de confidentialité — HustlerPay",
  description: "Comment HustlerPay traite les données personnelles, organisationnelles et Mobile Money.",
  path: "/privacy",
});

// Draft grounded in real, verified platform mechanics — never a legal
// claim invented for the occasion. Flagged as a draft (draftNotice) since
// a Privacy Policy has real regulatory implications (Ghana/Bénin data
// protection law, GDPR-style principles) requiring an actual legal
// review, not just engineering accuracy.
export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Politique de confidentialité" draftNotice>
      <section>
        <h2>Informations personnelles</h2>
        <p>
          HustlerPay traite les données nécessaires à la création et à la gestion des comptes utilisateurs : nom,
          email, rôle, et organisation d&apos;appartenance.
        </p>
      </section>
      <section>
        <h2>Données organisationnelles</h2>
        <p>
          Chaque organisation dispose de ses propres données — utilisateurs, appareils, bénéficiaires,
          trésorerie — cloisonnées des autres organisations utilisant la plateforme.
        </p>
      </section>
      <section>
        <h2>Métadonnées de transaction</h2>
        <p>
          Les transactions traitées via la plateforme (montants, statuts, références, horodatages) sont
          enregistrées pour permettre le suivi, la réconciliation et la supervision de trésorerie. HustlerPay
          n&apos;a pas accès aux identifiants ou codes PIN des comptes Mobile Money des opérateurs.
        </p>
      </section>
      <section>
        <h2>Journaux d&apos;audit</h2>
        <p>
          Les actions importantes effectuées sur la plateforme (création, modification, changement de statut)
          sont journalisées avec l&apos;identité de l&apos;auteur et l&apos;horodatage, afin de permettre une
          traçabilité complète des opérations sensibles.
        </p>
      </section>
      <section>
        <h2>Vérification par OTP</h2>
        <p>
          L&apos;enregistrement d&apos;un nouveau bénéficiaire déclenche l&apos;envoi d&apos;un code de vérification
          à usage unique par email, suivi d&apos;un délai de sécurité avant que ce bénéficiaire puisse recevoir des
          fonds — une mesure destinée à réduire le risque d&apos;enregistrement frauduleux.
        </p>
      </section>
      <section>
        <h2>Sécurité et chiffrement</h2>
        <ul>
          <li>Les mots de passe ne sont jamais stockés en clair (hachage avant enregistrement).</li>
          <li>Les échanges avec la plateforme transitent via une connexion chiffrée (HTTPS).</li>
          <li>L&apos;accès aux fonctionnalités est contrôlé par un système de permissions par rôle.</li>
        </ul>
      </section>
      <section>
        <h2>Conservation des données</h2>
        <p>
          Les données sont conservées pour la durée nécessaire à la fourniture du service et au respect des
          obligations légales applicables (notamment la traçabilité des transactions financières). Les modalités
          précises de conservation seront détaillées à l&apos;issue de la revue juridique de ce document.
        </p>
      </section>
      <section>
        <h2>Vos droits</h2>
        <p>
          Conformément aux principes de protection des données applicables, vous disposez d&apos;un droit
          d&apos;accès, de rectification et de suppression de vos données personnelles. Les modalités
          d&apos;exercice de ces droits seront précisées à l&apos;issue de la revue juridique de ce document.
        </p>
      </section>
    </LegalPageLayout>
  );
}
