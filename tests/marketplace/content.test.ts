import { describe, expect, it } from "vitest";
import {
  getFeaturedExperiences,
  getMarketplaceCategories,
  getMarketplaceListingData,
  getMarketplaceSearchFilters,
} from "@/lib/content/marketplace";

describe("marketplace content", () => {
  it("maps legacy and new category params into service types", () => {
    expect(
      getMarketplaceSearchFilters({
        category: "hoteles",
      }).serviceType,
    ).toBe("hotel");
    expect(
      getMarketplaceSearchFilters({
        category: "domicilios",
      }).serviceType,
    ).toBe("domicilios");
  });

  it("filters businesses by service type, location, price and rating", async () => {
    const listing = await getMarketplaceListingData(
      {
        q: "playa",
        location: "Zona Playa",
        price: "$$$",
        rating: "4",
      },
      {
        serviceType: "hotel",
      },
    );

    expect(listing.totalCount).toBeGreaterThan(0);
    expect(
      listing.businesses.every((business) => {
        return (
          business.serviceType === "hotel" &&
          business.priceRange === "$$$" &&
          (business.rating ?? 0) >= 4 &&
          (business.neighborhood ?? business.city) === "Zona Playa"
        );
      }),
    ).toBe(true);
  });

  it("exposes featured experiences and category navigation", async () => {
    const categories = await getMarketplaceCategories();
    const experiences = await getFeaturedExperiences(2);

    expect(categories.some((category) => category.href === "/hoteles")).toBe(true);
    expect(experiences).toHaveLength(1);
  });
});
