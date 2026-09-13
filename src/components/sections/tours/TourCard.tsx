import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import type { TourCard as TourCardType, Locale } from "@/lib/supabase/tours";

const LABELS = {
  en: {
    from: "From",
    departure: "Departure",
    noImage: "No image available",
    private: "Private tour",
    shared: "Shared tour",
    group: "Group tour",
  },
  fr: {
    from: "À partir de",
    departure: "Départ",
    noImage: "Aucune image disponible",
    private: "Circuit privé",
    shared: "Circuit partagé",
    group: "Circuit en groupe",
  },
  es: {
    from: "Desde",
    departure: "Salida",
    noImage: "Imagen no disponible",
    private: "Tour privado",
    shared: "Tour compartido",
    group: "Tour en grupo",
  },
} satisfies Record<
  Locale,
  {
    from: string;
    departure: string;
    noImage: string;
    private: string;
    shared: string;
    group: string;
  }
>;

export function TourCard({card,locale,}: {card: TourCardType;locale: Locale;}) {

  const t = LABELS[locale];
  const type = card.typeTour.trim().toLowerCase();

  const tourType =
    type === "private"
      ? t.private
      : type === "shared"
        ? t.shared
        : type === "group"
          ? t.group
          : card.typeTour;

  return (
    <article
      className="
        group relative flex h-full flex-col
        rounded-xl border border-primary/20 bg-card
        shadow-sm transition-shadow duration-300 "
    >
      <Link
        href={{
          pathname: "/tours/[slug]",
          params: { slug: card.slug },
        }}
        locale={locale}
        className="
          flex h-full flex-col rounded-xl
          focus-visible:outline-2
          focus-visible:outline-offset-4
          focus-visible:outline-primary
        "
      >
        {/* IMAGE : espace de 12px entre l’image et le cadre */}
        <div className="">
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-muted">
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
                  motion-safe:group-hover:scale-105
                "
              />
            ) : (
              <div className="flex h-full items-center justify-center px-4 text-center text-sm text-text-secondary">
                {t.noImage}
              </div>
            )}

            {card.duration && (
              <span
                className="
                  absolute bottom-3 left-3
                  inline-flex max-w-[calc(100%-1.5rem)] items-center gap-2
                  rounded-full border border-white/50
                  bg-white/95 px-3 py-1.5
                  text-xs font-semibold text-heading shadow-sm
                "
              >
                <Clock
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-primary"
                />
                <span>{card.duration}</span>
              </span>
            )}
          </div>
        </div>

        {/* CONTENU */}
        <div className="flex flex-1 flex-col px-5 pb-3 pt-3 sm:px-6">
          {tourType && (
            <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
              {tourType}
            </span>
          )}

          <h3
            className="
              line-clamp-2 text-[25px] font-semibold
              leading-[1.15] tracking-[-0.02em] text-heading
              transition-colors group-hover:text-primary
            "
          >
            {card.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-7 text-text-secondary">
            {card.description}
          </p>

          {/* PIED DE CARTE */}
          <div className="mt-auto pt-2">
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="min-w-0">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-text-secondary">
                  {t.departure}
                </span>

                <span className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-heading">
                  <MapPin
                    aria-hidden="true"
                    className="size-3.5 shrink-0 text-primary"
                  />
                  <span className="truncate">{card.departureCity}</span>
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                {card.price != null && (
                  <div className="text-right">
                    <span className="block text-[11px] text-text-secondary">
                      {t.from}
                    </span>

                    <span className="mt-0.5 block text-2xl font-bold tracking-tight text-primary">
                      ${card.price}
                    </span>
                  </div>
                )}

                <span
                  aria-hidden="true"
                  className="
                    flex size-10 shrink-0 items-center justify-center
                    rounded-full border border-border bg-muted/60
                    text-heading transition-colors
                    group-hover:border-primary group-hover:bg-primary
                    group-hover:text-primary-foreground
                  "
                >
                  <ArrowUpRight className="size-[18px]" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Hors du lien pour éviter une navigation au clic */}
      <div className="absolute right-3 top-3 z-10">
        <FavoriteButton id={card.id} type="tour" />
      </div>
    </article>
  );
}

export default TourCard;
