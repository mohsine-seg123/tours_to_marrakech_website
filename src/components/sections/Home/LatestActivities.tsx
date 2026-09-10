import { getActivityCards, type Locale } from "@/lib/supabase/activities";
import Link from "next/link";
import { ActivityCard } from "@/components/sections/activities/ActivityCard";

const CONTENT: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    description: string;
  }
> = {
  en: {
    eyebrow: "Handpicked Experiences",
    title: "morocco activities",
    description:
      "Explore our most popular experiences and unforgettable adventures.",
  },
  fr: {
    eyebrow: "Expériences sélectionnées",
    title: "activités au Maroc",
    description:
      "Découvrez nos expériences les plus populaires et des aventures inoubliables.",
  },
  es: {
    eyebrow: "Experiencias seleccionadas",
    title: "actividades en Marruecos",
    description:
      "Explora nuestras experiencias más populares y aventuras inolvidables.",
  },
};

export default async function LatestActivities({ locale }: { locale: Locale }) {
  const activities = await getActivityCards(locale, 3);

  const content = CONTENT[locale];

  return (
    <section className="mx-auto max-w-7xl px-6 pb-14 sm:px-8">
      {/* Mini header */}
      <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        {/* Left content */}
        <div className="max-w-2xl">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
            {content?.eyebrow}
          </span>

          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.02em] text-heading sm:text-4xl">
            {content?.title}
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary sm:text-[15px]">
            {content?.description}
          </p>
        </div>

        {/* Right button */}
        <Link
          href="/activities"
          className="
      inline-flex shrink-0 items-center justify-center
      rounded-full
      border border-border
      px-5 py-2.5
      text-sm font-semibold
      shadow-sm
    bg-primary
    text-primary-foreground
    "
        >
          All Activities
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>

      {activities.length === 0 ? (
        <p className="text-text-secondary">
          {locale === "fr"
            ? "Aucune activité disponible."
            : locale === "es"
              ? "No hay actividades disponibles."
              : "No activities available."}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((card) => (
            <ActivityCard key={card.id} card={card} locale={locale} />
          ))}
        </div>
      )}
    </section>
  );
}
