import { getBlogCards, type Locale } from "@/lib/supabase/blogs";
import { BlogCard } from "@/components/sections/blog/BlogCard";
import { BlogPagination } from "@/components/sections/blog/BlogPagination";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export const revalidate = 3600;

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }, { locale: "es" }];
}

interface BlogPageProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: BlogPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blogs" });

  return {
    title: t("title"),
    description: t("content"),
    alternates: {
      canonical: locale === "en" ? "/blog" : `/${locale}/blog`,
      languages: {
        en: "/blog",
        fr: "/fr/blog",
        es: "/es/blog",
        "x-default": "/blog",
      },
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale } = await params;
  const currentPage = 1;

  const { cards, totalPages } = await getBlogCards(locale, currentPage);
  const t = await getTranslations({ locale, namespace: "blogs" });

  return (
    <section className="bg-background">
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

      <BlogPagination
        locale={locale}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </section>
  );
}
