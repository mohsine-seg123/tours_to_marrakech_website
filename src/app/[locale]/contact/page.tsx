import ContactForm from "@/components/sections/Contact/ContactForms";
import ContactHero from "@/components/sections/Contact/ContactHero";
import ContactInformation from "@/components/sections/Contact/ContactInformation";
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Users,
  Zap,
  Map,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import React from "react";
import type { Metadata } from "next";
import { ContactItem, Faq, Reason } from "@/type/contact";
import FaqSection from "@/components/sections/Contact/FaqSection";
import ContactJsonLd from "@/components/seo/ContactJsonLd";
import FindUs from "@/components/sections/Contact/FindUs";

const WHATSAPP_NUMBER = "212642618936";

const SITE = {
  name: "Marrakech Package",
  url: "https://toursmarrakechdesert.com",
  email: "info@marrakechpackage.com",
  phone: "+212642618936",
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
    value: "+212 6 42 61 89 36",
    note: "Chat with us for a quick reply!",
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
  },
  {
    icon: <Phone className="h-5 w-5" aria-hidden="true" />,
    label: "Phone",
    value: "+212 6 42 61 89 36",
    href: "tel:+212642618936",
  },
  {
    icon: <Mail className="h-5 w-5" aria-hidden="true" />,
    label: "Email",
    value: "info@marrakechpackage.com",
    href: "mailto:info@marrakechpackage.com",
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Contact Marrakech Package | Plan Your Morocco Tour Today",
  description:
    "Contact Marrakech Package to plan your private Morocco tour, shared group trip, or custom desert itinerary. WhatsApp our local Marrakech team — fast replies, 7 days a week.",
  keywords: [
    "contact Marrakech tours",
    "Morocco travel agency",
    "Marrakech desert tours",
    "private Morocco tours",
    "WhatsApp Morocco travel",
    "Sahara desert package",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    type: "website",
    url: `${SITE.url}/contact`,
    siteName: SITE.name,
    title: "Contact Marrakech Package | Plan Your Morocco Tour",
    description:
      "Get in touch with our local Marrakech team. Private tours, shared groups, and tailor-made Morocco itineraries. Fast WhatsApp replies, 7 days a week.",
    locale: "en_US",
    images: [
      {
        url: "/images/hero.jpeg",
        width: 1200,
        height: 630,
        alt: "Marrakech skyline with the Koutoubia Mosque at sunset",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Marrakech Package",
    description:
      "Plan your Morocco tour with local experts. Fast WhatsApp replies, 7 days a week.",
    images: ["/images/hero.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

function page(): React.JSX.Element {
  return (
    <>
      <ContactJsonLd faqs={FAQS} site={SITE} />
      <ContactHero numero={WHATSAPP_NUMBER} />
      <section className="bg-background py-8 lg:py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
          <ContactForm />
          <ContactInformation ITEMS={ITEMS} />
        </div>
      </section>
      <FindUs />
      <FaqSection faqs={FAQS} />
    </>
  );
}

export default page;
