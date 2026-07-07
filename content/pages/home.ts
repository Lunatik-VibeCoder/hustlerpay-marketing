import { PageContent } from "../types";

// Real HustlerPay copy (not TGA's), intentionally minimal — this page is
// still the default create-next-app scaffold today (WEB-CALC-1 Sprint C
// migrates the real homepage sections: Hero/FAQ/FeatureGrid/etc.). This
// file exists in Sprint B only to prove the ContentProvider/SectionRenderer
// wiring end-to-end with the one section type built so far ("card", using
// Sprint A's real Card component) — not a preview of the real homepage.
export const home: PageContent = {
  slug: "home",
  seo: {
    title: "HustlerPay",
    description: "HustlerPay — Mobile Money automation platform.",
  },
  sections: [
    {
      id: "content-framework-demo",
      type: "card",
      metadata: {
        title: "Content Framework",
        description: "Section rendue via ContentProvider -> SectionRenderer -> card component.",
        body: "Cette section prouve le câblage de bout en bout (WEB-CALC-1 Sprint B) — les vraies sections marketing (Hero/FAQ/...) arrivent en Sprint C.",
      },
    },
  ],
};
