import { beforeEach, describe, expect, it, vi } from "vitest";

describe("firebase config diagnostics", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("detects when authDomain and projectId point to different Firebase projects", async () => {
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "test-api-key");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "other-project.firebaseapp.com");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "portalnecocli2026");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", "portalnecocli2026.appspot.com");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "123456");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_APP_ID", "1:123456:web:abcdef");

    const configModule = await import("@/lib/firebase/config");
    const diagnostics = configModule.getFirebasePublicConfigDiagnostics();

    expect(diagnostics.hasConfig).toBe(true);
    expect(diagnostics.inferredProjectId).toBe("other-project");
    expect(diagnostics.authDomainMatchesProject).toBe(false);
  });

  it("maps configuration-not-found to a production-actionable message", async () => {
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_API_KEY", "test-api-key");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "portalnecocli2026.firebaseapp.com");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID", "portalnecocli2026");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET", "portalnecocli2026.appspot.com");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID", "123456");
    vi.stubEnv("NEXT_PUBLIC_FIREBASE_APP_ID", "1:123456:web:abcdef");

    const { firebaseConfig } = await import("@/lib/firebase/config");
    const { getFirebaseAuthErrorDetails } = await import("@/lib/firebase/errors");
    const details = getFirebaseAuthErrorDetails(
      { code: "auth/configuration-not-found" },
      firebaseConfig,
    );

    expect(details.message).toContain("Google Sign-In no está configurado");
    expect(details.action).toContain("Authentication > Sign-in method");
  });
});
