import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getAllToursGroupedByCity, type Locale } from "@/lib/supabase/tours";
import TourCard from "@/components/sections/tours/TourCard";
import type { Metadata } from "next";
import { getPathname, routing } from "@/i18n/routing";

export const revalidate = 3600;

const CONTENT = {
  en: {
    label: "YOUR JOURNEY THROUGH MOROCCO",
    title: "morocco tour package",
    description:
      "From the streets of Marrakech to the dunes of Merzouga, find a route that matches your travel plans. Compare itineraries, trip durations and departure cities to choose your next Moroccan adventure.",
    empty: "No tours are available in this language at the moment.",
  },
  fr: {
    label: "VOTRE VOYAGE À TRAVERS LE MAROC",
    title: "voyage au maroc circuit",
    description:
      "Des ruelles de Marrakech aux dunes de Merzouga, trouvez un circuit adapté à vos envies. Comparez les itinéraires, les durées et les villes de départ pour préparer votre prochaine aventure au Maroc.",
    empty: "Aucun circuit n’est disponible dans cette langue pour le moment.",
  },
  es: {
    label: "TU VIAJE POR MARRUECOS",
    title: "Tours por Marruecos",
    description:
      "Desde las calles de Marrakech hasta las dunas de Merzouga, encuentra una ruta que se ajuste a tus planes. Compara itinerarios, duraciones y ciudades de salida para preparar tu próxima aventura por Marruecos.",
    empty: "Por el momento no hay tours disponibles en este idioma.",
  },
} satisfies Record<
  Locale,
  { label: string; title: string; description: string; empty: string }
>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const metadataByLocale = {
    en: {
      title: "Morocco Tour Package | Marrakech & Sahara Desert Tours",
      description:
        "Find your Morocco tour package, from Marrakech to the dunes of Merzouga. Compare itineraries, durations and prices to plan your Sahara desert journey.",
      keywords: [
        "morocco tour package",
        "Morocco tours",
        "Marrakech desert tour",
        "Marrakech to Merzouga",
        "Sahara desert tours",
        "Morocco travel packages",
      ],
      ogLocale: "en_US",
      imageAlt: "Tours Marrakech Desert — Morocco tours",
    },

    fr: {
      title: "Voyage au Maroc : circuits de Marrakech au Sahara",
      description:
        "Préparez votre voyage au Maroc : circuits depuis Marrakech, dunes de Merzouga et paysages du Sahara. Comparez les itinéraires, les durées et les prix.",
      keywords: [
        "voyage au maroc circuit",
        "circuits au Maroc",
        "circuit désert Maroc",
        "circuit Marrakech Merzouga",
        "voyage Sahara Maroc",
        "circuits au départ de Marrakech",
      ],
      ogLocale: "fr_FR",
      imageAlt: "Tours Marrakech Desert — circuits au Maroc",
    },

    es: {
      title: "Tours por Marruecos | Marrakech, Merzouga y el Sahara",
      description:
        "Elige tu tour por Marruecos, desde Marrakech hasta las dunas de Merzouga. Compara itinerarios, duración y precios para preparar tu viaje al Sahara.",
      keywords: [
        "tours por Marruecos",
        "circuitos por Marruecos",
        "tour desierto Marrakech",
        "Marrakech a Merzouga",
        "viaje al Sahara",
        "paquetes de viaje a Marruecos",
      ],
      ogLocale: "es_ES",
      imageAlt: "Tours Marrakech Desert — circuitos por Marruecos",
    },
  };

  const content = metadataByLocale[locale];

  const canonical = getPathname({
    locale,
    href: "/tours",
  });

  const image = {
    url: "/og-image.jpg",
    alt: content.imageAlt,
  };

  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,

    alternates: {
      canonical,
      languages: {
        en: getPathname({ locale: "en", href: "/tours" }),
        fr: getPathname({ locale: "fr", href: "/tours" }),
        es: getPathname({ locale: "es", href: "/tours" }),
        "x-default": getPathname({ locale: "en", href: "/tours" }),
      },
    },

    openGraph: {
      type: "website",
      siteName: "Tours Marrakech Desert",
      title: content.title,
      description: content.description,
      url: canonical,
      locale: content.ogLocale,
      alternateLocale: routing.locales
        .filter((language) => language !== locale)
        .map((language) => metadataByLocale[language].ogLocale),
      images: [image],
    },

    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: [image],
    },
  };
}

function isLocale(value: string): value is Locale {
  return value === "en" || value === "fr" || value === "es";
}

export default async function ToursPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = CONTENT[locale];
  const groupedTours = await getAllToursGroupedByCity(locale);

  const cities = Object.entries(groupedTours).filter(
    ([, tours]) => tours.length > 0,
  );

  const fromLabel =
    locale === "fr"
      ? "Circuits au départ de"
      : locale === "es"
        ? "Tours desde"
        : "Tours from";

  return (
    <section
      className="min-h-screen bg-background"
      aria-labelledby="tours-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* PRÉSENTATION */}
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            {t.label}
          </p>

          <h1
            id="tours-heading"
            className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-heading sm:text-5xl lg:text-6xl"
          >
            {t.title}
          </h1>

          <p className="mt-5 text-[15px] leading-8 text-text-secondary sm:text-base">
            {t.description}
          </p>
        </header>

        {/* CIRCUITS PAR VILLE */}
        {cities.length > 0 ? (
          <div className="space-y-14">
            {cities.map(([city, tours], index) => (
              <section key={city} aria-labelledby={`city-heading-${index}`}>
                <h2
                  id={`city-heading-${index}`}
                  className="mb-8 text-center text-3xl font-semibold text-heading sm:text-4xl"
                >
                  {fromLabel} <span className="text-primary">{city}</span>
                </h2>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {tours.map((card) => (
                    <TourCard key={card.id} card={card} locale={locale} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-border bg-card px-6 py-12 text-center text-text-secondary">
            {t.empty}
          </p>
        )}
      </div>
    </section>
  );
}