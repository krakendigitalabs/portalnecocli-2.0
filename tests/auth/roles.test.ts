import { describe, expect, it } from "vitest";
import {
  hasRequiredRole,
  hasRequiredScope,
  resolveAuthorizationFromClaims,
} from "@/lib/auth/roles";

describe("auth roles and scopes", () => {
  it("resolves roles and tenant scope from portal claims", () => {
    const authorization = resolveAuthorizationFromClaims({
      portal: {
        roles: ["business"],
        scope: {
          tenantId: "tenant-hospitality-coast",
          businessIds: ["hotel-brisa-marina", "cabanas-arena-clara"],
          serviceTypes: ["hotel"],
        },
      },
    });

    expect(authorization.roles).toEqual(["business"]);
    expect(authorization.scope.tenantId).toBe("tenant-hospitality-coast");
    expect(authorization.scope.businessIds).toEqual([
      "hotel-brisa-marina",
      "cabanas-arena-clara",
    ]);
    expect(authorization.scope.serviceTypes).toEqual(["hotel"]);
  });

  it("allows admins to satisfy any scope", () => {
    expect(
      hasRequiredScope(
        {
          global: true,
          tenantId: null,
          businessIds: [],
          serviceTypes: [],
        },
        {
          tenantId: "tenant-mar-de-sabores",
          businessId: "mar-de-sabores",
        },
      ),
    ).toBe(true);
  });

  it("treats super admins as global operators", () => {
    const authorization = resolveAuthorizationFromClaims({
      roles: ["super_admin"],
    });

    expect(authorization.roles).toEqual(["super_admin"]);
    expect(authorization.scope.global).toBe(true);
  });

  it("blocks managers from accessing data outside their business scope", () => {
    expect(
      hasRequiredScope(
        {
          global: false,
          tenantId: "tenant-hospitality-coast",
          businessIds: ["hotel-brisa-marina"],
          serviceTypes: ["hotel"],
        },
        {
          tenantId: "tenant-mar-de-sabores",
          businessId: "mar-de-sabores",
          serviceType: "restaurante",
        },
      ),
    ).toBe(false);
  });

  it("keeps role checks centralized", () => {
    expect(hasRequiredRole(["business"], ["admin", "business"])).toBe(true);
    expect(hasRequiredRole(["super_admin"], ["super_admin", "admin"])).toBe(true);
    expect(hasRequiredRole(["customer"], ["admin", "operator"])).toBe(false);
    expect(hasRequiredRole(["driver"], ["driver"])).toBe(true);
  });
});
