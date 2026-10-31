import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  cookies: vi.fn(),
  verifyIdToken: vi.fn(),
  verifySessionCookie: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: mocks.cookies,
}));

vi.mock("@/lib/firebase/admin", () => ({
  getFirebaseAdminAuth: () => ({
    verifyIdToken: mocks.verifyIdToken,
    verifySessionCookie: mocks.verifySessionCookie,
  }),
  getFirebaseAdminDiagnostics: vi.fn(),
  hasFirebaseAdminConfig: () => true,
}));

import { GET, POST } from "@/app/api/auth/session/route";

describe("/api/auth/session", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not return Firebase verification details from GET", async () => {
    mocks.cookies.mockResolvedValue({
      get: () => ({ value: "invalid-session" }),
    });
    mocks.verifySessionCookie.mockRejectedValue(new Error("sensitive provider detail"));
    const logError = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await GET();

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized", status: 401 });
    expect(logError).toHaveBeenCalled();
    logError.mockRestore();
  });

  it("does not return Firebase verification details from POST", async () => {
    mocks.cookies.mockResolvedValue({
      get: () => undefined,
    });
    mocks.verifyIdToken.mockRejectedValue(new Error("sensitive provider detail"));
    const logError = vi.spyOn(console, "error").mockImplementation(() => {});

    const response = await POST(
      new Request("http://localhost/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: "invalid-token" }),
      }),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized", status: 401 });
    expect(logError).toHaveBeenCalled();
    logError.mockRestore();
  });
});
