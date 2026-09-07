import supabase from "./server";

export type Locale = "en" | "fr" | "es";

const TABLE = "activities";

export interface ActivityFAQItem {
  question: string;
  answer: string;
}

export interface ActivityItineraryStep {
  title: string;
  description: string;
}

export interface ActivityReason {
  title: string;
  description: string;
}

export interface ActivityContent {
  highlights: string[];
  overview: string;
  duration: string;
  itinerary: ActivityItineraryStep[];
  include: string[];
  exclude: string[];
  why_this_activity: ActivityReason[];
  faq: ActivityFAQItem[];
}

export interface ActivityLocaleContent {
  title: string;
  description: string;
  seo_title: string;
  seo_description: string;
  keywords: string[];
  slug: string;
  content: ActivityContent;
}

export interface ActivityRow {
  id: string;
  category: string;
  price: number | null;
  image_url1: string;
  image_alt1: string;
  image_url2: string;
  image_alt2: string;
  created_at?: string;
  published: boolean;
  en: ActivityLocaleContent;
  fr: ActivityLocaleContent;
  es: ActivityLocaleContent;
}

export interface ActivityCard {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  price: number | null;
  duration: string;
  imageUrl: string;
  imageAlt: string;
}

export interface ActivityDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  category: string;
  price: number | null;
  highlights: string[];
  overview: string;
  duration: string;
  itinerary: ActivityItineraryStep[];
  include: string[];
  exclude: string[];
  whyThisActivity: ActivityReason[];
  faq: ActivityFAQItem[];
  imageUrl1: string;
  imageAlt1: string;
  imageUrl2: string;
  imageAlt2: string;
}


export async function getActivityCards(locale: Locale,Number=10): Promise<ActivityCard[]> {
  const { data, error } = await supabase.from(TABLE).select(`id, category, price, image_url1, image_alt1, ${locale}->>title, ${locale}->>slug, ${locale}->>description, ${locale}->content->>duration`,)
    .eq("published", true)
    .limit(Number)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getActivityCards error:", error.message);
    return [];
  }

  const cards: ActivityCard[] = (data ?? []).map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    price: row.price,
    duration: row.duration,
    imageUrl: row.image_url1,
    imageAlt: row.image_alt1,
  }));

  return cards
}


export async function getActivityDetail( locale: Locale,slug: string,): Promise<ActivityDetail | null> {

  const { data, error } = await supabase.from(TABLE).select(`id, category, price, image_url1, image_alt1, image_url2, image_alt2, ${locale}`,)
    .eq("published", true)
    .eq(`${locale}->>slug`, slug)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getActivityDetail error:", error.message);
    return null;
  }

  if (!data) return null;

  const localeContent = (data as any)[locale] as ActivityLocaleContent;

  // Vérification que le contenu traduit existe bien pour cette langue
  if (!localeContent || !localeContent.title || !localeContent.content)
    return null;

  const content = localeContent.content;

  return {
    id: (data as any).id,
    slug: localeContent.slug,
    title: localeContent.title,
    description: localeContent.description || "",
    seoTitle: localeContent.seo_title || localeContent.title,
    seoDescription: localeContent.seo_description || "",
    keywords: localeContent.keywords || [],
    category: (data as any).category,
    price: (data as any).price,
    highlights: content.highlights ?? [],
    overview: content.overview || "",
    duration: content.duration || "",
    itinerary: content.itinerary ?? [],
    include: content.include ?? [],
    exclude: content.exclude ?? [],
    whyThisActivity: content.why_this_activity ?? [],
    faq: content.faq ?? [],
    imageUrl1: (data as any).image_url1,
    imageAlt1: (data as any).image_alt1 || localeContent.title,
    imageUrl2: (data as any).image_url2,
    imageAlt2: (data as any).image_alt2 || localeContent.title,
  };
}

/* -------------------------------------------------------------------------- */
/* 3) BONUS — generateStaticParams() et changement de langue (hreflang)      */
/* -------------------------------------------------------------------------- */

/** Tous les slugs publiés pour une langue (sitemap, generateStaticParams) */
export async function getAllActivitySlugs(locale: Locale): Promise<string[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(`${locale}->>slug`)
    .eq("published", true);

  if (error) {
    console.error("getAllActivitySlugs error:", error.message);
    return [];
  }
  return (data ?? []).map((row: any) => row.slug).filter(Boolean);
}


/** Slugs équivalents (en/fr/es) d'une même activité, à partir de son id */
export async function getAlternateActivitySlugs(
  id: string,
): Promise<Record<Locale, string> | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("en_slug:en->>slug, fr_slug:fr->>slug, es_slug:es->>slug")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    console.error("getAlternateActivitySlugs error:", error?.message);
    return null;
  }

  const row = data as any;
  return {
    en: row.en_slug,
    fr: row.fr_slug,
    es: row.es_slug,
  };
}

/**
 * Même chose à partir du slug courant — utilisée sur la page détail avec
 * getActivityDetail() en Promise.all(), et par RegisterAlternateSlugs pour
 * que le LanguageSwitcher retrouve le bon slug traduit au changement de langue.
 */
export async function getAlternateActivitySlugsBySlug(
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
    console.error("getAlternateActivitySlugsBySlug error:", error?.message);
    return null;
  }

  const row = data as any;
  return {
    en: row.en_slug,
    fr: row.fr_slug,
    es: row.es_slug,
  };
}
