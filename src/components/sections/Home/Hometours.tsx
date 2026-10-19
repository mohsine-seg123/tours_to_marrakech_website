
import { getToursByCity, type Locale } from "@/lib/supabase/tours";
import TourCard from "@/components/sections/tours/TourCard";
import { Link } from "@/i18n/routing";
import { ArrowUpRight } from "lucide-react";

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

  const tours = await getToursByCity(locale, "marrakech", 6);

  if (!tours || tours.length === 0) {
    return null;
  }

  return (
    <section
      className="relative overflow-hidden bg-background py-8 sm:pt-10"
      aria-labelledby="marrakech-tours-heading"
    >
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* PREMIUM SECTION HEADER */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="mb-5 items-center justify-center lg:justify-start">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm">
              {t.label}
            </p>
          </div>

          {/* Title, Description & CTA */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            {/* Main content */}
            <div className="max-w-3xl text-center lg:text-left">
              <h2
                id="marrakech-tours-heading"
                className="text-balance font-body text-3xl font-bold leading-[1.15] tracking-tight text-heading sm:text-4xl lg:text-[40px]"
              >
                {t.title}
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg lg:mx-0">
                {t.description}
              </p>
            </div>

            {/* CTA - TOP RIGHT */}
            <div className="flex shrink-0 justify-center lg:justify-end lg:pb-1">
              <Link
                href="/tours"
                locale={locale}
                className="
              group inline-flex items-center justify-center
              gap-3 rounded-full
              border border-primary
              bg-primary px-6 py-3.5
              text-sm font-semibold
              text-primary-foreground
              transition-all duration-300
              hover:shadow-lg
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary
              focus-visible:ring-offset-2
            "
              >
                <span>{t.viewAll}</span>

                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* TOUR CARDS */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tours.map((card) => (
            <TourCard key={card.id} card={card} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
