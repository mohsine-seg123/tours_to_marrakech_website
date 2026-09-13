import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getToursByCity, type Locale } from "@/lib/supabase/tours";
import TourCard from "@/components/sections/tours/TourCard";
import { getPathname, Link, routing } from "@/i18n/routing";

const CONTENT = {
  en: {
    label: "YOUR JOURNEY STARTS HERE",
    title: "Tours from",
    description:
      "Find your next journey through Morocco. Compare itineraries, trip durations and prices to choose the tour that suits your travel plans.",
    empty:
      "No tours are available from this city in this language at the moment.",
    allTours: "View all tours",
  },
  fr: {
    label: "VOTRE VOYAGE COMMENCE ICI",
    title: "Circuits au départ de",
    description:
      "Préparez votre prochain voyage à travers le Maroc. Comparez les itinéraires, les durées et les prix pour choisir le circuit qui correspond à vos envies.",
    empty:
      "Aucun circuit n’est disponible depuis cette ville dans cette langue pour le moment.",
    allTours: "Voir tous les circuits",
  },
  es: {
    label: "TU VIAJE EMPIEZA AQUÍ",
    title: "Tours desde",
    description:
      "Prepara tu próximo viaje por Marruecos. Compara itinerarios, duraciones y precios para elegir el circuito que mejor se adapte a tus planes.",
    empty:
      "Por el momento no hay tours disponibles desde esta ciudad en este idioma.",
    allTours: "Ver todos los tours",
  },
} satisfies Record<Locale, Record<string, string>>;



function isLocale(value: string): value is Locale {
  return value === "en" || value === "fr" || value === "es";
}


type CityToursPageProps = {
  params: Promise<{ locale: string; city: string }>;
};




export async function generateMetadata({
  params,
}: CityToursPageProps): Promise<Metadata> {
  const { locale, city } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const departureCity = city.trim().replace(/-/g, " ");

  if (!departureCity) {
    notFound();
  }

  const cityName = departureCity.replace(/(^|\s)\S/g, (letter) =>
    letter.toLocaleUpperCase(locale),
  );
  const title = CONTENT[locale].title + " " + cityName + " | Tours Marrakech Desert";
  const descriptions: Record<Locale, string> = {
    en: "Explore Morocco with tours from " + cityName + ". Compare itineraries, durations and prices to plan your next trip.",
    fr: "Découvrez le Maroc avec nos circuits au départ de " + cityName + ". Comparez les itinéraires, les durées et les prix pour préparer votre voyage.",
    es: "Descubre Marruecos con nuestros tours desde " + cityName + ". Compara itinerarios, duraciones y precios para preparar tu próximo viaje.",
  };
  const description = descriptions[locale];
  const ogLocales = { en: "en_US", fr: "fr_FR", es: "es_ES" };
  const getCityPath = (language: Locale) =>
    getPathname({
      locale: language,
      href: {
        pathname: "/tours/from/[city]",
        params: { city },
      },
    });
  const canonical = getCityPath(locale);
  const images = [{ url: "/images/hero.jpg", alt: title }];

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: getCityPath("en"),
        fr: getCityPath("fr"),
        es: getCityPath("es"),
        "x-default": getCityPath(routing.defaultLocale),
      },
    },
    openGraph: {
      type: "website",
      siteName: "Tours Marrakech Desert",
      title,
      description,
      url: canonical,
      locale: ogLocales[locale],
      alternateLocale: routing.locales
        .filter((language) => language !== locale)
        .map((language) => ogLocales[language]),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}


export default async function CityToursPage({ params }: CityToursPageProps) {

  const { locale, city } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const departureCity = city.trim().replace(/-/g, " ");

  if (!departureCity) {
    notFound();
  }

  const tours = await getToursByCity(locale, departureCity);
  const cityName = tours[0]?.departureCity || departureCity;
  const t = CONTENT[locale];

  if(!tours){
    notFound();
  }

  return (
    <section
      className="min-h-screen bg-background"
      aria-labelledby="city-tours-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* PRÉSENTATION */}
        <header className="mx-auto mb-4 max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            {t.label}
          </p>

          <h1
            id="city-tours-heading"
            className=" text-balance text-4xl font-semibold leading-tight tracking-tight text-heading sm:text-5xl lg:text-6xl"
          >
            {t.title}{" "}
            <span className="capitalize text-primary">{cityName}</span>
          </h1>

          <p className="mt-1 text-[15px] leading-8 text-text-secondary sm:text-base">
            {t.description}
          </p>
        </header>

        {/* CIRCUITS */}
        {tours.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((card) => (
              <TourCard key={card.id} card={card} locale={locale} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-border bg-card px-6 py-12 text-center text-text-secondary">
            {t.empty}
          </p>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/tours"
            locale={locale}
            className="inline-flex items-center justify-center rounded-lg border border-primary/30 px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            {t.allTours}
          </Link>
        </div>
      </div>
    </section>
  );
}
