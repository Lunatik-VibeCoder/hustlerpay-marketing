import { PageContent } from "../types";

// The real homepage (WEB-CALC-2 Sprint A) — every claim below is a real,
// verifiable HustlerPay capability, not a marketing estimate. Explicit
// rule from the user: no fabricated statistics, customer counts, uptime
// percentages, testimonials, or compliance claims until they're genuinely
// true and publishable. Stats/Testimonials sections exist in
// SectionRenderer's registry but are deliberately NOT composed into this
// page yet — they return the day real numbers/real customer quotes
// exist, not before.
export const home: PageContent = {
  slug: "home",
  seo: {
    title: "HustlerPay — Automatisation Mobile Money",
    description:
      "HustlerPay orchestre vos appareils Mobile Money, votre trésorerie et vos bénéficiaires depuis une plateforme unique.",
  },
  sections: [
    {
      id: "hero",
      type: "hero",
      metadata: {
        title: "L'automatisation Mobile Money pour votre entreprise",
        subtitle:
          "HustlerPay connecte vos appareils agents, votre trésorerie et vos bénéficiaires dans un tableau de bord unique — conçu pour les entreprises qui opèrent des activités Mobile Money.",
        primaryCta: { label: "Nous contacter", href: "/contact" },
        secondaryCta: { label: "Questions fréquentes", href: "#faq" },
      },
    },
    {
      id: "features",
      type: "featureGrid",
      metadata: {
        title: "Ce que fait HustlerPay aujourd'hui",
        features: [
          { icon: "Smartphone", title: "Orchestration multi-appareils", description: "Supervisez plusieurs appareils Mobile Money depuis une seule plateforme." },
          { icon: "Zap", title: "Automatisation Mobile Money", description: "Exécution automatisée des opérations USSD via MoMo Assistant." },
          { icon: "Wallet", title: "Gestion de trésorerie", description: "Suivi des soldes, réconciliation et revue des écarts par portefeuille." },
          { icon: "UserCheck", title: "Gestion des bénéficiaires", description: "Registre de bénéficiaires de confiance, vérification par email et délai de sécurité." },
          { icon: "Building2", title: "Gestion des organisations", description: "Comptes, rôles et permissions par organisation." },
          { icon: "ShieldAlert", title: "Piste d'audit", description: "Chaque action importante est journalisée et consultable." },
          { icon: "Server", title: "Supervision du Runtime", description: "État des appareils, des SIMs et des tâches en temps réel." },
          { icon: "Code2", title: "Architecture API-first", description: "Une API backend conçue pour l'intégration, pas seulement le Dashboard." },
          { icon: "Globe", title: "Support Ghana & Bénin", description: "Opérateurs MTN Ghana et MTN Bénin pris en charge aujourd'hui." },
          {
            icon: "Calculator",
            title: "Calculatrice intelligente",
            description: "Estimation des frais et des transactions directement depuis la plateforme.",
            badge: "Bientôt disponible",
          },
        ],
      },
    },
    {
      id: "timeline",
      type: "timeline",
      metadata: {
        title: "Comment ça marche",
        steps: [
          { title: "Connexion", description: "Reliez votre appareil MoMo Assistant au Runtime HustlerPay." },
          { title: "Configuration", description: "Définissez vos bénéficiaires, organisations et règles d'exécution." },
          { title: "Automatisation", description: "Les transactions s'exécutent et remontent au Dashboard en temps réel." },
        ],
      },
    },
    {
      id: "faq",
      type: "faq",
      metadata: {
        title: "Questions fréquentes",
        items: [
          {
            id: "what-is-hustlerpay",
            question: "Qu'est-ce que HustlerPay ?",
            answer:
              "HustlerPay est une plateforme d'automatisation Mobile Money qui connecte vos appareils agents (via MoMo Assistant), votre trésorerie et vos bénéficiaires dans un tableau de bord unique.",
          },
          {
            id: "does-it-replace-operator",
            question: "Est-ce que HustlerPay remplace mon opérateur Mobile Money ?",
            answer:
              "Non. HustlerPay orchestre et automatise l'utilisation de vos comptes Mobile Money existants — ce n'est pas un opérateur ni un portefeuille de substitution.",
          },
          {
            id: "which-countries",
            question: "Quels pays et réseaux sont supportés ?",
            answer:
              "HustlerPay supporte aujourd'hui le Ghana et le Bénin, via les réseaux MTN. D'autres pays et opérateurs sont en cours d'intégration.",
          },
          {
            id: "how-is-security-handled",
            question: "Comment la sécurité est-elle gérée ?",
            answer:
              "Chaque bénéficiaire passe par une vérification par email et un délai de sécurité avant de pouvoir recevoir des fonds. Chaque action importante est journalisée dans une piste d'audit consultable.",
          },
        ],
      },
    },
    {
      id: "cta",
      type: "cta",
      metadata: {
        title: "Prêt à automatiser vos opérations ?",
        description: "Contactez-nous pour en savoir plus sur HustlerPay.",
        cta: { label: "Nous contacter", href: "/contact" },
        variant: "brand",
      },
    },
  ],
};
