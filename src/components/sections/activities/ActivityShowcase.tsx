"use client";

import { useState } from "react";
import FaqItem from "@/components/ui/FaqItem";



type FaqEntry = { question: string; answer: string };

type ActivityShowcaseProps = {
  faq?: FaqEntry[];
  labels: {
    faqTitle: string;
    faqSubtitle: string;
  };
};

export default function ActivityShowcase({faq,labels,}: ActivityShowcaseProps) {

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div >
      {faq && faq.length > 0 && (
        <section className="bg-muted py-10">
          <div className="mx-auto max-w-7xl px-2 sm:px-8 lg:px-12">

            <div className="mb-6 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                FAQ
              </span>
              <h2 className="mt-2 text-2xl font-semibold text-heading sm:text-3xl">
                {labels.faqTitle}
              </h2>
              {labels.faqSubtitle && (
                <p className="mt-3 text-sm text-text-secondary sm:text-base">
                  {labels.faqSubtitle}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 ">
              {faq.map((item, index) => (
                <FaqItem
                  key={index}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openIndex === index}
                  onClick={() =>
                    setOpenIndex(openIndex === index ? null : index)
                  }
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
