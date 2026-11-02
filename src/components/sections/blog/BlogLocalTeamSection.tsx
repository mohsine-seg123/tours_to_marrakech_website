import Image from "next/image";
import { Link } from "@/i18n/routing";
import { ArrowUpRight, MapPin } from "lucide-react";

type Locale = "en" | "fr" | "es";

type GuidePhoto = {
  src: string;
  alt: string;
};

type Props = {
  locale: Locale;
  photos: [GuidePhoto, GuidePhoto];
  featuredTourSlug?: string;
};

const CONTENT = {
  en: {
    eyebrow: "THE PEOPLE BEHIND YOUR JOURNEY",
    title: "Discover Morocco with",
    highlight: "Our Local Team",
    description:
      "Travel is about the people you meet along the way. Get to know our local team and the authentic experiences we share with travelers across Morocco.",
    location: "Based in Morocco",
    about: "Meet Our Team",
    tours: "Explore Our Tours",
    photoLabel: "Real moments from our journeys",
  },
  fr: {
    eyebrow: "LES VISAGES DERRIÈRE VOTRE VOYAGE",
    title: "Découvrez le Maroc avec",
    highlight: "Notre équipe locale",
    description:
      "Un voyage se découvre aussi à travers les rencontres. Faites connaissance avec notre équipe locale et les expériences authentiques que nous partageons avec nos voyageurs.",
    location: "Basés au Maroc",
    about: "Rencontrer notre équipe",
    tours: "Découvrir nos circuits",
    photoLabel: "De vrais moments de nos voyages",
  },
  es: {
    eyebrow: "LAS PERSONAS DETRÁS DE TU VIAJE",
    title: "Descubre Marruecos con",
    highlight: "Nuestro equipo local",
    description:
      "Viajar también significa conocer personas. Descubre nuestro equipo local y las experiencias auténticas que compartimos con viajeros de todo el mundo.",
    location: "Estamos en Marruecos",
    about: "Conoce a nuestro equipo",
    tours: "Explorar nuestros tours",
    photoLabel: "Momentos reales de nuestros viajes",
  },
};

export default function BlogLocalTeamSection({
  locale,
  photos,
  featuredTourSlug,
}: Props) {
  const t = CONTENT[locale];

  return (
    <section
      aria-labelledby="blog-local-team-title"
      className="py-6 sm:py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl ">
        <div
          className="
            grid items-center gap-7
            lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]
            lg:gap-10
          "
        >
          {/* LEFT CONTENT */}
          <div className="max-w-xl">
            {/* EYEBROW */}
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-primary">
              {t.eyebrow}
            </p>

            {/* TITLE */}
            <h2
              id="blog-local-team-title"
              className="
                font-heading text-[34px] font-semibold
                leading-[1.08] tracking-tight text-heading
                sm:text-[42px] lg:text-[46px]
              "
            >
              {t.title} <span className="text-primary">{t.highlight}</span>
            </h2>

            {/* DESCRIPTION */}
            <p
              className="
                mt-3 max-w-lg text-sm leading-[1.85]
                text-text-secondary sm:text-[15px]
              "
            >
              {t.description}
            </p>

            {/* LOCATION */}
            <div className="mt-4 flex items-center gap-2">
              <MapPin aria-hidden="true" className="size-3.5 text-primary" />

              <span className="text-xs font-medium text-heading-soft">
                {t.location}
              </span>
            </div>

            {/* LINKS */}
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/about"
                className="
                  group inline-flex items-center gap-1.5
                  text-sm font-semibold text-primary
                  transition-colors hover:text-primary-hover
                  focus-visible:outline-2
                  focus-visible:outline-offset-4
                "
              >
                {t.about}

                <ArrowUpRight
                  aria-hidden="true"
                  className="
                    size-4 transition-transform
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                  "
                />
              </Link>

              <Link
                href={
                  featuredTourSlug
                    ? {
                        pathname: "/tours/[slug]" as const,
                        params: { slug: featuredTourSlug },
                      }
                    : "/tours"
                }
                className="
                  group inline-flex items-center gap-1.5
                  text-sm font-medium text-heading
                  transition-colors hover:text-primary
                  focus-visible:outline-2
                  focus-visible:outline-offset-4
                "
              >
                {t.tours}

                <ArrowUpRight
                  aria-hidden="true"
                  className="
                    size-4 transition-transform
                    group-hover:translate-x-0.5
                    group-hover:-translate-y-0.5
                  "
                />
              </Link>
            </div>
          </div>

          {/* RIGHT PHOTOS */}
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative h-48 overflow-hidden rounded-lg sm:h-56 lg:h-70">
                <Image
                  src={photos[0].src}
                  alt={photos[0].alt}
                  fill
                  sizes="(min-width: 1024px) 18vw, 45vw"
                  className="object-cover"
                />
              </div>

              <div className="relative h-48 overflow-hidden rounded-lg sm:h-56 lg:h-70">
                <Image
                  src={photos[1].src}
                  alt={photos[1].alt}
                  fill
                  sizes="(min-width: 1024px) 18vw, 45vw"
                  className="object-cover"
                />
              </div>
            </div>

            <p className="mt-2 text-center text-[11px] text-text-muted">
              {t.photoLabel}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
