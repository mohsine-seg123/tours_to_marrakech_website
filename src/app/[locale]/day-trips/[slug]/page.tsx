import { getDayTripDetail,getAllDayTripSlugs ,type Locale, getAlternateDayTripSlugsBySlug} from '@/lib/supabase/day_trips';
import {notFound} from "next/navigation";
import { getPathname, Link, routing } from "@/i18n/routing";
import Image from "next/image";
import { SparklesIcon, Check,X } from "lucide-react";
import ContactForm from '@/components/sections/Contact/ContactForms';
import Itinerary from '@/components/sections/day_trips/Itinerary';
import WhyChoose from '@/components/sections/day_trips/WhyChoose';
import Faqs from "@/components/sections/day_trips/Faqs";
import { Metadata } from 'next';
import { RegisterAlternateSlugs } from '@/components/RegisterAlternaternateSlugs';
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";

export const revalidate =8400; 



export async function generateStaticParams() {
  const locales = routing.locales;

  const slugsByLocale = await Promise.all(
    locales.map((locale) => getAllDayTripSlugs(locale)),
  );


  const params: { locale: string; slug: string }[] = [];

  locales.forEach((locale, index) => {
    slugsByLocale[index].forEach((slug) => {
      params.push({ locale, slug });
    });
  });

  return params;
}


interface DayTripDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({params,}: DayTripDetailPageProps): Promise<Metadata> {

  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const trip = await getDayTripDetail(locale, slug);

  if (!trip) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://toursmarrakechdesert.com";

  const getUrl = (language: Locale, translatedSlug: string) =>
    new URL(
      getPathname({
        locale: language,
        href: {
          pathname: "/day-trips/[slug]",
          params: { slug: translatedSlug },
        },
      }),
      baseUrl,
    ).toString();

  const canonicalUrl = getUrl(locale, trip.slug);
  const alternateSlugs = await getAlternateDayTripSlugsBySlug(locale, slug);

  const languages: Record<string, string> = {
    [locale]: canonicalUrl,
  };

  const locales: Locale[] = ["en", "fr", "es"];

  for (const language of locales) {
    const translatedSlug = alternateSlugs?.[language];

    if (translatedSlug) {
      languages[language] = getUrl(language, translatedSlug);
    }
  }

  if (languages.en) {
    languages["x-default"] = languages.en;
  }

  const title = trip.seoTitle || trip.title;
  const description = trip.seoDescription || trip.description;

  const imageUrl = new URL(
    trip.imageUrl || "/images/hero.jpg",
    baseUrl,
  ).toString();

  const ogLocales: Record<Locale, string> = {
    en: "en_US",
    fr: "fr_FR",
    es: "es_ES",
  };

  return {
    title,
    description,
    keywords: trip.keywords ?? [],

    alternates: {
      canonical: canonicalUrl,
      languages,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Tours Marrakech Desert",
      images: [
        {
          url: imageUrl,
          alt: trip.imageAlt || trip.title,
        },
      ],
      locale: ogLocales[locale],
      alternateLocale: locales
        .filter((language) => language !== locale && languages[language])
        .map((language) => ogLocales[language]),
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}


function isLocale(value: string): value is Locale {
  return value === "en" || value === "fr" || value === "es";
}

async function page({params}: {params: Promise<{ locale: Locale; slug: string }>;}) {
  
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const [trip,alternateSlugs ]= await Promise.all([
    getDayTripDetail(locale, slug),
    getAlternateDayTripSlugsBySlug(locale, slug)
  ]);


  if(!trip || !alternateSlugs) {
    notFound();
  }

 

  return (
    <>
      <RegisterAlternateSlugs slugs={alternateSlugs} />
      <section className="bg-background min-h-screen">
        <section className="relative flex min-h-[420px] w-full items-end overflow-hidden py-8 sm:min-h-[520px] lg:py-20">
          <Image
            src={trip?.imageUrl || "/images/hero.jpg"}
            alt={trip?.imageAlt || "Activity Image"}
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-secondary/45 via-secondary/40 to-secondary/20" />

          <div className="relative mx-auto w-full max-w-7xl px-4 text-left text-white sm:px-8 lg:px-12">
            <div className="max-w-4xl pb-2 sm:pb-4">
              {/* Fil d'Ariane */}
              <nav className="mb-2 flex items-center gap-2 text-xs text-white/70">
                <Link href="/" className="transition-colors hover:text-white">
                  Accueil
                </Link>
                <span className="text-primary">/</span>
                <Link
                  href="/day-trips"
                  className="transition-colors hover:text-white"
                >
                  day trips
                </Link>
                <span className="text-primary">/</span>
                <span className="font-medium text-white" aria-current="page">
                  {trip?.departureCity}
                </span>
              </nav>

              <h1 className="mb-5 max-w-4xl text-3xl font-semibold leading-tight text-white drop-shadow-md sm:text-4xl lg:text-6xl">
                {trip?.title}
              </h1>

              {trip?.description && (
                <p className="mb-8 max-w-3xl text-sm font-normal leading-relaxed text-white/85 drop-shadow-sm sm:text-base">
                  {trip.description}
                </p>
              )}

              <div className="mb-8 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm font-medium text-white/90">
                {trip?.departureCity?.[0] && (
                  <span className="inline-flex max-w-xl text-xl items-center gap-2">
                    <SparklesIcon className="h-5 w-5 shrink-0 text-primary" />
                    {trip.departureCity}
                  </span>
                )}

                {trip?.price && (
                  <span className="inline-flex  text-xl items-center gap-1.5 font-bold text-white">
                    À partir de {trip?.price} €
                  </span>
                )}
              </div>

              <Link
                href="/contact"
                className="inline-flex items-center rounded-md bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-lg transition-colors hover:bg-primary-hover"
              >
                Réserver cette activité
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto my-12 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-6">
            <div className="min-w-0 lg:col-span-8">
              <h2 className="text-3xl font-semibold leading-tight tracking-tight text-primary/90 sm:text-4xl">
                {trip?.overviewTitle}
              </h2>

              {trip?.overview && (
                <div className="blog-content mt-6">
                    <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                      {trip.overview}
                    </ReactMarkdown>
                </div>
              )}

              {trip?.itinerary && (
                <Itinerary
                  itinerary={trip.itinerary}
                  title={trip.itineraryTitle}
                  locale={locale}
                />
              )}

              {trip?.whyChoose && (
                <WhyChoose
                  reasons={trip.whyChoose}
                  title={trip.whyChooseTitle}
                  locale={locale}
                />
              )}

              {/* INCLUS / EXCLUS */}
              {(!!trip?.include?.length || !!trip?.exclude?.length) && (
                <section className="mt-12 grid gap-6 sm:grid-cols-2">
                  {/* INCLUS */}
                  {!!trip?.include?.length && (
                    <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
                      <h2 className="text-2xl font-semibold text-primary">
                        {locale === "fr"
                          ? "Ce qui est inclus"
                          : locale === "es"
                            ? "Qué está incluido"
                            : "What's included"}
                      </h2>

                      <ul className="mt-5 space-y-4">
                        {trip.include.map((item, index) => (
                          <li
                            key={`${index}-${item}`}
                            className="flex items-start gap-3 text-sm leading-7 text-text-secondary"
                          >
                            <Check
                              aria-hidden="true"
                              className="mt-1 h-5 w-5 shrink-0 text-primary"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* EXCLUS */}
                  {!!trip?.exclude?.length && (
                    <div className="rounded-xl border border-border bg-muted/50 p-5 sm:p-6">
                      <h2 className="text-2xl font-semibold text-heading">
                        {locale === "fr"
                          ? "Ce qui n’est pas inclus"
                          : locale === "es"
                            ? "Qué no está incluido"
                            : "What's not included"}
                      </h2>

                      <ul className="mt-5 space-y-4">
                        {trip.exclude.map((item, index) => (
                          <li
                            key={`${index}-${item}`}
                            className="flex items-start gap-3 text-sm leading-7 text-text-secondary"
                          >
                            <X
                              aria-hidden="true"
                              className="mt-1 h-5 w-5 shrink-0 text-heading-soft"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </section>
              )}

              
              {/* INFORMATIONS COMPLÉMENTAIRES */}
              {trip?.moreInformation && (
                <section className="mt-12" aria-labelledby="more-information-heading"  >
                  <h2
                    id="more-information-heading"
                    className="text-3xl font-semibold text-primary/90 sm:text-4xl"
                  >
                    {locale === "fr"
                      ? "Que vous réserve cette excursion ?"
                      : locale === "es"
                        ? "¿Qué te espera en esta excursión?"
                        : "What awaits you on this day trip?"}
                  </h2>

                  <div className="day-content mt-6 break-words">
                    <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                      {trip.moreInformation}
                    </ReactMarkdown>
                  </div>
                </section>
              )}
            </div>

            {/* CONTACT */}
            <aside className="min-w-0 lg:sticky lg:top-24 lg:col-span-4">
              <ContactForm />
            </aside>
          </div>
        </section>

        {trip?.faq && <Faqs faqs={trip.faq} locale={locale} />}
      </section>
    </>
  );
}

export default page
