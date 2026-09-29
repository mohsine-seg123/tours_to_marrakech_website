import { getPathname, type Locale } from "@/i18n/routing";

type ContactJsonLdProps = {
  locale: Locale;
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

const LABELS = {
  en: { home: "Home", contact: "Contact" },
  fr: { home: "Accueil", contact: "Contact" },
  es: { home: "Inicio", contact: "Contacto" },
};

export default function ContactJsonLd({ locale, site }: ContactJsonLdProps) {
  const t = LABELS[locale];
  const baseUrl = site.url.replace(/\/+$/, "");

  const homeUrl = new URL(getPathname({ locale, href: "/" }), `${baseUrl}/`)
    .href;

  const contactUrl = new URL(
    getPathname({ locale, href: "/contact" }),
    `${baseUrl}/`,
  ).href;

  const websiteId = `${baseUrl}/#website`;
  const organizationId = `${baseUrl}/#organization`;
  const breadcrumbId = `${contactUrl}#breadcrumb`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: `${baseUrl}/`,
        name: site.name,
        publisher: { "@id": organizationId },
        inLanguage: ["en", "fr", "es"],
      },
      {
        "@type": "TravelAgency",
        "@id": organizationId,
        name: site.name,
        url: `${baseUrl}/`,
        email: site.email,
        telephone: site.phone,
        image: `${baseUrl}/images/hero.jpeg`,
        logo: `${baseUrl}/images/logofooter.jpeg`,
        address: {
          "@type": "PostalAddress",
          addressLocality: site.city,
          addressRegion: site.region,
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
          availableLanguage: ["English", "French", "Spanish", "Arabic"],
        },
      },
      {
        "@type": "ContactPage",
        "@id": `${contactUrl}#webpage`,
        url: contactUrl,
        name: `${t.contact} | ${site.name}`,
        inLanguage: locale,
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
        mainEntity: { "@id": organizationId },
        breadcrumb: { "@id": breadcrumbId },
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: t.home,
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: t.contact,
            item: contactUrl,
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
