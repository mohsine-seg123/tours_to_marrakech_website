import React from "react";
import { getTranslations} from "next-intl/server";
import FaqClient from "@/components/sections/Home/FaqClient";
import FaqJsonLd from "@/components/seo/FaqJsonLd";

type FaqData = {
  q: string;
  a: string;
};

export default async function Faq({locale}: { locale: string }): Promise<React.JSX.Element> {
  const t = await getTranslations("FAQ");
  const faq = t.raw("items") as FaqData[];

  return (
    <>
      {/* SEO côté serveur — invisible pour l'utilisateur, visible par Google */}
      <FaqJsonLd faq={faq} locale={locale} />

      {/* Passe les données déjà traduites au composant client */}
      <FaqClient
        faq={faq}
        title={t("title")}
        subtitle={t("subtitle")}
      />
    </>
  );
}
