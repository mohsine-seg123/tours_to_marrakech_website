import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Clock } from "lucide-react";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import type { ActivityCard as ActivityCardType, Locale,} from "@/lib/supabase/activities";
import { RiH2 } from "react-icons/ri";

const PRICE_LABEL: Record<Locale, string> = {
  en: "From",
  fr: "À partir de",
  es: "Desde",
};


export function ActivityCard({card,locale,}: {card: ActivityCardType;locale: Locale;}) {
  return (
    <article
      className="
        group relative flex h-full flex-col overflow-hidden
        rounded-[12px]
        bg-card
        transition-all duration-500 ease-out hover:-translate-y-1
      "
    >
      <Link
        href={{
          pathname: "/activities/[slug]",
          params: {
            slug: card.slug,
          },
        }}
        locale={locale}
        className="flex h-full flex-col"
      >
        {/* IMAGE */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          { card.imageAlt ?
            <Image
              src={card?.imageUrl}
              alt={card?.imageAlt}
              fill
              priority={false}
              sizes="
              (min-width: 1280px) 380px,
              (min-width: 1024px) 33vw,
              (min-width: 640px) 50vw,
              100vw
            "
              className="
              object-cover
              transition-transform
              duration-700
              ease-[cubic-bezier(0.22,1,0.36,1)]
              group-hover:scale-[1.06]
            "
            /> : <span> No image available </span>
          }

          {/* CATEGORY */}
          {card.category && (
            <span
              className="
                absolute left-2 top-4
                inline-flex items-center
                rounded-full
                border border-white/30
                bg-white/90
                px-3.5 py-1.5
                text-[10px]
                font-extrabold
                uppercase
                tracking-[0.12em]
                text-heading
              "
            >
              {card.category.replace(/-/g, " ")}
            </span>
          )}

          {/* DURATION OVER IMAGE */}
          {card.duration && (
            <div
              className="
                absolute bottom-4 left-4
                flex items-center gap-1.5
                rounded-full
                border border-white/20
                bg-black/35
                px-3 py-1.5
                text-[11px]
                font-semibold
                text-white
                shadow-sm
                backdrop-blur-md
              "
            >
              <Clock className="h-3.5 w-3.5" strokeWidth={2} />
              <span>{card.duration}</span>
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col px-5 pb-5 pt-5 sm:px-6 sm:pb-6">
          {/* TITLE */}
          <h2
            className="
              line-clamp-2
              text-[23px]
              font-semibold
              leading-[1.08]
              tracking-[-0.015em]
              text-heading
              transition-colors
              duration-300
              group-hover:text-primary
            "
          >
            {card.title}
          </h2>

          {/* DESCRIPTION */}
          <p
            className="
              mt-3
              line-clamp-2
              flex-1
              text-[14px]
              leading-[1.7]
              text-text-muted
            "
          >
            {card.description}
          </p>

          {/* FOOTER */}
          <div
            className="
              flex
              items-end
              justify-between
              gap-4
              pt-4
            "
          >
            {/* Small premium indication */}
            <div className="min-w-0">
              <span
                className="
                  block text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.12em]
                  text-text-muted
                "
              >
                {locale === "fr"
                  ? "Expérience"
                  : locale === "es"
                    ? "Experiencia"
                    : "Experience"}
              </span>

              <span className="mt-0.5 block text-xs font-medium text-heading-soft">
                Marrakech
              </span>
            </div>

            {/* PRICE */}
            {card.price != null && (
              <div className="shrink-0 text-right">
                <span className="block text-[10px] font-medium text-text-muted">
                  {PRICE_LABEL[locale]}
                </span>

                <div className="mt-0.5 flex items-baseline justify-end gap-1">
                  <span
                    className="
                      text-[21px]
                      font-extrabold
                      leading-none
                      tracking-[-0.02em]
                      text-heading
                    "
                  >
                    ${card.price}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* FAVORITE BUTTON */}
      <div className="absolute right-2 top-2 z-20">
        <FavoriteButton id={card.id} type="activity" />
      </div>
    </article>
  );
}
