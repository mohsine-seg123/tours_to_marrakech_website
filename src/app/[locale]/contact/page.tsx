import ContactForm from "@/components/sections/Contact/ContactForms";
import ContactHero from "@/components/sections/Contact/ContactHero";
import ContactInformation from "@/components/sections/Contact/ContactInformation";
import {Clock,MapPin,Phone,Mail,} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type { Metadata } from "next";
import { ContactItem, Faq} from "@/type/contact";
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


const FAQS: Faq[] = [
  {
    question: "How quickly will you reply to my inquiry?",
    answer:
      "We typically respond within 1 to 2 hours during business hours (8 AM – 10 PM Morocco time), 7 days a week. For urgent requests, message us directly on WhatsApp for an instant reply — our team is always online.",
  },
  {
    question: "How far in advance should I book my desert tour?",
    answer:
      "We recommend booking at least 48 hours before your desired departure date to guarantee availability, especially during peak season (March–May and September–November). Last-minute bookings are possible depending on availability — contact us and we'll do our best.",
  },
  {
    question: "Can I modify my tour after booking?",
    answer:
      "Yes. You can change your dates, add extra stops, extend your trip, or adjust group size free of charge up to 48 hours before departure. Just send us a message and we'll rearrange everything for you.",
  },
  {
    question: "Do I need to pay a deposit to confirm my booking?",
    answer:
      "A 20% deposit secures your reservation, payable by credit card, PayPal, or bank transfer. The remaining balance is due on the first day of your tour — you can pay in cash (EUR, USD, GBP, MAD) or by card.",
  },
  {
    question: "What happens if I need to cancel my tour?",
    answer:
      "Full refund for cancellations made 48 hours or more before departure. Cancellations within 48 hours may incur a partial charge depending on the tour type. We also offer free date changes whenever possible — just reach out.",
  },
  {
    question: "Can you arrange airport pickup when I arrive in Marrakech?",
    answer:
      "Yes. We provide private airport transfers from Marrakech Menara Airport (RAK) directly to your riad or hotel, including Medina locations where cars cannot enter — a porter will meet you at the nearest gate. Available 24/7, day or night.",
  },
  {
    question: "I'm traveling solo — can I still book a tour?",
    answer:
      "Absolutely. Solo travelers are welcome on all our tours. Choose a private tour for a fully personalized experience, or join one of our shared group departures to meet other travelers and share the cost.",
  },
  {
    question: "Is WhatsApp the best way to contact you?",
    answer:
      "WhatsApp is the fastest way to reach us — you'll get a reply within minutes. You can also use the contact form on this page, email us, or call directly. We're available in English, French, Spanish, and Arabic.",
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
