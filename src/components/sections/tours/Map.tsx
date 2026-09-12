import type { Locale, TourDetail } from "@/lib/supabase/tours";

const TITLES = {
  en: "Your route on the map",
  fr: "Votre itinéraire sur la carte",
  es: "Tu itinerario en el mapa",
} satisfies Record<Locale, string>;

type MapProps = {
  tour: Pick<TourDetail, "mapTitle" | "mapUrl">;
  locale: Locale;
};

export default function Map({ tour, locale }: MapProps) {
  if (!tour.mapUrl?.trim()) return null;

  const title = TITLES[locale];

  return (
    <section
      className="my-6 w-full px-4 sm:px-6 lg:px-8"
      aria-labelledby="tour-map-heading"
    >
      <h2
        id="tour-map-heading"
        className="mb-6 text-3xl font-semibold text-primary/90 sm:text-4xl"
      >
        {title}
      </h2>

      <div className="overflow-hidden bg-muted">
        <iframe
          src={tour.mapUrl}
          title={title}
          width="1200"
          height="500"
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="block h-[320px] w-full border-0"
        />
      </div>
    </section>
  );
}
