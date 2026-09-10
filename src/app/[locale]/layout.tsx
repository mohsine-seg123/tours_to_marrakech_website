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
import { FavoritesProvider } from "@/contexts/FavoritesContext";

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


export function generateMetadata(): Metadata {
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://toursmarrakechdesert.com";

  return {
    metadataBase: new URL(baseUrl),
    title: "Tours Marrakech Desert",
    authors: [{ name: "Tours Marrakech Desert" }],
    creator: "Tours Marrakech Desert",
    publisher: "Tours Marrakech Desert",

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




export default async function LocaleLayout({children,params,}: {children: React.ReactNode;params: Promise<{ locale: string }>;}) {

  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

   return (
     <html
       lang={locale}
       suppressHydrationWarning
       className={`${cormorant.variable} ${manrope.variable} h-full antialiased`}
     >
       <body className="min-h-screen flex flex-col bg-background text-foreground">
         <NextIntlClientProvider>
           <AlternateSlugsProvider>
             <FavoritesProvider>
               <Header />
               <main className="flex-1 w-full">{children}</main>
               <Footer />
               <Toaster position="top-right" richColors />
             </FavoritesProvider>
           </AlternateSlugsProvider>
         </NextIntlClientProvider>
       </body>
     </html>
   );
}
