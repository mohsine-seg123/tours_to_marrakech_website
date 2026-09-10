import supabase from "./server";

export type Locale = "en" | "fr" | "es";

const TABLE = "day_trips";
const DEFAULT_LIMIT = 10;

export interface DayTripFAQItem {
  question: string;
  answer: string;
}

export interface DayTripSectionItem {
  title: string;
  description: string;
}

export interface DayTripLocaleContent {
  title: string;
  description: string;
  slug: string;
  seo_title: string;
  seo_description: string;
  keywords: string[];
  overview_title: string;
  overview: string;
  why_choose_title: string;
  why_choose: DayTripSectionItem[];
  itinerary_title: string;
  itinerary: DayTripSectionItem[];
  include: string[];
  exclude: string[];
  more_information: string;
  faq: DayTripFAQItem[];
}

export interface DayTripRow {
  id: string;
  price: number | null;
  departure_city: string;
  image_url: string;
  image_alt: string | null;
  published: boolean;
  en: DayTripLocaleContent;
  fr: DayTripLocaleContent | null;
  es: DayTripLocaleContent | null;
  created_at: string;
  updated_at: string;
}

export interface DayTripCard {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number | null;
  departureCity: string;
  imageUrl: string;
  imageAlt: string;
}

export interface DayTripDetail extends DayTripCard {
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  overviewTitle: string;
  overview: string;
  whyChooseTitle: string;
  whyChoose: DayTripSectionItem[];
  itineraryTitle: string;
  itinerary: DayTripSectionItem[];
  include: string[];
  exclude: string[];
  moreInformation: string;
  faq: DayTripFAQItem[];
}

export type DayTripsByCity = Record<string, DayTripCard[]>;
export type AlternateDayTripSlugs = Record<Locale, string>;

type DayTripCardQueryRow = {
  id: string;
  price: number | null;
  departure_city: string;
  image_url: string;
  image_alt: string | null;
  title: string | null;
  description: string | null;
  slug: string | null;
};

function toDayTripCard(row: DayTripCardQueryRow): DayTripCard | null {
  if (!row.title || !row.slug) return null;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    price: row.price,
    departureCity: row.departure_city,
    imageUrl: row.image_url,
    imageAlt: row.image_alt ?? row.title,
  };
}

function cardSelect(locale: Locale): string {
  return `
    id,
    price,
    departure_city,
    image_url,
    image_alt,
    title:${locale}->>title,
    description:${locale}->>description,
    slug:${locale}->>slug
  `;
}

/** Tous les day trips publiés, regroupés par ville de départ. */
export async function getAllDayTripsGroupedByCity(
  locale: Locale,
): Promise<DayTripsByCity> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(cardSelect(locale))
    .eq("published", true)
    .not(`${locale}->>title`, "is", null)
    .not(`${locale}->>slug`, "is", null)
    .order("departure_city", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getAllDayTripsGroupedByCity error:", error.message);
    return {};
  }

  return (
    (data ?? []) as unknown as DayTripCardQueryRow[]
  ).reduce<DayTripsByCity>((groups, row) => {
    const card = toDayTripCard(row);
    if (!card) return groups;

    (groups[card.departureCity] ??= []).push(card);
    return groups;
  }, {});
}

/** Day trips d'une ville, avec une limite configurable. */
export async function getDayTripsByCity(
  locale: Locale,
  departureCity: string,
  limit: number = DEFAULT_LIMIT,
): Promise<DayTripCard[]> {
  const safeLimit = Math.max(1, Math.floor(limit));

  const { data, error } = await supabase
    .from(TABLE)
    .select(cardSelect(locale))
    .eq("published", true)
    .ilike("departure_city", departureCity.trim())
    .not(`${locale}->>title`, "is", null)
    .not(`${locale}->>slug`, "is", null)
    .order("created_at", { ascending: false })
    .limit(safeLimit);

  if (error) {
    console.error("getDayTripsByCity error:", error.message);
    return [];
  }

  return ((data ?? []) as unknown as DayTripCardQueryRow[])
    .map(toDayTripCard)
    .filter((card): card is DayTripCard => card !== null);
}



/** Détail d'un day trip à partir du slug traduit. */
export async function getDayTripDetail(
  locale: Locale,
  slug: string,
): Promise<DayTripDetail | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(`id, price, departure_city, image_url, image_alt, ${locale}`)
    .eq("published", true)
    .eq(`${locale}->>slug`, slug)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("getDayTripDetail error:", error.message);
    return null;
  }

  if (!data) return null;

  const row = data as unknown as Pick<
    DayTripRow,
    "id" | "price" | "departure_city" | "image_url" | "image_alt"
  > &
    Partial<Record<Locale, DayTripLocaleContent | null>>;
  const content = row[locale];

  if (!content?.title || !content.slug) return null;

  return {
    id: row.id,
    slug: content.slug,
    title: content.title,
    description: content.description ?? "",
    price: row.price,
    departureCity: row.departure_city,
    imageUrl: row.image_url,
    imageAlt: row.image_alt ?? content.title,
    seoTitle: content.seo_title || content.title,
    seoDescription: content.seo_description ?? "",
    keywords: content.keywords ?? [],
    overviewTitle: content.overview_title ?? "",
    overview: content.overview ?? "",
    whyChooseTitle: content.why_choose_title ?? "",
    whyChoose: content.why_choose ?? [],
    itineraryTitle: content.itinerary_title ?? "",
    itinerary: content.itinerary ?? [],
    include: content.include ?? [],
    exclude: content.exclude ?? [],
    moreInformation: content.more_information ?? "",
    faq: content.faq ?? [],
  };
}

/** Tous les slugs publiés d'une langue (sitemap/generateStaticParams). */
export async function getAllDayTripSlugs(locale: Locale): Promise<string[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select(`slug:${locale}->>slug`)
    .eq("published", true)
    .not(`${locale}->>slug`, "is", null);

  if (error) {
    console.error("getAllDayTripSlugs error:", error.message);
    return [];
  }

  return ((data ?? []) as unknown as Array<{ slug: string | null }>)
    .map((row) => row.slug)
    .filter((slug): slug is string => Boolean(slug));
}

/** Slugs traduits du même day trip à partir de son id. */
export async function getAlternateDayTripSlugs(
  id: string,
): Promise<AlternateDayTripSlugs | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("en_slug:en->>slug, fr_slug:fr->>slug, es_slug:es->>slug")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    console.error("getAlternateDayTripSlugs error:", error?.message);
    return null;
  }

  return normalizeAlternateSlugs(data);
}

/** Slugs traduits du même day trip à partir du slug actuellement affiché. */
export async function getAlternateDayTripSlugsBySlug(
  locale: Locale,
  slug: string,
): Promise<AlternateDayTripSlugs | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("en_slug:en->>slug, fr_slug:fr->>slug, es_slug:es->>slug")
    .eq("published", true)
    .eq(`${locale}->>slug`, slug)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    console.error("getAlternateDayTripSlugsBySlug error:", error?.message);
    return null;
  }

  return normalizeAlternateSlugs(data);
}

function normalizeAlternateSlugs(data: unknown): AlternateDayTripSlugs {
  const row = data as {
    en_slug: string;
    fr_slug: string;
    es_slug: string;
  };

  return {
    en: row.en_slug,
    fr: row.fr_slug,
    es: row.es_slug,
  };
}