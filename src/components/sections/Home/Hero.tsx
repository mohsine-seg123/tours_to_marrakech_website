import { Users, Compass } from "lucide-react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function HeroSection(): Promise<React.JSX.Element> {
  const t = await getTranslations("Hero");

  return (
    <section className="relative w-full overflow-hidden bg-background">
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:pt-12 lg:px-8 lg:pt-16">
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-2">
    
          <div className="order-1 mx-auto w-full max-w-xl lg:mx-0">
            {/* EYEBROW */}
            <p
              className="
      text-center
      font-body
      text-[11px]
      font-semibold
      uppercase
      tracking-[0.24em]
      text-primary
      sm:text-left
      sm:text-xs
      lg:text-sm
    "
            >
              {t("eyebrow")}
            </p>

            {/* TITLE */}
            <h1
              className="
      mx-auto
      mt-4
      max-w-[360px]
      text-center
      font-heading
      text-[38px]
      font-semibold
      leading-[0.98]
      tracking-[-0.025em]
      text-heading
      [text-wrap:balance]
      sm:mx-0
      sm:max-w-[620px]
      sm:text-left
      sm:text-5xl
      sm:leading-[1]"
            >
              {t.rich("title", {
                highlight: (chunks) => (
                  <span className="text-primary">{chunks}</span>
                ),
              })}
            </h1>

            {/* SUBTITLE */}
            <p
              className="
      mx-auto
      mt-6
      max-w-[360px]
      text-center
      text-[17px]
      font-semibold
      leading-snug
      text-text-main
      sm:mx-0
      sm:max-w-lg
      sm:text-left
      sm:text-lg
      lg:text-xl
    "
            >
              {t("subtitle")}
            </p>

            {/* DESCRIPTION */}
            <p
              className="
      mx-auto
      mt-4
      max-w-[390px]
      text-center
      text-[15px]
      leading-7
      text-text-secondary
      sm:mx-0
      sm:max-w-lg
      sm:text-left
      sm:text-base
    "
            >
              {t("description")}
            </p>

            {/* CTA */}
            <div
              className=" mx-auto mt-7 flex w-full max-w-[390px] flex-col gap-3 sm:mx-0 sm:mt-12 sm:max-w-none sm:flex-row sm:items-center sm:gap-4" >
              <Link
                href="/tours"
                className="
        group
        inline-flex
        min-h-[52px]
        w-full
        items-center
        justify-center
        gap-2
        rounded-full
        bg-primary
        px-6
        py-3.5
        text-sm
        font-semibold
        text-primary-foreground
        transition-all
        duration-300
        hover:bg-primary-hover
        sm:w-auto
      "
              >
                <Users
                  className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110"
                  aria-hidden="true"
                />

                <span>{t("ctaPrimary")}</span>
              </Link>

              <Link
                href="/contact"
                className="
        group
        inline-flex
        min-h-[52px]
        w-full
        items-center
        justify-center
        gap-2
        rounded-full
        border
        border-heading
        bg-background
        px-6
        py-3.5
        text-center
        text-sm
        font-semibold
        text-heading
        transition-all
        duration-300
        hover:bg-heading
        hover:text-background
        sm:w-auto
      "
              >
                <Compass
                  className="h-4 w-4 shrink-0 transition-transform group-hover:rotate-12"
                  aria-hidden="true"
                />
                <span>{t("ctaSecondary")}</span>
              </Link>
            </div>
          </div>

          {/* =====================================================
              RIGHT VISUAL
          ===================================================== */}
          <div className="order-2">
            <div
              className="
                relative
                mx-auto
                h-[330px]
                w-full
                max-w-[520px]
                bg-background
                sm:h-[410px]
                lg:h-[500px]
                lg:max-w-none
              "
            >
              {/* =================================================
                  MAP BACKGROUND
              ================================================= */}
              <svg
                viewBox="0 0 700 600"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full text-heading opacity-[0.07]"
                aria-hidden="true"
              >
                <path
                  d="M-20 110 C100 65 170 175 285 120 S490 60 730 125"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                />

                <path
                  d="M-10 205 C120 150 210 270 330 205 S540 145 720 225"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />

                <path
                  d="M0 325 C135 265 220 390 350 315 S555 270 730 340"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />

                <path
                  d="M20 460 C155 395 250 520 390 440 S565 390 720 465"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />

                <path
                  d="M80 50 C40 210 120 380 90 580"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />

                <path
                  d="M180 40 C140 220 220 370 180 600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />

                <path
                  d="M285 50 C240 220 320 380 280 600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />

                <path
                  d="M390 40 C350 210 430 380 390 600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />

                <path
                  d="M500 50 C450 220 540 390 500 600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />

                <path
                  d="M610 40 C560 220 650 390 605 600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>

              {/* =================================================
                  ANIMATED ROUTE
              ================================================= */}
              <svg
                viewBox="0 0 700 600"
                preserveAspectRatio="none"
                className="absolute inset-0 z-[1] h-full w-full text-heading"
                aria-hidden="true"
              >
                {/* DOTTED PATH */}
                <path
                  d="
                    M180 175
                    C260 120 330 205 410 210
                    C500 215 545 275 525 335
                    C500 405 445 425 395 465
                  "
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="2 13"
                  opacity="0.65"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-45"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </path>

                {/* START */}
                <circle cx="180" cy="175" r="6" className="fill-primary" />

                {/* START PULSE */}
                <circle
                  cx="180"
                  cy="175"
                  r="6"
                  className="fill-primary"
                  opacity="0.2"
                >
                  <animate
                    attributeName="r"
                    values="6;16;6"
                    dur="2.8s"
                    repeatCount="indefinite"
                  />

                  <animate
                    attributeName="opacity"
                    values="0.2;0;0.2"
                    dur="2.8s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* MIDDLE */}
                <circle cx="410" cy="210" r="6" className="fill-primary" />

                {/* END */}
                <circle cx="395" cy="465" r="6" className="fill-primary" />

                {/* MOVING HALO */}
                <circle r="13" className="fill-primary" opacity="0.1">
                  <animateMotion
                    dur="8s"
                    repeatCount="indefinite"
                    path="
                      M180 175
                      C260 120 330 205 410 210
                      C500 215 545 275 525 335
                      C500 405 445 425 395 465
                    "
                  />
                </circle>

                {/* MOVING DOT */}
                <circle r="6" className="fill-primary">
                  <animateMotion
                    dur="8s"
                    repeatCount="indefinite"
                    path="
                      M180 175
                      C260 120 330 205 410 210
                      C500 215 545 275 525 335
                      C500 405 445 425 395 465
                    "
                  />
                </circle>
              </svg>

              {/* =================================================
                  MARRAKECH CARD
              ================================================= */}
              <div
                className="
                  absolute
                  left-[7%]
                  top-[14%]
                  z-10
                  w-[118px]
                  -rotate-[2deg]
                  overflow-hidden
                  rounded-[18px]
                  bg-card
                  shadow-[0_14px_35px_hsl(var(--heading)/0.10)]
                  transition-all
                  duration-500
                  hover:rotate-0
                  hover:scale-[1.03]
                  sm:w-[145px]
                  lg:w-[165px]
                "
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src="/images/marrakech.jpeg"
                    alt="Jemaa el-Fna square in Marrakech, Morocco"
                    fill
                    priority
                    quality={100}
                    sizes="(max-width: 640px) 240px, (max-width: 1024px) 300px, 360px"
                    className="object-cover object-center"
                  />

                  {/* LIGHT LABEL */}
                  <div className="absolute bottom-2 left-2">
                    <div className="flex items-center gap-2 rounded-full bg-card/90 px-2.5 py-1.5 shadow-sm backdrop-blur-sm">
                      <span className="h-2 w-2 rounded-full bg-primary" />

                      <span className="text-[10px] font-semibold text-heading sm:text-xs">
                        Marrakech
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  AIT BENHADDOU CARD
              ================================================= */}
              <div
                className="
                  absolute
                  right-[6%]
                  top-[24%]
                  z-10
                  w-[118px]
                  rotate-[2deg]
                  overflow-hidden
                  rounded-[18px]
                  bg-card
                  shadow-[0_14px_35px_hsl(var(--heading)/0.10)]
                  transition-all
                  duration-500
                  hover:rotate-0
                  hover:scale-[1.03]
                  sm:right-[7%]
                  sm:top-[22%]
                  sm:w-[145px]
                  lg:right-[5%]
                  lg:top-[20%]
                  lg:w-[165px]
                "
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src="/images/benhdou.jpeg"
                    alt="Ait Benhaddou kasbah in Morocco"
                    fill
                    quality={100}
                    sizes="(max-width: 640px) 240px, (max-width: 1024px) 300px, 360px"
                    className="object-cover object-center"
                  />

                  {/* LIGHT LABEL */}
                  <div className="absolute bottom-2 left-2">
                    <div className="flex items-center gap-2 rounded-full bg-card/90 px-2.5 py-1.5 shadow-sm backdrop-blur-sm">
                      <span className="h-2 w-2 rounded-full bg-primary" />

                      <span className="text-[10px] font-semibold text-heading sm:text-xs">
                        Ait Benhaddou
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  SAHARA CARD
              ================================================= */}
              <div
                className="
                  absolute
                  bottom-[1%]
                  left-[31%]
                  z-10
                  w-[108px]
                  rotate-[1deg]
                  overflow-hidden
                  rounded-[18px]
                  bg-card
                  shadow-[0_14px_35px_hsl(var(--heading)/0.10)]
                  transition-all
                  duration-500
                  hover:rotate-0
                  hover:scale-[1.03]
                  sm:bottom-[2%]
                  sm:left-[30%]
                  sm:w-[135px]
                  lg:bottom-[0%]
                  lg:left-[29%]
                  lg:w-[155px]
                "
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image
                    src="/images/cammels.jpeg"
                    alt="Camel caravan in the Sahara desert in Morocco"
                    fill
                    quality={100}
                    sizes="(max-width: 640px) 220px, (max-width: 1024px) 280px, 340px"
                    className="object-cover object-center"
                  />

                  {/* LIGHT LABEL */}
                  <div className="absolute bottom-2 left-2">
                    <div className="flex items-center gap-2 rounded-full bg-card/90 px-2.5 py-1.5 shadow-sm backdrop-blur-sm">
                      <span className="h-2 w-2 rounded-full bg-primary" />

                      <span className="text-[10px] font-semibold text-heading sm:text-xs">
                        Sahara
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  PRIVATE TOURS BADGE
              ================================================= */}
              <div
                className="
                  absolute
                  bottom-[18%]
                  left-[5%]
                  z-20
                  -rotate-[3deg]
                  rounded-full
                  border
                  border-border
                  bg-card
                  px-3
                  py-2
                  text-[10px]
                  font-semibold
                  text-heading
                  shadow-sm
                  sm:px-4
                  sm:text-xs
                "
              >
                Private tours
              </div>

              {/* =================================================
                  DECORATIVE CIRCLE
              ================================================= */}
              <div
                className="
                  absolute
                  right-[18%]
                  top-[10%]
                  h-9
                  w-9
                  rounded-full
                  bg-primary/10
                  ring-1
                  ring-primary/15
                  sm:h-12
                  sm:w-12
                "
              />

              {/* SMALL DOT */}
              <div
                className="
                  absolute
                  bottom-[31%]
                  right-[4%]
                  h-2.5
                  w-2.5
                  rounded-full
                  bg-primary
                  shadow-[0_0_0_7px_hsl(var(--primary)/0.10)]
                "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
