import Hero from "@/components/sections/Home/Hero";
import Faq from "@/components/sections/Home/Faq";
import Destinations from "@/components/sections/Home/Destinations";
import MarrakechDesertSection from "@/components/sections/Home/MarrakechDesertSection";
import { setRequestLocale } from "next-intl/server";
import { Locale } from "@/lib/supabase/blogs";
import HomeBlogSection from "@/components/sections/Home/HomeBlogSection";

export default async function Home({ params,}: { params: Promise<{ locale: string }>;}) {

  const { locale } = await params;
  setRequestLocale(locale);    
  return (
    <>
      <Hero />
      <Destinations />
      <MarrakechDesertSection />
      <HomeBlogSection locale={locale as Locale} />
      <Faq locale={locale} />
    </>
  );
}
