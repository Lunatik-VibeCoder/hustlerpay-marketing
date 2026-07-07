import { Card, CardHeader, CardTitle, CardDescription } from "@ui/Card";
import { IconResolver } from "@ui/IconResolver";

export interface Feature {
  /** lucide-react icon name (e.g. "ShieldCheck", "Zap") — resolved by
   * IconResolver, never a React node in metadata (must stay
   * JSON-serializable for a future real ContentProvider/CMS). */
  icon: string;
  title: string;
  description: string;
}

export interface FeatureGridMetadata {
  title?: string;
  subtitle?: string;
  features: Feature[];
}

export function FeatureGrid({ metadata }: { metadata: FeatureGridMetadata }) {
  const { title, subtitle, features } = metadata;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        {(title || subtitle) && (
          <div className="text-center mb-10 space-y-2">
            {title && <h2 className="text-2xl font-bold text-foreground">{title}</h2>}
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground mb-2">
                  <IconResolver name={feature.icon} className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
