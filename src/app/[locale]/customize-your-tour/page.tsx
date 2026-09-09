import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, getPathname } from "@/i18n/routing";
import {
  MapPin,
  Calendar,
  Route,
  MessageCircle,
  Users,
  Shield,
  Compass,
  Mountain,
} from "lucide-react";
import ContactForm from "@/components/sections/Contact/ContactForms";


export async function generateMetadata({params,}: {params: Promise<{ locale: string }>;}): Promise<Metadata> {

  const { locale } = await params;
  const t = await getTranslations({locale,namespace: "CustomTour.meta",});

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://toursmarrakechdesert.com";

  const localizedPath = getPathname({
    locale,
    href: "/customize-your-tour",
  });

  return {
    title: t("title"),
    description: t("description"),
    keywords: [
      "custom morocco tour",
      "tailor made morocco trip",
      "private morocco tour",
      "plan my morocco trip",
      "custom sahara desert tour",
      "marrakech custom itinerary",
      "custom marrakech to merzouga",
    ],
    alternates: {
      canonical: `${baseUrl}${localizedPath}`,
      languages: {
        en: `${baseUrl}/customize-your-tour`,
        fr: `${baseUrl}/fr/personnalisez-votre-circuit`,
        es: `${baseUrl}/es/personaliza-tu-tour`,
        "x-default": `${baseUrl}/customize-your-tour`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      images: [{ url: "/og-image.webp", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.webp"],
    },
  };
}

const FEATURES = [
  { key: "guides", icon: MapPin },
  { key: "timing", icon: Calendar },
  { key: "itinerary", icon: Route },
  { key: "booking", icon: MessageCircle },
] as const;

const PROMISES = [
  { key: "private", icon: Users },
  { key: "flexible", icon: Calendar },
  { key: "support", icon: Shield },
  { key: "local", icon: MapPin },
] as const;



export default async function CustomTourPage({ params,}: {  params: Promise<{ locale: string }>;}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("CustomTour");

  
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "Tours Marrakech Desert",
  url: "https://toursmarrakechdesert.com",
  logo: "https://toursmarrakechdesert.com/logo.png",
  image: "https://toursmarrakechdesert.com/og-image.webp",
  description: t("meta.description"),
  telephone: "+212615683217",
  email: "info@toursmarrakechdesert.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Medina",
    addressLocality: "Marrakech",
    addressRegion: "Marrakech-Safi",
    postalCode: "40000",
    addressCountry: "MA",
  },
  areaServed: [
    {
      "@type": "City",
      name: "Marrakech",
      sameAs: "https://en.wikipedia.org/wiki/Marrakech",
    },
    {
      "@type": "City",
      name: "Fes",
      sameAs: "https://en.wikipedia.org/wiki/Fez,_Morocco",
    },
    {
      "@type": "City",
      name: "Ouarzazate",
      sameAs: "https://en.wikipedia.org/wiki/Ouarzazate",
    },
    {
      "@type": "City",
      name: "Chefchaouen",
      sameAs: "https://en.wikipedia.org/wiki/Chefchaouen",
    },
    {
      "@type": "Country",
      name: "Morocco",
      sameAs: "https://en.wikipedia.org/wiki/Morocco",
    },
  ],
  priceRange: "$$",
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
    opens: "08:00",
    closes: "22:00",
  },
  sameAs: [
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Custom Morocco Tours",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "TouristTrip",
          name: "Custom Marrakech Desert Tour",
          description: "Tailor-made desert tour from Marrakech to Merzouga",
          touristType: ["Adventure tourism", "Cultural tourism"],
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "TouristTrip",
          name: "Marrakech to Merzouga 3 Days",
          description: "Classic 3-day Sahara desert tour via Ait Ben Haddou",
          touristType: ["Desert tourism", "Adventure tourism"],
        },
      },
    ],
  },
};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="relative w-full overflow-hidden bg-background">
        <div className="relative min-h-[360px] w-full lg:min-h-[450px]">
          <Image
            src="/images/zalig.webp"
            alt="Traditional Moroccan zellige mosaic tilework"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-black/45" />

          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]"
          >
            <svg
              viewBox="0 0 1200 80"
              preserveAspectRatio="none"
              className="block h-10 w-full sm:h-14 lg:h-20"
            >
              <polygon points="0,0 1200,80 0,80" className="fill-background" />
            </svg>
          </div>

          <div className="relative mx-auto flex min-h-[360px] max-w-4xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6 lg:min-h-[450px] lg:px-8">
            <span className="text-xl font-bold uppercase tracking-widest text-orange-100 drop-shadow-md">
              {t("hero.eyebrow")}
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
              {t("hero.title")}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-xm leading-relaxed text-white drop-shadow-md sm:text-base">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-7xl  px-4 pb-6 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-text-muted sm:text-sm">
            {t("intro.eyebrow")}
          </p>

          <h2 className="mt-2 text-3xl font-bold leading-tight text-heading sm:text-4xl lg:text-5xl">
            {t("intro.title")}
          </h2>

          <p className="mt-4 text-base leading-8 text-text-secondary sm:text-lg">
            {t("intro.description")}
          </p>

          <Link
            href="/contact"
            className="mt-4 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            {t("intro.cta")}
          </Link>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* Image */}
            <div className="relative aspect-[4/4] overflow-hidden">
              <Image
                src="/images/custome.jpeg"
                alt="Our local Berber guides with happy travelers in the Sahara desert"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={85}
              />
            </div>

            {/* Features */}
            <div className="space-y-4">
              {FEATURES.map(({ key, icon: Icon }) => (
                <div key={key} className="flex items-start gap-4">
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-heading sm:text-lg">
                      {t(`features.${key}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">
                      {t(`features.${key}.description`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2 lg:gap-16">
            {/* ── Colonne gauche : How it works ── */}
            <div>
              <span className="text-sm font-medium italic text-primary">
                {t("steps.eyebrow")}
              </span>
              <h2 className="mt-2 text-2xl font-bold text-heading sm:text-3xl">
                {t("steps.title")}
              </h2>

              <div className="mt-8 space-y-5 text-base leading-8 text-text-secondary">
                <p>
                  {t.rich("steps.p1", {
                    bold: (chunks) => (
                      <strong className="font-semibold text-heading">
                        {chunks}
                      </strong>
                    ),
                  })}
                </p>
                <p>
                  {t.rich("steps.p2", {
                    bold: (chunks) => (
                      <strong className="font-semibold text-heading">
                        {chunks}
                      </strong>
                    ),
                  })}
                </p>
                <p>
                  {t.rich("steps.p3", {
                    bold: (chunks) => (
                      <strong className="font-semibold text-heading">
                        {chunks}
                      </strong>
                    ),
                  })}
                </p>
              </div>
            </div>

            {/* ── Colonne droite : What we guarantee ── */}
            <div>
              <h2 className="text-2xl font-bold text-heading sm:text-3xl">
                {t("promises.title")}
              </h2>

              <div className="mt-6 space-y-4">
                {PROMISES.map(({ key, icon: Icon }) => (
                  <div key={key} className="flex items-start gap-4">
                    <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-heading sm:text-lg">
                        {t(`promises.items.${key}.title`)}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-text-secondary sm:text-base">
                        {t(`promises.items.${key}.description`)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-8 lg:py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
          <ContactForm />
          <div className="flex flex-col justify-center">
            <h3 className="text-xl font-bold text-heading sm:text-2xl">
              {t("sidebar.title")}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              {t("sidebar.description")}
            </p>

            <div className="mt-8 space-y-5">
              <Link
                href="/tours"
                className="group flex items-center gap-4 rounded-xl border border-primary p-4 "
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Users className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold text-heading">
                    {t("sidebar.tours.title")}
                  </p>
                  <p className="text-xs text-text-muted">
                    {t("sidebar.tours.desc")}
                  </p>
                </div>
              </Link>

              <Link
                href="/day-trips"
                className="group flex items-center gap-4 rounded-xl border border-primary p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Compass className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold text-heading">
                    {t("sidebar.dayTrips.title")}
                  </p>
                  <p className="text-xs text-text-muted">
                    {t("sidebar.dayTrips.desc")}
                  </p>
                </div>
              </Link>

              <Link
                href="/activities"
                className="group flex items-center gap-4 rounded-xl border border-primary p-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Mountain className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold text-heading">
                    {t("sidebar.activities.title")}
                  </p>
                  <p className="text-xs text-text-muted">
                    {t("sidebar.activities.desc")}
                  </p>
                </div>
              </Link>

            </div>
          </div>
        </div>
      </section>
    </>
  );
}
