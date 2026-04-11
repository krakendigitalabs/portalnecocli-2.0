import { describe, expect, it } from "vitest";
import {
  buildPortalUrl,
  getDashboardRewritePath,
  getPortalApp,
  isPublicPortalPath,
  resolvePortalAppFromHost,
} from "@/lib/routing/subdomains";

describe("subdomain routing", () => {
  it("maps admin subdomains to the admin app", () => {
    expect(resolvePortalAppFromHost("admin.portalnecocli.com")).toBe("admin");
    expect(resolvePortalAppFromHost("admin.localhost:3000")).toBe("admin");
  });

  it("maps negocio subdomains to the business app", () => {
    expect(resolvePortalAppFromHost("negocio.portalnecocli.com")).toBe("business");
    expect(resolvePortalAppFromHost("negocio.localhost:3000")).toBe("business");
  });

  it("resolves internal dashboard paths from subdomain roots", () => {
    expect(getDashboardRewritePath("/", "admin")).toBe("/admin");
    expect(getDashboardRewritePath("/", "business")).toBe("/merchant");
    expect(getDashboardRewritePath("/usuarios", "admin")).toBe("/admin/usuarios");
    expect(getDashboardRewritePath("/reservas", "business")).toBe("/merchant/reservas");
    expect(getDashboardRewritePath("/admin/usuarios", "admin")).toBeNull();
    expect(getDashboardRewritePath("/merchant/reservas", "business")).toBeNull();
    expect(getDashboardRewritePath("/ingresar", "admin")).toBeNull();
  });

  it("falls back to path-based routing on the main domain", () => {
    expect(getPortalApp("/admin", "portalnecocli.com")).toBe("admin");
    expect(getPortalApp("/merchant", "portalnecocli.com")).toBe("business");
    expect(getPortalApp("/", "portalnecocli.com")).toBe("public");
  });

  it("treats auth and recovery pages as public even on dashboard hosts", () => {
    expect(isPublicPortalPath("/ingresar")).toBe(true);
    expect(isPublicPortalPath("/forbidden")).toBe(true);
    expect(getPortalApp("/ingresar", "admin.portalnecocli.com")).toBe("public");
    expect(getPortalApp("/forbidden", "negocio.portalnecocli.com")).toBe("public");
  });

  it("builds host-aware dashboard and portal urls", () => {
    expect(
      buildPortalUrl("admin", "/", {
        host: "portalnecocli.com",
        protocol: "https",
      }),
    ).toBe("https://admin.portalnecocli.com/");
    expect(
      buildPortalUrl("business", "/", {
        host: "localhost:3000",
        protocol: "http",
      }),
    ).toBe("http://negocio.localhost:3000/");
    expect(
      buildPortalUrl("public", "/", {
        host: "admin.portalnecocli.com",
        protocol: "https",
      }),
    ).toBe("https://portalnecocli.com/");
  });
});
