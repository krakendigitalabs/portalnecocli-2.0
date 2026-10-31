import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/reservations/route";

describe("POST /api/reservations", () => {
  it("fails closed until the server can calculate a trusted price", async () => {
    const response = await POST(
      new Request("http://localhost/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: "business-1",
          business_name: "Business",
          total_amount: 1,
          lead: {
            full_name: "Tourist",
            email: "tourist@example.com",
            phone: "3000000000",
            whatsapp: "3000000000",
          },
        }),
      }),
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({
      error: expect.stringContaining("tarifa configurada"),
    });
  });
});
