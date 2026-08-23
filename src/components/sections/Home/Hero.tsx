import { Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection(): React.JSX.Element {
  return (
    <section className="relative w-full">
      <div className="relative min-h-[560px] w-full overflow-hidden lg:min-h-[640px]">
        <Image
          src="/images/hero.jpg"
          alt="Koutoubia Mosque and Jemaa el-Fnaa square in Marrakech at sunset"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Content — centré */}
        <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col items-center justify-start pt-16 px-4 text-center sm:px-6 lg:min-h-[640px] lg:px-8">
          <div className="max-w-4xl">
            <h1 className="font-body text-3xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-4xl lg:text-6xl">
              Tours
              <br />
              <span className="text-text-main">Marrakech Desert</span>
            </h1>

            <p className="mt-10 text-lg font-bold text-white sm:text-xl">
              marrakech desert tour &amp; morocco tour package
            </p>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white sm:text-base">
              Explore Morocco with local experts. Private tours, desert day
              trips and unforgettable activities, with tailor-made itineraries
              to the Sahara and beyond.
            </p>

            {/* CTA buttons — centrés */}
            <div className="mt-8 flex justify-center gap-4">
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 rounded-lg bg-primary p-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary-hover"
              >
                <Users className="h-4 w-4" aria-hidden="true" />
                Private Tours
              </Link>

              <Link
                href="/Activities"
                className="inline-flex items-center gap-2 rounded-lg border border-white/70 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Users className="h-4 w-4" aria-hidden="true" />
                activities
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
