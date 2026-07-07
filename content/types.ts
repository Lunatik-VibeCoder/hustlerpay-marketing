// Content Framework — pattern only, reimplemented fresh for HustlerPay.
// Inspired by TGA's documented "Content Framework v1.0" (ADR-013) — a
// Section{id,type,metadata}[] driving a component registry — but this is
// a clean rewrite, never TGA's actual code (TGA is inspiration, never a
// dependency, per the WEB-CALC-0 rule).

export interface Section {
  id: string;
  /** Looked up in SectionRenderer's registry — adding a new section type
   * is a one-line registry addition, never a switch statement. */
  type: string;
  metadata: Record<string, unknown>;
}

export interface SEO {
  title: string;
  description: string;
}

export interface PageContent {
  slug: string;
  seo: SEO;
  sections: Section[];
}
