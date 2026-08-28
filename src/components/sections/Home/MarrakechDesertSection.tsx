"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function MarrakechDesertSection() {
  const t = useTranslations("MarrakechDesertSection");

  return (
    <section
      aria-labelledby="marrakech-desert-title"
      className="relative overflow-hidden bg-background py-10 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 xl:gap-10">
          <div className="relative flex justify-center lg:justify-start">
            <div className="relative w-auto">
              <Image
                src="/images/camel_mask.png"
                alt={t("imageAlt")}
                width={1200}
                height={800}
                priority={false}
                className="h-auto w-full object-contain"
                sizes="(max-width: 1024px) 90vw, 650px"
              />
            </div>
          </div>

          {/* TEXT */}
          <div className="max-w-3xl">
            <p className="m-3 text-sm italic tracking-wide text-primary sm:text-base">
              {t("eyebrow")}
            </p>
            <h2
              id="marrakech-desert-title"
              className="max-w-2xl text-3xl font-medium leading-[1.05] text-heading sm:text-4xl"
            >
              {t("title")}
            </h2>

            {/* DESCRIPTION */}
            <div className="space-y-4 text-[1.05rem] leading-8 text-text-secondary">
              <p>
                {t.rich("paragraph1", {
                  bold: (
                    chunks, 
                  ) => (
                    <strong className="font-semibold text-heading">
                      {chunks}
                    </strong>
                  ),
                })}
              </p>

              <p>
                {t.rich("paragraph2", {
                  bold: (
                    chunks, 
                  ) => (
                    <strong className="font-semibold text-heading">
                      {chunks}
                    </strong>
                  ),
                })}
              </p>
            </div>

            {/* CTA */}
            <div className="mt-5">
              {" "}
              <Link
                href="/tours"
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary-hover hover:shadow-lg"
              >
                {t("cta")}
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
