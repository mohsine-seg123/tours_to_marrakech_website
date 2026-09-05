"use client";

import { useEffect } from "react";
import { useAlternateSlugs } from "@/contexts/AlternateSlugsContext";
import type { Locale } from "@/lib/supabase/blogs";

/**
 * À placer une fois dans n'importe quelle page dont le slug d'URL est
 * traduit par langue (page détail blog, activité, tour...).
 * Ne rend rien visuellement — sert uniquement à pousser les slugs
 * alternatifs dans le contexte pour que LanguageSwitcher puisse les lire.
 */
export function RegisterAlternateSlugs({slugs,}: {slugs: Record<Locale, string> | null;}) {
  const { setAlternateSlugs } = useAlternateSlugs();
  useEffect(() => {
    setAlternateSlugs(slugs);
    return () => setAlternateSlugs(null);
  }, [slugs, setAlternateSlugs]);

  return null;
}
