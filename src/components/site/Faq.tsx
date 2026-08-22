"use client";

import { useState } from "react";
import { Icon } from "@/components/Icon";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: string;
}
export function Faq({ items, className }: { items: FaqItem[]; className?: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!items.length) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.question} className="card overflow-hidden">
            <h3>
              <button
                type="button"
                onClick={() => setOpenIndex(open ? null : i)}
                aria-expanded={open}
                aria-controls={`faq-panel-${i}`}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
              >
                <span className="font-display text-base font-semibold text-navy-900 sm:text-lg">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300",
                    open ? "rotate-45 bg-gold-400 text-navy-950" : "bg-navy-50 text-navy-600",
                  )}
                >
                  <Icon name="plus" size={15} />
                </span>
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              role="region"
              hidden={!open}
              className="px-5 pb-5 sm:px-6"
            >
              <p className="max-w-3xl text-sm leading-relaxed text-navy-800/85">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Builds FAQPage structured data for search engines. */
export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
