import { LegalPageLayout } from "@/components/layout/LegalPageLayout";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "À propos — HustlerPay",
  description: "HustlerPay est une plateforme d'infrastructure Mobile Money pour les entreprises.",
  path: "/about",
});

// Real mission content — no invented customer counts or company history.
export default function AboutPage() {
  return (
    <LegalPageLayout title="À propos de HustlerPay">
      <section>
        <h2>Notre mission</h2>
        <p>
          HustlerPay est une plateforme d&apos;infrastructure Mobile Money conçue pour les entreprises qui opèrent
          à travers plusieurs opérateurs Mobile Money. Nous construisons les outils nécessaires pour orchestrer,
          superviser et sécuriser ces opérations à l&apos;échelle d&apos;une organisation, pas seulement d&apos;un
          agent isolé.
        </p>
      </section>
      <section>
        <h2>Une architecture pensée pour les organisations</h2>
        <p>
          La plateforme repose sur une architecture par organisation : chaque entreprise gère ses propres
          utilisateurs, appareils, bénéficiaires et trésorerie, avec des rôles et permissions dédiés. HustlerPay
          orchestre plusieurs appareils Mobile Money à la fois, automatise leur exécution, et fait remonter chaque
          opération dans un tableau de bord unique.
        </p>
      </section>
      <section>
        <h2>Ce que nous construisons</h2>
        <ul>
          <li>Une orchestration multi-appareils pour les opérations Mobile Money.</li>
          <li>Une gestion de trésorerie par organisation.</li>
          <li>Une automatisation du Runtime d&apos;exécution.</li>
          <li>Une plateforme conçue API-first, pensée pour l&apos;intégration dès le départ.</li>
        </ul>
      </section>
      <section>
        <h2>Où nous en sommes</h2>
        <p>
          HustlerPay est initialement déployé au Ghana et au Bénin, et conçu pour s&apos;étendre à d&apos;autres
          marchés africains à mesure que la plateforme mûrit.
        </p>
      </section>
    </LegalPageLayout>
  );
}
