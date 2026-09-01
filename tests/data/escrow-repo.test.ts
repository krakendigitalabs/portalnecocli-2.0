import { describe, it, expect, vi, beforeEach } from "vitest";
import { EscrowRepo } from "@/lib/data/repositories/escrow-repo";

// Mock Firebase Admin Auth/Firestore
vi.mock("@/lib/firebase/admin", () => ({
  getFirebaseAdminApp: vi.fn(),
}));

vi.mock("firebase-admin/firestore", () => {
  const getMock = vi.fn();
  const setMock = vi.fn();
  const updateMock = vi.fn();
  const docMock = vi.fn(() => ({
    id: "mock-doc-id",
    get: getMock,
    set: setMock,
    update: updateMock,
  }));
  const whereMock = vi.fn(() => ({
    get: getMock,
  }));
  const collectionMock = vi.fn(() => ({
    doc: docMock,
    where: whereMock,
  }));
  
  return {
    getFirestore: vi.fn(() => ({
      collection: collectionMock,
    })),
  };
});

describe("EscrowRepo", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a transaction with correct structure", async () => {
    const mockData = {
      wompiTransactionId: "wompi-123",
      businessId: "business-1",
      reservationId: "res-123",
      customerEmail: "test@example.com",
      amountInCents: 5000000, // 50.000 COP
      amountCollected: 5000000,
      platformFee: 500000,
      netAmountToBusiness: 4500000,
      currency: "COP",
      status: "held" as const,
      description: "Test Booking",
    };

    // Esto lanzará un error si el mock no está correctamente configurado o si Zod falla.
    // Como el `set` mock devuelve undefined, simplemente resolvemos el proceso.
    const resultId = await EscrowRepo.createTransaction(mockData);

    expect(resultId).toBe("mock-doc-id");
  });
});
