import React from "react";
import {
  getActivityDetail,
  getAlternateActivitySlugsBySlug,
  getAllActivitySlugs,
  Locale,
} from "@/lib/supabase/activities";
import type { Metadata } from "next";
import Image from "next/image";
import {
  Bus,
  Camera,
  CheckCircle2,
  ClockIcon,
  Coffee,
  Mountain,
  ShieldCheck,
  Sparkles,
  SparklesIcon,
  Sun,
  XCircle,
  Award,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import ContactForm from "@/components/sections/Contact/ContactForms";
import { getTranslations } from "next-intl/server";
import ActivityShowcase from "@/components/sections/activities/ActivityShowcase";
import { routing } from "@/i18n/routing";
import { buildActivityJsonLdGraph } from "@/components/seo/seoActivities";
import { notFound } from "next/navigation";
import { RegisterAlternateSlugs } from "@/components/RegisterAlternaternateSlugs";


export async function generateStaticParams() {
  const locales = routing.locales;

  const slugsByLocale = await Promise.all(
    locales.map((locale) => getAllActivitySlugs(locale)),
  );

  const params: { locale: string; slug: string }[] = [];

  locales.forEach((locale, index) => {
    slugsByLocale[index].forEach((slug) => {
      params.push({ locale, slug });
    });
  });

  return params;
}




const highlightIcons = [
  Sun,
  ShieldCheck,
  Mountain,
  Camera,
  Award,
  Coffee,
  Sparkles,
  Bus,
];

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://toursmarrakechdesert.com";

const LOCALE_PATH: Record<Locale, string> = {
  en: "activities",
  fr: "activites",
  es: "actividades",
};

const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
  es: "es_ES",
};


function buildActivityUrl(locale: Locale, slug: string) {
  const path = `${LOCALE_PATH[locale]}/${slug}`;
  return locale === "en" ? `${BASE_URL}/${path}` : `${BASE_URL}/${locale}/${path}`;
}

type PageParams = { locale: string; slug: string };


export async function generateMetadata({ params,}: {params: Promise<PageParams>;}): Promise<Metadata> {


  const { locale, slug } = await params;
  const activityDetail = await getActivityDetail(locale as Locale, slug);


  if (!activityDetail) {
    return {
      title: "Activité introuvable",
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = buildActivityUrl(locale as Locale, slug);
  const ogImage = activityDetail.imageUrl1;

  const alternates = await getAlternateActivitySlugsBySlug(
    locale as Locale,
    slug,
  );


  const languagesAlternates = alternates ? (Object.keys(alternates) as Locale[]).reduce<Record<string, string>>(
        (acc, loc) => {
          const altSlug = alternates[loc];
          if (altSlug) acc[loc] = buildActivityUrl(loc, altSlug);
          return acc;
        },
        {},
      )
    : {};

  return {
    title: activityDetail.seoTitle,
    description: activityDetail.seoDescription,
    keywords: activityDetail.keywords,

    alternates: {
      canonical: canonicalUrl,
      languages: {
        ...languagesAlternates,
        "x-default": languagesAlternates.en ?? canonicalUrl,
      },
    },

    openGraph: {
      type: "website",
      url: canonicalUrl,
      title: activityDetail.seoTitle,
      description: activityDetail.seoDescription,
      siteName: "Tours Marrakech Desert",
      locale: OG_LOCALE[locale as Locale],
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: activityDetail.imageAlt1 || activityDetail.title,
            },
          ]
        : undefined,
    },

    twitter: {
      card: "summary_large_image",
      title: activityDetail.seoTitle,
      description: activityDetail.seoDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}


async function page({params,}: {params: Promise<{ locale: string; slug: string }>;}) {

  const { locale, slug } = await params;
  const activityDetail = await getActivityDetail(locale as Locale, slug);

   if (!activityDetail) {
     notFound();
   }

   const jsonLdGraph = activityDetail ? buildActivityJsonLdGraph(activityDetail, locale as Locale) : [];


   const alternateSlugs = await getAlternateActivitySlugsBySlug(
     locale as Locale,
     slug,
   );


  const t=await getTranslations("ActivityDetail");

  return (
    <section className="bg-background p-0 m-0">
      <RegisterAlternateSlugs slugs={alternateSlugs} />
      {jsonLdGraph.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <section className="relative flex min-h-[420px] w-full items-end overflow-hidden py-8 sm:min-h-[520px] lg:py-20">
        <Image
          src={activityDetail?.imageUrl1 || "/images/benhdou.jpeg"}
          alt={activityDetail?.imageAlt1 || "Activity Image"}
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-secondary/50 via-secondary/40 to-secondary/20" />

        <div className="relative mx-auto w-full max-w-7xl px-6 text-left text-white sm:px-8 lg:px-12">
          <div className="max-w-4xl pb-2 sm:pb-4">
            {/* Fil d'Ariane */}
            <nav className="mb-2 flex items-center gap-2 text-xs text-white/70">
              <Link href="/" className="transition-colors hover:text-white">
                Accueil
              </Link>
              <span className="text-primary">/</span>
              <Link
                href="/activities"
                className="transition-colors hover:text-white"
              >
                Activités
              </Link>
              <span className="text-primary">/</span>
              <span className="font-medium text-white" aria-current="page">
                {activityDetail?.category}
              </span>
            </nav>

            <h1 className="mb-5 max-w-4xl text-3xl font-semibold leading-tight text-white drop-shadow-md sm:text-4xl lg:text-6xl">
              {activityDetail?.title}
            </h1>

            {activityDetail?.description && (
              <p className="mb-8 max-w-3xl text-sm font-normal leading-relaxed text-white/85 drop-shadow-sm sm:text-base">
                {activityDetail.description}
              </p>
            )}

            <div className="mb-8 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm font-medium text-white/90">
              {activityDetail?.duration && (
                <span className="inline-flex items-center gap-2">
                  <ClockIcon className="h-5 w-5 text-primary" />
                  {activityDetail.duration}
                </span>
              )}

              {activityDetail?.highlights?.[0] && (
                <span className="inline-flex max-w-xl items-center gap-2">
                  <SparklesIcon className="h-5 w-5 shrink-0 text-primary" />
                  {activityDetail.highlights[0]}
                </span>
              )}

              {activityDetail?.price && (
                <span className="inline-flex items-center gap-1.5 font-bold text-white">
                  À partir de {activityDetail.price} €
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

      <div className="mx-auto max-w-7xl pl-0 sm:pl-4 my-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 px-3">
            <div>
              <h2 className="m-2 text-2xl font-bold text-primary sm:text-3xl">
                {t("overviewTitle")}
              </h2>
              {activityDetail?.overview && (
                <div
                  className="blog-content"
                  dangerouslySetInnerHTML={{ __html: activityDetail.overview }}
                />
              )}
            </div>

            {activityDetail?.itinerary &&
              activityDetail.itinerary.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-8 text-2xl font-bold text-primary sm:text-3xl">
                    {t("itineraryTitle")}
                  </h2>

                  <ol className="relative space-y-4">
                    {/* Ligne verticale reliant les étapes */}
                    <div
                      className="absolute left-[19px] top-2 bottom-2 w-px bg-border"
                      aria-hidden="true"
                    />

                    {activityDetail.itinerary.map((step, index) => (
                      <li key={index} className="relative flex gap-5 pl-0">
                        {/* Numéro dans un cercle terracotta */}
                        <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm">
                          {index + 1}
                        </span>

                        <div className="pt-1.5">
                          <h3 className="text-base font-bold text-heading sm:text-lg">
                            {step.title}
                          </h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary sm:text-base">
                            {step.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6 px-3">
              <ContactForm />

              {(activityDetail?.include?.length ||
                activityDetail?.exclude?.length) && (
                <div className="rounded-xl border border-primary p-6">
                  {activityDetail?.include &&
                    activityDetail.include.length > 0 && (
                      <div>
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-heading">
                          {t("includeTitle")}
                        </h3>
                        <ul className="space-y-3">
                          {activityDetail.include.map((item, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2.5 text-sm text-text-main"
                            >
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                  {activityDetail?.exclude &&
                    activityDetail.exclude.length > 0 && (
                      <div
                        className={
                          activityDetail?.include?.length
                            ? "mt-6 border-t border-border pt-6"
                            : ""
                        }
                      >
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-heading">
                          {t("excludeTitle")}
                        </h3>
                        <ul className="space-y-3">
                          {activityDetail.exclude.map((item, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-2.5 text-sm text-text-main"
                            >
                              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    
    
      {(activityDetail?.itinerary?.length || activityDetail?.imageUrl2) && (
        <section className="mx-auto max-w-7xl px-3 sm:py-4 sm:pl-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Texte */}
            <div className="lg:col-span-6 ">
              <span className="text-xs italic pl-8 sm:pl-0 font-bold uppercase tracking-widest text-primary">
                {t("whyKicker")}
              </span>
              <h2 className="mt-2 mb-3 text-2xl text-center font-semibold text-heading sm:text-3xl">
                {t("whyTitle")}
              </h2>

              <div className="mt-8 space-y-6">
                {activityDetail.whyThisActivity?.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary text-sm font-bold text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-bold text-heading sm:text-lg">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-text-secondary sm:text-base">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            {activityDetail?.imageUrl2 && (
              <div className="lg:col-span-6">
                <div className="relative h-80 w-full overflow-hidden rounded-[4px] sm:h-[420px] lg:h-full lg:min-h-[480px]">
                  <Image
                    src={activityDetail?.imageUrl2}
                    alt={activityDetail?.imageAlt2 || "Activity"}
                    fill
                    quality={90}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {activityDetail?.highlights && activityDetail.highlights.length > 0 && (
        <section className="relative overflow-hidden bg-primary py-8">
          <div className="relative mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 ">
              {activityDetail.highlights.map((item, index) => {
                const Icon = highlightIcons[index % highlightIcons.length];
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-3 px-4 text-center sm:items-center sm:px-6"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm transition-transform duration-300 hover:scale-105">
                      <Icon
                        className="h-5 w-5 text-primary-foreground"
                        strokeWidth={1.75}
                      />
                    </span>
                    <span className="text-sm font-semibold leading-snug text-primary-foreground sm:text-[0.9rem]">
                      {item}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <ActivityShowcase
        faq={activityDetail?.faq}
        labels={{
          faqTitle: t("faqTitle"),
          faqSubtitle: t("faqSubtitle"),
        }}
      />
    </section>
  );
}

export default page;
