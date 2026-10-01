"use server";

import { unstable_cache } from "next/cache";
import { getFirebaseAdminFirestore, hasFirebaseAdminConfig } from "@/lib/firebase/admin";
import { featuredBusinessesSeed } from "@/data/featured-businesses";
import type { FeaturedBusiness } from "@/types/featured-business";

const BUSINESSES_COLLECTION = "businesses";

/**
 * Fetches all businesses from Firestore.
 * If Firestore is empty or the connection fails, it falls back to the seed data.
 */
async function fetchMarketplaceBusinesses(): Promise<FeaturedBusiness[]> {
  try {
    if (!hasFirebaseAdminConfig()) {
      console.warn("Firebase Admin is not configured. Falling back to seed data.");
      return featuredBusinessesSeed;
    }

    const db = getFirebaseAdminFirestore();
    const snapshot = await db.collection(BUSINESSES_COLLECTION).where("isActive", "!=", false).get();
    
    if (snapshot.empty) {
      console.log("Firestore businesses collection is empty. Falling back to seed data.");
      return featuredBusinessesSeed;
    }

    const businesses = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
      } as FeaturedBusiness;
    });

    return businesses;
  } catch (error) {
    console.error("Error fetching businesses from Firestore:", error);
    return featuredBusinessesSeed;
  }
}

/**
 * Cached version of the businesses fetcher.
 * Bypasses Next.js unstable_cache during tests to avoid invariant errors.
 */
export const getCachedMarketplaceBusinesses = 
  process.env.NODE_ENV === "test" 
    ? fetchMarketplaceBusinesses 
    : unstable_cache(
        fetchMarketplaceBusinesses,
        ["marketplace-businesses-cache"],
        {
          revalidate: 3600, // Revalidate cache every hour
          tags: ["marketplace-businesses"],
        }
      );
