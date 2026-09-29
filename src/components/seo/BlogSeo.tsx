import type { BlogDetail, Locale } from "@/lib/supabase/blogs";
import { getPathname } from "@/i18n/routing";

interface BlogSeoProps {
  blog: BlogDetail;
  locale: Locale;

  /**
   * Slugs correspondant au même article dans les autres langues.
   */
  alternateSlugs?: Record<Locale, string> | null;

  /**
   * Facultatif.
   * À utiliser quand tu ajouteras created_at à BlogDetail.
   */
  datePublished?: string;

  /**
   * Facultatif.
   * À utiliser si tu ajoutes updated_at dans Supabase.
   */
  dateModified?: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://toursmarrakechdesert.com";

const SITE_NAME = "Tours Marrakech Desert";

const LOGO_URL = `${SITE_URL}/logo.png`;

function absoluteUrl(url?: string): string | undefined {
  if (!url) return undefined;

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return new URL(url, SITE_URL).href;
}

function stripHtml(html?: string): string {
  if (!html) return "";

  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function getLanguage(locale: Locale) {
  switch (locale) {
    case "fr":
      return "fr-FR";

    case "es":
      return "es-ES";

    default:
      return "en-US";
  }
}

function getBlogLabel(locale: Locale) {
  switch (locale) {
    case "fr":
      return "Blog Maroc";

    case "es":
      return "Blog de Marruecos";

    default:
      return "Morocco Travel Blog";
  }
}

export default function BlogSeo({
  blog,
  locale,
  alternateSlugs,
  datePublished,
  dateModified,
}: BlogSeoProps) {
  const pathname = getPathname({
    locale,
    href: {
      pathname: "/blog/[slug]",
      params: {
        slug: blog.slug,
      },
    },
  });

  const canonicalUrl = new URL(pathname, SITE_URL).href;

  const imageUrl = absoluteUrl(blog.coverImage);

  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;
  const blogId = `${SITE_URL}/blog/#blog`;
  const articleId = `${canonicalUrl}#blogposting`;
  const breadcrumbId = `${canonicalUrl}#breadcrumb`;
  const faqId = `${canonicalUrl}#faq`;

  const description = blog.seoDescription?.trim();

  const articleBody = stripHtml(blog.content);

  const alternateUrls = alternateSlugs
    ? {
        en: `${SITE_URL}/blog/${alternateSlugs.en}`,
        fr: `${SITE_URL}/fr/blog/${alternateSlugs.fr}`,
        es: `${SITE_URL}/es/blog/${alternateSlugs.es}`,
      }
    : null;

  const graph: Record<string, unknown>[] = [
    /*
     * ORGANIZATION
     *
     * L'entité principale du site.
     * On réutilise le même @id dans les autres schemas.
     */
    {
      "@type": "Organization",
      "@id": organizationId,

      name: SITE_NAME,
      url: SITE_URL,

      logo: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/#logo`,
        url: LOGO_URL,
        contentUrl: LOGO_URL,
        caption: SITE_NAME,
      },

      image: {
        "@id": `${SITE_URL}/#logo`,
      },

      description:
        "Morocco tour operator offering private desert tours, cultural trips and travel experiences across Morocco.",

      areaServed: {
        "@type": "Country",
        name: "Morocco",
      },

      knowsAbout: [
        "Morocco travel",
        "Morocco desert tours",
        "Marrakech desert tours",
        "Sahara Desert",
        "Morocco itineraries",
        "Morocco travel tips",
        "Marrakech",
        "Merzouga",
        "Fes",
        "Ouarzazate",
      ],
    },

    /*
     * WEBSITE
     */
    {
      "@type": "WebSite",
      "@id": websiteId,

      url: SITE_URL,
      name: SITE_NAME,

      publisher: {
        "@id": organizationId,
      },

      inLanguage: ["en", "fr", "es"],
    },

    /*
     * BLOG
     */
    {
      "@type": "Blog",
      "@id": blogId,

      url: `${SITE_URL}/blog`,
      name: "Tours Marrakech Desert Blog",

      description:
        "Morocco travel guides, practical advice, culture, destinations and desert travel information.",

      publisher: {
        "@id": organizationId,
      },

      inLanguage: ["en", "fr", "es"],
    },

    /*
     * BLOG POSTING
     */
    {
      "@type": "BlogPosting",
      "@id": articleId,

      url: canonicalUrl,

      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },

      headline: blog.title,

      name: blog.title,

      ...(description && {
        description,
      }),

      ...(imageUrl && {
        image: {
          "@type": "ImageObject",
          url: imageUrl,
          contentUrl: imageUrl,
          caption: blog.altImage || blog.title,
        },
      }),

      ...(datePublished && {
        datePublished,
      }),

      ...(dateModified && {
        dateModified,
      }),

      author: {
        "@id": organizationId,
      },

      publisher: {
        "@id": organizationId,
      },

      isPartOf: {
        "@id": blogId,
      },

      inLanguage: getLanguage(locale),

      articleSection: getBlogLabel(locale),

      ...(blog.keywords?.length > 0 && {
        keywords: blog.keywords,
      }),

      ...(articleBody && {
        articleBody,
      }),

      about:
        blog.keywords?.length > 0
          ? blog.keywords.slice(0, 10).map((keyword) => ({
              "@type": "Thing",
              name: keyword,
            }))
          : undefined,

      ...(alternateUrls && {
        workTranslation: Object.entries(alternateUrls)
          .filter(([language]) => language !== locale)
          .map(([language, url]) => ({
            "@type": "BlogPosting",
            inLanguage: language,
            url,
          })),
      }),

      breadcrumb: {
        "@id": breadcrumbId,
      },
    },

    /*
     * BREADCRUMBS
     */
    {
      "@type": "BreadcrumbList",
      "@id": breadcrumbId,

      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name:
            locale === "fr" ? "Accueil" : locale === "es" ? "Inicio" : "Home",
          item: locale === "en" ? SITE_URL : `${SITE_URL}/${locale}`,
        },

        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item:
            locale === "en" ? `${SITE_URL}/blog` : `${SITE_URL}/${locale}/blog`,
        },

        {
          "@type": "ListItem",
          position: 3,
          name: blog.title,
          item: canonicalUrl,
        },
      ],
    },
  ];

  /*
   * FAQ
   *
   * On ajoute le schema uniquement si la FAQ existe réellement
   * et est visible sur la page.
   */
  if (blog.faq?.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": faqId,

      url: canonicalUrl,

      mainEntity: blog.faq
        .filter(
          (item) =>
            item.question?.trim().length > 0 && item.answer?.trim().length > 0,
        )
        .map((item) => ({
          "@type": "Question",
          name: item.question.trim(),

          acceptedAnswer: {
            "@type": "Answer",
            text: stripHtml(item.answer),
          },
        })),
    });
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
