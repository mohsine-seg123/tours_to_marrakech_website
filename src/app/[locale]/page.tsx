import Hero from "@/components/sections/Home/Hero";
import Faq from "@/components/sections/Home/Faq";
import Destinations from "@/components/sections/Home/Destinations";
import MarrakechDesertSection from "@/components/sections/Home/MarrakechDesertSection";
import { setRequestLocale } from "next-intl/server";
import { Locale } from "@/lib/supabase/blogs";
import HomeBlogSection from "@/components/sections/Home/HomeBlogSection";
import LatestActivities from "@/components/sections/Home/LatestActivities";
import Homedaytrips from "@/components/sections/Home/Homedaytrips";
import { Metadata } from "next";
import { routing,getPathname} from "@/i18n/routing";
import {notFound} from "next/navigation";
import Hometours from "@/components/sections/Home/Hometours";


export async function generateMetadata({params,}: { params: Promise<{ locale: string }>;}): Promise<Metadata> {

  const { locale } = await params;

  if (locale !== "en" && locale !== "fr" && locale !== "es") {
    notFound();
  }


  const metadataByLocale = {
    en: {
      title: "Tours Marrakech Desert | Sahara Trips & Morocco Tours",
      description:"Plan your Morocco trip with desert tours from Marrakech, journeys to Merzouga, camel rides and day trips to mountain towns and historic sites.",
      keywords: [
        "tours marrakech desert",
        "Marrakech desert tours",
        "Marrakech Sahara tour",
        "Merzouga desert tour",
        "Morocco day trips",
        "Marrakech excursions",
      ],
      ogLocale: "en_US",
      imageAlt: "Tours Marrakech Desert — Sahara trips in Morocco",
    },
    fr: {
      title: "Tours Marrakech Desert | Circuits au Sahara et au Maroc",
      description:
        "Préparez votre voyage au Maroc : circuits dans le désert depuis Marrakech, séjours à Merzouga, balades à dos de chameau et excursions à la journée.",
      keywords: [
        "circuit désert Marrakech",
        "circuit Sahara Maroc",
        "excursion Marrakech",
        "désert de Merzouga",
        "voyage au Maroc",
        "excursions au Maroc",
      ],
      ogLocale: "fr_FR",
      imageAlt: "Tours Marrakech Desert — Circuits dans le Sahara marocain",
    },
    es: {
      title: "Tours Marrakech Desert | Viajes al Sahara y Marruecos",
      description:
        "Prepara tu viaje a Marruecos: rutas al desierto desde Marrakech, viajes a Merzouga, paseos en camello y excursiones de un día.",
      keywords: [
        "excursiones desierto Marrakech",
        "viaje al Sahara",
        "desierto de Merzouga",
        "excursiones desde Marrakech",
        "viajes a Marruecos",
        "rutas por Marruecos",
      ],
      ogLocale: "es_ES",
      imageAlt: "Tours Marrakech Desert — Viajes al Sahara marroquí",
    },
  };

  const content= metadataByLocale[locale];

  const canonical = getPathname({
    locale,
    href: "/",
  });

  return {
    title: content.title,
    description: content.description,
    keywords: content.keywords,

    alternates: {
      canonical,
      languages: {
        en: getPathname({ locale: "en", href: "/" }),
        fr: getPathname({ locale: "fr", href: "/" }),
        es: getPathname({ locale: "es", href: "/" }),
        "x-default": getPathname({ locale: "en", href: "/" }),
      },
    },

    openGraph: {
      type: "website",
      url: canonical,
      title: content.title,
      description: content.description,
      siteName: "Tours Marrakech Desert",
      locale: content.ogLocale,
      alternateLocale: routing.locales
        .filter((language) => language !== locale)
        .map((language) => metadataByLocale[language].ogLocale),
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: content.imageAlt,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: [
        {
          url: "/og-image.jpg",
          alt: content.imageAlt,
        },
      ],
    },
  };
}

export default async function Home({ params,}: { params: Promise<{ locale: string }>;}) {

  const { locale } = await params;
  setRequestLocale(locale);    
  return (
    <>
      <Hero />
      <Destinations />
       <Hometours locale={locale as Locale} />
      <Homedaytrips locale={locale as Locale} />
      <MarrakechDesertSection />
      <LatestActivities locale={locale as Locale} />
      <HomeBlogSection locale={locale as Locale} />
      <Faq locale={locale} />
    </>
  );
}
