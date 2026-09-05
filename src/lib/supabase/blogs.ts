import supabase from "./server";

export type Locale = "en" | "fr" | "es";

const TABLE = "posts";
const PAGE_SIZE = 6;

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
}

export interface PaginatedBlogCards {
  cards: BlogCard[];
  total: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
}

export async function getBlogCards(locale: Locale, page: number = 1,pageSize: number = PAGE_SIZE,): Promise<PaginatedBlogCards> {

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
    console.error("getBlogCards error:", error.message);
    return {
      cards: [],
      total: 0,
      totalPages: 0,
      currentPage: page,
      hasMore: false,
    };
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

export async function getBlogDetail(
  locale: Locale,
  slug: string,
): Promise<BlogDetail | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(`id, cover_image, alt_image, timeread, ${locale}`)
    .eq("published", true)
    .eq(`${locale}->>slug`, slug)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getBlogDetail error:", error.message);
    return null;
  }

  if (!data) return null;

  const localeContent = (data as any)[locale] as BlogLocaleContent;

  // Vérification que le contenu traduit existe bien pour cette langue
  if (!localeContent || !localeContent.title) return null;

  return {
    id: (data as any).id,
    slug: localeContent.slug,
    title: localeContent.title,
    seoTitle: localeContent.seo_title || localeContent.title,
    seoDescription: localeContent.seo_description || "",
    keywords: localeContent.keywords || [],
    content: localeContent.content || "",
    faq: localeContent.faq ?? [],
    coverImage: (data as any).cover_image,
    altImage: (data as any).alt_image || localeContent.title,
    timeread: (data as any).timeread,
  };
}

export async function getAllBlogSlugs(locale: Locale): Promise<string[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(`${locale}->>slug`)
    .eq("published", true);

  if (error) {
    console.error("getAllBlogSlugs error:", error.message);
    return [];
  }
  return (data ?? []).map((row: any) => row.slug).filter(Boolean);
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

  const row = data as any;
  return {
    en: row.en_slug,
    fr: row.fr_slug,
    es: row.es_slug,
  };
}

export async function getAlternateBlogSlugsBySlug(
  locale: Locale,
  slug: string,
): Promise<Record<Locale, string> | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("en_slug:en->>slug, fr_slug:fr->>slug, es_slug:es->>slug")
    .eq(`${locale}->>slug`, slug)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    console.error("getAlternateBlogSlugsBySlug error:", error?.message);
    return null;
  }

  const row = data as any;
  return {
    en: row.en_slug,
    fr: row.fr_slug,
    es: row.es_slug,
  };
}