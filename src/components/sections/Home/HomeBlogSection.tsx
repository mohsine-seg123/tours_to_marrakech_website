import Image from "next/image";
import Link from "next/link";
import { getBlogCards, type Locale } from "@/lib/supabase/blogs";

interface HomeBlogSectionProps {
  locale: Locale;
}


const SECTION_TEXTS: Record<
  Locale,
  {
    title: string;
    viewAll: string;
    description: string;
    readTime: string;
  }
> = {
  en: {
    title: "Explore Our Travel Blog",
    viewAll: "View all posts",
    description:
      "Discover expert tips, travel guides, and inspiration to make the most of your journey through Morocco.",
    readTime: "read",
  },
  fr: {
    title: "Explorez Notre Blog de Voyage",
    viewAll: "Voir tous les articles",
    description:
      "Découvrez nos conseils, guides et inspirations pour profiter pleinement de votre voyage au Maroc.",
    readTime: "de lecture",
  },
  es: {
    title: "Explora Nuestro Blog de Viajes",
    viewAll: "Ver todos los artículos",
    description:
      "Descubre consejos, guías e inspiración para disfrutar al máximo de tu viaje por Marruecos.",
    readTime: "de lectura",
  },
};



export default async function HomeBlogSection({locale,}: HomeBlogSectionProps) {

  const{cards }= await getBlogCards(locale,1, 4);
  const texts = SECTION_TEXTS[locale] ?? SECTION_TEXTS.en;


  if (!cards || cards.length === 0) return null;

  return (
    <section className="bg-background transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 items-end gap-6 lg:grid-cols-12 lg:gap-12">
          {/* Titre & Lien */}
          <div className="lg:col-span-6">
            <h2 className=" font-heading text-2xl lg:text-3xl font-bold tracking-tight text-heading">
              {texts.title}
            </h2>
            <Link
              href={`/${locale}/blog`}
              className="group mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
            >
              <span>{texts.viewAll}</span>
              <svg
                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>

          {/* Paragraphe descriptif */}
          <div className="lg:col-span-6">
            <p className="text-base sm:text-xl leading-relaxed text-text-secondary">
              {texts.description}
            </p>
          </div>
        </div>

        {/* ── GRILLE DE 4 CARTES ── */}
        <div className="grid grid-cols-1 gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.id}
              href={`/${locale}/blog/${card.slug}`}
              className="group block h-full"
            >
              <article className="flex h-full flex-col">
                {/* Image */}
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={card.coverImage}
                    alt={card.altImage || card.title}
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />

                  {/* Subtle image overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/5 opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Reading time */}
                  <div className="absolute left-3 top-3">
                    <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-[11px] font-medium tracking-wide text-white shadow-lg backdrop-blur-md">
                      <svg
                        className="h-3.5 w-3.5 text-white/90"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <circle cx="12" cy="12" r="9.5" />
                        <polyline points="12 6.5 12 12 15.5 14" />
                      </svg>

                      <span>{card.timeread}</span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div
                    className="
          absolute bottom-3 right-3
          flex h-10 w-10 items-center justify-center
          rounded-full
          bg-white/95 text-heading
          shadow-lg
          opacity-0 translate-y-2
          transition-all duration-300
          group-hover:translate-y-0
          group-hover:opacity-100
        "
                  >
                    <svg
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M13 6l6 6-6 6"
                      />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col pt-5">
                  <h3
                    className="
          font-heading
          text-[19px] font-semibold
          leading-[1.35]
          tracking-[-0.015em]
          text-heading
          transition-colors duration-300
          group-hover:text-primary
          line-clamp-2
        "
                  >
                    {card.title}
                  </h3>

                  <p
                    className="
          mt-2.5
          line-clamp-2
          text-[14px]
          leading-6
          text-text-secondary
        "
                  >
                    {card.description}
                  </p>

                  {/* Read article */}
                  <div
                    className="
          mt-4 flex items-center gap-2
          text-xs font-semibold uppercase
          tracking-[0.12em]
          text-heading
          transition-colors duration-300
          group-hover:text-primary
        "
                  >
                    <span>
                      {locale === "fr"
                        ? "Lire l’article"
                        : locale === "es"
                          ? "Leer artículo"
                          : "Read article"}
                    </span>

                    <svg
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 12h14M13 6l6 6-6 6"
                      />
                    </svg>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
