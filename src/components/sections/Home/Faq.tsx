"use client";

import React, { useState } from "react";
import FaqItem from "@/components/ui/FaqItem";


function FAQ({ faq }: { faq: { q: string; a: string }[] }): React.JSX.Element {


  const [openId, setOpenId] = useState<string | null>(
    faq[faq.length]?.q ?? null,
  );


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
            Everything You Need to Know
            <span className="text-primary"> About Tours to marrakech</span>
          </h2>
          <p className="mx-auto my-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            Find answers to the most common questions about our tours, services,
            and traveling in Morocco.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-3 sm:gap-4">
          <div className="grid grid-cols-1 lg:columns-2 gap-3 sm:gap-4 sm:grid-cols-2">
            {faq.map((faqId) => (
              <div key={faqId.q} className="h-fit">
                <FaqItem
                  question={faqId.q}
                  answer={faqId.a}
                  isOpen={openId === faqId.q}
                  onClick={() => setOpenId(openId === faqId.q ? null : faqId.q)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
