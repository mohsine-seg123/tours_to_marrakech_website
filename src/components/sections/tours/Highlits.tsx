import type { Locale, TourDetail } from "@/lib/supabase/tours";
import { Minus } from "lucide-react";

const TITLES = {
  en: "Tour highlights",
  fr: "Les points forts du circuit",
  es: "Lo más destacado del circuito",
} satisfies Record<Locale, string>;

type HighlitsProps = {
  highlights: TourDetail["highlights"];
  locale: Locale;
};

export default function Highlits({ highlights, locale }: HighlitsProps) {
  if (!highlights?.length) return null;

  return (
    <section className="mt-12" aria-labelledby="tour-highlights-heading">
      <h2
        id="tour-highlights-heading"
        className="text-3xl font-semibold leading-tight tracking-tight text-primary sm:text-4xl"
      >
        {TITLES[locale]}
      </h2>

      <ul className="mt-6 space-y-3">
        {highlights.map((highlight, index) => (
          <li
            key={`${index}-${highlight}`}
            className="flex items-start gap-4 text-[15px] leading-7 text-text-secondary"
          >
            <span aria-hidden="true" className="shrink-0 text-primary">
              <Minus className="size-5" />
            </span>

            <span className="min-w-0 text-xl break-words">{highlight}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
