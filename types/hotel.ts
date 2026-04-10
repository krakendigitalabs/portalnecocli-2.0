import type { Business } from "@/types/business";

export type Hotel = Business & {
  stars: 3 | 4 | 5;
  amenities: string[];
};
