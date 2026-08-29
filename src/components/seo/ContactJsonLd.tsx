import { Faq } from "@/type/contact";

type ContactJsonLdProps = {
  faqs: Faq[];
  site: {
    name: string;
    url: string;
    email: string;
    phone: string;
    city: string;
    region: string;
    country: string;
    countryCode: string;
    latitude: number;
    longitude: number;
    opens: string;
    closes: string;
  };
};

export default function ContactJsonLd({
  faqs,
  site,
}: ContactJsonLdProps): React.JSX.Element {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        publisher: { "@id": `${site.url}/#organization` },
      },
      {
        "@type": "TravelAgency",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        email: site.email,
        telephone: site.phone,
        image: `${site.url}/images/hero.jpeg`,
        logo: `${site.url}/images/logofooter.jpeg`,
        priceRange: "$$",
        address: {
          "@type": "PostalAddress",
          addressLocality: site.city,
          addressRegion: site.region,
          postalCode: "40000",
          addressCountry: site.countryCode,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: site.latitude,
          longitude: site.longitude,
        },
        areaServed: {
          "@type": "Country",
          name: site.country,
        },
        openingHoursSpecification: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
          opens: site.opens,
          closes: site.closes,
        },
        contactPoint: {
          "@type": "ContactPoint",
          telephone: site.phone,
          email: site.email,
          contactType: "customer service",
          areaServed: site.countryCode,
          availableLanguage: ["English", "French", "Arabic", "Spanish"],
        },
      },
      {
        "@type": "ContactPage",
        "@id": `${site.url}/contact/#webpage`,
        url: `${site.url}/contact`,
        name: `Contact ${site.name}`,
        isPartOf: { "@id": `${site.url}/#website` },
        about: { "@id": `${site.url}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: site.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Contact",
            item: `${site.url}/contact`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${site.url}/contact/#faq`,
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
