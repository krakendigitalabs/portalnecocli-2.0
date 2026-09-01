import "server-only";
import { cache } from "react";
import { commercialHomeContent as seedCommercialHomeContent } from "@/data/commercial-content";
import { firestoreCommercialHomePath } from "@/lib/firebase/config";
import { fetchFirestoreDocument } from "@/lib/firebase/firestore-rest";
import type { CommercialHomeContent } from "@/types/commercial-content";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isCommercialHomeContent(value: unknown): value is CommercialHomeContent {
  if (!isRecord(value)) {
    return false;
  }

  return [
    "hero",
    "valueProposition",
    "touristSection",
    "merchantSection",
    "directorySection",
    "showcaseSection",
    "bonusSection",
    "reservationCta",
    "contactSection",
  ].every((key) => key in value);
}

export const getCommercialHomeContent = cache(async (): Promise<CommercialHomeContent> => {
  try {
    const remoteContent = await fetchFirestoreDocument<CommercialHomeContent>(
      firestoreCommercialHomePath,
    );

    if (isCommercialHomeContent(remoteContent)) {
      return remoteContent;
    }
  } catch (error) {
    console.error("Failed to load commercial home content from Firestore.", {
      error,
    });
  }

  return seedCommercialHomeContent;
});
