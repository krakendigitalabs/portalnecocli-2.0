"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useFavorites } from "@/components/providers/favorites-provider";
import type { Business } from "@/types/business";

type BusinessCardProps = {
  business: Business;
};

export function BusinessCard({ business }: BusinessCardProps) {
  const statusLabel = business.status === "active" ? "Activo" : "Borrador";
  
  // No va a explotar si no estamos logueados porque useFavorites devuelve array vacío
  const { favoriteIds, toggleFavorite } = useFavorites();
  const isFavorite = favoriteIds.includes(business.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(business.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="h-full"
    >
      <Link href={`/negocios/${business.id}`} className="group h-full block">
        <Card className="h-full rounded-[30px] border-ink/10 p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-gold/30">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">
                {business.categoryLabel}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-ink group-hover:text-green">
                {business.name}
              </h3>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={business.status === "active" ? "teal" : "neutral"}>{statusLabel}</Badge>
              <button 
                onClick={handleFavoriteClick}
                className={`p-2 rounded-full transition-all ${isFavorite ? 'bg-coral/10' : 'bg-ink/5 hover:bg-ink/10'}`}
                aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
              >
                <Heart 
                  className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-coral text-coral' : 'text-ink/40'}`} 
                />
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-ink/70">{business.summary}</p>
          <div className="mt-6 flex items-center justify-between text-sm text-ink/65">
            <span>{business.location}</span>
            <span className="font-semibold text-green">{business.priceRange}</span>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
