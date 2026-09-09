import { notFound } from "next/navigation";
import { DayTripCard } from "@/components/sections/day_trips/daytripCard";
import { getAllDayTripsGroupedByCity, type Locale,} from "@/lib/supabase/day_trips";
import Image from "next/image";
import type { Metadata } from "next";
import { getPathname } from "@/i18n/routing";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://toursmarrakechdesert.com";

const LOCALES: Locale[] = ["en", "fr", "es"];

const SEO = {
  en: {
    title: "Morocco Day Trips | day trips from Marrakech and Fes",
    description:"Explore Morocco day trips from Marrakech and Fes. Discover historic cities, mountain landscapes and coastal escapes. View itineraries and prices.",
    ogLocale: "en_US",
  },
  fr: {
    title: "Excursions au Maroc | Départs de Marrakech et Fès",
    description:
      "Découvrez nos excursions au Maroc depuis Marrakech et Fès : villes historiques, montagnes et côte atlantique. Consultez les itinéraires et les prix.",
    ogLocale: "fr_FR",
  },
  es: {
    title: "Excursiones en Marruecos | Desde Marrakech y Fez",
    description:
      "Descubre excursiones en Marruecos desde Marrakech y Fez. Explora ciudades históricas, montañas y la costa. Consulta itinerarios y precios.",
    ogLocale: "es_ES",
  },
} satisfies Record<
  Locale,
  {
    title: string;
    description: string;
    ogLocale: string;
  }
>;


export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}


function getDayTripsUrl(locale: Locale): string {
  const pathname = getPathname({
    locale,
    href: "/day-trips",
  });

  return new URL(pathname, SITE_URL).toString();
}




export async function generateMetadata({params,}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {

  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const seo = SEO[locale];
  const canonical = getDayTripsUrl(locale);
  const imageUrl = `${SITE_URL}/images/hero.jpg`;

  return {
    title: {absolute: seo.title, },
    description: seo.description,
    keywords: ["Morocco day trips", "Marrakech excursions", "Fes excursions", "day trips from tangier", "Day trips from Marrakech morocco", "Day trips from Fes morocco"],
    alternates: {
      canonical,
      languages: {
        en: getDayTripsUrl("en"),
        fr: getDayTripsUrl("fr"),
        es: getDayTripsUrl("es"),
        "x-default": getDayTripsUrl("en"),
      },
    },

    openGraph: {
      type: "website",
      siteName: "Tours Marrakech Desert",
      title: seo.title,
      description: seo.description,
      url: canonical,
      locale: seo.ogLocale,
      alternateLocale: LOCALES
        .filter((language) => language !== locale)
        .map((language) => SEO[language].ogLocale),
      images: [
        {
          url: imageUrl,
          alt: CONTENT[locale].title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [imageUrl],
    },
  };
}

const CONTENT = {
  en: {
    label: "EXPLORE MOROCCO, ONE DAY AT A TIME",

    title: "Morocco Day Trips",

    description:
      "Discover Morocco day trips departing from Marrakech, Fes and beyond. Explore historic medinas, visit ancient sites, enjoy mountain landscapes or escape to the Atlantic coast. Whether you are looking for cultural discoveries, time in nature or a change of scenery, browse our excursions by departure city. Find the itinerary, included services and practical details to help you plan your day.",

    from: "Day trips from",
    country: "Morocco",
    empty:
      "No day trips are available in this language at the moment. Please check back soon to discover our upcoming excursions.",

    excursion: "excursion",
    excursions: "excursions",
    navigation: "Explore day trips by departure city",
  },

  fr: {
    label: "EXPLOREZ LE MAROC, UNE JOURNÉE À LA FOIS",

    title: "Excursions d’une journée au Maroc",

    description:
      "Découvrez nos excursions d’une journée au Maroc au départ de Marrakech, de Fès et d’autres villes. Explorez les médinas historiques, visitez des sites anciens, admirez les paysages de montagne ou évadez-vous sur la côte atlantique. Découverte culturelle, sortie en pleine nature ou envie de dépaysement : parcourez nos excursions selon votre ville de départ. Retrouvez les itinéraires, les prestations incluses et les informations pratiques pour préparer votre journée.",

    from: "Excursions au départ de",
    country: "Maroc",
    empty:
      "Aucune excursion n’est disponible dans cette langue pour le moment. Revenez prochainement pour découvrir nos prochaines escapades.",

    excursion: "excursion",
    excursions: "excursions",
    navigation: "Explorer les excursions par ville de départ",
  },

  es: {
    label: "EXPLORA MARRUECOS, UN DÍA A LA VEZ",

    title: "Excursiones de un día en Marruecos",

    description:
      "Descubre nuestras excursiones de un día en Marruecos con salida desde Marrakech, Fez y otras ciudades. Explora medinas históricas, visita lugares antiguos, disfruta de paisajes de montaña o escápate a la costa atlántica. Tanto si buscas descubrir la cultura local como pasar tiempo en la naturaleza o cambiar de ambiente, encuentra tu excursión por ciudad de salida. Consulta los itinerarios, los servicios incluidos y la información práctica para organizar tu día.",

    from: "Excursiones desde",
    country: "Marruecos",
    empty:
      "Por el momento no hay excursiones disponibles en este idioma. Vuelve pronto para descubrir nuestras próximas escapadas.",

    excursion: "excursión",
    excursions: "excursiones",
    navigation: "Explorar excursiones por ciudad de salida",
  },
} satisfies Record<Locale, Record<string, string>>;

function isLocale(value: string): value is Locale {
  return value === "en" || value === "fr" || value === "es";
}

export default async function DayTripsPage({params,}: {params: Promise<{ locale: string }>;}) {

  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const t = CONTENT[locale];

  const groupedTrips = await getAllDayTripsGroupedByCity(locale);

  const cities = Object.entries(groupedTrips).filter(([, trips]) => trips.length > 0,);


  return (
    <section className="bg-background">
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
          <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-14">
            {/* TEXTE */}
            <div className="max-w-xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary sm:text-[11px]">
                {t.label}
              </p>

              <h1 className=" mt-4 text-4xl font-semibold leading-[1.08] tracking-[-0.025em] text-balance text-heading sm:text-5xl lg:text-6xl ">
                {t.title}
              </h1>

              <p className="mt-5 text-[15px] leading-[1.85] text-text-secondary sm:text-base">
                {t.description}
              </p>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <Image
                src="/images/hero.jpg"
                alt="Day trips in Morocco"
                fill
                priority
                sizes="(min-width: 1280px) 580px, (min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* EXCURSIONS PAR VILLE */}
      <div className="mx-auto max-w-7xl space-y-14 px-4 py-12 sm:px-6 lg:px-8">
        {cities.length === 0 ? (
          <p className="rounded-xl border border-border bg-card px-6 py-12 text-center text-text-secondary">
            {t.empty}
          </p>
        ) : (
          cities.map(([city, trips], index) => (
            <section
              key={city}
              aria-labelledby={`city-heading-${index}`}
              className="scroll-mt-28"
            >
              <div className="mb-10 text-center">
                <h2
                  id={`city-heading-${index}`}
                  className="text-3xl font-semibold text-heading sm:text-4xl"
                >
                  {t.from} <span className="text-primary">{city}</span> {t.country}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {trips.map((card) => (
                  <DayTripCard key={card.id} card={card} locale={locale} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </section>
  );
}
