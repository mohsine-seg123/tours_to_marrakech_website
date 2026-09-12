import supabase from "./server";

export type Locale = "en" | "fr" | "es";
const TABLE = "tours";
const DEFAULT_LIMIT = 10;
const PAGE_SIZE = 500;

export interface TourFAQItem {
  question: string;
  answer: string;
}

export interface TourSectionItem {
  title: string;
  description: string;
}

/** Clés JSON attendues dans en / fr / es (snake_case). */
export interface TourLocaleContent {
  title: string;
  slug: string;
  description: string;
  seo_title: string;
  seo_description: string;
  keywords: string[];
  overview_title: string;
  overview: string;
  itinerary_title: string;
  itinerary: TourSectionItem[];
  include: string[];
  exclude: string[];
  faq: TourFAQItem[];
  highlights: string[];
  why_choose: string;
}

export interface TourRow {
  id: string;
  price: number | null;
  departure_city: string;
  duration: string;
  type_tour: string;
  map_title: string;
  map_url: string;
  image_url1: string;
  image_alt1: string | null;
  image_url2: string | null;
  image_alt2: string | null;
  image_url3: string | null;
  image_alt3: string | null;
  published: boolean;
  en: TourLocaleContent;
  fr: TourLocaleContent | null;
  es: TourLocaleContent | null;
  created_at: string;
  updated_at: string;
}

/** Même convention imageUrl / imageAlt que DayTripCard. */
export interface TourCard {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number | null;
  departureCity: string;
  duration: string;
  typeTour: string;
  imageUrl: string;
  imageAlt: string;
}

export interface TourDetail extends TourCard {
  mapTitle: string;
  mapUrl: string;
  imageUrl1: string;
  imageAlt1: string;
  imageUrl2: string | null;
  imageAlt2: string;
  imageUrl3: string | null;
  imageAlt3: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  overviewTitle: string;
  overview: string;
  itineraryTitle: string;
  itinerary: TourSectionItem[];
  include: string[];
  exclude: string[];
  faq: TourFAQItem[];
  highlights: string[];
  whyChoose: string;
  createdAt: string;
  updatedAt: string;
}

export type ToursByCity = Record<string, TourCard[]>;

// Pas de Partial : les trois clés sont présentes, null = traduction absente.
export type AlternateTourSlugs = Record<Locale, string | null>;

type CardQueryRow = Pick<
  TourRow,
  | "id"
  | "price"
  | "departure_city"
  | "duration"
  | "type_tour"
  | "image_url1"
  | "image_alt1"
> & {
  title: string | null;
  description: string | null;
  slug: string | null;
};

type DetailQueryRow = Omit<TourRow, "en" | "fr" | "es"> & {
  content: unknown;
};

type QueryResult = {
  data: unknown;
  error: { message: string } | null;
};

function assertLocale(locale: Locale): void {
  if (locale !== "en" && locale !== "fr" && locale !== "es") {
    throw new Error(`Unsupported tour locale: ${locale}`);
  }
}

function text(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function strings(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter(
        (item): item is string => typeof item === "string" && !!item.trim(),
      )
    : [];
}

function sections(value: unknown): TourSectionItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const row = record(item);
    const title = text(row.title).trim();
    return title ? [{ title, description: text(row.description) }] : [];
  });
}

function faqs(value: unknown): TourFAQItem[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    const row = record(item);
    const question = text(row.question).trim();
    const answer = text(row.answer);
    return question && answer.trim() ? [{ question, answer }] : [];
  });
}

function normalizeLimit(limit: number): number {
  return Number.isFinite(limit)
    ? Math.min(Number.MAX_SAFE_INTEGER, Math.max(1, Math.floor(limit)))
    : DEFAULT_LIMIT;
}

function fail(operation: string, error: { message: string }){
  console.error(`${operation}:`, error.message);}


/** Pagination : avance du nombre réel de lignes renvoyées par l'API.
 * On continue jusqu'à une page vide, même si le plafond API est < PAGE_SIZE.
 * Chaque requête appelante utilise un ordre stable avec id comme départage.
 */
async function readRows<T>(
  operation: string,
  fetchPage: (from: number, to: number) => PromiseLike<QueryResult>,
  limit: number = Number.POSITIVE_INFINITY,
): Promise<T[]> {
  const rows: T[] = [];
  while (rows.length < limit) {
    const size = Math.min(PAGE_SIZE, limit - rows.length);
    const { data, error } = await fetchPage(
      rows.length,
      rows.length + size - 1,
    );
    if (error) fail(operation, error);
    const page = (data ?? []) as T[];
    if (page.length === 0) break;
    rows.push(...page);
  }
  return rows;
}

function cardSelect(locale: Locale): string {
  return `id, price, departure_city, duration, type_tour, image_url1, image_alt1,
    title:${locale}->>title, description:${locale}->>description, slug:${locale}->>slug`;
}

function cardsQuery(locale: Locale) {
  return supabase
    .from(TABLE)
    .select(cardSelect(locale))
    .eq("published", true)
    .not(`${locale}->>title`, "is", null)
    .neq(`${locale}->>title`, "")
    .not(`${locale}->>slug`, "is", null)
    .neq(`${locale}->>slug`, "");
}

function toTourCard(row: CardQueryRow): TourCard | null {
  const title = text(row.title).trim();
  const slug = text(row.slug).trim();
  if (!title || !slug) return null;
  return {
    id: row.id,
    slug,
    title,
    description: text(row.description),
    price: row.price,
    departureCity: row.departure_city,
    duration: row.duration,
    typeTour: row.type_tour,
    imageUrl: row.image_url1,
    imageAlt: text(row.image_alt1).trim() || title,
  };
}

function toCards(rows: CardQueryRow[]): TourCard[] {
  return rows.map(toTourCard).filter((card): card is TourCard => card !== null);
}


/** Tous les circuits publiés et disponibles dans la langue demandée. */
export async function getAllTours(locale: Locale): Promise<TourCard[]> {
  assertLocale(locale);
  const rows = await readRows<CardQueryRow>("getAllTours", (from, to) =>
    cardsQuery(locale)
      .order("departure_city", { ascending: true })
      .order("created_at", { ascending: false })
      .order("id", { ascending: true })
      .range(from, to),
  );
  return toCards(rows);
}



/** Tous les circuits regroupés par ville de départ. */
export async function getAllToursGroupedByCity(
  locale: Locale,
): Promise<ToursByCity> {
  const cards = await getAllTours(locale);
  const groups = new Map<string, TourCard[]>();
  for (const card of cards) {
    const group = groups.get(card.departureCity) ?? [];
    group.push(card);
    groups.set(card.departureCity, group);
  }
  return Object.fromEntries(groups);
}

/** Circuits d'une ville ; comparaison insensible à la casse.
 * %, _ et \\ sont échappés pour chercher un nom et non un motif SQL.
 */
export async function getToursByCity(
  locale: Locale,
  departureCity: string,
  limit: number = DEFAULT_LIMIT,
): Promise<TourCard[]> {
  assertLocale(locale);
  const city = departureCity.trim();
  if (!city) return [];
  const pattern = city.replace(/[\\%_]/g, "\\$&");
  const rows = await readRows<CardQueryRow>(
    "getToursByCity",
    (from, to) =>
      cardsQuery(locale)
        .ilike("departure_city", pattern)
        .order("created_at", { ascending: false })
        .order("id", { ascending: true })
        .range(from, to),
    normalizeLimit(limit),
  );
  return toCards(rows);
}

/** Détail par slug traduit. null = circuit absent ou traduction inexploitable.
 * Sans limit(1) : un slug dupliqué déclenche une erreur au lieu d'être masqué.
 */
export async function getTourDetail(
  locale: Locale,
  slug: string,
): Promise<TourDetail | null> {
  assertLocale(locale);
  const requestedSlug = slug.trim();
  if (!requestedSlug) return null;
  const { data, error } = await supabase
    .from(TABLE)
    .select(
      `id, price, departure_city, duration, type_tour, map_title, map_url,
      image_url1, image_alt1, image_url2, image_alt2, image_url3, image_alt3,
      published, created_at, updated_at, content:${locale}`,
    )
    .eq("published", true)
    .eq(`${locale}->>slug`, requestedSlug)
    .maybeSingle();
  if (error) fail("getTourDetail", error);
  if (!data) return null;

  const row = data as unknown as DetailQueryRow;
  const content = record(row.content);
  const card = toTourCard({
    ...row,
    title: text(content.title),
    slug: text(content.slug),
    description: text(content.description),
  });
  if (!card) return null;

  return {
    ...card,
    mapTitle: row.map_title,
    mapUrl: row.map_url,
    imageUrl1: card.imageUrl,
    imageAlt1: card.imageAlt,
    imageUrl2: row.image_url2 || null,
    imageAlt2: text(row.image_alt2).trim() || card.title,
    imageUrl3: row.image_url3 || null,
    imageAlt3: text(row.image_alt3).trim() || card.title,
    seoTitle: text(content.seo_title).trim() || card.title,
    seoDescription: text(content.seo_description).trim() || card.description,
    keywords: strings(content.keywords),
    overviewTitle: text(content.overview_title),
    overview: text(content.overview),
    itineraryTitle: text(content.itinerary_title),
    itinerary: sections(content.itinerary),
    include: strings(content.include),
    exclude: strings(content.exclude),
    faq: faqs(content.faq),
    highlights: strings(content.highlights),
    whyChoose: text(content.why_choose),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/** Slugs publiés, avec titre non vide, pour sitemap / generateStaticParams. */
export async function getAllTourSlugs(locale: Locale): Promise<string[]> {
  assertLocale(locale);
  const rows = await readRows<{ slug: string | null; title: string | null }>(
    "getAllTourSlugs",
    (from, to) =>
      supabase
        .from(TABLE)
        .select(`slug:${locale}->>slug, title:${locale}->>title`)
        .eq("published", true)
        .not(`${locale}->>title`, "is", null)
        .neq(`${locale}->>title`, "")
        .not(`${locale}->>slug`, "is", null)
        .neq(`${locale}->>slug`, "")
        .order("id", { ascending: true })
        .range(from, to),
  );
  return [
    ...new Set(
      rows
        .filter((row) => text(row.title).trim())
        .map((row) => text(row.slug).trim())
        .filter(Boolean),
    ),
  ];
}

const ALTERNATE_SELECT = `
  en_slug:en->>slug, en_title:en->>title,
  fr_slug:fr->>slug, fr_title:fr->>title,
  es_slug:es->>slug, es_title:es->>title
`;

function normalizeAlternateSlugs(data: unknown): AlternateTourSlugs {
  const row = record(data);
  function available(locale: Locale): string | null {
    const title = text(row[`${locale}_title`]).trim();
    const slug = text(row[`${locale}_slug`]).trim();
    return title && slug ? slug : null;
  }
  return { en: available("en"), fr: available("fr"), es: available("es") };
}

/** Slugs du même circuit publié ; une traduction sans titre ou slug vaut null. */
export async function getAlternateTourSlugs(
  id: string,
): Promise<AlternateTourSlugs | null> {
  if (!id.trim()) return null;
  const { data, error } = await supabase
    .from(TABLE)
    .select(ALTERNATE_SELECT)
    .eq("published", true)
    .eq("id", id.trim())
    .maybeSingle();
  if (error) fail("getAlternateTourSlugs", error);
  return data ? normalizeAlternateSlugs(data) : null;
}



/** Slugs alternatifs à partir de la langue et du slug courants. */
export async function getAlternateTourSlugsBySlug(
  locale: Locale,
  slug: string,
): Promise<Record<Locale, string> | null> {
  assertLocale(locale);

  const currentSlug = slug.trim();
  if (!currentSlug) return null;

  const { data, error } = await supabase
    .from(TABLE)
    .select(ALTERNATE_SELECT)
    .eq("published", true)
    .eq(`${locale}->>slug`, currentSlug)
    .maybeSingle();

  if (error) {
    console.error("getAlternateTourSlugsBySlug:", error.message);
    return null;
  }

  if (!data) return null;

  const slugs = normalizeAlternateSlugs(data);

  if (!slugs[locale]) return null;

  return {
    en: slugs.en ?? "",
    fr: slugs.fr ?? "",
    es: slugs.es ?? "",
  };
}