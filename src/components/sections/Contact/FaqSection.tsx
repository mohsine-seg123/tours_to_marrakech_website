"use client";

import { useState } from "react";
import FaqItem from "@/components/ui/FaqItem";
import { Faq } from "@/type/contact";

type FaqSectionProps = {
  faqs: Faq[];
};

export default function FaqSection({
  faqs,
}: FaqSectionProps): React.JSX.Element {
  const [openIndex, setOpenIndex] = useState<number | null>(-1);

  const toggle = (index: number): void => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="bg-background py-4 lg:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Frequently Asked Questions
          </span>
          <h2 className="mt-2 text-3xl font-bold text-heading sm:text-4xl">
            Everything You Need to Know
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          {faqs.map((faq, index) => (
            <FaqItem
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => toggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
