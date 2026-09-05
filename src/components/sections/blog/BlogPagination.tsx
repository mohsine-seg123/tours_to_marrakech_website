// components/blog/BlogPagination.tsx
import Link from "next/link";
import type { Locale } from "@/lib/supabase/blogs";

const LABELS: Record<Locale, { prev: string; next: string }> = {
  en: { prev: "Previous", next: "Next" },
  fr: { prev: "Précédent", next: "Suivant" },
  es: { prev: "Anterior", next: "Siguiente" },
};

interface BlogPaginationProps {
  locale: Locale;
  currentPage: number;
  totalPages: number;
}

export function BlogPagination({
  locale,
  currentPage,
  totalPages,
}: BlogPaginationProps) {
  if (totalPages <= 1) return null;

  const labels = LABELS[locale] ?? LABELS.en;

  // Génère /en/blog pour la page 1 et /en/blog/page/2 pour les pages suivantes
  const pageHref = (page: number) =>
    page <= 1 ? `/${locale}/blog` : `/${locale}/blog/page/${page}`;

  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <nav
      aria-label="Pagination"
      className="mx-auto flex max-w-6xl items-center justify-center gap-2 px-6 pb-24"
    >
      {/* Bouton Précédent */}
      <Link
        href={pageHref(Math.max(1, currentPage - 1))}
        aria-disabled={isFirst}
        tabIndex={isFirst ? -1 : undefined}
        className={`rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-primary hover:text-primary ${
          isFirst ? "pointer-events-none opacity-40" : ""
        }`}
      >
        {labels.prev}
      </Link>

      {/* Numéros de page */}
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Link
            key={page}
            href={pageHref(page)}
            aria-current={page === currentPage ? "page" : undefined}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
              page === currentPage
                ? "bg-primary text-primary-foreground font-medium"
                : "text-text-secondary hover:bg-muted"
            }`}
          >
            {page}
          </Link>
        ))}
      </div>

      {/* Bouton Suivant */}
      <Link
        href={pageHref(Math.min(totalPages, currentPage + 1))}
        aria-disabled={isLast}
        tabIndex={isLast ? -1 : undefined}
        className={`rounded-full border border-border px-4 py-2 text-sm text-text-secondary transition-colors hover:border-primary hover:text-primary ${
          isLast ? "pointer-events-none opacity-40" : ""
        }`}
      >
        {labels.next}
      </Link>
    </nav>
  );
}
