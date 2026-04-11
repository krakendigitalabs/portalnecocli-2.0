import { beforeEach, describe, expect, it, vi } from "vitest";

const cookiesMock = vi.fn();
const redirectMock = vi.fn((value: string) => {
  throw new Error(`redirect:${value}`);
});
const verifySessionCookieMock = vi.fn();

vi.mock("next/headers", () => ({
  cookies: cookiesMock,
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("@/lib/firebase/admin", () => ({
  hasFirebaseAdminConfig: vi.fn(() => true),
  getFirebaseAdminAuth: vi.fn(() => ({
    verifySessionCookie: verifySessionCookieMock,
  })),
}));

describe("server auth enforcement", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("blocks anonymous access to private routes", async () => {
    cookiesMock.mockResolvedValue({
      get: () => undefined,
    });

    const { authorizeServerAccess } = await import("@/lib/auth/server");
    const result = await authorizeServerAccess();

    expect(result).toEqual({ ok: false, status: 401 });
  });

  it("blocks authenticated users with insufficient roles", async () => {
    cookiesMock.mockResolvedValue({
      get: () => ({ value: "session-cookie" }),
    });
    verifySessionCookieMock.mockResolvedValue({
      uid: "user-1",
      email: "viewer@portalnecocli.com",
      name: "Viewer",
      picture: null,
      email_verified: true,
      roles: ["customer"],
    });

    const { authorizeServerAccess } = await import("@/lib/auth/server");
    const result = await authorizeServerAccess({
      roles: ["super_admin", "admin"],
    });

    expect(result).toEqual({ ok: false, status: 403 });
  });

  it("allows admins with a valid session", async () => {
    cookiesMock.mockResolvedValue({
      get: () => ({ value: "session-cookie" }),
    });
    verifySessionCookieMock.mockResolvedValue({
      uid: "user-2",
      email: "admin@portalnecocli.com",
      name: "Admin",
      picture: null,
      email_verified: true,
      roles: ["admin"],
    });

    const { authorizeServerAccess } = await import("@/lib/auth/server");
    const result = await authorizeServerAccess({
      roles: ["super_admin", "admin"],
    });

    expect(result.ok).toBe(true);

    if (result.ok) {
      expect(result.session.user.roles).toEqual(["admin"]);
    }
  });

  it("redirects users with insufficient role to forbidden", async () => {
    cookiesMock.mockResolvedValue({
      get: () => ({ value: "session-cookie" }),
    });
    verifySessionCookieMock.mockResolvedValue({
      uid: "user-3",
      email: "business@portalnecocli.com",
      name: "Business",
      picture: null,
      email_verified: true,
      roles: ["business"],
    });

    const { requireRole } = await import("@/lib/auth/server");

    await expect(
      requireRole(["super_admin", "admin"], { nextPath: "/admin" }),
    ).rejects.toThrow("redirect:/forbidden?next=%2Fadmin");
  });
});
