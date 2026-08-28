import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

const DESTINATIONS = [
  {
    slug: "fes",
    image: "/images/destinations/fes.webp",
    tours: 12,
  },
  {
    slug: "casablanca",
    image: "/images/destinations/casablanca.webp",
    tours: 6,
  },
  {
    slug: "tangier",
    image: "/images/destinations/tangier.jpeg",
    tours: 10,
  },
  {
    slug: "marrakech",
    image: "/images/destinations/marrakech.webp",
    tours: 24,
  },
  {
    slug: "agadir",
    image: "/images/destinations/agadir.webp",
    tours: 6,
  },
] as const;

export default async function Destinations() {
  const t = await getTranslations("Destinations");

  return (
    <section className="relative bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="font-body text-3xl font-extrabold tracking-tight text-heading lg:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-base text-text-secondary sm:text-lg">
            {t("subtitle")}
          </p>
        </div>

        <div className="-mx-4 mt-6 sm:-mx-6 lg:mx-0">
          <ul className="flex gap-5 overflow-x-auto px-4 pb-6 scrollbar-none sm:gap-6 sm:px-6 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0">
            {DESTINATIONS.map((dest) => (
              <li key={dest.slug} className="w-52 shrink-0 sm:w-56 lg:w-auto">
                <Link
                  href={{
                    pathname: "/tours/from/[city]",
                    params: { city: dest.slug },
                  }}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={dest.image}
                      alt={t(`cities.${dest.slug}.alt`)}
                      fill
                      sizes="(max-width: 1024px) 224px, 17vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  </div>
                  <h3 className="mt-3 text-base font-bold text-heading transition-colors group-hover:text-primary sm:text-lg">
                    {t(`cities.${dest.slug}.name`)}
                  </h3>
                  <p className="mt-0.5 text-sm text-text-muted">
                    {t("toursCount", { count: dest.tours })}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
