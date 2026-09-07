import type { ActivityDetail, Locale } from "@/lib/supabase/activities";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://toursmarrakechdesert.com";

const LOCALE_PATH: Record<Locale, string> = {
  en: "activities",
  fr: "activites",
  es: "actividades",
};

const CURRENCY_BY_LOCALE: Record<Locale, string> = {
  en: "EUR",
  fr: "EUR",
  es: "EUR",
};

const HOME_LABEL: Record<Locale, string> = {
  en: "Home",
  fr: "Accueil",
  es: "Inicio",
};

const ACTIVITIES_LABEL: Record<Locale, string> = {
  en: "Activities",
  fr: "Activités",
  es: "Actividades",
};

/** Reconstruit l'URL canonique d'une activité, alignée sur le pattern du layout (en = pas de préfixe) */
function buildActivityUrl(locale: Locale, slug: string) {
  const path = `${LOCALE_PATH[locale]}/${slug}`;
  return locale === "en"
    ? `${BASE_URL}/${path}`
    : `${BASE_URL}/${locale}/${path}`;
}

function buildActivitiesListUrl(locale: Locale) {
  return locale === "en"
    ? `${BASE_URL}/${LOCALE_PATH.en}`
    : `${BASE_URL}/${locale}/${LOCALE_PATH[locale]}`;
}

function buildHomeUrl(locale: Locale) {
  return locale === "en" ? BASE_URL : `${BASE_URL}/${locale}`;
}

/**
 * Schema.org TouristTrip — décrit l'activité elle-même : prix, durée, image.
 * TouristTrip est plus précis que Product pour une excursion/expérience touristique,
 * et reste bien supporté par Google pour les rich results "things to do".
 */
export function buildActivityJsonLd(activity: ActivityDetail, locale: Locale) {
  const url = buildActivityUrl(locale, activity.slug);

  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "@id": `${url}#activity`,
    name: activity.title,
    description: activity.description,
    url,
    image: [activity.imageUrl1, activity.imageUrl2].filter(Boolean),
    touristType: "Leisure",
    ...(activity.duration && { duration: activity.duration }),
    provider: {
      "@type": "TravelAgency",
      name: "Tours Marrakech Desert",
      url: BASE_URL,
    },
    ...(activity.price && {
      offers: {
        "@type": "Offer",
        price: activity.price,
        priceCurrency: CURRENCY_BY_LOCALE[locale],
        availability: "https://schema.org/InStock",
        url,
      },
    }),
    ...(activity.itinerary?.length && {
      subjectOf: {
        "@type": "ItemList",
        itemListElement: activity.itinerary.map((step, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: step.title,
          description: step.description,
        })),
      },
    }),
  };
}

/**
 * Schema.org FAQPage — génère les rich snippets FAQ dans les résultats Google.
 * Retourne null si pas de FAQ, pour ne pas injecter un schema vide.
 */
export function buildActivityFaqJsonLd(activity: ActivityDetail) {
  if (!activity.faq?.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: activity.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/**
 * Schema.org BreadcrumbList — reflète le fil d'Ariane affiché en haut de page
 * (Accueil / Activités / Catégorie ou titre).
 */
export function buildActivityBreadcrumbJsonLd(
  activity: ActivityDetail,
  locale: Locale,
) {
  const items = [
    { name: HOME_LABEL[locale], url: buildHomeUrl(locale) },
    { name: ACTIVITIES_LABEL[locale], url: buildActivitiesListUrl(locale) },
    { name: activity.title, url: buildActivityUrl(locale, activity.slug) },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/** Regroupe les 3 schémas en un seul tableau, prêt à injecter dans un <script type="application/ld+json"> par entrée */
export function buildActivityJsonLdGraph(
  activity: ActivityDetail,
  locale: Locale,
) {
  return [
    buildActivityJsonLd(activity, locale),
    buildActivityFaqJsonLd(activity),
    buildActivityBreadcrumbJsonLd(activity, locale),
  ].filter(Boolean);
}
