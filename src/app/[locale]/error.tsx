"use client";

import { useTranslations } from "next-intl";

export default function Error({reset,}: { error: Error & { digest?: string };reset: () => void;}) {
  const t = useTranslations("Error");

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-heading">{t("title")}</h1>
      <p className="mt-4 text-text-secondary">{t("description")}</p>
      <button
        onClick={reset}
        className="mt-8 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-hover"
      >
        {t("tryAgain")}
      </button>
    </div>
  );
}
