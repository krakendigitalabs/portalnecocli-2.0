import type { BusinessServiceType, FeaturedBusiness } from "@/types/featured-business";

export type MarketplaceCategoryKey =
  | "all"
  | "hoteles"
  | "restaurantes"
  | "tours"
  | "transporte";

export type MarketplaceSearchParams = {
  q?: string;
  category?: string;
  location?: string;
  price?: string;
  rating?: string;
};

export type MarketplaceFilters = {
  query: string;
  serviceType: BusinessServiceType | "all";
  location: string | null;
  priceRange: string | null;
  minRating: number | null;
};

export type MarketplaceCategory = {
  key: MarketplaceCategoryKey;
  label: string;
  shortLabel: string;
  description: string;
  href: string;
  serviceType: BusinessServiceType | "all";
  heroTitle: string;
  heroDescription: string;
  searchPlaceholder: string;
};

export type MarketplaceFilterOptions = {
  locations: string[];
  priceRanges: string[];
  ratings: number[];
};

export type MarketplaceListingData = {
  filters: MarketplaceFilters;
  businesses: FeaturedBusiness[];
  totalCount: number;
  options: MarketplaceFilterOptions;
  category: MarketplaceCategory;
};
