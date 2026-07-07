import { PageSection } from "./types";
import { CardSection, type CardSectionMetadata } from "./sections/CardSection";
import { HeroSection, type HeroSectionMetadata } from "./sections/HeroSection";
import { FAQSection, type FAQSectionMetadata } from "./sections/FAQSection";
import { FeatureGrid, type FeatureGridMetadata } from "./sections/FeatureGrid";
import { StatsSection, type StatsSectionMetadata } from "./sections/StatsSection";
import { TestimonialSection, type TestimonialSectionMetadata } from "./sections/TestimonialSection";
import { TimelineSection, type TimelineSectionMetadata } from "./sections/TimelineSection";
import { CTASection, type CTASectionMetadata } from "./sections/CTASection";

// Pairs each section `type` literal with its own metadata shape — the
// same pairing PageSection (content/types.ts) already enforces at the
// content-authoring boundary (content/pages/*.ts, where a human actually
// types content by hand and a typo is most likely). Keep in lockstep with
// PageSection's own union.
type SectionTypeMap = {
  hero: HeroSectionMetadata;
  faq: FAQSectionMetadata;
  featureGrid: FeatureGridMetadata;
  stats: StatsSectionMetadata;
  testimonials: TestimonialSectionMetadata;
  timeline: TimelineSectionMetadata;
  cta: CTASectionMetadata;
  card: CardSectionMetadata;
};

type SectionComponentMap = {
  [K in keyof SectionTypeMap]: React.ComponentType<{ metadata: SectionTypeMap[K] }>;
};

// The registry — reimplemented pattern, not TGA's code. Adding a new
// section type is one new entry here (plus one line in SectionTypeMap
// above and PageSection in content/types.ts), never a switch statement.
// Typed via SectionComponentMap, so assigning the wrong component to a
// key (e.g. `hero: FAQSection`) now fails to compile — no more
// `as unknown as SectionComponent` per entry.
const SECTION_REGISTRY: SectionComponentMap = {
  card: CardSection,
  hero: HeroSection,
  faq: FAQSection,
  featureGrid: FeatureGrid,
  stats: StatsSection,
  testimonials: TestimonialSection,
  timeline: TimelineSection,
  cta: CTASection,
};

export function SectionRenderer({ sections }: { sections: PageSection[] }) {
  return (
    <>
      {sections.map((section) => {
        // One remaining, narrowly-scoped cast: TypeScript can't carry the
        // correlation between a specific union member's `type` and its
        // `metadata` shape through a runtime `Record` lookup (a known
        // TS limitation with "correlated unions"). The real safety net is
        // upstream — `section` is already a checked `PageSection` here,
        // so this erasure only affects the render-time dispatch, not
        // whether the content was authored correctly.
        const Component = SECTION_REGISTRY[section.type] as
          | React.ComponentType<{ metadata: unknown }>
          | undefined;
        if (!Component) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(`SectionRenderer: unknown section type "${section.type}" (id: ${section.id})`);
          }
          return null;
        }
        // Wrapping div carries the section's own id as an HTML anchor
        // target (e.g. Hero's secondaryCta linking to "#faq") — generic
        // for every section, not special-cased to one type.
        return (
          <div key={section.id} id={section.id}>
            <Component metadata={section.metadata} />
          </div>
        );
      })}
    </>
  );
}
