import type { Business } from "@/types/business";

export type Tour = Business & {
  durationLabel: string;
  meetingPoint: string;
};
