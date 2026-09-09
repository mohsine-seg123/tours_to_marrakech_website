"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { DayTripDetail, Locale } from "@/lib/supabase/day_trips";

type WhyChooseProps = {
  reasons: DayTripDetail["whyChoose"];
  title?: string;
  locale: Locale;
};

const TITLES = {
  en: "Why choose this day trip?",
  fr: "Pourquoi choisir cette excursion ?",
  es: "¿Por qué elegir esta excursión?",
};

export default function WhyChoose({ reasons, title, locale }: WhyChooseProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const id = useId();

  if (!reasons.length) return null;

  return (
    <section className="mt-12" aria-labelledby={`${id}-heading`}>
      <h2
        id={`${id}-heading`}
        className="text-3xl font-semibold text-primary/90 sm:text-4xl"
      >
        {title || TITLES[locale]}
      </h2>

      <ol className="mt-4">
        {reasons.map((reason, index) => {
          const isOpen = openIndex === index;
          const buttonId = `${id}-button-${index}`;
          const panelId = `${id}-panel-${index}`;

          return (
            <li
              key={`${index}-${reason.title}`}
              className="relative flex gap-3 pb-2 last:pb-0 sm:gap-4"
            >
              {/* LIGNE */}
              {index < reasons.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-5 top-10 w-px bg-border"
                />
              )}

              {/* NUMÉRO */}
              <span
                aria-hidden="true"
                className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                  isOpen
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-primary/20 bg-background text-primary"
                }`}
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* CONTENU */}
              <div
                className={`min-w-0 flex-1 rounded-xl border bg-card ${
                  isOpen ? "border-primary/30" : "border-border"
                }`}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() =>
                      setOpenIndex((current) =>
                        current === index ? null : index,
                      )
                    }
                    className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl p-3 text-left font-heading text-xl font-semibold text-heading hover:text-primary focus-visible:outline-primary sm:p-6 sm:text-2xl"
                  >
                    <span>{reason.title}</span>

                    <ChevronDown
                      aria-hidden="true"
                      className={`h-5 w-5 shrink-0 text-primary ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </h3>

                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="px-5 pb-2 sm:px-6 sm:pb-6"
                >
                  <p className="whitespace-pre-line text-[15px] leading-7 text-text-secondary">
                    {reason.description}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
