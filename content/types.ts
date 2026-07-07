// Content Framework — pattern only, reimplemented fresh for HustlerPay.
// Inspired by TGA's documented "Content Framework v1.0" (ADR-013) — a
// Section{id,type,metadata}[] driving a component registry — but this is
// a clean rewrite, never TGA's actual code (TGA is inspiration, never a
// dependency, per the WEB-CALC-0 rule).

import type { HeroSectionMetadata } from "./sections/HeroSection";
import type { FAQSectionMetadata } from "./sections/FAQSection";
import type { FeatureGridMetadata } from "./sections/FeatureGrid";
import type { StatsSectionMetadata } from "./sections/StatsSection";
import type { TestimonialSectionMetadata } from "./sections/TestimonialSection";
import type { TimelineSectionMetadata } from "./sections/TimelineSection";
import type { CTASectionMetadata } from "./sections/CTASection";
import type { CardSectionMetadata } from "./sections/CardSection";

// Generic shape kept around for reference/future section authors — the
// real compile-time guarantee lives in the PageSection union below, not
// in this alone (a bare `Section<string, X>` can't enforce that a given
// `type` string is paired with the right `X`).
export interface Section<TType extends string = string, TMetadata = Record<string, unknown>> {
  id: string;
  /** Looked up in SectionRenderer's registry — adding a new section type
   * is a one-line registry addition, never a switch statement. */
  type: TType;
  metadata: TMetadata;
}

// Discriminated union of every real section type paired with its own
// metadata interface (WEB-CALC-2.5 — closes the gap the Architecture
// Checkpoint flagged: authoring a section with the wrong `type`/`metadata`
// pairing in a content/pages/*.ts file now fails `tsc`, instead of only
// being caught by SectionRenderer's `unknown` cast at render time, which
// enforced nothing). Keep this list and SectionRenderer's SECTION_REGISTRY
// in lockstep — adding a section type means one line in each.
export type PageSection =
  | Section<"hero", HeroSectionMetadata>
  | Section<"faq", FAQSectionMetadata>
  | Section<"featureGrid", FeatureGridMetadata>
  | Section<"stats", StatsSectionMetadata>
  | Section<"testimonials", TestimonialSectionMetadata>
  | Section<"timeline", TimelineSectionMetadata>
  | Section<"cta", CTASectionMetadata>
  | Section<"card", CardSectionMetadata>;

export interface SEO {
  title: string;
  description: string;
}

export interface PageContent {
  slug: string;
  seo: SEO;
  sections: PageSection[];
}
