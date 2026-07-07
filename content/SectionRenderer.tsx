import { Section } from "./types";
import { CardSection } from "./sections/CardSection";

type SectionComponent = React.ComponentType<{ metadata: Record<string, unknown> }>;

// The registry — reimplemented pattern, not TGA's code. Adding a new
// section type (Sprint C: Hero/FAQ/FeatureGrid/Stats/Testimonial/
// Timeline/CTA) is one new entry here, never a switch statement, never a
// change to how pages fetch/pass content. Each section component narrows
// its own `metadata` prop type internally (e.g. CardSectionMetadata) —
// the registry itself only needs to agree they all accept a metadata bag.
const SECTION_REGISTRY: Record<string, SectionComponent> = {
  // Each section component narrows its own metadata shape (e.g.
  // CardSectionMetadata requires `title`) — necessarily wider than the
  // registry's generic `Record<string, unknown>`. This cast is the one
  // deliberate type-erasure boundary of the pattern: content authors are
  // responsible for matching each section's expected metadata shape, the
  // type system can't enforce it across a heterogeneous registry.
  card: CardSection as unknown as SectionComponent,
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
        return <Component key={section.id} metadata={section.metadata} />;
      })}
    </>
  );
}
