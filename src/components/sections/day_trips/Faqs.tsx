"use client";

import { useId, useState } from "react";
import FaqItem from "@/components/ui/FaqItem";
import type { DayTripDetail, Locale } from "@/lib/supabase/day_trips";

type FaqsProps = {
  faqs: DayTripDetail["faq"];
  locale: Locale;
};

const TITLES = {
  en: "Frequently asked questions",
  fr: "Questions fréquentes",
  es: "Preguntas frecuentes",
};

export default function Faqs({ faqs, locale }: FaqsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const id = useId();

  if (!faqs.length) return null;

  return (
    <section
      className="mx-auto my-12 max-w-7xl px-4 sm:px-6 lg:px-8"
      aria-labelledby={`${id}-heading`}
    >
      <h2
        id={`${id}-heading`}
        className="text-3xl font-semibold text-primary/90 sm:text-4xl"
      >
        {TITLES[locale]}
      </h2>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {faqs.map((faq, index) => (
          <FaqItem
            key={`${index}-${faq.question}`}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onClick={() =>
              setOpenIndex((current) => (current === index ? null : index))
            }
          />
        ))}
      </div>
    </section>
  );
}
