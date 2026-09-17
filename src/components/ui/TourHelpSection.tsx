import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Link } from "@/i18n/routing";

type Locale = "en" | "fr" | "es";

type TourHelpSectionProps = {
  locale: Locale;
};

export default function TourHelpSection({ locale }: TourHelpSectionProps) {
  const content = {
    en: {
      label: "Free travel advice",
      title: "Have a question about one of our tours?",
      description:
        "Ask us about the itinerary, accommodation, transport, desert camps, prices or possible changes. We'll help you understand your options before you book — completely free and with no obligation.",
      freeAdvice: "Free advice",
      noBooking: "No booking required",
      personalAnswers: "Personal answers",
      helpText: "Need help choosing the right itinerary?",
      button: "Ask about a tour",
      noObligation: "No obligation to book.",
    },

    fr: {
      label: "Conseils voyage gratuits",
      title: "Une question sur l'un de nos circuits ?",
      description:
        "Posez-nous vos questions sur l'itinéraire, l'hébergement, le transport, les camps dans le désert, les prix ou les modifications possibles. Nous vous aiderons à comprendre vos options avant de réserver — gratuitement et sans engagement.",
      freeAdvice: "Conseils gratuits",
      noBooking: "Aucune réservation requise",
      personalAnswers: "Réponses personnalisées",
      helpText: "Besoin d'aide pour choisir le bon itinéraire ?",
      button: "Poser une question sur un circuit",
      noObligation: "Sans obligation de réserver.",
    },

    es: {
      label: "Asesoramiento de viaje gratuito",
      title: "¿Tienes alguna pregunta sobre uno de nuestros tours?",
      description:
        "Pregúntanos sobre el itinerario, el alojamiento, el transporte, los campamentos en el desierto, los precios o posibles cambios. Te ayudaremos a entender tus opciones antes de reservar — totalmente gratis y sin compromiso.",
      freeAdvice: "Asesoramiento gratuito",
      noBooking: "No es necesario reservar",
      personalAnswers: "Respuestas personalizadas",
      helpText: "¿Necesitas ayuda para elegir el itinerario adecuado?",
      button: "Preguntar sobre un tour",
      noObligation: "Sin obligación de reservar.",
    },
  };

  const t = content[locale];

  return (
    <section className="mt-16">
      <div className="rounded-xl border border-primary/60 bg-muted px-6 py-10 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-center">
          {/* LEFT */}
          <div className="max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              {t.label}
            </p>

            <h2 className="font-heading text-3xl font-semibold leading-tight text-heading sm:text-4xl">
              {t.title}
            </h2>

            <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary">
              {t.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-secondary">
              <span>{t.freeAdvice}</span>

              <span className="text-text-muted">•</span>

              <span>{t.noBooking}</span>

              <span className="text-text-muted">•</span>

              <span>{t.personalAnswers}</span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:min-w-[260px] lg:border-l lg:border-border lg:pl-10">
            <p className="text-sm leading-6 text-text-secondary">
              {t.helpText}
            </p>

            <Link
              href="/contact"
              locale={locale}
              className="group mt-5 inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              <MessageCircle className="h-5 w-5" />

              {t.button}

              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>

            <p className="mt-3 text-xs text-text-muted">{t.noObligation}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
