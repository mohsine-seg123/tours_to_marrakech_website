import supabase from "./server";

export type Locale = "en" | "fr" | "es";

const TABLE = "posts";
const PAGE_SIZE = 6;
import { cache } from "react";

export interface BlogFAQItem {
  question: string;
  answer: string;
}

export interface BlogLocaleContent {
  title: string;
  slug: string;
  keywords: string[];
  seo_title: string;
  seo_description: string;
  content: string;
  faq: BlogFAQItem[];
}

export interface BlogPostRow {
  id: string;
  created_at?: string;
  timeread: string;
  published: boolean;
  cover_image: string;
  alt_image: string;
  en: BlogLocaleContent;
  fr: BlogLocaleContent;
  es: BlogLocaleContent;
}

export interface BlogCard {
  id: string;
  slug: string;
  title: string;
  keywords: string[];
  description: string;
  coverImage: string;
  altImage: string;
  timeread: string;
}

export interface BlogDetail {
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  content: string;
  faq: BlogFAQItem[];
  coverImage: string;
  altImage: string;
  timeread: string;
  created_at?: string;
}

export interface PaginatedBlogCards {
  cards: BlogCard[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
}

export async function getBlogCards(
  locale: Locale,
  page: number = 1,
  pageSize: number = PAGE_SIZE,
): Promise<PaginatedBlogCards> {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from(TABLE)
    .select(
      `id, cover_image, alt_image, timeread, ${locale}->>keywords, ${locale}->>title, ${locale}->>slug, ${locale}->>seo_description`,
      { count: "exact" },
    )
    .eq("published", true)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("getBlogCards Supabase error:", {
      locale,
      page,
      code: error.code,
      message: error.message,
    });

    throw new Error("BLOG_CARDS_FETCH_FAILED");
  }

  const cards: BlogCard[] = (data ?? []).map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    keywords: row.keywords,
    description: row.seo_description,
    coverImage: row.cover_image,
    altImage: row.alt_image,
    timeread: row.timeread,
  }));

  const total = count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    cards,
    total,
    totalPages,
    currentPage: page,
    hasMore: page < totalPages,
  };
}

export const getBlogDetail = cache(
  async (locale: Locale, slug: string): Promise<BlogDetail | null> => {
    const { data, error } = await supabase
      .from(TABLE)
      .select(`id,created_at,cover_image,alt_image,timeread,${locale}`)
      .eq("published", true)
      .eq(`${locale}->>slug`, slug)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("getBlogDetail Supabase error:", {
        locale,
        slug,
        code: error.code,
        message: error.message,
        details: error.details,
      });

      throw new Error("BLOG_DETAIL_FETCH_FAILED");
    }

    if (!data) {
      return null;
    }

    const localeContent = (data as any)[locale] as BlogLocaleContent;

    if (!localeContent || !localeContent.title) {
      return null;
    }

    return {
      id: data.id,
      slug: localeContent.slug,
      title: localeContent.title,
      seoTitle: localeContent.seo_title || localeContent.title,
      seoDescription: localeContent.seo_description || "",
      keywords: localeContent.keywords || [],
      content: localeContent.content || "",
      faq: localeContent.faq ?? [],
      coverImage: data.cover_image,
      altImage: data.alt_image || localeContent.title,
      timeread: data.timeread,
      created_at: data.created_at ?? undefined,
    };
  },
);

export async function getAllBlogSlugs(locale: Locale): Promise<string[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(`${locale}->>slug`)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllBlogSlugs error:", error.message);
    return [];
  }

  return (data ?? []).map((row) => row.slug).filter(Boolean);
}

export async function getLatestBlogSlugs(
  locale: Locale,
  limit = 6,
): Promise<string[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(`slug:${locale}->>slug`)
    .eq("published", true)
    .not(`${locale}->>slug`, "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getLatestBlogSlugs error:", {
      locale,
      message: error.message,
    });
    return [];
  }

  return (data ?? [])
    .map((row) => row.slug)
    .filter((slug): slug is string => Boolean(slug));
}

export async function getAlternateBlogSlugs(
  id: string,
): Promise<Record<Locale, string> | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("en_slug:en->>slug, fr_slug:fr->>slug, es_slug:es->>slug")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    console.error("getAlternateBlogSlugs error:", error?.message);
    return null;
  }

  const row = data;
  return {
    en: row.en_slug,
    fr: row.fr_slug,
    es: row.es_slug,
  };
}

export const getAlternateBlogSlugsBySlug = cache(
  async (
    locale: Locale,
    slug: string,
  ): Promise<Record<Locale, string> | null> => {
    const { data, error } = await supabase
      .from(TABLE)
      .select("en_slug:en->>slug, fr_slug:fr->>slug, es_slug:es->>slug")
      .eq("published", true)
      .eq(`${locale}->>slug`, slug)
      .maybeSingle();

    if (error) {
      console.error("getAlternateBlogSlugsBySlug:", {
        locale,
        slug,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      throw new Error("ALTERNATE_BLOG_SLUGS_FETCH_FAILED");
    }

    if (!data) {
      return null;
    }

    const en = data.en_slug?.trim();
    const fr = data.fr_slug?.trim();
    const es = data.es_slug?.trim();

    // Les composants actuels exigent trois slugs valides
    if (!en || !fr || !es) {
      return null;
    }

    return {
      en,
      fr,
      es,
    };
  },
);