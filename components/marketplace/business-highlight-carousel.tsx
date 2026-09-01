import { FeaturedBusinessCard } from "@/components/marketplace/featured-business-card";
import type { FeaturedBusiness } from "@/types/featured-business";

type BusinessHighlightCarouselProps = {
  businesses: FeaturedBusiness[];
};

export function BusinessHighlightCarousel({ businesses }: BusinessHighlightCarouselProps) {
  return (
    <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {businesses.map((business) => (
        <div key={business.id} className="min-w-[85%] snap-start sm:min-w-[420px]">
          <FeaturedBusinessCard business={business} />
        </div>
      ))}
    </div>
  );
}
