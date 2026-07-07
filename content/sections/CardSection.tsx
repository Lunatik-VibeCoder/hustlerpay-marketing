import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@ui/Card";

export interface CardSectionMetadata {
  title: string;
  description?: string;
  body?: string;
}

// The one section type registered for Sprint B — proves the Content
// Framework wiring against a real component (Sprint A's Card), not a
// throwaway placeholder. Sprint C adds Hero/FAQ/FeatureGrid/Stats/
// Testimonial/Timeline/CTA the same way: a component here + one line in
// SectionRenderer's registry.
export function CardSection({ metadata }: { metadata: CardSectionMetadata }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{metadata.title}</CardTitle>
        {metadata.description && <CardDescription>{metadata.description}</CardDescription>}
      </CardHeader>
      {metadata.body && <CardContent>{metadata.body}</CardContent>}
    </Card>
  );
}
