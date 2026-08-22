"use client";

import React, { useState } from "react";
import FaqItem from "@/components/ui/FaqItem";

type FaqData = {
  q: string;
  a: string;
};

type FaqClientProps = {
  faq: FaqData[];
  title: string;
  subtitle: string;
};

export default function FaqClient({
  faq,
  title,
  subtitle,
}: FaqClientProps): React.JSX.Element {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section
      className="relative overflow-hidden bg-background px-4 py-4 text-foreground sm:px-6 lg:px-8 lg:py-6"
      aria-labelledby="faq-title"
    >
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="text-center">
          <h2
            id="faq-title"
            className="mt-3 font-body text-2xl font-extrabold leading-[1.15] tracking-tight text-heading sm:text-3xl lg:text-4xl"
          >
            {title}
          </h2>
          <p className="mx-auto my-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            {subtitle}
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:gap-4">
          <div className="grid grid-cols-1 lg:columns-2 gap-3 sm:gap-4 sm:grid-cols-2">
            {faq.map((faqItem) => (
              <div key={faqItem.q} className="h-fit">
                <FaqItem
                  question={faqItem.q}
                  answer={faqItem.a}
                  isOpen={openId === faqItem.q}
                  onClick={() =>
                    setOpenId(openId === faqItem.q ? null : faqItem.q)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
