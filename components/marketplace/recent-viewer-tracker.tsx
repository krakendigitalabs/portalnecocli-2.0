"use client";

import { useEffect } from "react";
import { useRecentlyViewed } from "@/hooks/use-recently-viewed";

export function RecentViewerTracker({ businessId }: { businessId: string }) {
  const { addViewedItem } = useRecentlyViewed();

  useEffect(() => {
    if (businessId) {
      addViewedItem(businessId);
    }
  }, [businessId, addViewedItem]);

  return null;
}
