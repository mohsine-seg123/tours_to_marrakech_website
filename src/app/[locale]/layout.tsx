import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { routing } from "@/i18n/routing";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import "./globals.css";
import { setRequestLocale } from "next-intl/server";
import { Toaster } from "sonner";
import { AlternateSlugsProvider } from "@/contexts/AlternateSlugsContext";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const metadataByLocale = {
    en: {
      title:
        "tours marrakech desert | sahara desert trips & moroccan adventure",
      description:
        "Discover the best Marrakech desert tours, Sahara desert trips, and Moroccan adventures. Explore Merzouga, ride camels through the desert, and enjoy unforgettable Morocco excursions with local guides.",
      ogLocale: "en_US",
    },
    fr: {
      title: "Désert maroc | circuit sahara maroc",
      description:
        "Découvrez des circuits désert depuis Marrakech vers le Sahara, Merzouga et les plus beaux paysages du Maroc avec des guides locaux.",
      ogLocale: "fr_FR",
    },
    es: {
      title: "excursiones desierto Marrakech | Excursiones al Sahara",
      description:
        "Descubre excursiones desde Marrakech al desierto del Sahara, rutas en camello y aventuras inolvidables por Marruecos.",
      ogLocale: "es_ES",
    },
  };

  const content =
    metadataByLocale[locale as keyof typeof metadataByLocale] ??
    metadataByLocale.en;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://toursmarrakechdesert.com";

  const currentUrl = locale === "en" ? baseUrl : `${baseUrl}/${locale}`;

  return {
    metadataBase: new URL(baseUrl),

    title: content.title,

    description: content.description,

    keywords: [
      "marrakech to desert tour",
      "Marrakech Sahara tour",
      "Merzouga desert tour",
      "merzouga au maroc",
      "Sahara camel",
      "tauck tours morocco",
      "Marrakech excursions",
      "marrakech private tours",
    ],

    authors: [
      {
        name: "Tours Marrakech Desert",
      },
    ],
    creator: "Tours Marrakech Desert",
    publisher: "Tours Marrakech Desert",
    openGraph: {
      type: "website",
      url: currentUrl,
      title: content.title,
      description: content.description,
      siteName: "Tours Marrakech Desert",
      locale: content.ogLocale,
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "Tours Marrakech Desert - Sahara Morocco",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: ["/og-image.jpg"],
    },

    alternates: {
      canonical: currentUrl,
      languages: {
        en: baseUrl,
        fr: `${baseUrl}/fr`,
        es: `${baseUrl}/es`,
      },
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  setRequestLocale(locale);
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <NextIntlClientProvider>
          <AlternateSlugsProvider>
            <Header />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
            <Toaster position="top-right" richColors />
          </AlternateSlugsProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
