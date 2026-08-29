import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";

const WHATSAPP_MESSAGE =
  "Hello! I'd like to know more about your Morocco tours.";

export default function ContactHero({
  numero,
}: {
  numero: string;
}): React.JSX.Element {
  const whatsappUrl = `https://wa.me/${numero}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background image */}
      <div className="relative min-h-[360px] w-full lg:min-h-[420px]">
        <Image
          src="/images/merzouga.webp"
          alt="Marrakech skyline with the Koutoubia Mosque at sunset"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Dark gradient for readability */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-secondary/70 via-secondary/30 to-secondary/10"
        />

        {/* Content */}
        <div className="relative mx-auto flex min-h-[360px] max-w-7xl flex-col justify-center px-4 py-14 sm:px-6 lg:min-h-[420px] lg:px-8">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Contact Us
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
              Let&apos;s Plan Your Moroccan Adventure Together
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              Whether you&apos;re looking for a private tour, a shared group
              trip, or a customized itinerary, our local team is here to help.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary-hover"
              >
                <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
