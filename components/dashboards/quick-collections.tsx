"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, Heart, Compass } from "lucide-react";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";
import { featuredBusinessesSeed } from "@/data/featured-businesses";
import { BusinessCard } from "@/components/marketplace/business-card";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { CustomerFavorite } from "@/data/favoriteService";

type QuickCollectionsProps = {
  favorites: CustomerFavorite[];
};

export function QuickCollections({ favorites }: QuickCollectionsProps) {
  const { viewedIds } = useRecentlyViewed();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Mapa para favoritos
  const favoriteBusinessIds = new Set(favorites.map((f) => f.business_id));
  const favoriteBusinesses = featuredBusinessesSeed
    .filter((b) => favoriteBusinessIds.has(b.id))
    .slice(0, 3)
    .map((b) => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      category: "hotels" as const, // Dummy for card type
      categoryLabel: b.category,
      summary: b.shortDescription,
      location: b.address,
      priceRange: b.priceRange || "$",
      status: "active" as const,
    }));

  // Mapa para vistos recientemente (excluyendo los que ya están en favoritos para no repetir si hay pocos)
  const recentlyViewedBusinesses = viewedIds
    .filter((id) => !favoriteBusinessIds.has(id))
    .map((id) => featuredBusinessesSeed.find((b) => b.id === id))
    .filter(Boolean)
    .slice(0, 3)
    .map((b) => {
      const business = b!;
      return {
        id: business.id,
        name: business.name,
        slug: business.slug,
        category: "hotels" as const,
        categoryLabel: business.category,
        summary: business.shortDescription,
        location: business.address,
        priceRange: business.priceRange || "$",
        status: "active" as const,
      };
    });

  // Si no hay favoritos ni recientes
  if (favoriteBusinesses.length === 0 && recentlyViewedBusinesses.length === 0) {
    return (
      <SurfaceCard className="rounded-[28px] p-8 text-center bg-sand/30">
        <div className="flex justify-center mb-4">
          <div className="bg-white p-3 rounded-full shadow-sm">
            <Compass className="w-8 h-8 text-teal" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-ink">Comienza tu aventura</h3>
        <p className="mt-1 text-sm text-ink/60 mb-5">
          Explora Necoclí, marca tus hoteles favoritos y guarda tu historial para armar el viaje perfecto.
        </p>
        <Link
          href="/negocios"
          className="inline-flex items-center gap-2 bg-teal text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-soft hover:bg-teal/90 transition-all"
        >
          Explorar Directorio
        </Link>
      </SurfaceCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sección Favoritos */}
      {favoriteBusinesses.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-coral fill-coral/10" />
              <h3 className="font-bold text-ink text-lg">Tus Favoritos</h3>
            </div>
            {favorites.length > 3 && (
              <Link
                href="/customer/favoritos"
                className="text-xs font-bold text-teal hover:text-coral transition-colors uppercase tracking-wider"
              >
                Ver todos
              </Link>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favoriteBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </section>
      )}

      {/* Sección Vistos Recientemente */}
      {recentlyViewedBusinesses.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4 mt-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal" />
              <h3 className="font-bold text-ink text-lg">Vistos recientemente</h3>
            </div>
            {viewedIds.length > 3 && (
              <Link
                href="/customer/vistos"
                className="text-xs font-bold text-teal hover:text-coral transition-colors uppercase tracking-wider"
              >
                Ver historial
              </Link>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentlyViewedBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
