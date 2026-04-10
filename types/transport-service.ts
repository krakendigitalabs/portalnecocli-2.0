import type { Business } from "@/types/business";

export type TransportService = Business & {
  serviceType: "transfer" | "private-route" | "shared-route";
  capacity: number;
};
