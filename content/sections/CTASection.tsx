import Link from "next/link";
import { Button } from "@ui/Button";
import { cn } from "@/lib/utils";

export interface CTASectionMetadata {
  title: string;
  description?: string;
  cta: { label: string; href: string };
  /** "brand" adds the branded lime glow background — use sparingly, for
   * the single most important CTA on a page, not every CTA section. */
  variant?: "default" | "brand";
}

export function CTASection({ metadata }: { metadata: CTASectionMetadata }) {
  const { title, description, cta, variant = "default" } = metadata;

  return (
    <section className="py-16">
      <div
        className={cn(
          "mx-auto max-w-4xl px-6 py-12 rounded-lg border border-border text-center space-y-5",
          variant === "brand" ? "bg-accent shadow-[0_0_32px_0_rgb(197_255_65_/_0.15)]" : "bg-secondary",
        )}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h2>
        {description && <p className="text-muted-foreground max-w-xl mx-auto">{description}</p>}
        <Button size="lg" asChild>
          <Link href={cta.href}>{cta.label}</Link>
        </Button>
      </div>
    </section>
  );
}
