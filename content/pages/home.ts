import { PageContent } from "../types";

// Real HustlerPay copy (not TGA's), still a demo/reference page — this
// is NOT the real homepage yet (that's a future sprint, once the real
// marketing copy/positioning is decided). Exercises all 8 registered
// section types so `next build` actually render-checks every one of
// them, not just the "card" placeholder from Sprint B.
export const home: PageContent = {
  slug: "home",
  seo: {
    title: "HustlerPay",
    description: "HustlerPay — Mobile Money automation platform.",
  },
  sections: [
    {
      id: "hero",
      type: "hero",
      metadata: {
        title: "L'automatisation Mobile Money pour votre entreprise",
        subtitle:
          "HustlerPay connecte vos opérations Mobile Money à un moteur d'exécution fiable, traçable et sécurisé.",
        primaryCta: { label: "Commencer", href: "/contact" },
        secondaryCta: { label: "En savoir plus", href: "/faq" },
        trustBadge: "Sécurité et conformité au cœur de la plateforme",
      },
    },
    {
      id: "features",
      type: "featureGrid",
      metadata: {
        title: "Une plateforme conçue pour la fiabilité",
        features: [
          { icon: "ShieldCheck", title: "Sécurité", description: "Confirmation bénéficiaire et audit complet de chaque transaction." },
          { icon: "Zap", title: "Automatisation", description: "Exécution des transactions sans intervention manuelle répétée." },
          { icon: "BarChart3", title: "Visibilité", description: "Un tableau de bord unique pour suivre l'activité en temps réel." },
        ],
      },
    },
    {
      id: "stats",
      type: "stats",
      metadata: {
        stats: [
          { label: "Transactions traitées", value: "10k+" },
          { label: "Uptime", value: "99.9%" },
          { label: "Pays supportés", value: "3" },
          { label: "Opérateurs", value: "5" },
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
          { title: "Configuration", description: "Définissez vos bénéficiaires et vos règles d'exécution." },
          { title: "Automatisation", description: "Les transactions s'exécutent et remontent au Dashboard en temps réel." },
        ],
      },
    },
    {
      id: "testimonials",
      type: "testimonials",
      metadata: {
        title: "Ils nous font confiance",
        testimonials: [
          { quote: "Exemple de témoignage — contenu réel à venir.", author: "Exemple Agent", role: "Agent Mobile Money" },
        ],
      },
    },
    {
      id: "faq",
      type: "faq",
      metadata: {
        title: "Questions fréquentes",
        items: [
          { id: "q1", question: "Qu'est-ce que HustlerPay ?", answer: "Contenu réel à définir." },
          { id: "q2", question: "Comment fonctionne la sécurité ?", answer: "Contenu réel à définir." },
        ],
      },
    },
    {
      id: "cta",
      type: "cta",
      metadata: {
        title: "Prêt à automatiser vos opérations ?",
        description: "Contactez-nous pour une démonstration.",
        cta: { label: "Nous contacter", href: "/contact" },
        variant: "brand",
      },
    },
  ],
};
