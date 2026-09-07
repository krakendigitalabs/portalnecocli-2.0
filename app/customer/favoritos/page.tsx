import { Heart, Navigation, Map } from "lucide-react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/server";
import { getCustomerFavorites } from "@/data/favoriteService";
import { featuredBusinessesSeed } from "@/data/featured-businesses";
import { BusinessCard } from "@/components/marketplace/business-card";

export default async function FavoritosPage() {
  const session = await requireRole(["customer", "business", "admin", "super_admin"], {
    nextPath: "/customer/favoritos",
  });

  // Fetch favorites from Firestore
  const favorites = await getCustomerFavorites(session.user.uid);
  
  const favoriteBusinessIds = new Set(favorites.map(f => f.business_id));
  const favoriteBusinesses = featuredBusinessesSeed
    .filter(b => favoriteBusinessIds.has(b.id))
    .map(b => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      category: "hotels" as const, // We use a valid CategorySlug here
      categoryLabel: b.category,
      summary: b.shortDescription,
      location: b.address,
      priceRange: b.priceRange || "$",
      status: "active" as const,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-ink tracking-tight">Tus Favoritos</h2>
        <p className="text-ink/60 mt-2">
          Colecciona los lugares mágicos que sueñas visitar en el Golfo de Urabá.
        </p>
      </div>

      {favoriteBusinesses.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[28px] shadow-soft border border-ink/5 p-12 flex flex-col items-center justify-center min-h-[450px] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-coral/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-coral/20 blur-xl rounded-full" />
                <div className="bg-white border border-coral/20 p-5 rounded-full relative z-10 shadow-sm">
                  <Heart className="w-12 h-12 text-coral fill-coral/10" />
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-ink mb-3">Aún no tienes favoritos</h3>
            <p className="text-ink/60 max-w-md mx-auto mb-10 leading-relaxed">
              Explora las maravillas de Necoclí y presiona el corazón en los hoteles y tours que más te gusten para guardarlos aquí.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/negocios"
                className="bg-coral hover:bg-coral/90 text-white font-bold py-3.5 px-8 rounded-full transition-all shadow-soft flex items-center gap-2"
              >
                <Map className="w-4 h-4" />
                Ver Hoteles
              </Link>
              <Link 
                href="/tours"
                className="bg-white border-2 border-ink/10 hover:border-teal/30 hover:bg-teal/5 text-ink font-bold py-3.5 px-8 rounded-full transition-all flex items-center gap-2"
              >
                <Navigation className="w-4 h-4 text-teal" />
                Ver Tours
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
