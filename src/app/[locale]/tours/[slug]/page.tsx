import { getAllTourSlugs, getAlternateTourSlugsBySlug, getTourDetail,type Locale } from '@/lib/supabase/tours';
import { Link, routing, getPathname } from "@/i18n/routing";
import Image from 'next/image';
import ContactForm from '@/components/sections/Contact/ContactForms';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import Faqs from '@/components/sections/day_trips/Faqs';
import Itinerary from '@/components/sections/day_trips/Itinerary';
import { Check, X } from 'lucide-react';
import Highlits from '@/components/sections/tours/Highlits';
import Gallery from '@/components/sections/tours/Gallery';
import Map from '@/components/sections/tours/Map';
import { RegisterAlternateSlugs } from '@/components/RegisterAlternaternateSlugs';
import type { Metadata } from "next";
import { notFound } from "next/navigation";


export const revalidate = 3600;


export async function generateStaticParams(): Promise<Array<{ locale: Locale; slug: string }>> {
  const params = await Promise.all(
    routing.locales.map(async (locale) => {
      const slugs = await getAllTourSlugs(locale);

      return slugs.map((slug) => ({
        locale,
        slug,
      }));
    }),
  );

  return params.flat();
}


type TourDetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

function isLocale(value: string): value is Locale {
  return value === "en" || value === "fr" || value === "es";
}

export async function generateMetadata({
  params,
}: TourDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const [tour, alternateSlugs] = await Promise.all([
    getTourDetail(locale, slug),
    getAlternateTourSlugsBySlug(locale, slug),
  ]);

  if (!tour) {
    notFound();
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://toursmarrakechdesert.com";

  const getUrl = (language: Locale, translatedSlug: string) =>
    new URL(
      getPathname({
        locale: language,
        href: {
          pathname: "/tours/[slug]",
          params: { slug: translatedSlug },
        },
      }),
      baseUrl,
    ).toString();

  const canonicalUrl = getUrl(locale, tour.slug);

  // La page actuelle est toujours présente.
  const languages: Record<string, string> = {
    [locale]: canonicalUrl,
  };

  // Ajouter uniquement les traductions disponibles.
  for (const language of routing.locales) {
    if (language === locale) continue;

    const translatedSlug = alternateSlugs?.[language]?.trim();

    if (translatedSlug) {
      languages[language] = getUrl(language, translatedSlug);
    }
  }

  if (languages.en) {
    languages["x-default"] = languages.en;
  }

  const title = tour.seoTitle?.trim() || tour.title;
  const description = tour.seoDescription?.trim() || tour.description;

  const imageUrl = new URL(
    tour.imageUrl || "/images/hero.jpg",
    baseUrl,
  ).toString();

  const image = {
    url: imageUrl,
    alt: tour.imageAlt || tour.title,
  };

  const ogLocales: Record<Locale, string> = {
    en: "en_US",
    fr: "fr_FR",
    es: "es_ES",
  };

  return {
    title,
    description,
    keywords: tour.keywords ?? [],

    alternates: {
      canonical: canonicalUrl,
      languages,
    },

    openGraph: {
      type: "website",
      siteName: "Tours Marrakech Desert",
      title,
      description,
      url: canonicalUrl,
      locale: ogLocales[locale],
      alternateLocale: routing.locales
        .filter(
          (language) => language !== locale && Boolean(languages[language]),
        )
        .map((language) => ogLocales[language]),
      images: [image],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}


async function page(params: { params: { locale: Locale; slug: string } }) {
  const { locale, slug } =await params.params

  const [tour, alternateSlugs] =await Promise.all([
    getTourDetail(locale, slug),
    getAlternateTourSlugsBySlug(locale, slug),
  ]);

  if (!tour) {
    notFound();
   }

  return (
    <>
    <RegisterAlternateSlugs slugs={alternateSlugs} />
    <section className="bg-background min-h-screen">
      <section
        aria-labelledby="tour-title"
        className="relative isolate flex min-h-[540px] w-full items-end overflow-hidden bg-secondary sm:min-h-[620px] lg:min-h-[580px]"
      >
        <Image
          src={tour?.imageUrl || "/images/hero.jpg"}
          alt={tour?.imageAlt || tour?.title || "Morocco tour"}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* CONTRASTE SUR L’IMAGE */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/30 to-black/15"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"
        />

        <div className="relative mx-auto w-full max-w-7xl px-4 py-10 text-white sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          {/* FIL D’ARIANE */}
          <nav
            aria-label={
              locale === "fr"
                ? "Fil d’Ariane"
                : locale === "es"
                  ? "Ruta de navegación"
                  : "Breadcrumb"
            }
            className="mb-8 text-xs text-white"
          >
            <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <li>
                <Link
                  href="/"
                  locale={locale}
                  className="transition-colors hover:text-white"
                >
                  {locale === "fr"
                    ? "Accueil"
                    : locale === "es"
                      ? "Inicio"
                      : "Home"}
                </Link>
              </li>

              <li aria-hidden="true" className="text-white/40">
                /
              </li>

              <li>
                <Link
                  href="/tours"
                  locale={locale}
                  className="transition-colors hover:text-white"
                >
                  {locale === "fr" ? "Circuits" : "Tours"}
                </Link>
              </li>

              <li aria-hidden="true" className="text-white/40">
                /
              </li>

              <li aria-current="page" className="font-medium text-white">
                {tour?.title}
              </li>
            </ol>
          </nav>

          <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14">
            {/* PRÉSENTATION */}
            <div>
              <h1
                id="tour-title"
                className="max-w-3xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                {tour?.title}
              </h1>

              {tour?.description && (
                <p className="mt-4 max-w-2xl text-[15px] leading-8 text-white/85 sm:text-base">
                  {tour.description}
                </p>
              )}

              {(tour?.departureCity || tour?.duration) && (
                <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5 pt-6">
                  {tour?.departureCity && (
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65">
                        {locale === "fr"
                          ? "Ville de départ"
                          : locale === "es"
                            ? "Ciudad de salida"
                            : "Departure city"}
                      </dt>

                      <dd className="mt-2 text-base font-medium text-white">
                        {tour.departureCity}
                      </dd>
                    </div>
                  )}

                  {tour?.duration && (
                    <div>
                      <dt className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/65">
                        {locale === "fr"
                          ? "Durée"
                          : locale === "es"
                            ? "Duración"
                            : "Duration"}
                      </dt>

                      <dd className="mt-2 text-base font-medium text-white">
                        {tour.duration}
                      </dd>
                    </div>
                  )}
                </dl>
              )}
            </div>

            {/* PRIX ET RÉSERVATION */}
            <div className="space-y-5 rounded-xl border border-white/20 bg-black/20 p-5 text-white">
              {tour?.price != null && (
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm text-white/75">
                    {locale === "fr"
                      ? "À partir de"
                      : locale === "es"
                        ? "Desde"
                        : "From"}
                  </p>

                  <p className="text-3xl font-semibold">
                    {tour.price}
                    <span className="ml-1 text-lg font-normal text-white/80">
                      €
                    </span>
                  </p>
                </div>
              )}

              <Link
                href="/contact"
                locale={locale}
                className="flex min-h-12 items-center justify-center rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                {locale === "fr"
                  ? "Obtenir un devis gratuit"
                  : locale === "es"
                    ? "Solicitar presupuesto gratis"
                    : "Get a free quote"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto my-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-6">
          <div className="min-w-0 lg:col-span-8">
            <h2 className="text-3xl font-semibold leading-tight tracking-tight text-primary/90 sm:text-4xl">
              {tour?.overviewTitle}
            </h2>

            {tour?.overview && (
              <div className="blog-content mt-6">
                <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                  {tour.overview}
                </ReactMarkdown>
              </div>
            )}

            {tour?.itinerary && (
              <Itinerary
                itinerary={tour.itinerary}
                title={tour.itineraryTitle}
                locale={locale}
              />
            )}

            {tour?.highlights && (
              <Highlits highlights={tour.highlights} locale={locale} />
            )}

            {/* INCLUS / EXCLUS */}
            {(!!tour?.include?.length || !!tour?.exclude?.length) && (
              <section className="mt-12 grid gap-6 sm:grid-cols-2">
                {/* INCLUS */}
                {!!tour?.include?.length && (
                  <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
                    <h2 className="text-2xl font-semibold text-primary">
                      {locale === "fr"
                        ? "Ce qui est inclus"
                        : locale === "es"
                          ? "Qué está incluido"
                          : "What's included"}
                    </h2>

                    <ul className="mt-5 space-y-4">
                      {tour.include.map((item, index) => (
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
                {!!tour?.exclude?.length && (
                  <div className="rounded-xl border border-border bg-muted/50 p-5 sm:p-6">
                    <h2 className="text-2xl font-semibold text-heading">
                      {locale === "fr"
                        ? "Ce qui n’est pas inclus"
                        : locale === "es"
                          ? "Qué no está incluido"
                          : "What's not included"}
                    </h2>

                    <ul className="mt-5 space-y-4">
                      {tour.exclude.map((item, index) => (
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
            {tour?.whyChoose && (
              <section className="mt-6" aria-labelledby="why-choose-heading">
                <h2
                  id="why-choose-heading"
                  className="text-3xl font-semibold leading-tight tracking-tight text-primary/90 sm:text-4xl"
                >
                  {locale === "fr"
                    ? "Ce qui rend ce circuit spécial"
                    : locale === "es"
                      ? "Lo que hace especial este circuito"
                      : "What makes this tour special"}
                </h2>

                <div className="blog-content mt-3">
                  <ReactMarkdown rehypePlugins={[rehypeRaw, rehypeSanitize]}>
                    {tour.whyChoose}
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
      {tour && (
        <section className="mx-auto w-full max-w-7xl">
          <Gallery tour={tour} locale={locale} />
          <Map tour={tour} locale={locale} />
        </section>
      )}

      {tour?.faq && <Faqs faqs={tour.faq} locale={locale} />}
    </section>
  </>
  );
}

export default page
