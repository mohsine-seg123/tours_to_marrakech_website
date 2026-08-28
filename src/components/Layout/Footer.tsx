import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import ReseauxSociaux from "@/components/ui/ReseauxSociaux";

const TRIPADVISOR_URL =
  "https://www.tripadvisor.com/Attraction_Review-g293734-d34332055-Reviews-Treck_To_Morocco-Marrakech_Marrakech_Safi.html";

const FOOTER_TOURS = [
  { href: "/tours/marrakech", label: "Tours from Marrakech" },
  { href: "/tours/fes", label: "Tours from Fes" },
  { href: "/tours/casablanca", label: "Tours from Casablanca" },
  { href: "/tours/tangier", label: "Tours from Tangier" },
  { href: "/tours/agadir", label: "Tours from Agadir" },
];

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/activities", label: "Activities Marrakech" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/day-trips", label: "Day Trips" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-footer text-footer-foreground">
      <section className="px-4 pb-12 pt-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 sm:gap-14 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr] lg:gap-10">
          {/* BRAND */}

          <div>
            <Link href="/" className="inline-flex items-center">
              {/* <Image
                src="/logo.png"
                alt="Trips to Marrakech"
                width={160}
                height={40}
                sizes="160px"
                className="h-auto w-30"
              /> */} Logo
            </Link>

            <p className="mt-2 max-w-sm text-sm leading-7 text-footer-muted sm:text-[15px] sm:leading-8">
              Tours To Marrakech is a local Morocco tour operator creating
              private tours, Sahara desert experiences and tailor-made journeys
              across Marrakech, Fes, Merzouga, Chefchaouen and the Atlas
              Mountains.
            </p>

            <div className=" flex justify-center sm:justify-start">
              <ReseauxSociaux />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-footer-foreground sm:text-sm">
              Popular Tours
            </h3>

            <ul className="mt-6">
              {FOOTER_TOURS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm inline-flex min-h-11 font-medium text-footer-foreground/85 transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-footer-foreground sm:text-sm">
              Useful Links
            </h3>

            <ul className="mt-6">
              {FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm inline-flex min-h-11 font-medium text-footer-foreground/85 transition hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-footer-foreground sm:text-sm">
              Contact
            </h3>

            <ul className="mt-6 space-y-5">
              <li className="flex gap-3 text-sm leading-6 text-footer-muted">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />

                <span>Morocco · Marrakech · Fes · Merzouga</span>
              </li>

              <li className="flex gap-3 text-sm leading-6 text-footer-muted">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold" />

                <a
                  href="tel:+212643577845"
                  className="transition hover:text-gold"
                >
                  +212643577845
                </a>
              </li>

              <li className="flex gap-3 text-sm leading-6 text-footer-muted">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold" />

                <a
                  href="mailto:info@tripstomarrakech.com"
                  className="break-all transition hover:text-gold"
                >
                  info@tripstomarrakech.com
                </a>
              </li>
            </ul>

            {/* PAYMENT */}

            <div className="flex flex-row justify-center items-center">
              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-footer-foreground">
                  Accepted Payment
                </p>
                <Image
                  src="/images/payement.webp"
                  alt="Accepted payment methods"
                  quality={70}
                  width={140}
                  height={44}
                  className="h-20 w-auto object-contain"
                />
              </div>

              <div className="mt-6 sm:ml-6 sm:mt-8">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-footer-foreground">
                  Trusted By Travelers
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-centerpx-3">
                    <a
                      aria-label="View Trips to Marrakech reviews on TripAdvisor"
                      href={TRIPADVISOR_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src="/images/tripadvisor-logo-circle-owl-icon-black-green-1536x1536-1.webp"
                        alt=""
                        width={65}
                        height={65}
                        className="h-20 w-20 object-contain"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COPYRIGHT */}

      <section className="border-t border-footer-border px-4 py-5 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-footer-muted/80">
          © {new Date().getFullYear()} Tours To Marrakech. All rights reserved.
        </p>
      </section>
    </footer>
  );
}
