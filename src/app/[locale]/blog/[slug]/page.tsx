import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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

  if (!blog) return {};

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toursmarrakechdesert.com";
  const canonicalUrl = `${baseUrl}/${locale}/blog/${blog.slug}`;

  const alternateSlugs = await getAlternateBlogSlugsBySlug(locale, slug);

  return {
    title: blog.seoTitle || blog.title,
    description: blog.seoDescription,
    keywords: blog.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: alternateSlugs
        ? {
            en: `${baseUrl}/blog/${alternateSlugs.en}`,
            fr: `${baseUrl}/fr/blog/${alternateSlugs.fr}`,
            es: `${baseUrl}/es/blog/${alternateSlugs.es}`,
            "x-default": `${baseUrl}/blog/${alternateSlugs.en}`,
          }
        : undefined,
    },
    openGraph: {
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription,
      url: canonicalUrl,
      siteName: "tours marrakech desert",
      images: [
        {
          url: blog.coverImage,
          width: 1200,
          height: 630,
          alt: blog.altImage || blog.title,
        },
      ],
      locale: locale === "fr" ? "fr_FR" : locale === "es" ? "es_ES" : "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription,
      images: [blog.coverImage],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {

  const { locale, slug } = await params;
  const [blog, blogCardsData, alternateSlugs] = await Promise.all([
    getBlogDetail(locale, slug),
    getBlogCards(locale, 1, 4),
    getAlternateBlogSlugsBySlug(locale, slug),
  ]);

  if (!blog) {
    notFound();
  }

  const recentBlogs = Array.isArray(blogCardsData) ? blogCardsData : blogCardsData?.cards || [];

  // Schema.org Article JSON-LD (SEO Google)
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.seoDescription,
    "keywords": blog.keywords,
    articleSection: "Travel",
    image: [blog.coverImage],
    inLanguage: locale,
    author: {
      "@type": "Organization",
      name: "tours marrakech desert",
    },
    publisher: {
      "@type": "Organization",
      name: "tours marrakech desert",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/logo.png`,
      },
    },
  };

  // Schema.org FAQ JSON-LD (Rich Snippets Google)
  const faqJsonLd =
    blog.faq && blog.faq.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: blog.faq.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {/* Transmet les slugs FR/EN/ES équivalents au LanguageSwitcher */}
      <RegisterAlternateSlugs slugs={alternateSlugs} />

      {/* Intégration des Données Structurées JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

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
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-black/10" />

          <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 text-left text-white">
            <div className="max-w-3xl">
              <Link
                href={`/${locale}/blog`}
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

              {/* 5. Méta-informations (Auteur, Temps de lecture) */}
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 font-medium">
                <span>{blog.timeread}</span>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN LAYOUT (CONTENU + SIDEBAR CTA) */}
        <div className="mx-auto max-w-7xl mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <main className="min-w-0 lg:col-span-8">
              <div
                className="blog-content prose prose-lg dark:prose-invert max-w-none
    [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-extrabold [&_h2]:text-foreground [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:tracking-tight [&_h2]:pb-2
    /* Titres H3 */
    [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3
    /* Paragraphes */
    [&_p]:text-base [&_p]:sm:text-lg [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-6
    /* Listes à puces (UL) */
    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-3 [&_ul]:text-muted-foreground
    /* Listes numérotées (OL) */
    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-3 [&_ol]:text-muted-foreground
    /* Éléments de liste (LI) */
    [&_li]:text-base [&_li]:sm:text-lg [&_li]:leading-relaxed [&_li]:marker:text-primary
    /* Textes en gras (STRONG) */
    [&_strong]:font-semibold [&_strong]:text-foreground
    /* Liens (A) */
    [&_a]:text-primary [&_a]:font-medium [&_a]:underline underline-offset-4 hover:[&_a]:opacity-80 transition"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />

              {/* SECTION FAQ (Rendu si présent) */}
              {blog.faq && blog.faq.length > 0 && (
                <section className="mt-16">
                  <h2 className="text-2xl font-bold tracking-tight mb-8">
                    FAQ
                  </h2>
                  <BlogFaqAccordion faq={blog.faq} />
                </section>
              )}
            </main>

            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <ContactForm />
                <div className="flex items-center justify-between pb-3 border-b border-border/80">
                  <h3 className="font-serif text-2xl font-medium tracking-tight text-foreground">
                    More Blogs
                  </h3>
                  <Link
                    href={`/${locale}/blog`}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                  >
                    View all
                  </Link>
                </div>

                <div className="space-y-6">
                  {recentBlogs.map((item) => (
                    <Link
                      key={item.id || item.slug}
                      href={`/${locale}/blog/${item.slug}`}
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

                        <h4 className="font-serif text-xl font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-1">
                          {item.title}
                        </h4>

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
        </div>
      </article>
    </>
  );
}
