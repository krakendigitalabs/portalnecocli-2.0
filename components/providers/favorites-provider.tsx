"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthSession } from "@/hooks/use-auth-session";

type FavoritesContextType = {
  favoriteIds: string[];
  toggleFavorite: (businessId: string) => Promise<void>;
  isLoading: boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthSession();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      if (!user) {
        setFavoriteIds([]);
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/favorites");
        if (res.ok) {
          const data = await res.json();
          setFavoriteIds(data.favorites.map((f: any) => f.business_id));
        }
      } catch (e) {
        console.error("Error loading favorites", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadFavorites();
  }, [user]);

  const toggleFavorite = async (businessId: string) => {
    if (!user) {
      // Si no hay usuario, idealmente deberíamos mostrar un modal de login.
      // Por ahora, ignoramos o redirigimos (Auth modal idealmente)
      return;
    }

    const isFav = favoriteIds.includes(businessId);

    // Optimistic UI update
    setFavoriteIds((prev) =>
      isFav ? prev.filter((id) => id !== businessId) : [...prev, businessId],
    );

    try {
      if (isFav) {
        await fetch(`/api/favorites?businessId=${businessId}`, { method: "DELETE" });
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessId }),
        });
      }
    } catch (e) {
      console.error("Error toggling favorite", e);
      // Revertir en caso de error
      setFavoriteIds((prev) =>
        isFav ? [...prev, businessId] : prev.filter((id) => id !== businessId),
      );
    }
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, toggleFavorite, isLoading }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
