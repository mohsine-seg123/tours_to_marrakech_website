import Hero from "@/components/sections/Home/Hero";
import Faq from "@/components/sections/Home/Faq";

export default async function Home({ params,}: { params: Promise<{ locale: string }>;}) {

  const { locale } = await params;

  return (
    <>
      <Hero />
      <Faq locale={locale} />
    </>
  );
}
