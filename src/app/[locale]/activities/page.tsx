import { getActivityCards, type Locale } from "@/lib/supabase/activities";
import { ActivityCard } from "@/components/sections/activities/ActivityCard";

const PAGE_COPY: Record<
  Locale,
  { title: string; subtitle: string; empty: string }
> = {
  en: {
    title: "Marrakech Activities & Excursions",
    subtitle:
      "Hand-picked experiences beyond the usual tours, bookable directly with no middleman.",
    empty: "No activities published yet. Check back soon.",
  },
  fr: {
    title: "Activités & Excursions à Marrakech",
    subtitle:
      "Des expériences sélectionnées au-delà des circuits classiques, réservables en direct sans intermédiaire.",
    empty: "Aucune activité publiée pour le moment. Revenez bientôt.",
  },
  es: {
    title: "Actividades y Excursiones en Marrakech",
    subtitle:
      "Experiencias seleccionadas más allá de los tours clásicos, reservables directamente sin intermediarios.",
    empty: "Aún no hay actividades publicadas. Vuelve pronto.",
  },
};

interface ActivitiesPageProps {
  params: Promise<{ locale: Locale }>;
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://deluxemoroccotrips.com";

const LOCALE_PATHS: Record<Locale, string> = {
  en: "/activities",
  fr: "/fr/activites",
  es: "/es/actividades",
};

export async function generateMetadata({ params }: ActivitiesPageProps) {
  const { locale } = await params;
  const copy = PAGE_COPY[locale] ?? PAGE_COPY.en;

  return {
    title: copy.title,
    description: copy.subtitle,
    alternates: {
      canonical: `${SITE_URL}${LOCALE_PATHS[locale]}`,
      languages: {
        en: `${SITE_URL}${LOCALE_PATHS.en}`,
        fr: `${SITE_URL}${LOCALE_PATHS.fr}`,
        es: `${SITE_URL}${LOCALE_PATHS.es}`,
        "x-default": `${SITE_URL}${LOCALE_PATHS.en}`,
      },
    },
  };
}

export default async function ActivitiesPage({ params }: ActivitiesPageProps) {
  const { locale } = await params;
  const copy = PAGE_COPY[locale] ?? PAGE_COPY.en;

  const activities = await getActivityCards(locale, 12);

  return (
    <section className="bg-background">
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10 ">
        <h1 className="max-w-xl text-4xl text-heading sm:text-5xl">
          {copy.title}
        </h1>
        <p className="mt-4 max-w-lg text-text-secondary">{copy.subtitle}</p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        {activities.length === 0 ? (
          <p className="text-text-secondary">{copy.empty}</p>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((card) => (
              <ActivityCard key={card.id} card={card} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
