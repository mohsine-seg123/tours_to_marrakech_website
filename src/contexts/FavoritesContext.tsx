"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

// "activity" pour l'instant, mais déjà prêt pour "tour" et "day-trip"
export type FavoriteType = "activity" | "tour" | "day-trip";

export interface FavoriteItem {
  id: string; // toujours l'id stable, jamais le slug (traduit différemment par langue)
  type: FavoriteType;
}

interface FavoritesContextValue {
  favorites: FavoriteItem[];
  isFavorite: (type: FavoriteType, id: string) => boolean;
  toggleFavorite: (type: FavoriteType, id: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(
  undefined,
);
const STORAGE_KEY = "favorites";

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Charge depuis localStorage une seule fois, au montage côté client
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      // localStorage indisponible (navigation privée, etc.) : on continue sans persistance
    } finally {
      setHydrated(true);
    }
  }, []);

  // Sauvegarde à chaque changement, après l'hydratation initiale seulement
  // (sinon on écraserait le localStorage avec un tableau vide au premier rendu)
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // stockage plein ou indisponible : on ignore silencieusement
    }
  }, [favorites, hydrated]);

  const isFavorite = useCallback(
    (type: FavoriteType, id: string) =>
      favorites.some((f) => f.type === type && f.id === id),
    [favorites],
  );

  const toggleFavorite = useCallback((type: FavoriteType, id: string) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.type === type && f.id === id);
      return exists
        ? prev.filter((f) => !(f.type === type && f.id === id))
        : [...prev, { type, id }];
    });
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used inside <FavoritesProvider>");
  }
  return ctx;
}
