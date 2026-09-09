import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight, MapPin } from "lucide-react";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import type {
  DayTripCard as DayTripCardType,
  Locale,
} from "@/lib/supabase/day_trips";

const LABELS = {
  en: {
    from: "From",
    departure: "Departure",
    noImage: "No image available",
  },
  fr: {
    from: "À partir de",
    departure: "Départ",
    noImage: "Aucune image disponible",
  },
  es: {
    from: "Desde",
    departure: "Salida",
    noImage: "Imagen no disponible",
  },
} satisfies Record<
  Locale,
  { from: string; departure: string; noImage: string }
>;

export function DayTripCard({
  card,
  locale,
}: {
  card: DayTripCardType;
  locale: Locale;
}) {
  const t = LABELS[locale];

  return (
    <article
      className=" group relative flex h-full flex-col
        rounded-[12px] border bg-card
        shadow-primary/5 transition-all
        duration-600
        border-primary/25
        motion-safe:hover:-translate-y-0.5
      "
    >
      <Link
        href={{
          pathname: "/day-trips/[slug]",
          params: { slug: card.slug },
        }}
        locale={locale}
        className="
          flex h-full flex-col rounded-[20px]
          focus-visible:outline-2
          focus-visible:outline-offset-4
          focus-visible:outline-primary
        "
      >
        {/* IMAGE */}
        <div className="p-2 pb-0">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-muted">
            {card.imageUrl ? (
              <Image
                src={card.imageUrl}
                alt={card.imageAlt || card.title}
                fill
                sizes="
                  (min-width: 1280px) 380px,
                  (min-width: 1024px) 33vw,
                  (min-width: 640px) 50vw,
                  100vw
                "
                className="
                  object-cover
                  motion-safe:transition-transform
                  motion-safe:duration-700
                  motion-safe:ease-out
                  motion-safe:group-hover:scale-105
                "
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-text-secondary">
                {t.noImage}
              </div>
            )}

            {card.departureCity && (
              <span
                className="
                  absolute bottom-3 left-3
                  inline-flex items-center gap-1.5
                  rounded-full border border-white/60
                  bg-white/95 px-3 py-1.5
                  text-[11px] font-semibold text-heading
                  shadow-sm
                "
              >
                <MapPin
                  aria-hidden="true"
                  className="h-3.5 w-3.5 text-primary"
                  strokeWidth={1.8}
                />
                {card.departureCity}
              </span>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
          <h3
            className="
              line-clamp-2 text-[25px] font-bold
              leading-[1.15] tracking-[-0.02em]
              text-heading transition-colors duration-300
              group-hover:text-primary
            "
          >
            {card.title}
          </h3>

          <p className="mt-3 line-clamp-2 text-sm leading-7 text-text-secondary">
            {card.description}
          </p>

          {/* FOOTER */}
          <div className="mt-auto pt-5">
            <div className="flex items-center justify-between gap-3 pt-4">
              <div className="min-w-0">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-text-secondary">
                  {t.departure}
                </span>

                <span className="mt-1 block truncate text-[13px] font-medium text-heading">
                  {card.departureCity}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                {card.price != null && (
                  <div className="text-right">
                    <span className="block text-[11px] text-text-secondary">
                      {t.from}
                    </span>

                    <span className="mt-0.5 block text-2xl font-bold leading-tight tracking-tight text-primary">
                      ${card.price}
                    </span>
                  </div>
                )}

                <span
                  aria-hidden="true"
                  className="
                    flex h-10 w-10 shrink-0
                    items-center justify-center
                    rounded-full border border-border
                    bg-muted/70 text-heading
                    transition-colors duration-300
                    group-hover:border-primary
                    group-hover:bg-primary
                    group-hover:text-primary-foreground
                  "
                >
                  <ArrowUpRight className="h-[18px] w-[18px]" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* FAVORIS : séparé du lien */}
      <FavoriteButton id={card.id} type="day-trip" />
    </article>
  );
}

export default DayTripCard;
