import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const limitMock = vi.hoisted(() => vi.fn());

vi.mock("@upstash/redis", () => ({
  Redis: class {},
}));

vi.mock("@upstash/ratelimit", () => ({
  Ratelimit: Object.assign(
    class {
      limit = limitMock;
    },
    { slidingWindow: vi.fn() },
  ),
}));

const policy = { name: "test", limit: 1, window: "1 m" } as const;

function createRequest(headers: Record<string, string> = {}) {
  return new Request("http://localhost/api/test", { method: "POST", headers });
}

describe("rate limiting", () => {
  beforeEach(() => {
    vi.resetModules();
    limitMock.mockReset();
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("uses platform-provided IP headers and ignores x-forwarded-for", async () => {
    const { getClientIdentifier } = await import("@/lib/security/rate-limit");

    expect(
      getClientIdentifier(
        createRequest({ "x-vercel-forwarded-for": "203.0.113.7", "x-forwarded-for": "1.2.3.4" }),
      ),
    ).toBe("203.0.113.7");
    expect(getClientIdentifier(createRequest({ "x-forwarded-for": "1.2.3.4" }))).toBe("unknown");
  });

  it("allows requests when the store is not configured", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    vi.stubEnv("KV_REST_API_URL", "");
    vi.stubEnv("KV_REST_API_TOKEN", "");
    const { enforceRateLimit } = await import("@/lib/security/rate-limit");

    await expect(enforceRateLimit(createRequest(), policy)).resolves.toBeNull();
    expect(limitMock).not.toHaveBeenCalled();
  });

  it("returns 429 with Retry-After once the limit is exceeded", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
    limitMock.mockResolvedValue({ success: false, reset: Date.now() + 30_000 });
    const { enforceRateLimit } = await import("@/lib/security/rate-limit");

    const response = await enforceRateLimit(createRequest(), policy);

    expect(response?.status).toBe(429);
    expect(Number(response?.headers.get("Retry-After"))).toBeGreaterThan(0);
  });

  it("allows requests under the limit and when the store fails", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
    const { enforceRateLimit } = await import("@/lib/security/rate-limit");

    limitMock.mockResolvedValueOnce({ success: true, reset: Date.now() });
    await expect(enforceRateLimit(createRequest(), policy)).resolves.toBeNull();

    limitMock.mockRejectedValueOnce(new Error("redis unavailable"));
    await expect(enforceRateLimit(createRequest(), policy)).resolves.toBeNull();
  });
});
