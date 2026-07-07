import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@ui/Button";

export interface HeroSectionMetadata {
  title: string;
  subtitle?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  image?: { src: string; alt: string };
  /** Small trust line under the CTAs (e.g. "Agréé par..."), optional. */
  trustBadge?: string;
}

// Generic, metadata-driven — no business logic, no hardcoded brand copy.
// Composed entirely from Design System primitives (Button) and tokens
// (text-foreground/text-muted-foreground/bg-* via Tailwind), never a
// hardcoded color. Reusable across any future HustlerPay portal that
// needs a hero banner, not just this marketing site.
export function HeroSection({ metadata }: { metadata: HeroSectionMetadata }) {
  const { title, subtitle, primaryCta, secondaryCta, image, trustBadge } = metadata;

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-6 grid gap-10 sm:grid-cols-2 sm:items-center">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">{title}</h1>
          {subtitle && <p className="text-lg text-muted-foreground leading-relaxed">{subtitle}</p>}
          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap gap-3">
              {primaryCta && (
                <Button size="lg" asChild>
                  <Link href={primaryCta.href}>{primaryCta.label}</Link>
                </Button>
              )}
              {secondaryCta && (
                <Button size="lg" variant="secondary" asChild>
                  <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
                </Button>
              )}
            </div>
          )}
          {trustBadge && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
              {trustBadge}
            </div>
          )}
        </div>
        {image && (
          <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-border">
            <Image src={image.src} alt={image.alt} fill className="object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
