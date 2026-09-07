"use client";

import { Heart } from "lucide-react";
import { useFavorites, type FavoriteType } from "@/contexts/FavoritesContext";

export function FavoriteButton({id,type,}: {id: string;type: FavoriteType;}) {

  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(type, id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(type, id);
      }}
      aria-pressed={active}
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/85 backdrop-blur-sm "
    >
      <Heart
        className={`h-6 w-6 transition-colors ${
          active ? "fill-primary text-primary" : "fill-none text-primary"
        }`}
      />
    </button>
  );
}
