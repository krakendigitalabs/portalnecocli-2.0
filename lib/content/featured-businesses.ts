import { featuredBusinessesSeed } from "@/data/featured-businesses";
import type { FeaturedBusiness } from "@/types/featured-business";
import {
  getBusinessFilterOptions,
  getRelatedBusinesses,
} from "@/lib/utils/business-links";

export function getAllBusinesses() {
  return featuredBusinessesSeed;
}

export function getFeaturedBusinesses(limit?: number) {
  const featuredBusinesses = featuredBusinessesSeed.filter(
    (business) => business.featured,
  );

  return typeof limit === "number"
    ? featuredBusinesses.slice(0, limit)
    : featuredBusinesses;
}

export function getBusinessBySlug(slug: string) {
  return featuredBusinessesSeed.find((business) => business.slug === slug);
}

export function getBusinessesByServiceType(serviceType?: string) {
  if (!serviceType || serviceType === "all") {
    return featuredBusinessesSeed;
  }

  return featuredBusinessesSeed.filter(
    (business) => business.serviceType === serviceType,
  );
}

export function getBusinessServiceTypeOptions() {
  return getBusinessFilterOptions(featuredBusinessesSeed);
}

export function getRelatedBusinessesForDetail(
  business: FeaturedBusiness,
  limit = 3,
) {
  return getRelatedBusinesses(featuredBusinessesSeed, business, limit);
}
