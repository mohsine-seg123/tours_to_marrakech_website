import React from "react";
import Image from "next/image";
import {
  ArrowUpRight,
  Compass,
} from "lucide-react";
import { Link } from "@/i18n/routing";

function page(): React.JSX.Element {
  const whyChoose = [
    {
      number: "01",
      title: "Designed around your journey",
      text: "We do not believe every traveler should follow the same itinerary. Your route can be shaped around your time, interests and preferred travel pace.",
    },
    {
      number: "02",
      title: "Morocco, beyond the obvious",
      text: "From Marrakech and the Sahara to mountain roads, kasbahs and smaller communities, our local knowledge helps make every route more meaningful.",
    },
    {
      number: "03",
      title: "Private travel, properly cared for",
      text: "Comfortable transportation, carefully planned stages and personal support are part of the experience from beginning to end.",
    },
    {
      number: "04",
      title: "Real people, real answers",
      text: "Have a question before booking? You speak with people who understand the tours and can help you make the right choices for your trip.",
    },
  ];

  const values = [
    {
      title: "Care before everything",
      text: "Your comfort, safety and peace of mind guide the way we organize every journey.",
    },
    {
      title: "Freedom to travel your way",
      text: "Where possible, we adapt stops and timing so your trip feels personal rather than rushed.",
    },
    {
      title: "Warm Moroccan hospitality",
      text: "We want you to feel welcomed, comfortable and at ease throughout your time with us.",
    },
    {
      title: "Quality without unnecessary excess",
      text: "We focus on the things that truly improve a journey: good planning, dependable service and meaningful experiences.",
    },
    {
      title: "Local knowledge that matters",
      text: "Our recommendations are based on the route, your interests and what can genuinely improve your experience.",
    },
  ];

  return (
    <section className="overflow-hidden bg-background">
      {/* =========================================================
          HERO — EDITORIAL / ASYMMETRIC
      ========================================================= */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-6 pb-20 pt-10 lg:px-8 lg:pb-28 lg:pt-16">
          <div className="grid items-end gap-10 lg:grid-cols-[0.82fr_1.18fr]">
            {/* LEFT */}
            <div className="relative z-10 lg:pb-16">
              <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                About Tours Marrakech Desert
              </p>

              <h1 className="font-heading text-[3.6rem] font-semibold leading-[0.88] tracking-[-0.025em] text-heading sm:text-7xl lg:text-[6rem]">
                Morocco,
                <br />
                made
                <br />
                <span className="italic text-primary">personal.</span>
              </h1>

              <p className="mt-8 max-w-xl text-base leading-8 text-text-secondary sm:text-lg">
                Private journeys shaped with local knowledge, thoughtful
                planning and the freedom to experience Morocco at your own
                rhythm.
              </p>

              <div className="mt-8 flex items-center gap-5">
                <Link
                  href="/tours"
                  className="group inline-flex items-center gap-3 bg-primary px-6 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Explore our journeys
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>

                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-heading"
                >
                  Talk to us
                  <ArrowUpRight className="h-4 w-4 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative">
              <div className="relative ml-auto min-h-[520px] overflow-hidden sm:min-h-[620px] lg:min-h-[720px] lg:w-[92%]">
                <Image
                  src="/images/hero.jpg"
                  alt="Private Morocco journey with Tours Marrakech Desert"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>

              {/* floating editorial card */}
              <div className="relative -mt-20 mr-5 ml-auto w-[88%] border border-border bg-card p-6 sm:w-[70%] sm:p-8 lg:absolute lg:-bottom-12 lg:-left-12 lg:m-0 lg:w-[360px]">
                <p className="font-heading text-2xl leading-snug text-heading sm:text-3xl">
                  “A journey should feel carefully planned,
                  <span className="italic text-primary">
                    {" "}
                    never manufactured.
                  </span>
                  ”
                </p>

                <div className="mt-6 h-px w-12 bg-primary" />

                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
                  Our way of travelling
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MANIFESTO
      ========================================================= */}
      <section className="border-y border-border bg-muted">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[260px_1fr]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                Who we are
              </span>
            </div>

            <div>
              <h2 className="max-w-5xl font-heading text-4xl font-medium leading-[1.08] text-heading sm:text-5xl lg:text-6xl">
                We are not here simply to take you from one place to another. We
                are here to help you
                <span className="italic text-primary">
                  {" "}
                  experience Morocco well.
                </span>
              </h2>

              <div className="mt-10 grid gap-8 border-t border-border pt-8 md:grid-cols-2">
                <p className="leading-8 text-text-secondary">
                  Tours Marrakech Desert is a local Morocco tour company
                  creating private journeys from Marrakech and other cities
                  across the country. We combine well-planned routes with the
                  flexibility that private travel should offer.
                </p>

                <p className="leading-8 text-text-secondary">
                  Whether your journey leads through the Atlas Mountains,
                  ancient kasbahs, the Sahara, imperial cities or the Atlantic
                  coast, our aim is simple: give you the time, comfort and
                  support to enjoy Morocco without feeling rushed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          WHY CHOOSE US — NOT CARDS
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8 lg:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Why travel with us
            </p>

            <h2 className="mt-5 max-w-md font-heading text-4xl font-semibold leading-[1.02] text-heading sm:text-5xl">
              The difference is often in the details.
            </h2>

            <p className="mt-6 max-w-sm leading-7 text-text-secondary">
              A private journey should feel considered from the first message to
              the final day.
            </p>
          </div>

          <div className="border-t border-border">
            {whyChoose.map((item) => (
              <article
                key={item.number}
                className="group grid gap-5 border-b border-border py-9 sm:grid-cols-[80px_1fr] sm:py-10"
              >
                <span className="font-heading text-2xl text-primary">
                  {item.number}
                </span>

                <div className="grid gap-4 md:grid-cols-[0.8fr_1.2fr] md:gap-10">
                  <h3 className="font-heading text-2xl font-semibold leading-tight text-heading sm:text-3xl">
                    {item.title}
                  </h3>

                  <p className="leading-7 text-text-secondary">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          VISUAL BREAK
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-[1.3fr_0.7fr]">
          <div className="relative min-h-[480px] overflow-hidden">
            <Image
              src="/images/merzouga.webp"
              alt="Road through Morocco landscape"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 65vw"
            />
          </div>

          <div className="flex min-h-[360px] flex-col justify-between bg-footer p-8 sm:p-10">
            <Compass className="h-8 w-8 text-primary" />

            <div>
              <p className="font-heading text-3xl leading-tight text-footer-foreground sm:text-4xl">
                The route matters.
                <br />
                <span className="italic text-primary">
                  So does how you travel it.
                </span>
              </p>

              <p className="mt-5 max-w-sm leading-7 text-footer-muted">
                We balance driving time, meaningful stops and moments to simply
                enjoy where you are.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CORE VALUES — STAGGERED
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="mb-16 flex flex-col justify-between gap-6 border-b border-border pb-10 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              Our core values
            </p>

            <h2 className="mt-4 font-heading text-5xl font-semibold leading-none text-heading sm:text-6xl">
              What we stand for.
            </h2>
          </div>

          <p className="max-w-md leading-7 text-text-secondary">
            Simple principles that influence the way we plan, communicate and
            travel with our guests.
          </p>
        </div>

        <div className="space-y-4">
          {values.map((value, index) => (
            <article
              key={value.title}
              className={`grid gap-6 border border-border bg-card p-7 sm:p-9 lg:grid-cols-[100px_0.8fr_1.2fr] lg:items-center ${
                index % 2 === 1 ? "lg:ml-20" : "lg:mr-20"
              }`}
            >
              <span className="font-heading text-4xl text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="font-heading text-2xl font-semibold text-heading sm:text-3xl">
                {value.title}
              </h3>

              <p className="max-w-2xl leading-7 text-text-secondary">
                {value.text}
              </p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default page;
