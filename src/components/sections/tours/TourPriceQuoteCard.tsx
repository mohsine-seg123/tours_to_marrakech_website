import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import type { Locale } from "@/lib/supabase/tours";

type TourPriceQuoteCardProps = {
  price?: number | null;
  locale: Locale;
};

const LABELS = {
  en: {
    heading: "Your Private Morocco Journe",
    badge: "Flexible pricing",
    from: "Starting from",
    perPerson: "per person",
    description:
      "Indicative price. Your final quote is tailored to your group size, travel dates and selected accommodation.",
    button: "Get a Personalized Quote",
    trust: "Free quote · No booking obligation",
  },
  fr: {
    heading: "Votre voyage privé au Maroc",
    badge: "Tarif flexible",
    from: "À partir de",
    perPerson: "par personne",
    description:
      "Prix indicatif. Votre devis final est personnalisé selon le nombre de voyageurs, les dates et l’hébergement choisi.",
    button: "Obtenir un devis personnalisé",
    trust: "Devis gratuit · Sans engagement",
  },
  es: {
    heading: "Tu viaje privado por Marruecos",
    badge: "Precio flexible",
    from: "Desde",
    perPerson: "por persona",
    description:
      "Precio orientativo. El presupuesto final se adapta al número de viajeros, las fechas y el alojamiento elegido.",
    button: "Solicitar presupuesto personalizado",
    trust: "Presupuesto gratis · Sin compromiso",
  },
} satisfies Record<
  Locale,
  {
    heading: string;
    badge: string;
    from: string;
    perPerson: string;
    description: string;
    button: string;
    trust: string;
  }
>;

export default function TourPriceQuoteCard({price,locale,}: TourPriceQuoteCardProps) {

  const t = LABELS[locale];

  const formattedPrice =
    price != null
      ? new Intl.NumberFormat(
          locale === "fr" ? "fr-FR" : locale === "es" ? "es-ES" : "en-IE",
          {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
          },
        ).format(price)
      : null;

  return (
    <section
      aria-label={t.heading}
      className="
        w-full rounded-2xl border border-border
        bg-card p-5 text-heading
        shadow-lg shadow-heading/5
        sm:p-6
      "
    >
      {/* HEADER */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span
          className="
            text-[10px] font-bold uppercase
            tracking-[0.12em] text-heading-soft
          "
        >
          {t.heading}
        </span>

        <span
          className="
            rounded-full bg-gold-muted
            px-2.5 py-1
            text-[10px] font-semibold text-gold-soft
          "
        >
          {t.badge}
        </span>
      </div>

      {/* PRICE */}
      {formattedPrice && (
        <>
          <div className="border-t border-border pt-4">
            <p className="mb-2 text-xs font-medium text-heading-soft">
              {t.from}
            </p>

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span
                className="
                  font-body text-[38px]
                  font-extrabold leading-none
                  tracking-tight text-heading
                  sm:text-[42px]
                "
              >
                {formattedPrice}
              </span>

              <span className="text-xs font-medium text-heading-soft">
                {t.perPerson}
              </span>
            </div>
          </div>

          {/* PRICING INFORMATION */}
          <div
            className="
              mt-5 rounded-lg border-primary
              bg-surface-soft px-3.5 py-3
            "
          >
            <p className="text-xs leading-[1.7] text-text-secondary">
              {t.description}
            </p>
          </div>
        </>
      )}

      {/* QUOTE BUTTON */}
      <a
        href="#tour-inquiry"
        className="
          group mt-5 flex min-h-12
          items-center justify-center gap-2
          rounded-lg bg-primary px-4 py-3.5
          text-center text-sm font-bold
          text-primary-foreground
          transition-colors duration-200
          hover:bg-primary-hover
          focus-visible:outline-2
          focus-visible:outline-offset-4
          focus-visible:outline-primary
        "
      >
        <span>{t.button}</span>

        <ArrowUpRight
          aria-hidden="true"
          className="
            size-4 shrink-0
            transition-transform duration-200
            group-hover:translate-x-0.5
            group-hover:-translate-y-0.5
          "
        />
      </a>

      {/* TRUST MESSAGE */}
      <div className="mt-3 flex items-center justify-center gap-1.5 text-center">
        <CheckCircle2
          aria-hidden="true"
          className="size-3.5 shrink-0 text-gold-soft"
        />

        <p className="text-[11px] leading-relaxed text-heading-soft">
          {t.trust}
        </p>
      </div>
    </section>
  );
}
