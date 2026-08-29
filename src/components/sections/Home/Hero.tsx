import { Users, Compass } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

export default async function HeroSection(): Promise<React.JSX.Element> {
  const t=await getTranslations("Hero");
  return (
    <section className="relative w-full overflow-hidden bg-background">
      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-15">
          <div className="order-1 lg:order-1">
            <p className="font-body text-xs font-semibold text-center sm:text-start uppercase tracking-[0.25em] text-primary sm:text-sm">
              {t("eyebrow")}
            </p>

            <h1 className="mt-3 sm:mt-5 font-body text-4xl text-center sm:text-start font-black leading-[1.05] tracking-tight text-heading sm:text-5xl lg:text-6xl xl:text-7xl">
              {t.rich("title", {
                highlight: (chunks) => (
                  <span className="text-primary">{chunks}</span>
                ),
              })}
            </h1>

            <p className="mt-3 sm:mt-6 text-center sm:text-start text-base font-semibold text-text-main sm:text-lg lg:text-xl">
              {t("subtitle")}
            </p>

            <p className="mt-4 max-w-lg text-sm leading-relaxed text-text-secondary sm:text-base">
              {t("description")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/tours"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary-hover"
              >
                <Users
                  className="h-4 w-4 transition-transform group-hover:scale-110"
                  aria-hidden="true"
                />
                {t("ctaPrimary")}
              </Link>

              <Link
                href="/activities"
                className="group inline-flex items-center gap-2 rounded-full border-2 border-heading bg-transparent px-7 py-3.5 text-sm font-semibold text-heading transition-all duration-300 hover:bg-heading hover:text-background"
              >
                <Compass
                  className="h-4 w-4 transition-transform group-hover:rotate-12"
                  aria-hidden="true"
                />
                {t("ctaSecondary")}
              </Link>
            </div>
          </div>

          <div className="order-2 lg:order-2">
            <div className="relative mx-auto w-full max-w-md sm:max-w-lg py-6 lg:max-w-none lg:px-8">
              <div className="group relative aspect-square overflow-hidden">
                <Image
                  src="/images/marrakech.jpeg"
                  alt="Jemaa el-Fna square in Marrakech with traditional Moroccan souks and architecture | tours marrakech desert"
                  fill
                  priority
                  quality={90}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform rounded-xl duration-[900ms] ease-out hover:cursor-pointer group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
