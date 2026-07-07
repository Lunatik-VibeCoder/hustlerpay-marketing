"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQSectionMetadata {
  title?: string;
  items: FAQItem[];
}

// Single-open accordion, fully data-driven, no business logic. Accessible
// by construction (aria-expanded/aria-controls/hidden), not bolted on.
export function FAQSection({ metadata }: { metadata: FAQSectionMetadata }) {
  const { title, items } = metadata;
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-6">
        {title && <h2 className="text-2xl font-bold text-foreground mb-8 text-center">{title}</h2>}
        <div className="divide-y divide-border rounded-lg border border-border">
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`}
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors"
                >
                  {item.question}
                  <ChevronDown
                    className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")}
                  />
                </button>
                <p
                  id={`faq-answer-${item.id}`}
                  hidden={!isOpen}
                  className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed"
                >
                  {item.answer}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
