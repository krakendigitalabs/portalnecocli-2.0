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
      tenantId: "tenant-primavera-beach",
      businessIds: ["hotel-boutique-primavera-beach"],
      serviceTypes: ["hotel"],
    };

    const businesses = getScopedBusinesses(scope);
    const data = await getMerchantDashboardData(scope);

    expect(businesses).toHaveLength(1);
    expect(businesses[0]?.id).toBe("hotel-boutique-primavera-beach");
    expect(data.metrics.find((metric) => metric.label === "Negocios en tu scope")?.value).toBe(
      "1",
    );
  });

  it("prevents merchant dashboards from leaking data outside the scope", async () => {
    const data = await getMerchantDashboardData({
      global: false,
      tenantId: "tenant-ibiza-garcia",
      businessIds: ["hotel-ibiza-garcia"],
      serviceTypes: ["hotel"],
    });

    expect(data.businesses.every((business) => business.id === "hotel-ibiza-garcia")).toBe(
      true,
    );
  });
});
