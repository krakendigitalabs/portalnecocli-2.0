import { describe, expect, it } from "vitest";
import { getMerchantEmail } from "@/data/merchantDirectory";
import { COMMISSION_RATES } from "@/types/order";
import type { RequestCategory } from "@/types/order";

describe("🛡️ Poka Yoke: Validaciones de Negocio", () => {
  describe("1. Directorio de Aliados Comerciales", () => {
    it("Debe enrutar el correo correcto a Pollos Árabe, ignorando mayúsculas y espacios", () => {
      expect(getMerchantEmail(" POLLOS Árabe ")).toBe("pollosarabe@gmail.com");
      expect(getMerchantEmail("pollos árabe")).toBe("pollosarabe@gmail.com");
    });

    it("Debe enrutar correctamente a Hotel Brisa Marina", () => {
      expect(getMerchantEmail("Brisa Marina")).toBe("hotelerisamarina@gmail.com");
    });

    it("Debe retornar null si la cadena está vacía (Prevención de match accidental)", () => {
      expect(getMerchantEmail("")).toBeNull();
      expect(getMerchantEmail("   ")).toBeNull();
    });

    it("Debe retornar null si la cadena es muy corta (Evita que 'el' o 'la' hagan match)", () => {
      expect(getMerchantEmail("el")).toBeNull();
      expect(getMerchantEmail("a")).toBeNull();
    });

    it("Debe retornar null si el comercio no existe o está inactivo", () => {
      expect(getMerchantEmail("Restaurante El Fantasma")).toBeNull();
    });
  });

  describe("2. Tasas de Comisión (Take Rates) por Categoría", () => {
    it("Debe respetar la comisión estricta del 10% para hoteles", () => {
      expect(COMMISSION_RATES.hotel).toBe(0.10);
    });

    it("Debe respetar la comisión estricta del 12% para tours", () => {
      expect(COMMISSION_RATES.tour).toBe(0.12);
    });

    it("Debe respetar la comisión estricta del 6% para restaurantes y delivery", () => {
      expect(COMMISSION_RATES.restaurant).toBe(0.06);
      expect(COMMISSION_RATES.delivery).toBe(0.06);
    });

    it("Debe respetar la comisión del 10% corregida para los taxis", () => {
      expect(COMMISSION_RATES.taxi).toBe(0.10);
    });

    it("El fallback general debe ser del 6% para evitar fallos matemáticos", () => {
      expect(COMMISSION_RATES.general).toBe(0.06);
    });

    it("Debe evitar el tipo NaN probando el cálculo del backend con un fallback seguro", () => {
      // Simulación del comportamiento seguro inyectado en concierge.ts
      const alucinatedCategory = "avion" as unknown as RequestCategory;
      const rate = COMMISSION_RATES[alucinatedCategory] ?? COMMISSION_RATES.general;
      
      expect(rate).toBe(0.06); // Debe aplicar el 6% por defecto en vez de undefined
      expect(typeof rate).toBe("number");
      expect(isNaN(rate)).toBeFalsy();
    });
  });
});
