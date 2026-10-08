import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getBlogDetail,
  getAllBlogSlugs,
  getAlternateBlogSlugsBySlug,
  type Locale,
  getBlogCards,
} from "@/lib/supabase/blogs";
import { RegisterAlternateSlugs } from "@/components/RegisterAlternaternateSlugs";
import {BlogFaqAccordion} from "@/components/sections/blog/BlogFaqAccordion";
import ContactForm from "@/components/sections/Contact/ContactForms";
import { getToursByCity } from "@/lib/supabase/tours";
import { TourCard } from "@/components/sections/tours/TourCard";
import TourHelpSection from "@/components/ui/TourHelpSection";
import { getPathname,Link } from "@/i18n/routing";
import BlogSeo from "@/components/seo/BlogSeo";
import { CalendarDays, Clock3, ArrowUpRight } from "lucide-react";

export const revalidate = 3600;


interface BlogDetailPageProps {
  params: Promise<{ locale: Locale; slug: string }>;
}


export async function generateStaticParams() {
  const locales: Locale[] = ["en", "fr", "es"];
  const paramsList: { locale: Locale; slug: string }[] = [];

  for (const locale of locales) {
    const slugs = await getAllBlogSlugs(locale);
    slugs.forEach((slug) => {
      paramsList.push({ locale, slug });
    });
  }
  return paramsList;
}




export async function generateMetadata({params,}: BlogDetailPageProps): Promise<Metadata> {

  const { locale, slug } = await params;

  const blog = await getBlogDetail(locale, slug);

  if (!blog) {
    notFound();
  }

  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://toursmarrakechdesert.com"
  ).replace(/\/+$/, "");

  const canonicalUrl = new URL(
    getPathname({
      locale,
      href: {
        pathname: "/blog/[slug]",
        params: { slug: blog.slug },
      },
    }),
    baseUrl,
  ).href;

  const alternateSlugs = await getAlternateBlogSlugsBySlug(locale, slug);

  // Only include existing translations
  const languages: Record<string, string> = {
    [locale]: canonicalUrl,
  };

  if (alternateSlugs?.en) {
    languages.en = `${baseUrl}/blog/${alternateSlugs.en}`;

    languages["x-default"] = languages.en;
  }

  if (alternateSlugs?.fr) {
    languages.fr = `${baseUrl}/fr/blog/${alternateSlugs.fr}`;
  }

  if (alternateSlugs?.es) {
    languages.es = `${baseUrl}/es/blog/${alternateSlugs.es}`;
  }

  const title = blog.seoTitle?.trim() || blog.title;

  const description = blog.seoDescription?.trim() || `Read ${blog.title} on Tours Marrakech Desert.`;

  const images = blog.coverImage
    ? [
        {
          url: blog.coverImage,
          alt: blog.altImage || blog.title,
        },
      ]
    : [];

  return {
    title,
    description,
    keywords: blog.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Tours Marrakech Desert",
      type: "article",
      locale: locale === "fr" ? "fr_FR" : locale === "es" ? "es_ES" : "en_US",
      images,
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@toursmarrakechdesert",
      images: blog.coverImage ? [blog.coverImage] : [],
    },
  };
}




function fixDuplicateBlogHeading(html: string,title: string,locale: Locale,): string {

  const normalize = (value: string) =>
    value
      .replace(/<[^>]*>/g, "")
      .replace(/&amp;/gi, "&")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

  const firstH2 = html.match(/^(\s*)<h2\b[^>]*>([\s\S]*?)<\/h2>/i);

  if (!firstH2) return html;

  // Ne modifier que si le premier H2 répète le H1
  if (normalize(firstH2[2]) !== normalize(title)) {
    return html;
  }

  const headings: Record<Locale, string> = {
    en: " Travel Insights by Tours Marrakech Desert",
    fr: " Conseils de voyage par Tours Marrakech Desert",
    es: " Consejos de viaje de Tours Marrakech Desert",
  };

  return html.replace(firstH2[0], `${firstH2[1]}<h2>${headings[locale]}</h2>`);
}


export default async function BlogDetailPage({ params }: BlogDetailPageProps) {

  const { locale, slug } = await params;

  const [blog, blogCardsData, alternateSlugs, tours] = await Promise.all([
    getBlogDetail(locale, slug),
    getBlogCards(locale, 1, 4),
    getAlternateBlogSlugsBySlug(locale, slug),
    getToursByCity(locale, "marrakech", 3)
    ]);

  if (!blog) {
    notFound();
  }

  const recentBlogs = Array.isArray(blogCardsData) ? blogCardsData : blogCardsData?.cards || [];

  const blogContent = fixDuplicateBlogHeading(blog.content, blog.title, locale);

  return (
    <>
      {/* Transmet les slugs FR/EN/ES équivalents au LanguageSwitcher */}
      <RegisterAlternateSlugs slugs={alternateSlugs} />

      <BlogSeo blog={blog} locale={locale} alternateSlugs={alternateSlugs} />

      <article className="min-h-screen bg-background pb-20 text-foreground">
        <section className="relative w-full overflow-hidden bg-slate-950 py-20 lg:py-22">
          <Image
            src={blog.coverImage}
            alt={blog.altImage || blog.title}
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/20 to-black/10" />

          <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 text-left text-white">
            <div className="max-w-3xl">
              <Link
                href={`/blog`}
                className="mb-6 inline-flex items-center gap-2 text-xs font-medium text-slate-200 hover:text-white transition-colors"
              >
                <span>←</span>blogs
              </Link>

              <div className="mb-4">
                <span className="inline-block rounded-full bg-white/15 backdrop-blur-md px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-slate-100 border border-white/15">
                  tours marrakech desert
                </span>
              </div>

              <h1 className="font-serif text-3xl font-medium sm:text-4xl lg:text-5xl leading-tight sm:leading-tight lg:leading-snug text-white drop-shadow-md mb-4">
                {blog.title}
              </h1>

              {blog.seoDescription && (
                <p className="max-w-2xl text-sm sm:text-base text-slate-200 font-normal leading-relaxed mb-6 drop-shadow-sm">
                  {blog.seoDescription}
                </p>
              )}

              {/* Publication date and reading time */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-200 font-medium mb-6">
                {blog.created_at && (
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />

                    <time dateTime={blog.created_at}>
                      {new Intl.DateTimeFormat(
                        locale === "fr"
                          ? "fr-FR"
                          : locale === "es"
                            ? "es-ES"
                            : "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          timeZone: "UTC",
                        },
                      ).format(new Date(blog.created_at))}
                    </time>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" />
                  <span>{blog.timeread}</span>
                </div>
              </div>

              {/* Get a Free Quote */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold  text-slate-950 shadow-lg transition-all duration-300 hover:bg-primary/50 hover:text-white hover:-translate-y-0.5"
                >
                  {locale === "fr" ? "Une question ? Contactez-nous !" : locale === "es" ? "¿Tienes preguntas? ¡Consúltanos!"  : "Have Questions? Ask Us!"}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN LAYOUT (CONTENU + SIDEBAR CTA) */}
        <div className="mx-auto max-w-7xl mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="min-w-0 lg:col-span-8">
              <div
                className="blog-content prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: blogContent }}
              />

              {blog.faq && blog.faq.length > 0 && (
                <section className="mt-16">
                  <h2 className="text-2xl font-bold tracking-tight mb-8">
                    FAQ
                  </h2>
                  <BlogFaqAccordion faq={blog.faq} />
                </section>
              )}
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <ContactForm />
                <div className="flex items-center justify-between pb-3 border-b border-border/80">
                  <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground">
                    More Blogs
                  </h2>
                  <Link
                    href={`/blog`}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                  >
                    View all
                  </Link>
                </div>

                <div className="space-y-6">
                  {recentBlogs.map((item) => (
                    <Link
                      key={item.id || item.slug}
                      href={{
                        pathname: "/blog/[slug]",
                        params: { slug: item.slug },
                      }}
                      className="group flex items-center gap-4 transition-all"
                    >
                      {/* Image miniature */}
                      <div className="relative h-30 w-30 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                        <Image
                          src={item.coverImage}
                          alt={item.altImage || item.title}
                          fill
                          sizes="80px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1 truncate">
                          {item.category || "Morocco Travel Tips"}
                        </span>

                        <h3 className="font-serif text-xl font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-1">
                          {item.title}
                        </h3>

                        <span className="block text-xs text-muted-foreground/70">
                          {item.timeread || item.date || "5 min read"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
          <section className="mt-10">
            {/* Section heading */}
            <div className="mb-6 flex items-end justify-between gap-4">
              <div className="max-w-2xl">
                <h2 className="font-heading text-3xl font-semibold leading-tight text-primary sm:text-4xl lg:text-5xl">
                  Tours Marrakech Desert
                </h2>
              </div>

              <Link
                href="/tours"
                locale={locale}
                className="group inline-flex shrink-0 items-center gap-2 border-b border-border pb-1 text-sm font-semibold text-heading transition-colors hover:border-primary hover:text-primary"
              >
                All tours
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>

            {/* Tours */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tours.map((card) => (
                <TourCard key={card.id} card={card} locale={locale} />
              ))}
            </div>

            <TourHelpSection locale={locale} />
          </section>
        </div>
      </article>
    </>
  );
}
