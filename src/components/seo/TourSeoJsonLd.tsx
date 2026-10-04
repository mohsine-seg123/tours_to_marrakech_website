import type { Locale, TourDetail } from "@/lib/supabase/tours";
import { getPathname } from "@/i18n/routing";

type TourSeoJsonLdProps = {
  tour: TourDetail;
  locale: Locale;
};

const SITE_URL = "https://toursmarrakechdesert.com";
const SITE_NAME = "Tours Marrakech Desert";

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

function cleanText(value: string): string {
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function getLanguage(locale: Locale): string {
  switch (locale) {
    case "fr":
      return "fr-FR";

    case "es":
      return "es-ES";

    default:
      return "en-US";
  }
}

function getHomeLabel(locale: Locale): string {
  if (locale === "fr") return "Accueil";
  if (locale === "es") return "Inicio";

  return "Home";
}

function getToursLabel(locale: Locale): string {
  if (locale === "fr") return "Circuits";

  return "Tours";
}

function getToursFromLabel(locale: Locale, city: string): string {
  if (locale === "fr") {
    return `Circuits depuis ${city}`;
  }

  if (locale === "es") {
    return `Tours desde ${city}`;
  }

  return `Tours from ${city}`;
}

export default function TourSeoJsonLd({ tour, locale }: TourSeoJsonLdProps) {
  const language = getLanguage(locale);

  /*
   * URL CANONIQUE DU TOUR
   */
  const pathname = getPathname({
    locale,
    href: {
      pathname: "/tours/[slug]",
      params: {
        slug: tour.slug,
      },
    },
  });

  const pageUrl = new URL(pathname, SITE_URL).href;

  /*
   * IDS DES ENTITÉS
   */
  const pageId = `${pageUrl}#webpage`;
  const tourId = `${pageUrl}#tour`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const faqId = `${pageUrl}#faq`;

  /*
   * DESCRIPTION
   */
  const description =
    tour.seoDescription?.trim() || tour.description?.trim() || tour.title;

  /*
   * IMAGES
   */
  const images = [
    {
      url: tour.imageUrl1,
      alt: tour.imageAlt1,
    },

    ...(tour.imageUrl2
      ? [
          {
            url: tour.imageUrl2,
            alt: tour.imageAlt2,
          },
        ]
      : []),

    ...(tour.imageUrl3
      ? [
          {
            url: tour.imageUrl3,
            alt: tour.imageAlt3,
          },
        ]
      : []),
  ];

  /*
   * HOME
   */
  const homeUrl = new URL(
    getPathname({
      locale,
      href: "/",
    }),
    SITE_URL,
  ).href;

  /*
   * ALL TOURS
   */
  const toursUrl = new URL(
    getPathname({
      locale,
      href: "/tours",
    }),
    SITE_URL,
  ).href;

  /*
   * TOURS FROM CITY
   */
  const toursFromUrl = tour.departureCity
    ? new URL(
        getPathname({
          locale,
          href: {
            pathname: "/tours/from/[city]",
            params: {
              city: tour.departureCity.toLowerCase(),
            },
          },
        }),
        SITE_URL,
      ).href
    : null;

  const graph: Record<string, unknown>[] = [
    /*
     * ==========================================================
     * TRAVEL AGENCY
     * ==========================================================
     */
    {
      "@type": "TravelAgency",
      "@id": ORGANIZATION_ID,

      name: SITE_NAME,

      url: `${SITE_URL}/`,

      image: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-image.jpg`,
      },

      telephone: "+212704572370",

      email: "info@toursmarrakechdesert.com",

      address: {
        "@type": "PostalAddress",
        addressLocality: "Marrakech",
        addressCountry: "MA",
      },

      contactPoint: {
        "@type": "ContactPoint",

        telephone: "+212704572370",

        email: "info@toursmarrakechdesert.com",

        contactType: "customer service",

        availableLanguage: ["English", "French", "Spanish", "Arabic"],

        url: "https://wa.me/212704572370",
      },

      sameAs: [
        "https://www.instagram.com/toursmarrakechdesert/",
        "https://www.reddit.com/user/toursmarrakechdesert/",
        "https://x.com/MohsineSeg92559",
      ],

      areaServed: [
        {
          "@type": "Country",
          name: "Morocco",
        },

        {
          "@type": "City",
          name: "Marrakech",
        },

        {
          "@type": "City",
          name: "Fes",
        },

        {
          "@type": "City",
          name: "Casablanca",
        },

        {
          "@type": "City",
          name: "Tangier",
        },

        {
          "@type": "City",
          name: "Agadir",
        },

        {
          "@type": "City",
          name: "Ouarzazate",
        },
      ],

      knowsAbout: [
        "Morocco tours",
        "Morocco desert tours",
        "Marrakech desert tours",
        "Sahara Desert",
        "Merzouga",
        "Erg Chebbi",
        "Private Morocco tours",
        "Morocco camel rides",
      ],
    },

    /*
     * ==========================================================
     * WEBSITE
     * ==========================================================
     */
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,

      url: `${SITE_URL}/`,

      name: SITE_NAME,

      inLanguage: ["en", "fr", "es"],

      publisher: {
        "@id": ORGANIZATION_ID,
      },
    },

    /*
     * ==========================================================
     * WEB PAGE
     * ==========================================================
     */
    {
      "@type": "WebPage",
      "@id": pageId,

      url: pageUrl,

      name: tour.seoTitle || tour.title,

      description,

      inLanguage: language,

      isPartOf: {
        "@id": WEBSITE_ID,
      },

      about: {
        "@id": tourId,
      },

      mainEntity: {
        "@id": tourId,
      },

      breadcrumb: {
        "@id": breadcrumbId,
      },

      primaryImageOfPage: {
        "@type": "ImageObject",

        url: tour.imageUrl1,

        contentUrl: tour.imageUrl1,

        caption: tour.imageAlt1 || tour.imageAlt || tour.title,
      },

      ...(tour.createdAt && {
        datePublished: tour.createdAt,
      }),

      ...(tour.updatedAt && {
        dateModified: tour.updatedAt,
      }),
    },

    /*
     * ==========================================================
     * TOUR
     * ==========================================================
     */
    {
      "@type": "TouristTrip",
      "@id": tourId,

      url: pageUrl,

      name: tour.title,

      description,

      inLanguage: language,

      mainEntityOfPage: {
        "@id": pageId,
      },

      image: images.map((image) => ({
        "@type": "ImageObject",

        url: image.url,

        contentUrl: image.url,

        caption: image.alt || tour.title,
      })),

      /*
       * L'agence qui organise le tour.
       */
      provider: {
        "@id": ORGANIZATION_ID,
      },

      /*
       * Exemple Supabase :
       * typeTour = "private"
       */
      ...(tour.typeTour && {
        touristType:
          tour.typeTour.toLowerCase() === "private"
            ? "Private tour"
            : tour.typeTour,
      }),

      /*
       * Ville de départ du circuit.
       */
      ...(tour.departureCity && {
        tripOrigin: {
          "@type": "City",
          name: tour.departureCity,
        },
      }),

      /*
       * ITINÉRAIRE
       */
      ...(tour.itinerary.length > 0 && {
        itinerary: {
          "@type": "ItemList",

          name: tour.itineraryTitle || `${tour.title} itinerary`,

          numberOfItems: tour.itinerary.length,

          itemListOrder: "https://schema.org/ItemListOrderAscending",

          itemListElement: tour.itinerary.map((day, index) => ({
            "@type": "ListItem",

            position: index + 1,

            name: day.title,

            description: cleanText(day.description),
          })),
        },
      }),

      /*
       * KEYWORDS
       */
      ...(tour.keywords.length > 0 && {
        keywords: tour.keywords.join(", "),
      }),

      /*
       * PRIX
       *
       * Important :
       * le frontend affiche actuellement $.
       * Le JSON-LD doit utiliser la même devise.
       */
      ...(tour.price !== null && {
        offers: {
          "@type": "Offer",

          url: pageUrl,

          price: tour.price,

          priceCurrency: "USD",

          seller: {
            "@id": ORGANIZATION_ID,
          },
        },
      }),
    },

    /*
     * ==========================================================
     * BREADCRUMB
     * ==========================================================
     */
    {
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,

      itemListElement: [
        /*
         * HOME
         */
        {
          "@type": "ListItem",

          position: 1,

          name: getHomeLabel(locale),

          item: homeUrl,
        },

        /*
         * TOURS
         */
        {
          "@type": "ListItem",

          position: 2,

          name: getToursLabel(locale),

          item: toursUrl,
        },

        /*
         * TOURS FROM CITY + CURRENT TOUR
         */
        ...(tour.departureCity && toursFromUrl
          ? [
              {
                "@type": "ListItem",

                position: 3,

                name: getToursFromLabel(locale, tour.departureCity),

                item: toursFromUrl,
              },

              {
                "@type": "ListItem",

                position: 4,

                name: tour.title,

                item: pageUrl,
              },
            ]
          : [
              {
                "@type": "ListItem",

                position: 3,

                name: tour.title,

                item: pageUrl,
              },
            ]),
      ],
    },
  ];

  /*
   * ==========================================================
   * FAQ
   * ==========================================================
   *
   * Seulement si des FAQ existent réellement sur la page.
   */
  if (tour.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",

      "@id": faqId,

      url: pageUrl,

      inLanguage: language,

      isPartOf: {
        "@id": pageId,
      },

      mainEntity: tour.faq.map((faq) => ({
        "@type": "Question",

        name: faq.question.trim(),

        acceptedAnswer: {
          "@type": "Answer",

          text: cleanText(faq.answer),
        },
      })),
    });
  }

  /*
   * ==========================================================
   * FINAL JSON-LD
   * ==========================================================
   */
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
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
