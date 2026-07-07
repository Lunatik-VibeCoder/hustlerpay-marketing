import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/layout/LegalPageLayout";

export const metadata: Metadata = {
  title: "À propos — HustlerPay",
  description: "Pourquoi HustlerPay existe et le problème que nous résolvons.",
};

// Real narrative — grounded in what HustlerPay actually does today, not
// an invented founding story (no dates/names/funding claims fabricated).
export default function AboutPage() {
  return (
    <LegalPageLayout title="À propos de HustlerPay">
      <section>
        <h2>Le problème que nous résolvons</h2>
        <p>
          Les agents et entreprises Mobile Money traitent chaque jour un volume important d&apos;opérations USSD
          manuelles — dépôts, retraits, transferts, achats de crédit — saisies à la main dans l&apos;interface de
          l&apos;opérateur. Cette saisie manuelle est source d&apos;erreurs, difficile à superviser à l&apos;échelle
          de plusieurs appareils, et ne laisse aucune trace d&apos;audit facilement exploitable.
        </p>
      </section>
      <section>
        <h2>Notre approche</h2>
        <p>
          HustlerPay automatise ce travail répétitif à travers MoMo Assistant, notre outil pour les appareils
          agents, et centralise la supervision — trésorerie, bénéficiaires, organisations, journal d&apos;audit —
          dans un tableau de bord unique. L&apos;objectif n&apos;est pas de remplacer les opérateurs Mobile Money,
          mais d&apos;orchestrer et de sécuriser la façon dont vos équipes les utilisent.
        </p>
      </section>
      <section>
        <h2>Notre vision</h2>
        <p>
          Qu&apos;une transaction provienne d&apos;une automatisation planifiée, d&apos;un appareil agent, ou
          d&apos;une future intégration avec les rapports opérateur, elle doit converger vers un registre unique et
          fiable. Chaque transaction doit rester explicable : son origine, l&apos;appareil concerné, et la preuve
          qui la confirme.
        </p>
      </section>
    </LegalPageLayout>
  );
}
