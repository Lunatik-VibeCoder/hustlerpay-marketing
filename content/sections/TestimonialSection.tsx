import Image from "next/image";
import { Card, CardContent } from "@ui/Card";

export interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  avatarUrl?: string;
}

export interface TestimonialSectionMetadata {
  title?: string;
  testimonials: Testimonial[];
}

// Plain grid, no carousel/animation library — matches the "no dependency
// without a concrete need" rule. A carousel can be added later without
// changing this component's metadata shape if the design ever needs one.
export function TestimonialSection({ metadata }: { metadata: TestimonialSectionMetadata }) {
  const { title, testimonials } = metadata;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        {title && <h2 className="text-2xl font-bold text-foreground mb-10 text-center">{title}</h2>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.author}>
              <CardContent className="space-y-4">
                <p className="text-sm text-foreground leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  {testimonial.avatarUrl && (
                    <Image
                      src={testimonial.avatarUrl}
                      alt={testimonial.author}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-foreground">{testimonial.author}</p>
                    {testimonial.role && <p className="text-xs text-muted-foreground">{testimonial.role}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
