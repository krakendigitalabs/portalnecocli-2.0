"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthSession } from "@/hooks/use-auth-session";

type FavoritesContextType = {
  favoriteIds: string[];
  toggleFavorite: (businessId: string) => Promise<void>;
  isLoading: boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthSession();
  const router = useRouter();
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
      alert("Para guardar favoritos, por favor inicia sesión como turista.");
      router.push("/ingresar");
      return;
    }

    const isFav = favoriteIds.includes(businessId);

    // Optimistic UI update
    setFavoriteIds((prev) =>
      isFav ? prev.filter((id) => id !== businessId) : [...prev, businessId],
    );

    try {
      if (isFav) {
        const res = await fetch(`/api/favorites?businessId=${businessId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Error del servidor al eliminar favorito");
      } else {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessId }),
        });
        if (!res.ok) throw new Error("Error del servidor al agregar favorito");
      }
    } catch (e) {
      console.error("Error toggling favorite", e);
      // Revertir en caso de error
      setFavoriteIds((prev) =>
        isFav ? [...prev, businessId] : prev.filter((id) => id !== businessId),
      );
      alert("Hubo un error al guardar tu favorito. Inténtalo de nuevo.");
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
