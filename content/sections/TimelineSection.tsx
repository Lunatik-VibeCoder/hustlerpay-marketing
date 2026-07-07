import { cn } from "@/lib/utils";

export interface TimelineStep {
  title: string;
  description?: string;
}

export interface TimelineSectionMetadata {
  title?: string;
  steps: TimelineStep[];
}

// Generic ordered-step visual — no domain-specific milestone logic (unlike
// e.g. the Dashboard's BeneficiaryTimeline, which knows about real
// backend statuses). Purely presentational, driven entirely by metadata.
export function TimelineSection({ metadata }: { metadata: TimelineSectionMetadata }) {
  const { title, steps } = metadata;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-2xl px-6">
        {title && <h2 className="text-2xl font-bold text-foreground mb-10 text-center">{title}</h2>}
        <div>
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            return (
              <div key={step.title} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                    {index + 1}
                  </div>
                  {!isLast && <div className="w-0.5 flex-1 min-h-[32px] bg-border" />}
                </div>
                <div className={cn("pb-8", isLast && "pb-0")}>
                  <p className="text-base font-semibold text-foreground">{step.title}</p>
                  {step.description && (
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
