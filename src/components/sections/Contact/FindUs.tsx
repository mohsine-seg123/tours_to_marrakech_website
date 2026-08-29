import { MapPin } from "lucide-react";

const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=31.6337885,-8.0165977&z=16&output=embed";

export default function FindUs(): React.JSX.Element {
  return (
    <section className="bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 px-4 py-12 sm:px-6 lg:px-10 lg:py-16 items-center gap-0 lg:grid-cols-2">
        {/* Text side */}
        <div className="">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary">
              Find Us
            </span>
          </div>

          <h2 className="mt-3 text-3xl font-bold leading-tight text-heading sm:text-4xl">
            Based in Marrakech, Exploring All of Morocco
          </h2>

          <p className="mt-4 max-w-md text-sm leading-relaxed text-text-secondary sm:text-base">
            Our office is based in Marrakech, but our tours cover every corner
            of Morocco—from the Sahara Desert to Chefchaouen, Fes, Casablanca,
            and beyond.
          </p>
        </div>

        {/* Map side */}
        <div className="h-[300px] w-full lg:h-[380px]">
          <iframe
            src={MAP_EMBED_URL}
            title="Map showing Marrakech, Morocco"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
