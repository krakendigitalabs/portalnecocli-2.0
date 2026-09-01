import { describe, expect, it } from "vitest";
import { featuredBusinessesSeed } from "@/data/featured-businesses";
import {
  getAdminDashboardData,
  getMerchantDashboardData,
  getScopedBusinesses,
} from "@/lib/dashboards/data";
import type { AuthScope } from "@/types/auth";

describe("dashboard data", () => {
  it("returns global metrics for admins", () => {
    const data = getAdminDashboardData();

    expect(data.metrics.find((metric) => metric.label === "Negocios totales")?.value).toBe(
      String(featuredBusinessesSeed.length),
    );
    expect(data.topBusinesses.length).toBeGreaterThan(0);
  });

  it("filters merchant data to the assigned tenant and business ids", async () => {
    const scope: AuthScope = {
      global: false,
      tenantId: "tenant-hospitality-coast",
      businessIds: ["hotel-brisa-marina"],
      serviceTypes: ["hotel"],
    };

    const businesses = getScopedBusinesses(scope);
    const data = await getMerchantDashboardData(scope);

    expect(businesses).toHaveLength(1);
    expect(businesses[0]?.id).toBe("hotel-brisa-marina");
    expect(data.metrics.find((metric) => metric.label === "Negocios en tu scope")?.value).toBe(
      "1",
    );
  });

  it("prevents merchant dashboards from leaking data outside the scope", async () => {
    const data = await getMerchantDashboardData({
      global: false,
      tenantId: "tenant-hospitality-coast",
      businessIds: ["cabanas-arena-clara"],
      serviceTypes: ["hotel"],
    });

    expect(data.businesses.every((business) => business.id === "cabanas-arena-clara")).toBe(
      true,
    );
  });
});
