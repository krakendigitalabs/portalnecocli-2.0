import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

const resendMocks = vi.hoisted(() => ({
  send: vi.fn().mockResolvedValue({ data: { id: "email-1" }, error: null }),
}));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: resendMocks.send };
  },
}));

import { POST } from "@/app/api/contact/route";

function createRequest(body: unknown) {
  return new NextRequest("http://localhost/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contact", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it("escapes untrusted contact data in both email templates", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-api-key");
    const response = await POST(
      createRequest({
        name: '<img src=x onerror="alert(1)">',
        phone: "3001234567",
        email: "traveler@example.com",
        message: "<script>alert(1)</script>",
      }),
    );

    expect(response.status).toBe(200);
    expect(resendMocks.send).toHaveBeenCalledTimes(2);
    for (const [email] of resendMocks.send.mock.calls) {
      expect(email.html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
      expect(email.html).toContain("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;");
      expect(email.html).not.toContain("<script>alert(1)</script>");
    }
  });

  it("returns an explicit service error without the mail provider key", async () => {
    vi.stubEnv("RESEND_API_KEY", "");

    const response = await POST(
      createRequest({
        name: "Tourist Name",
        phone: "3001234567",
        email: "traveler@example.com",
        message: "Quiero información sobre turismo.",
      }),
    );

    expect(response.status).toBe(503);
    expect(resendMocks.send).not.toHaveBeenCalled();
  });

  it("does not report success when the mail provider returns an error", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-api-key");
    resendMocks.send.mockResolvedValueOnce({
      data: null,
      error: { message: "provider rejected message" },
    });

    const response = await POST(
      createRequest({
        name: "Tourist Name",
        phone: "3001234567",
        email: "traveler@example.com",
        message: "Quiero información sobre turismo.",
      }),
    );

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toMatchObject({ success: false });
  });
});
