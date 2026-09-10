import { Link } from "@/i18n/routing";
import { getDayTripsByCity, type Locale } from "@/lib/supabase/day_trips";
import { DayTripCard } from "../day_trips/daytripCard";

const CONTENT = {
  en: {
    label: "MOROCCO DAY TRIPS",
    title: "Day trips from",
    city: "Marrakech",
    description:
      "Take a break from the city and enjoy carefully selected excursions through Morocco’s landscapes, villages and cultural sites.",
    viewAll: "View all day trips",
    empty: "No day trips are available at the moment.",
  },
  fr: {
    label: "EXCURSIONS AU MAROC",
    title: "Excursions au départ de",
    city: "Marrakech",
    description:
      "Quittez la ville le temps d’une journée et profitez d’excursions à travers les paysages, villages et sites culturels du Maroc.",
    viewAll: "Voir toutes les excursions",
    empty: "Aucune excursion n’est disponible pour le moment.",
  },
  es: {
    label: "EXCURSIONES POR MARRUECOS",
    title: "Excursiones desde",
    city: "Marrakech",
    description:
      "Aléjate de la ciudad por un día y disfruta de excursiones por los paisajes, pueblos y lugares culturales de Marruecos.",
    viewAll: "Ver todas las excursiones",
    empty: "No hay excursiones disponibles en este momento.",
  },
} satisfies Record<
  Locale,
  {
    label: string;
    title: string;
    city: string;
    description: string;
    viewAll: string;
    empty: string;
  }
>;

async function HomeDayTrips({ locale }: { locale: Locale }) {
  const t = CONTENT[locale];
  const dayTrips = await getDayTripsByCity(locale, "Marrakech", 3);

  return (
    <section
      aria-labelledby="home-day-trips-heading"
      className="relative overflow-hidden bg-surface-soft pt-10"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary sm:text-[11px]">
              {t.label}
            </p>

            <h2
              id="home-day-trips-heading"
              className="mt-2 text-4xl font-semibold leading-[1.05] tracking-[-0.025em] text-heading sm:text-5xl"
            >
              {t.title} <span className="text-primary">{t.city}</span>
            </h2>

            <p className="mt-5 max-w-xl text-[15px] leading-7 text-text-secondary sm:text-base">
              {t.description}
            </p>
          </div>

          <Link
            href="/day-trips"
            locale={locale}
            className="inline-flex w-fit items-center text-sm font-semibold text-primary transition-colors hover:border-primary-hover hover:text-primary-hover"
          >
            {t.viewAll}
            <span aria-hidden="true" className="ml-2 text-lg leading-none">
              →
            </span>
          </Link>
        </header>

        {dayTrips.length > 0 ? (
          <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dayTrips.map((card) => (
              <DayTripCard key={card.id} card={card} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center text-text-secondary">
            {t.empty}
          </div>
        )}
      </div>
    </section>
  );
}

export default HomeDayTrips;
