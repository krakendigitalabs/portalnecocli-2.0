import { createHash } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/webhooks/wompi/route";

const secret = "test-wompi-events-secret";
const signedProperties = [
  "transaction.id",
  "transaction.status",
  "transaction.amount_in_cents",
  "transaction.reference",
  "transaction.currency",
];

function createPayload(properties = signedProperties) {
  const timestamp = 1_798_350_000;
  const transaction = {
    id: "txn-test-1",
    status: "APPROVED",
    amount_in_cents: 150_000_00,
    reference: "NEC-TEST-1",
    currency: "COP",
  };
  const signedValues = properties
    .map((property) => {
      const key = property.replace("transaction.", "") as keyof typeof transaction;
      return String(transaction[key]);
    })
    .join("");
  const checksum = createHash("sha256")
    .update(`${signedValues}${timestamp}${secret}`)
    .digest("hex");

  return {
    event: "transaction.other",
    data: { transaction },
    signature: { checksum, properties },
    timestamp,
  };
}

function createRequest(payload: unknown) {
  return new NextRequest("http://localhost/api/webhooks/wompi", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

describe("POST /api/webhooks/wompi", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects signatures that do not cover the transaction reference", async () => {
    vi.stubEnv("WOMPI_EVENTS_SECRET", secret);
    const payload = createPayload(signedProperties.filter((property) => property !== "transaction.reference"));

    const response = await POST(createRequest(payload));

    expect(response.status).toBe(401);
  });

  it("rejects a transaction reference changed after signing", async () => {
    vi.stubEnv("WOMPI_EVENTS_SECRET", secret);
    const payload = createPayload();
    payload.data.transaction.reference = "TOPUP_attacker";

    const response = await POST(createRequest(payload));

    expect(response.status).toBe(401);
  });

  it("accepts a valid signature that covers the transaction reference and currency", async () => {
    vi.stubEnv("WOMPI_EVENTS_SECRET", secret);

    const response = await POST(createRequest(createPayload()));

    expect(response.status).toBe(200);
  });
});
