import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/supabase/blogs";

export interface BlogCardData {
  id: string;
  slug: string;
  title: string;
  keywords?: string | string[];
  description: string;
  coverImage: string;
  altImage?: string;
  timeread: string;
  createdAt?: string;
}

interface BlogCardHorizontalProps {
  card: BlogCardData;
  locale: Locale;
}

export function BlogCard({ card, locale }: BlogCardHorizontalProps) {
  
  // Parsing sécurisé des mots-clés (qu'ils soient sous forme de chaîne JSON ou de tableau)
  let parsedKeywords: string[] = [];
  if (Array.isArray(card.keywords)) {
    parsedKeywords = card.keywords;
  } else if (typeof card.keywords === "string") {
    try {
      parsedKeywords = JSON.parse(card.keywords);
    } catch {
      parsedKeywords = card.keywords.split(",").map((k) => k.trim());
    }
  }



  return (
    <Link
      href={`/${locale}/blog/${card.slug}`}
      className="group relative flex flex-col md:flex-row gap-6 lg:gap-8"
    >
  

      <div className="relative aspect-[4/3] w-full md:w-[280px] lg:w-[320px] flex-shrink-0 overflow-hidden rounded-xl bg-muted">
        <Image
          src={card.coverImage}
          alt={card.altImage || card.title}
          fill
          sizes="(min-width: 1024px) 320px, (min-width: 768px) 280px, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>

      {/* 📝 CONTENU TEXTE (À droite sur Desktop) */}
      <div className="flex flex-1 flex-col justify-between py-1">
        <div className="space-y-2.5">
          {/* Méta : Temps de lecture & Date */}
          <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
            <svg
              className="h-3.5 w-3.5 text-primary/80"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{card.timeread}</span>
          </div>

          {/* Titre avec Police Cormorant (--font-heading) */}
          <h2 className="font-heading text-2xl sm:text-3xl font-bold leading-tight tracking-tight text-heading transition-colors duration-200 group-hover:text-primary line-clamp-2">
            {card.title}
          </h2>

          {/* Description courte */}
          <p className="text-sm sm:text-base leading-relaxed text-text-secondary line-clamp-3">
            {card.description}
          </p>
        </div>

        {/* 🏷️ TAGS / KEYWORDS (Pills en bas) */}
        {parsedKeywords.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 pt-2">
            {parsedKeywords.slice(0, 5).map((keyword, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-md border border-border/60 bg-muted/70 px-2.5 py-1 text-xs font-medium text-text-secondary transition-colors group-hover:border-primary/20 group-hover:bg-surface-soft"
              >
                {keyword.toLowerCase()}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
