import { afterEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getServerAuthSession: vi.fn(),
  sendEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/auth/server", () => ({
  getServerAuthSession: mocks.getServerAuthSession,
}));

vi.mock("@/lib/email/resend", () => ({
  sendEmail: mocks.sendEmail,
}));

vi.mock("@/lib/firebase/admin", () => ({
  hasFirebaseAdminConfig: () => false,
}));

import { POST } from "@/app/api/drivers/register/route";

function createRequest(body: unknown) {
  return new Request("http://localhost/api/drivers/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/drivers/register", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("rejects invalid registration data before sending email", async () => {
    mocks.getServerAuthSession.mockResolvedValue({ user: { uid: "driver-1" } });

    const response = await POST(
      createRequest({
        full_name: "Driver Name",
        email: "not-an-email",
        phone: "3001234567",
        whatsapp: "3001234567",
        vehicle_type: "mototaxi",
        vehicle_plate: "ABC123",
        nequi_number: "3001234567",
      }),
    );

    expect(response.status).toBe(400);
    expect(mocks.sendEmail).not.toHaveBeenCalled();
  });

  it("escapes the driver's name in the confirmation email", async () => {
    mocks.getServerAuthSession.mockResolvedValue({ user: { uid: "driver-1" } });
    vi.spyOn(console, "log").mockImplementation(() => {});

    const response = await POST(
      createRequest({
        full_name: '<img src=x onerror="alert(1)">',
        email: "driver@example.com",
        phone: "3001234567",
        whatsapp: "3001234567",
        vehicle_type: "mototaxi",
        vehicle_plate: "ABC123",
        nequi_number: "3001234567",
      }),
    );

    expect(response.status).toBe(200);
    expect(mocks.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining("&lt;img src=x onerror=&quot;alert(1)&quot;&gt;"),
      }),
    );
  });
});
