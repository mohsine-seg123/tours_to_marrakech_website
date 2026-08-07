import { Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


export default function HeroSection(): React.JSX.Element {
  return (
    <section className="relative w-full">
      <div className="relative min-h-[560px] w-full overflow-hidden lg:min-h-[640px]">
        <Image
          src="/images/merzouga.webp"
          alt="Koutoubia Mosque and Jemaa el-Fnaa square in Marrakech at sunset"
          fill
          priority
          quality={85}
          sizes="100vw"
          className="object-cover object-center"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-secondary/70 via-secondary/10 to-transparent"
        />

        {/* Content */}
        <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:min-h-[640px] lg:px-8">
          <div className="max-w-2xl">
            <h1 className="font-body text-5xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Tours  to 
              <br />
              <span className="text-primary">Marrakech</span>
            </h1>

            <p className="mt-6 text-lg font-bold text-white sm:text-xl">
              Private Marrakech Tours &amp; Morocco Desert Packages
            </p>

            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">
              Explore Morocco with local experts. Private tours, shared group
              tours and tailor-made itineraries to all the beautiful
              destinations across Morocco.
            </p>

            {/* CTA buttons */}
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-colors hover:bg-primary-hover"
              >
                <Users className="h-4 w-4" aria-hidden="true" />
                Private Tours
              </Link>

              <Link
                href="/shared-group-tours"
                className="inline-flex items-center gap-2 rounded-lg border border-white/70 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Users className="h-4 w-4" aria-hidden="true" />
                Share Groups
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
