import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "./Card";

export interface QuoteLine {
  label: string;
  value: string;
  /** Visually emphasized (larger/bold) — typically the final total line. */
  emphasize?: boolean;
}

export interface QuoteCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  lines: QuoteLine[];
  footnote?: string;
}

// Pure presentation — never computes anything itself. Whatever calls this
// (a future real Quote Engine, WEB-CALC-2) passes already-computed lines;
// this component has no fee/exchange-rate logic of its own to keep in
// sync with anything.
export function QuoteCard({ className, title, lines, footnote, ...props }: QuoteCardProps) {
  return (
    <Card className={cn("space-y-3", className)} {...props}>
      {title && <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{title}</h4>}
      <dl className="divide-y divide-border">
        {lines.map((line) => (
          <div key={line.label} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
            <dt className={cn("text-sm text-muted-foreground", line.emphasize && "font-semibold text-foreground")}>
              {line.label}
            </dt>
            <dd className={cn("text-sm text-foreground", line.emphasize && "text-lg font-bold text-primary")}>
              {line.value}
            </dd>
          </div>
        ))}
      </dl>
      {footnote && <p className="text-xs text-muted-foreground">{footnote}</p>}
    </Card>
  );
}
