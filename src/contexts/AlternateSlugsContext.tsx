"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import type { Locale } from "@/lib/supabase/blogs";

/**
 * Sur une page dont le [slug] de l'URL est traduit différemment par langue
 * (ex: /en/blog/ultimate-guide-... vs /fr/blog/guide-ultime-...), le
 * LanguageSwitcher ne peut pas deviner le bon slug cible tout seul.
 * La page (Server Component) enregistre ici les 3 équivalents au montage,
 * et le switcher les consulte au moment de construire l'URL.
 *
 * Sur une page sans slug traduit (Home, Tours, etc.), rien n'est enregistré
 * et `alternateSlugs` reste `null` : le switcher retombe sur son
 * comportement par défaut (réutiliser les mêmes params).
 */
type AlternateSlugsMap = Record<Locale, string> | null;

interface AlternateSlugsContextValue {
  alternateSlugs: AlternateSlugsMap;
  setAlternateSlugs: (map: AlternateSlugsMap) => void;
}

const AlternateSlugsContext = createContext<AlternateSlugsContextValue | undefined>(undefined);


export function AlternateSlugsProvider({ children }: { children: ReactNode }) {
  const [alternateSlugs, setAlternateSlugsState] = useState<AlternateSlugsMap>(null);

  const setAlternateSlugs = useCallback((map: AlternateSlugsMap) => {
    setAlternateSlugsState(map);
  }, []);

  return (
    <AlternateSlugsContext.Provider value={{ alternateSlugs, setAlternateSlugs }}>
      {children}
    </AlternateSlugsContext.Provider>
  );
}

export function useAlternateSlugs() {
  const ctx = useContext(AlternateSlugsContext);
  if (!ctx) {
    throw new Error(
      "useAlternateSlugs must be used inside <AlternateSlugsProvider>",
    );
  }
  return ctx;
}
