import type { Business } from "@/types/business";

export type Restaurant = Business & {
  cuisine: string;
  deliveryAvailable: boolean;
};
