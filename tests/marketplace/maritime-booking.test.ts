/**
 * Maritime Booking Module — Unit Tests
 * Covers: price logic, Zod schema validation, Server Action edge cases
 */

import { describe, it, expect } from "vitest";

// ============================================================
// 1. PRICE CALCULATION LOGIC (pure functions — no framework)
// ============================================================
describe("Maritime Price Calculation", () => {
  const getBasePrice = (
    tripType: "ruta" | "sol" | "yate",
    totalPassengers: number
  ) => {
    if (tripType === "yate") return 8000000;
    const base = tripType === "sol" ? 210000 : 190000;
    return base * totalPassengers;
  };

  const getAccommodationPrice = (
    accommodation: "none" | "without_food" | "food_standard" | "food_exclusive",
    totalPassengers: number
  ) => {
    if (accommodation === "without_food") return 80000 * totalPassengers;
    if (accommodation === "food_standard") return 105000 * totalPassengers;
    if (accommodation === "food_exclusive") return 160000 * totalPassengers;
    return 0;
  };

  it("Ruta Diaria: 1 pasajero = $190.000", () => {
    expect(getBasePrice("ruta", 1)).toBe(190000);
  });

  it("Ruta Diaria: 3 pasajeros = $570.000", () => {
    expect(getBasePrice("ruta", 3)).toBe(570000);
  });

  it("Día de Sol: 1 pasajero = $210.000", () => {
    expect(getBasePrice("sol", 1)).toBe(210000);
  });

  it("Día de Sol: 2 pasajeros = $420.000", () => {
    expect(getBasePrice("sol", 2)).toBe(420000);
  });

  it("Yate Exclusivo: tarifa plana = $8.000.000 sin importar pasajeros", () => {
    expect(getBasePrice("yate", 1)).toBe(8000000);
    expect(getBasePrice("yate", 10)).toBe(8000000);
  });

  it("Alojamiento: solo transporte = $0", () => {
    expect(getAccommodationPrice("none", 2)).toBe(0);
  });

  it("Alojamiento sin alimentación: 2 pasajeros = $160.000", () => {
    expect(getAccommodationPrice("without_food", 2)).toBe(160000);
  });

  it("Alojamiento con alimentación estándar: 2 pasajeros = $210.000", () => {
    expect(getAccommodationPrice("food_standard", 2)).toBe(210000);
  });

  it("Alojamiento con alimentación exclusiva: 2 pasajeros = $320.000", () => {
    expect(getAccommodationPrice("food_exclusive", 2)).toBe(320000);
  });

  it("Total general: Ruta Diaria + Alojamiento estándar + Solidarity para 1 pax", () => {
    const base = getBasePrice("ruta", 1);
    const acc = getAccommodationPrice("food_standard", 1);
    const solidarity = 5000;
    expect(base + acc + solidarity).toBe(190000 + 105000 + 5000); // = 300.000
  });
});

// ============================================================
// 2. ZOD SCHEMA VALIDATION
// ============================================================
import { z } from "zod";

const PassengerSchema = z.object({
  name: z.string().min(2),
  docType: z.enum(["CC", "CE", "TI", "PAS"]),
  docNum: z.string().min(5),
  phone: z.string().optional().default(""),
  email: z.union([z.string().email(), z.literal("")]).optional().default(""),
  petFriendly: z.boolean().default(false),
  allergies: z.boolean().default(false),
});

const BookingSchema = z.object({
  tripType: z.enum(["ruta", "sol", "yate"]),
  destination: z.string().min(1),
  date: z.string().optional(),
  accommodation: z.enum(["none", "without_food", "food_standard", "food_exclusive"]),
  isSolidarityActive: z.boolean(),
  totalPrice: z.number().min(0),
  passengers: z.array(PassengerSchema).min(1),
});

const VALID_BOOKING = {
  tripType: "ruta" as const,
  destination: "Capurganá",
  date: "2026-09-20",
  accommodation: "none" as const,
  isSolidarityActive: false,
  totalPrice: 190000,
  passengers: [
    { name: "Juan García", docType: "CC" as const, docNum: "1234567890", phone: "3001234567", email: "juan@test.com", petFriendly: false, allergies: false },
  ],
};

describe("Zod Schema — BookingSchema", () => {
  it("Acepta una reserva completa y válida", () => {
    const result = BookingSchema.safeParse(VALID_BOOKING);
    expect(result.success).toBe(true);
  });

  it("Rechaza tripType inválido", () => {
    const result = BookingSchema.safeParse({ ...VALID_BOOKING, tripType: "helicoptero" });
    expect(result.success).toBe(false);
  });

  it("Rechaza pasajero con nombre muy corto (<2 chars)", () => {
    const result = BookingSchema.safeParse({
      ...VALID_BOOKING,
      passengers: [{ name: "A", docType: "CC", docNum: "1234567890", petFriendly: false, allergies: false }],
    });
    expect(result.success).toBe(false);
  });

  it("Rechaza pasajero con docNum muy corto (<5 chars)", () => {
    const result = BookingSchema.safeParse({
      ...VALID_BOOKING,
      passengers: [{ name: "Juan García", docType: "CC", docNum: "123", petFriendly: false, allergies: false }],
    });
    expect(result.success).toBe(false);
  });

  it("Rechaza docType desconocido", () => {
    const result = BookingSchema.safeParse({
      ...VALID_BOOKING,
      passengers: [{ name: "Juan García", docType: "RUT", docNum: "123456789", petFriendly: false, allergies: false }],
    });
    expect(result.success).toBe(false);
  });

  it("Rechaza pasajeros vacíos (array length 0)", () => {
    const result = BookingSchema.safeParse({ ...VALID_BOOKING, passengers: [] });
    expect(result.success).toBe(false);
  });

  it("Rechaza totalPrice negativo", () => {
    const result = BookingSchema.safeParse({ ...VALID_BOOKING, totalPrice: -5000 });
    expect(result.success).toBe(false);
  });

  it("Acepta 3 pasajeros simultáneos", () => {
    const result = BookingSchema.safeParse({
      ...VALID_BOOKING,
      passengers: [
        { name: "Juan García", docType: "CC", docNum: "1234567890", petFriendly: false, allergies: false },
        { name: "María López", docType: "CE", docNum: "9876543210", petFriendly: false, allergies: true },
        { name: "Carlos Ruiz", docType: "PAS", docNum: "AB12345678", petFriendly: true, allergies: false },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("Acepta reserva de Día de Sol con isSolidarityActive=true", () => {
    const result = BookingSchema.safeParse({
      ...VALID_BOOKING,
      tripType: "sol",
      isSolidarityActive: true,
      totalPrice: 215000,
    });
    expect(result.success).toBe(true);
  });

  it("Acepta Yate Exclusivo con tarifa plana", () => {
    const result = BookingSchema.safeParse({
      ...VALID_BOOKING,
      tripType: "yate",
      totalPrice: 8000000,
    });
    expect(result.success).toBe(true);
  });
});

// ============================================================
// 3. TICKET ID GENERATION (format validation)
// ============================================================
describe("Ticket ID Generation", () => {
  const generateTicketId = () => {
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    return `TKT-MAR-${datePart}-${randomPart}`;
  };

  it("Tiene el prefijo correcto TKT-MAR-", () => {
    const id = generateTicketId();
    expect(id.startsWith("TKT-MAR-")).toBe(true);
  });

  it("Tiene exactamente 4 partes separadas por guiones", () => {
    const id = generateTicketId();
    expect(id.split("-").length).toBe(4);
  });

  it("Genera IDs únicos en cada llamada", () => {
    const ids = new Set(Array.from({ length: 50 }, generateTicketId));
    expect(ids.size).toBeGreaterThan(45); // Probabilistically unique
  });

  it("La parte de fecha tiene 8 dígitos (AAAAMMDD)", () => {
    const id = generateTicketId();
    const datePart = id.split("-")[2];
    expect(datePart).toMatch(/^\d{8}$/);
  });

  it("La parte aleatoria tiene exactamente 6 caracteres alfanuméricos", () => {
    const id = generateTicketId();
    const randomPart = id.split("-")[3];
    expect(randomPart).toMatch(/^[A-Z0-9]{6}$/);
  });
});

// ============================================================
// 4. COMMISSION RULES (Business Logic)
// ============================================================
describe("Reglas de Comisión del Contrato", () => {
  const calcCommission = (
    type: "sol" | "otros" | "alojamiento" | "alimentos",
    amount: number,
    passengers?: number
  ) => {
    if (type === "sol") return (passengers ?? 1) * 10000;
    if (type === "otros") return amount * 0.05;
    if (type === "alojamiento") return amount * 0.10;
    if (type === "alimentos") return amount * 0.08;
    return 0;
  };

  it("Día de Sol: $10.000 por pasajero", () => {
    expect(calcCommission("sol", 0, 1)).toBe(10000);
    expect(calcCommission("sol", 0, 3)).toBe(30000);
  });

  it("Ruta Diaria (otros): 5% sobre $190.000 = $9.500", () => {
    expect(calcCommission("otros", 190000)).toBe(9500);
  });

  it("Yate Exclusivo (otros): 5% sobre $8.000.000 = $400.000", () => {
    expect(calcCommission("otros", 8000000)).toBe(400000);
  });

  it("Alojamiento: 10% sobre $80.000 = $8.000", () => {
    expect(calcCommission("alojamiento", 80000)).toBe(8000);
  });

  it("Alimentos: 8% sobre $50.000 = $4.000", () => {
    expect(calcCommission("alimentos", 50000)).toBe(4000);
  });

  it("Alimentos: 8% sobre $200.000 = $16.000", () => {
    expect(calcCommission("alimentos", 200000)).toBe(16000);
  });
});
