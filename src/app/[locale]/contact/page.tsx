import ContactForm from "@/components/sections/Contact/ContactForms";
import ContactHero from "@/components/sections/Contact/ContactHero";
import ContactInformation from "@/components/sections/Contact/ContactInformation";
import {Clock,MapPin,Phone,Mail,} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type { Metadata } from "next";
import { ContactItem} from "@/type/contact";
import ContactJsonLd from "@/components/seo/ContactJsonLd";
import { getPathname, type Locale } from "@/i18n/routing";
import { notFound } from "next/navigation";


const WHATSAPP_NUMBER = "212704572370";


const SITE = {
  name: "Tours Marrakech Desert",
  url: "https://toursmarrakechdesert.com",
  email: "info@toursmarrakechdesert.com",
  phone: "+212704572370",
  city: "Marrakech",
  region: "Marrakech-Safi",
  country: "Morocco",
  countryCode: "MA",
  latitude: 31.6337885,
  longitude: -8.0165977,
  opens: "00:00",
  closes: "23:59",
};


const ITEMS: ContactItem[] = [
  {
    icon: <FaWhatsapp className="h-5 w-5" aria-hidden="true" />,
    label: "WhatsApp",
    value: "+212 704572370",
    note: "Chat with us for a quick reply!",
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
  },
  {
    icon: <Phone className="h-5 w-5" aria-hidden="true" />,
    label: "Phone",
    value: "+212 704572370",
    href: "tel:+212704572370",
  },
  {
    icon: <Mail className="h-5 w-5" aria-hidden="true" />,
    label: "Email",
    value: "info@toursmarrakechdesert.com",
    href: "mailto:info@toursmarrakechdesert.com",
  },
  {
    icon: <MapPin className="h-5 w-5" aria-hidden="true" />,
    label: "Location",
    value: "Marrakech, Morocco",
  },
  {
    icon: <Clock className="h-5 w-5" aria-hidden="true" />,
    label: "Available 7 Days a Week",
    value: "Monday – Sunday: 24/7",
  },
];


type ContactPageProps = {
  params: Promise<{ locale: Locale }>;
};

function isLocale(locale: string): locale is Locale {
  return locale === "en" || locale === "fr" || locale === "es";
}

const SEO = {
  en: {
    title: "Contact Tours Marrakech Desert | Plan Your Morocco Trip",
    description:
      "Contact our Marrakech team to plan your Morocco trip. Tell us your travel dates and preferences for a private tour or a personalised desert itinerary.",
    imageAlt: "Morocco — Tours Marrakech Desert",
    ogLocale: "en_US",
  },
  fr: {
    title: "Contact Tours Marrakech Desert | Votre voyage au Maroc",
    description:
      "Contactez notre équipe à Marrakech pour préparer votre voyage au Maroc. Partagez vos dates et vos envies pour un circuit privé ou un itinéraire sur mesure.",
    imageAlt: "Maroc — Tours Marrakech Desert",
    ogLocale: "fr_FR",
  },
  es: {
    title: "Contacto Tours Marrakech Desert | Tu viaje a Marruecos",
    description:
      "Contacta con nuestro equipo en Marrakech para preparar tu viaje a Marruecos. Comparte tus fechas y preferencias para un tour privado o un itinerario a medida.",
    imageAlt: "Marruecos — Tours Marrakech Desert",
    ogLocale: "es_ES",
  },
};

export async function generateMetadata({params,}: ContactPageProps): Promise<Metadata> {

  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const t = SEO[locale];

  const contactUrl = (language: Locale) =>
    new URL(getPathname({ locale: language, href: "/contact" }), SITE.url).href;

  const canonical = contactUrl(locale);

  return {
    metadataBase: new URL(SITE.url),
    title: t.title,
    description: t.description,

    alternates: {
      canonical,
      languages: {
        en: contactUrl("en"),
        fr: contactUrl("fr"),
        es: contactUrl("es"),
        "x-default": contactUrl("en"),
      },
    },

    openGraph: {
      type: "website",
      url: canonical,
      siteName: SITE.name,
      title: t.title,
      description: t.description,
      locale: t.ogLocale,
      images: [
        {
          url: "/images/hero.jpeg",
          alt: t.imageAlt,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: t.title,
      description: t.description,
      images: ["/images/hero.jpeg"],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

async function page({ params }: ContactPageProps) {
  const { locale } = await params;

  return (
    <>
      <ContactJsonLd site={SITE} locale={locale} />
      <ContactHero numero={WHATSAPP_NUMBER} locale={locale} />
      <section className="bg-background py-8 lg:py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
          <ContactInformation locale={locale} ITEMS={ITEMS} />
          <ContactForm />
        </div>
      </section>
    </>
  );
}

export default page;
