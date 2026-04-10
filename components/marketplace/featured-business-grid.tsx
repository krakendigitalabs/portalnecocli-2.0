import { FeaturedBusinessCard } from "@/components/marketplace/featured-business-card";
import type { FeaturedBusiness } from "@/types/featured-business";

type FeaturedBusinessGridProps = {
  businesses: FeaturedBusiness[];
};

export function FeaturedBusinessGrid({
  businesses,
}: FeaturedBusinessGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {businesses.map((business) => (
        <FeaturedBusinessCard key={business.id} business={business} />
      ))}
    </div>
  );
}
