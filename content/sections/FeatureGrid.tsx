import { Card, CardHeader, CardTitle, CardDescription } from "@ui/Card";
import { IconResolver } from "@ui/IconResolver";
import { Badge } from "@ui/Badge";

export interface Feature {
  /** lucide-react icon name (e.g. "ShieldCheck", "Zap") — resolved by
   * IconResolver, never a React node in metadata (must stay
   * JSON-serializable for a future real ContentProvider/CMS). */
  icon: string;
  title: string;
  description: string;
  /** Transparency label for a feature that isn't fully shipped yet (e.g.
   * "Bientôt disponible", "Beta privée") — never omitted silently for an
   * incomplete feature, per the "no fabricated claims" rule extended to
   * marketing copy: a feature listed without this badge is a claim that
   * it's real and available today. */
  badge?: string;
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
                <div className="flex items-center justify-between mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
                    <IconResolver name={feature.icon} className="h-5 w-5" />
                  </div>
                  {feature.badge && <Badge variant="warning">{feature.badge}</Badge>}
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
