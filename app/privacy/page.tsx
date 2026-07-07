import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

export const metadata: Metadata = {
  title: "Politique de confidentialité — HustlerPay",
  description: "Comment HustlerPay traite les données personnelles et Mobile Money.",
};

// Draft grounded in real, verified platform mechanics (OTP verification,
// audit logging, password hashing) — never a legal claim invented for
// the occasion. Flagged as a draft (LegalPageLayout draftNotice) since a
// Privacy Policy has real regulatory implications (Ghana/Bénin data
// protection law) that require an actual legal review, not just
// engineering accuracy.
export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Politique de confidentialité" draftNotice>
      <section>
        <h2>Données personnelles collectées</h2>
        <p>
          HustlerPay traite les données nécessaires au fonctionnement de la plateforme : informations de compte
          (email, nom, organisation, rôle), informations sur les bénéficiaires enregistrés (nom, numéro de
          téléphone, pays, réseau préféré), et les métadonnées des transactions traitées via la plateforme.
        </p>
      </section>
      <section>
        <h2>Données Mobile Money</h2>
        <p>
          Les transactions Mobile Money traitées via la plateforme (montants, statuts, références) sont
          enregistrées pour permettre le suivi, la réconciliation et la supervision de trésorerie. HustlerPay
          n&apos;a pas accès aux identifiants ou codes PIN des comptes Mobile Money des opérateurs.
        </p>
      </section>
      <section>
        <h2>Vérification par OTP</h2>
        <p>
          L&apos;enregistrement d&apos;un nouveau bénéficiaire déclenche l&apos;envoi d&apos;un code de vérification
          à usage unique par email, avec un délai de sécurité avant que ce bénéficiaire puisse recevoir des fonds.
          Ce mécanisme vise à réduire le risque d&apos;enregistrement frauduleux.
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
        <h2>Sécurité et chiffrement</h2>
        <ul>
          <li>Les mots de passe ne sont jamais stockés en clair (hachage avant enregistrement).</li>
          <li>Les échanges avec la plateforme transitent via une connexion chiffrée (HTTPS).</li>
          <li>L&apos;accès aux fonctionnalités est contrôlé par un système de permissions par rôle.</li>
        </ul>
      </section>
    </LegalPageLayout>
  );
}
