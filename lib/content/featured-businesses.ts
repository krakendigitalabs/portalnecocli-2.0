import { featuredBusinessesSeed } from "@/data/featured-businesses";
import { getBusinessFilterOptions, getRelatedBusinesses } from "@/lib/utils/business-links";
import type { FeaturedBusiness } from "@/types/featured-business";

export function getAllBusinesses() {
  return featuredBusinessesSeed;
}

export function getFeaturedBusinesses(limit?: number) {
  const featuredBusinesses = featuredBusinessesSeed.filter((business) => business.featured);

  return typeof limit === "number" ? featuredBusinesses.slice(0, limit) : featuredBusinesses;
}

export function getBusinessBySlug(slug: string) {
  return featuredBusinessesSeed.find((business) => business.slug === slug);
}

export function getBusinessesByServiceType(serviceType?: string) {
  if (!serviceType || serviceType === "all") {
    return featuredBusinessesSeed;
  }

  return featuredBusinessesSeed.filter((business) => business.serviceType === serviceType);
}

export function getBusinessesByFilters(filters?: { serviceType?: string; query?: string }) {
  const serviceType = filters?.serviceType;
  const query = filters?.query?.trim().toLowerCase();

  return featuredBusinessesSeed.filter((business) => {
    const matchesServiceType =
      !serviceType || serviceType === "all" ? true : business.serviceType === serviceType;

    if (!matchesServiceType) {
      return false;
    }

    if (!query) {
      return true;
    }

    const searchableFields = [
      business.name,
      business.category,
      business.shortDescription,
      business.city,
      business.neighborhood,
      ...business.tags,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableFields.includes(query);
  });
}

export function getBusinessServiceTypeOptions() {
  return getBusinessFilterOptions(featuredBusinessesSeed);
}

export function getRelatedBusinessesForDetail(business: FeaturedBusiness, limit = 3) {
  return getRelatedBusinesses(featuredBusinessesSeed, business, limit);
}
