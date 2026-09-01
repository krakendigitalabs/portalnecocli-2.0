export type CategorySlug = "hotels" | "restaurants" | "tours" | "transport" | "delivery";

export type Category = {
  slug: CategorySlug;
  label: string;
  shortLabel: string;
  description: string;
  href?: string;
  metric?: string;
};
