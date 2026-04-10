import type { CategorySlug } from "@/types/category";

export type BusinessStatus = "draft" | "active";

export type Business = {
  id: string;
  name: string;
  slug: string;
  category: CategorySlug;
  categoryLabel: string;
  summary: string;
  location: string;
  priceRange: string;
  status: BusinessStatus;
};
