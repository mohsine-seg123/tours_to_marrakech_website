import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";

const CONTENT = {
  en: {
    label: "Contact Tours Marrakech Desert",
    title: "Let’s Plan Your Time in Morocco",
    description:
      "Share your travel dates, group size and the places you’d like to visit. Our local team will help you shape your itinerary and provide a personalised quote.",
    button: "Request a Free Quote on WhatsApp",
    imageAlt: "morocco desert view ",
  },
  es: {
    label: "Contacta con Tours Marrakech Desert",
    title: "Planifiquemos tu viaje a Marruecos",
    description:
      "Cuéntanos cuándo quieres viajar, cuántas personas sois y qué lugares te gustaría visitar. Nuestro equipo local te ayudará a preparar tu itinerario y te enviará un presupuesto personalizado.",
    button: "Solicita un presupuesto gratis por WhatsApp",
    imageAlt: "Vista del desierto de Marruecos",
  },
  fr: {
    label: "Contactez Tours Marrakech Desert",
    title: "Préparons votre voyage au Maroc",
    description:
      "Indiquez-nous vos dates, le nombre de voyageurs et les lieux que vous aimeriez visiter. Notre équipe locale vous aidera à construire votre itinéraire et vous proposera un devis personnalisé.",
    button: "Demander un devis gratuit sur WhatsApp",
    imageAlt:"désert marocain avec des dunes de sable",
  },
};

type ContactHeroProps = {
  numero: string;
  locale: string;
};

export default function ContactHero({numero,locale,}: ContactHeroProps): React.JSX.Element {

  const currentLocale = locale === "fr" || locale === "es" ? locale : "en";
  const t = CONTENT[currentLocale];

  const whatsappUrl = `https://wa.me/${numero}`;

  return (
    <section className="relative w-full overflow-hidden">
      {/* IMAGE */}
      <div className="relative min-h-[360px] w-full lg:min-h-[420px]">
        <Image
          src="/images/desert.jpeg"
          alt={t.imageAlt}
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* DÉGRADÉ */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-secondary/60 via-secondary/5 to-secondary/1"
        />

        {/* CONTENU */}
        <div className="relative mx-auto flex min-h-[360px] max-w-7xl flex-col justify-center px-4 py-14 sm:px-6 lg:min-h-[420px] lg:px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold uppercase tracking-widest text-white">
                {t.label}
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
              {t.title}
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              {t.description}
            </p>

            {/* WHATSAPP */}
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary-hover"
              >
                <FaWhatsapp className="h-4 w-4 shrink-0" aria-hidden="true" />
                {t.button}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
