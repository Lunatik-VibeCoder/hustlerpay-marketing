import { Section } from "./types";
import { CardSection } from "./sections/CardSection";
import { HeroSection } from "./sections/HeroSection";
import { FAQSection } from "./sections/FAQSection";
import { FeatureGrid } from "./sections/FeatureGrid";
import { StatsSection } from "./sections/StatsSection";
import { TestimonialSection } from "./sections/TestimonialSection";
import { TimelineSection } from "./sections/TimelineSection";
import { CTASection } from "./sections/CTASection";

type SectionComponent = React.ComponentType<{ metadata: Record<string, unknown> }>;

// The registry — reimplemented pattern, not TGA's code. Adding a new
// section type is one new entry here, never a switch statement, never a
// change to how pages fetch/pass content. Each section component narrows
// its own `metadata` prop type internally (e.g. CardSectionMetadata) —
// the registry itself only needs to agree they all accept a metadata bag.
//
// Each entry below is cast through `unknown` deliberately — a component's
// own metadata shape (e.g. requiring `title`) is necessarily narrower
// than the registry's generic `Record<string, unknown>`. Content authors
// are responsible for matching each section's expected metadata shape;
// the type system can't enforce that across a heterogeneous registry.
const SECTION_REGISTRY: Record<string, SectionComponent> = {
  card: CardSection as unknown as SectionComponent,
  hero: HeroSection as unknown as SectionComponent,
  faq: FAQSection as unknown as SectionComponent,
  featureGrid: FeatureGrid as unknown as SectionComponent,
  stats: StatsSection as unknown as SectionComponent,
  testimonials: TestimonialSection as unknown as SectionComponent,
  timeline: TimelineSection as unknown as SectionComponent,
  cta: CTASection as unknown as SectionComponent,
};

export function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((section) => {
        const Component = SECTION_REGISTRY[section.type];
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
