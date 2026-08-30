"use client";

import { FeaturedBusinessCard } from "@/components/marketplace/featured-business-card";
import type { FeaturedBusiness } from "@/types/featured-business";
import { motion } from "framer-motion";

type FeaturedBusinessGridProps = {
  businesses: FeaturedBusiness[];
};

export function FeaturedBusinessGrid({
  businesses,
}: FeaturedBusinessGridProps) {
  return (
    <div className="grid gap-6 md:gap-10 md:grid-cols-2 xl:grid-cols-3 py-10" role="list">
      {businesses.map((business, index) => (
        <motion.div
          key={business.id}
          animate={{ y: [0, -15, 0] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.4, // Staggered levitation
          }}
          className="w-full h-full"
        >
          <FeaturedBusinessCard business={business} />
        </motion.div>
      ))}
    </div>
  );
}
