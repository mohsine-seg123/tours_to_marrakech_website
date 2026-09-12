"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import { useAlternateSlugs } from "@/contexts/AlternateSlugsContext";
import type { Locale } from "@/i18n/routing";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

const LANGUAGES = [
  { code: "en", label: "English", country: "gb" },
  { code: "fr", label: "Français", country: "fr" },
  { code: "es", label: "Español", country: "es" },
] as const;

function FlagIcon({ country, alt }: { country: string; alt: string }) {
  return (
    <Image
      src={`https://flagcdn.com/w80/${country}.png`}
      alt={alt}
      width={20}
      height={15}
      className="rounded-[2px] object-cover shadow-sm"
      unoptimized
    />
  );
}

export default function LanguageSwitcher() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams(); // ex: { slug: "ultimate-guide-solo-travel-morocco" } sur /blog/[slug]
  const { alternateSlugs } = useAlternateSlugs();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = LANGUAGES.find((lang) => lang.code === locale);

  // Ferme le menu au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


const handleChange = (newLocale: Locale) => {
  const currentSlug = typeof params.slug === "string" ? params.slug : "";

  const targetSlug = alternateSlugs?.[newLocale] ?? currentSlug;

  if (pathname === "/blog/[slug]") {
    router.replace(
      {
        pathname: "/blog/[slug]",
        params: {
          slug: targetSlug,
        },
      },
      { locale: newLocale },
    );

    setIsOpen(false);
    return;
  }

  if (pathname === "/activities/[slug]") {
    router.replace(
      {
        pathname: "/activities/[slug]",
        params: {
          slug: targetSlug,
        },
      },
      { locale: newLocale },
    );

    setIsOpen(false);
    return;
  }

  if (pathname === "/day-trips/[slug]") {
    router.replace(
      {
        pathname: "/day-trips/[slug]",
        params: {
          slug: targetSlug,
        },
      },
      { locale: newLocale },
    );

    setIsOpen(false);
    return;
  }


  if (pathname === "/tours/[slug]") {
    router.replace(
      {
        pathname: "/tours/[slug]",
        params: {
          slug: targetSlug,
        },
      },
      { locale: newLocale },
    );

    setIsOpen(false);
    return;
  }



  // @ts-expect-error pathname et params sont cohérents à l'exécution.
   router.replace({
      pathname,
      params,
    },
    { locale: newLocale },
  );

  setIsOpen(false);
};;;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        type="button"
        aria-label={t("changeLanguage")}
        aria-expanded={isOpen}
      >
        {currentLanguage && (
          <FlagIcon
            country={currentLanguage.country}
            alt={currentLanguage.label}
          />
        )}
        <span className="hidden sm:inline">
          {currentLanguage?.code.toUpperCase()}
        </span>
        <ChevronDown
          className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 min-w-[180px] rounded-xl border border-border bg-card p-2 shadow-lg z-50">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => handleChange(lang.code)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                locale === lang.code
                  ? "bg-primary/10 text-primary"
                  : "text-text-secondary hover:bg-muted hover:text-foreground"
              }`}
            >
              <FlagIcon country={lang.country} alt={lang.label} />
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
