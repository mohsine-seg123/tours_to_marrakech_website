import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getAllTours, type Locale } from "@/lib/supabase/tours";
import TourCard from "@/components/sections/tours/TourCard";

const CONTENT = {
  en: {
    label: "YOUR JOURNEY THROUGH MOROCCO",
    title: "morocco tour package",
    description:
      "From the streets of Marrakech to the dunes of Merzouga, find a route that matches your travel plans. Compare itineraries, trip durations and departure cities to choose your next Moroccan adventure.",
    empty: "No tours are available in this language at the moment.",
  },
  fr: {
    label: "VOTRE VOYAGE À TRAVERS LE MAROC",
    title: "voyage au maroc circuit",
    description:
      "Des ruelles de Marrakech aux dunes de Merzouga, trouvez un circuit adapté à vos envies. Comparez les itinéraires, les durées et les villes de départ pour préparer votre prochaine aventure au Maroc.",
    empty: "Aucun circuit n’est disponible dans cette langue pour le moment.",
  },
  es: {
    label: "TU VIAJE POR MARRUECOS",
    title: "Tours por Marruecos",
    description:
      "Desde las calles de Marrakech hasta las dunas de Merzouga, encuentra una ruta que se ajuste a tus planes. Compara itinerarios, duraciones y ciudades de salida para preparar tu próxima aventura por Marruecos.",
    empty: "Por el momento no hay tours disponibles en este idioma.",
  },
} satisfies Record<
  Locale,
  { label: string; title: string; description: string; empty: string }
>;


function isLocale(value: string): value is Locale {
  return value === "en" || value === "fr" || value === "es";
}

export default async function ToursPage({ params,}: {params: Promise<{ locale: string }>;}) {

  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const t = CONTENT[locale];
  const tours = await getAllTours(locale);

  return (
    <section
      className="min-h-screen bg-background"
      aria-labelledby="tours-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* PRÉSENTATION */}
        <header className="mx-auto mb-12 max-w-3xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            {t.label}
          </p>

          <h1
            id="tours-heading"
            className=" text-4xl font-semibold leading-tight tracking-tight text-heading sm:text-5xl lg:text-6xl"
          >
            {t.title}
          </h1>

          <p className="mt-5 text-[15px] leading-8 text-text-secondary sm:text-base">
            {t.description}
          </p>
        </header>

        {/* CIRCUITS */}
        {tours.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tours.map((card) => (
              <TourCard key={card.id} card={card} locale={locale} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-border bg-card px-6 py-12 text-center text-text-secondary">
            {t.empty}
          </p>
        )}
      </div>
    </section>
  );
}
