"use client";

import { useState } from "react";
import FaqItem from "@/components/ui/FaqItem";

interface BlogFaqAccordionItem {
  question: string;
  answer: string;
}

export function BlogFaqAccordion({ faq }: { faq: BlogFaqAccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faq.map((item, index) => (
        <FaqItem
          key={index}
          question={item.question}
          answer={item.answer}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}
