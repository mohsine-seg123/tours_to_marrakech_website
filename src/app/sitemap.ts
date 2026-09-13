import type { MetadataRoute } from "next";
import { getPathname, routing } from "@/i18n/routing";
import {
  getAllTourSlugs,
  getAllToursGroupedByCity,
} from "@/lib/supabase/tours";
import { getAllDayTripSlugs } from "@/lib/supabase/day_trips";
import { getAllActivitySlugs } from "@/lib/supabase/activities";
import { getAllBlogSlugs } from "@/lib/supabase/blogs";

export const revalidate = 3600;

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://toursmarrakechdesert.com";

const STATIC_PATHS = [
  "/",
  "/tours",
  "/day-trips",
  "/activities",
  "/customize-your-tour",
  "/blog",
  "/about",
  "/about/morocco_tourist",
  "/contact",
] as const;

function absoluteUrl(path: string): string {
  return new URL(path, BASE_URL).toString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const localizedSitemaps = await Promise.all(
    routing.locales.map(async (locale) => {
      const [tourSlugs, dayTripSlugs, activitySlugs, blogSlugs, toursByCity] =
        await Promise.all([
          getAllTourSlugs(locale),
          getAllDayTripSlugs(locale),
          getAllActivitySlugs(locale),
          getAllBlogSlugs(locale),
          getAllToursGroupedByCity(locale),
        ]);

      // Pages fixes dans la langue courante.
      const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((pathname) => ({
        url: absoluteUrl(getPathname({ locale, href: pathname })),
      }));

      // Pages détail avec leurs slugs traduits.
      const detailPages = [
        { pathname: "/tours/[slug]", slugs: tourSlugs },
        { pathname: "/day-trips/[slug]", slugs: dayTripSlugs },
        { pathname: "/activities/[slug]", slugs: activitySlugs },
        { pathname: "/blog/[slug]", slugs: blogSlugs },
      ] as const;

      for (const { pathname, slugs } of detailPages) {
        for (const slug of slugs) {
          if (!slug.trim()) continue;

          entries.push({
            url: absoluteUrl(
              getPathname({
                locale,
                href: { pathname, params: { slug } },
              }),
            ),
          });
        }
      }

      // Circuits par ville de départ.
      for (const [cityName, tours] of Object.entries(toursByCity)) {
        if (!cityName.trim() || !tours.length) continue;

        const city = cityName.trim().toLowerCase().replace(/\s+/g, "-");

        entries.push({
          url: absoluteUrl(
            getPathname({
              locale,
              href: {
                pathname: "/tours/from/[city]",
                params: { city },
              },
            }),
          ),
        });
      }

      return entries;
    }),
  );

  // Réunir les langues et supprimer les URL en double.
  const entries = localizedSitemaps.flat();

  return [...new Map(entries.map((entry) => [entry.url, entry])).values()];
}
