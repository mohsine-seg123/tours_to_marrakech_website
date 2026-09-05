import { getBlogCards, type Locale } from "@/lib/supabase/blogs";
import { BlogCard } from "@/components/sections/blog/BlogCard";
import { BlogPagination } from "@/components/sections/blog/BlogPagination";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { redirect, notFound } from "next/navigation";

export const revalidate = 3600;

interface PaginatedBlogProps {
  params: Promise<{ locale: Locale; number: string }>;
}

export async function generateMetadata({ params }: PaginatedBlogProps) {
  const { locale, number } = await params;
  const t = await getTranslations({ locale, namespace: "blogs" });
  return {
    title: `${t("title")} - Page ${number}`,
    description: t("content"),
    alternates: {
      canonical: `/${locale}/blog/page/${number}`,
      languages: {
        en: `/en/blog/page/${number}`,
        fr: `/fr/blog/page/${number}`,
        es: `/es/blog/page/${number}`,
        "x-default": `/en/blog/page/${number}`,
      },
    },
  };
}


export default async function PaginatedBlogPage({params,}: PaginatedBlogProps) {
  const { locale, number } = await params;
  const pageNumber = parseInt(number, 10);

  if (pageNumber === 1) {
    redirect(`/${locale}/blog`);
  }

  if (isNaN(pageNumber) || pageNumber < 1) {
    notFound();
  }

  const { cards, totalPages } = await getBlogCards(locale, pageNumber);

  if (cards.length === 0 && pageNumber > 1) {
    notFound();
  }

  const t = await getTranslations({ locale, namespace: "blogs" });

  return (
    <section className="bg-background">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-background">
        <div className="relative min-h-[360px] w-full lg:min-h-[500px]">
          <Image
            src="/images/benhdou.jpeg"
            alt="Ksar of Ait Benhaddou, Morocco"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-black/35" />
          <div className="relative mx-auto flex min-h-[360px] max-w-4xl flex-col items-center justify-center px-4 py-14 text-center sm:px-6 lg:min-h-[500px] lg:px-8">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-200 drop-shadow-md sm:text-sm">
              {t("title")}
            </span>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
              {t("subtitle")}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-100 drop-shadow-md sm:text-base lg:text-lg">
              {t("content")}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16">
        {cards.length === 0 ? (
          <div className="rounded-2xl border border-border/60 bg-card p-12 text-center">
            <p className="text-text-secondary font-medium">No articles yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 sm:gap-16">
            {cards.map((card) => (
              <BlogCard key={card.id} card={card} locale={locale} />
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      <BlogPagination
        locale={locale}
        currentPage={pageNumber}
        totalPages={totalPages}
      />
    </section>
  );
}
