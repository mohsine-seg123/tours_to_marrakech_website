"use client";

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type FavoriteType = "activity" | "tour" | "day-trip";

export interface FavoriteItem {
  id: string;
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
const CHANGE_EVENT = "favorites-change";

const EMPTY_FAVORITES: FavoriteItem[] = [];

let cachedRaw: string | null | undefined;
let cachedFavorites: FavoriteItem[] = EMPTY_FAVORITES;

function isFavoriteItem(value: unknown): value is FavoriteItem {
  if (typeof value !== "object" || value === null) return false;

  const item = value as Record<string, unknown>;

  return (
    typeof item.id === "string" &&
    (item.type === "activity" ||
      item.type === "tour" ||
      item.type === "day-trip")
  );
}

function getSnapshot(): FavoriteItem[] {
  if (typeof window === "undefined") return EMPTY_FAVORITES;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    // React exige une référence stable si les données ne changent pas.
    if (raw === cachedRaw) return cachedFavorites;

    cachedRaw = raw;

    const parsed: unknown = raw ? JSON.parse(raw) : [];

    cachedFavorites = Array.isArray(parsed)
      ? parsed.filter(isFavoriteItem)
      : EMPTY_FAVORITES;

    return cachedFavorites;
  } catch {
    cachedRaw = undefined;
    cachedFavorites = EMPTY_FAVORITES;
    return EMPTY_FAVORITES;
  }
}

function getServerSnapshot(): FavoriteItem[] {
  return EMPTY_FAVORITES;
}

function subscribe(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function saveFavorites(items: FavoriteItem[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Stockage indisponible : les favoris restent en mémoire.
    cachedRaw = undefined;
  }

  cachedFavorites = items;

  try {
    cachedRaw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    cachedRaw = undefined;
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const favorites = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isFavorite = useCallback(
    (type: FavoriteType, id: string) =>
      favorites.some((f) => f.type === type && f.id === id),
    [favorites],
  );

  const toggleFavorite = useCallback((type: FavoriteType, id: string) => {
    // Lire l'état le plus récent avant de modifier.
    const current = getSnapshot();

    const exists = current.some((f) => f.type === type && f.id === id);

    const next = exists
      ? current.filter((f) => !(f.type === type && f.id === id))
      : [...current, { type, id }];

    saveFavorites(next);
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
