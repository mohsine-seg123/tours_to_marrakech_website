import Image from "next/image";

import {
  ArrowUpRight,
  BadgePercent,
  Camera,
  Mail,
  MessageCircle,
} from "lucide-react";

import { FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";

import { Link } from "@/i18n/routing";

type Locale = "en" | "fr" | "es";

type CreatorOfferProps = {
  locale: Locale;
};

const content = {
  en: {
    eyebrow: "Creator partnerships",

    title: "Special Offers for Travel Creators",

    discount: "Up to 30% OFF",

    discountText:
      "Special rates available on selected private tours for eligible creators.",

    platforms: "Creators on",

    whatsapp: "WhatsApp",

    email: "Send an enquiry",

    imageBadge: "Create in Morocco",

    imageText: "Desert • Culture • Adventure",
  },

  fr: {
    eyebrow: "Partenariats créateurs",

    title: "Offres spéciales pour les créateurs de voyage",

    discount: "Jusqu’à -25 %",

    discountText:
      "Tarifs spéciaux sur certains circuits privés pour les créateurs éligibles.",

    platforms: "Créateurs sur",

    whatsapp: "WhatsApp",

    email: "Envoyer une demande",

    imageBadge: "Créez au Maroc",

    imageText: "Désert • Culture • Aventure",
  },

  es: {
    eyebrow: "Colaboraciones con creadores",

    title: "Ofertas especiales para creadores de viajes",

    discount: "Hasta 25% OFF",

    discountText:
      "Tarifas especiales en tours privados seleccionados para creadores elegibles.",

    platforms: "Creadores en",

    whatsapp: "WhatsApp",

    email: "Enviar solicitud",

    imageBadge: "Crea en Marruecos",

    imageText: "Desierto • Cultura • Aventura",
  },
};

export default function CreatorOffer({ locale }: CreatorOfferProps) {
  const t = content[locale] ?? content.en;

  return (
    <section className="bg-background pt-4 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden border border-border bg-card rounded-[4px]">
          <div className="grid lg:grid-cols-2">
            {/* LEFT — CONTENT */}
            <div className="relative flex flex-col justify-center p-4 sm:p-6 lg:p-8">
              <div className="absolute -left-20 -top-20 size-52 rounded-full bg-primary/10 blur-3xl" />

              <div className="relative">
                {/* EYEBROW */}
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  <Camera className="size-4" />
                  {t.eyebrow}
                </div>

                {/* TITLE */}
                <h2 className="mt-6 max-w-xl font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-[#161412] sm:text-4xl">
                  {t.title}
                </h2>
                {/* DISCOUNT */}
                <div className="mt-8 rounded-[4px] border border-primary/20 bg-primary/5 p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                      <BadgePercent className="size-5" />
                    </div>

                    <div>
                      <p className="font-heading text-3xl font-bold text-primary">
                        {t.discount}
                      </p>

                      <p className="mt-1 text-sm leading-6 text-text-secondary">
                        {t.discountText}
                      </p>
                    </div>
                  </div>
                </div>

                {/* SOCIAL PLATFORMS */}
                <div className="mt-8">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-text-muted">
                    {t.platforms}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium">
                      <FaInstagram className="text-primary" />
                      Instagram
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium">
                      <FaYoutube className="text-primary" />
                      YouTube
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-medium">
                      <FaTiktok className="text-primary" />
                      TikTok
                    </div>
                  </div>
                </div>

                {/* CONTACT */}
                <div className="mt-8">
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <a
                      href="https://wa.me/212704572370"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition hover:bg-primary-hover"
                    >
                      <MessageCircle className="size-4" />

                      {t.whatsapp}

                      <ArrowUpRight className="size-4" />
                    </a>

                    <Link
                      href="/contact"
                      locale={locale}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 text-sm font-bold text-foreground transition hover:border-primary/40 hover:text-primary"
                    >
                      <Mail className="size-4" />

                      {t.email}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative min-h-[400px] lg:min-h-[480px]">
              <Image
                src="/images/creatoor.webp"
                alt="Travel content creator photographing the Moroccan desert"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />

              <div className="absolute right-5 top-5 rounded-full border border-primary/30 bg-primary/90 px-4 py-2 text-xs font-semibold text-primary-foreground">
                Tours Marrakech Desert
              </div>

              {/* BOTTOM IMAGE CONTENT */}
              <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground">
                    <Camera className="size-4" />
                    {t.imageBadge}
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
