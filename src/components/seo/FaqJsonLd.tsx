import React from "react";

type FaqItem = {
  q: string;
  a: string;
};

type FaqJsonLdProps = {
  faq: FaqItem[];
  locale: string;
};

export default function FaqJsonLd({
  faq,
  locale,
}: FaqJsonLdProps): React.JSX.Element {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: locale,
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
