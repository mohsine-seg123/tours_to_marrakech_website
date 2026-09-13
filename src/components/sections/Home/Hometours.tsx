import { ArrowRight } from "lucide-react";

import { getToursByCity, type Locale } from "@/lib/supabase/tours";
import TourCard from "@/components/sections/tours/TourCard";
import { Link } from "@/i18n/routing";

type Props = {
  locale: Locale;
};

const content = {
  en: {
    label: "Morocco Desert Adventures",
    title: "Best Desert Tours from Marrakech",
    description:
      "Discover our most popular private tours from Marrakech, crossing the High Atlas Mountains, Ait Ben Haddou and the valleys of southern Morocco on the way to the Sahara and the golden dunes of Merzouga.",
    viewAll: "Explore All Tours",
  },

  fr: {
    label: "Aventures dans le désert marocain",
    title: "Meilleurs circuits au départ de Marrakech",
    description:
      "Découvrez nos circuits privés les plus populaires au départ de Marrakech, à travers le Haut Atlas, Aït Ben Haddou et les vallées du sud du Maroc jusqu’au Sahara et aux dunes de Merzouga.",
    viewAll: "Explorer tous les circuits",
  },

  es: {
    label: "Aventuras por el desierto de Marruecos",
    title: "Los mejores tours desde Marrakech",
    description:
      "Descubre nuestros tours privados más populares desde Marrakech, cruzando el Alto Atlas, Ait Ben Haddou y los valles del sur de Marruecos hasta el Sahara y las dunas de Merzouga.",
    viewAll: "Explorar todos los tours",
  },
} as const;

type ContentLocale = keyof typeof content;

export default async function MarrakechToursHome({ locale }: Props) {
  const t = content[locale as ContentLocale] ?? content.en;

  const tours = await getToursByCity(locale, "marrakech", 3);

  if (!tours || tours.length === 0) {
    return null;
  }

  return (
    <section
      className="bg-background py-8"
      aria-labelledby="marrakech-tours-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mx-auto mb-4 max-w-3xl text-center sm:mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {t.label}
          </p>

          <h2
            id="marrakech-tours-heading"
            className="text-balance text-3xl font-semibold leading-tight tracking-tight text-heading sm:text-4xl"
          >
            {t.title}
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
            {t.description}
          </p>
        </div>

        {/* TOURS */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((card) => (
            <TourCard key={card.id} card={card} locale={locale} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-4 flex justify-center sm:mt-6">
          <Link
            href="/tours"
            locale={locale}
            className="
              group inline-flex items-center justify-center gap-2
              rounded-xl bg-primary px-6 py-3.5
              text-sm font-semibold text-primary-foreground
              shadow-sm transition
              hover:-translate-y-0.5 hover:shadow-md
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary
              focus-visible:ring-offset-2
            "
          >
            {t.viewAll}

            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
