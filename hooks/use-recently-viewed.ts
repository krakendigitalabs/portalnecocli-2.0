"use client";

import { useState, useEffect, useCallback } from "react";

const RECENTLY_VIEWED_KEY = "portal_necocli_recently_viewed";
const MAX_RECENT = 10;

export function useRecentlyViewed() {
  const [viewedIds, setViewedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
      if (stored) {
        setViewedIds(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Failed to parse recently viewed items from localStorage.");
    }
  }, []);

  const addViewedItem = useCallback((businessId: string) => {
    setViewedIds((prev) => {
      // Remove if exists to push to front
      const filtered = prev.filter((id) => id !== businessId);
      const updated = [businessId, ...filtered].slice(0, MAX_RECENT);
      
      try {
        localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn("Failed to save recently viewed item to localStorage.");
      }
      
      return updated;
    });
  }, []);

  const clearViewedItems = useCallback(() => {
    setViewedIds([]);
    localStorage.removeItem(RECENTLY_VIEWED_KEY);
  }, []);

  return { viewedIds, addViewedItem, clearViewedItems };
}
