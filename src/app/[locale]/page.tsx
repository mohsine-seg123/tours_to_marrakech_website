import Hero from "@/components/sections/Home/Hero";
import Faq from "@/components/sections/Home/Faq";
import Destinations from "@/components/sections/Home/Destinations";
import MarrakechDesertSection from "@/components/sections/Home/MarrakechDesertSection";
import { setRequestLocale } from "next-intl/server";
import HomeBlogSection from "@/components/sections/Home/HomeBlogSection";
import LatestActivities from "@/components/sections/Home/LatestActivities";
import Homedaytrips from "@/components/sections/Home/Homedaytrips";
import { Metadata } from "next";
import { routing, getPathname, type Locale } from "@/i18n/routing";
import { notFound } from "next/navigation";
import Hometours from "@/components/sections/Home/Hometours";
import CreatorOffer from "@/components/sections/Home/CreatorOffer";

export async function generateMetadata({ params,}: {params: Promise<{ locale: Locale }>;}): Promise<Metadata> {

  const { locale } = await params;

  if (locale !== "en" && locale !== "fr" && locale !== "es") {
    notFound();
  }


const metadataByLocale = {
  en: {
    title: "Marrakech Desert Tours & Sahara Trips | Tours Marrakech Desert",
    description:"Explore Morocco with Tours Marrakech Desert. Discover private Sahara tours from Marrakech to Merzouga, camel rides, Atlas Mountains and tailor-made trips.",
    keywords: [
      "tours marrakech desert",
      "marrakech desert tours",
      "sahara desert tours from marrakech",
      "private morocco tours",
      "marrakech to merzouga tour",
      "morocco desert trips",
    ],
    ogLocale: "en_US",
    imageAlt: "Sahara desert dunes in Morocco — Tours Marrakech Desert",
  },

  fr: {
    title: "Circuits Désert Marrakech & Sahara | Tours Marrakech Desert",
    description:
      "Découvrez le Maroc avec Tours Marrakech Desert. Circuits privés au Sahara depuis Marrakech, désert de Merzouga, balades à dos de dromadaire et voyages sur mesure.",
    keywords: [
      "tours marrakech desert",
      "circuit désert Marrakech",
      "excursion désert Marrakech",
      "circuit Sahara Maroc",
      "désert Merzouga",
      "voyage privé Maroc",
    ],
    ogLocale: "fr_FR",
    imageAlt: "Dunes du désert du Sahara au Maroc — Tours Marrakech Desert",
  },

  es: {
    title: "Tours por el Desierto desde Marrakech | Tours Marrakech Desert",
    description:
      "Descubre Marruecos con Tours Marrakech Desert. Excursiones privadas al Sahara desde Marrakech, viajes a Merzouga, paseos en camello y rutas a medida.",
    keywords: [
      "tours marrakech desert",
      "excursiones desierto Marrakech",
      "tour desierto Marruecos",
      "Sahara desde Marrakech",
      "desierto de Merzouga",
      "viajes privados Marruecos",
    ],
    ogLocale: "es_ES",
    imageAlt: "Dunas del Sahara en Marruecos — Tours Marrakech Desert",
  },
};


  const content = metadataByLocale[locale];

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
          url: "/og-image.webp",
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
          url: "/og-image.webp",
          alt: content.imageAlt,
        },
      ],
    },
  };
}



export default async function Home({params,}: {params: Promise<{ locale: string }>;}) {

  const { locale } = await params;

  if (locale !== "en" && locale !== "fr" && locale !== "es") {
    notFound();
  }

  setRequestLocale(locale);

  const siteUrl = "https://toursmarrakechdesert.com";

  const pageUrl = new URL(getPathname({ locale, href: "/" }), siteUrl).href;

  const titles = {
    en: "Marrakech Desert Tours & Sahara Trips | Tours Marrakech Desert",
    fr: "Circuits Désert Marrakech & Sahara | Tours Marrakech Desert",
    es: "Tours por el Desierto desde Marrakech | Tours Marrakech Desert",
  };


  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TravelAgency",
        "@id": `${siteUrl}/#organization`,
        name: "Tours Marrakech Desert",
        url: `${siteUrl}/`,
        image: `${siteUrl}/og-image.jpg`,
        telephone: "+212704572370",
        email: "info@toursmarrakechdesert.com",

        address: {
          "@type": "PostalAddress",
          addressLocality: "Marrakech",
          addressCountry: "MA",
        },

        sameAs: [
          "https://www.instagram.com/toursmarrakechdesert/",
          "https://www.reddit.com/user/toursmarrakechdesert/",
          "https://x.com/MohsineSeg92559",
        ],

        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+212704572370",
          email: "info@toursmarrakechdesert.com",
          contactType: "customer service",
          availableLanguage: ["en", "fr", "es", "ar"],
          url: "https://wa.me/212704572370",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: "Tours Marrakech Desert",
        inLanguage: ["en", "fr", "es"],
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: titles[locale],
        inLanguage: locale,
        isPartOf: {
          "@id": `${siteUrl}/#website`,
        },
        about: {
          "@id": `${siteUrl}/#organization`,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${siteUrl}/og-image.jpg`,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Hero />
      <Destinations />
      <Hometours locale={locale} />
      <Homedaytrips locale={locale} />
      <MarrakechDesertSection />
      <LatestActivities locale={locale} />
      <CreatorOffer locale={locale} />
      <HomeBlogSection locale={locale} />
      <Faq locale={locale} />
    </>
  );
}