/**
 * Directorio centralizado de comercios aliados de Portal Necoclí.
 * Cada comercio tiene una categoría, nombre visible y correo de contacto.
 * Este mapa es la fuente de verdad para el enrutamiento de notificaciones.
 *
 * REGLA: Agregar aquí cada nuevo aliado aprobado por Kraken Digital Labs.
 */

import type { RequestCategory } from "@/types/order";

export interface MerchantRecord {
  id: string;
  name: string;
  category: RequestCategory;
  email: string;
  phone?: string;
  status: "active" | "pending" | "inactive";
}

export const MERCHANT_DIRECTORY: MerchantRecord[] = [
  // ─── HOTELES ────────────────────────────────────────────────────────────────
  {
    id: "hotel-brisa-marina",
    name: "Hotel Brisa Marina",
    category: "hotel",
    email: "hotelerisamarina@gmail.com",
    status: "active",
  },
  // ─── RESTAURANTES ───────────────────────────────────────────────────────────
  {
    id: "pollos-arabe",
    name: "Pollos Árabe",
    category: "restaurant",
    email: "pollosarabe@gmail.com",
    status: "active",
  },
  {
    id: "mariscos-necocli",
    name: "Restaurante de Mariscos Necoclí",
    category: "restaurant",
    email: "mariscos.necocli@gmail.com",
    status: "active",
  },
  // ─── TRANSPORTE ─────────────────────────────────────────────────────────────
  {
    id: "motonecos",
    name: "Motonecos (Mototaxistas, Motocarros y Taxis)",
    category: "taxi",
    email: "motonecos.necocli@gmail.com",
    status: "active",
  },
  // ─── TOURS Y TRANSPORTE MARÍTIMO ────────────────────────────────────────────
  {
    id: "ruta-manglar",
    name: "Ruta Manglar (Tours y Lanchas)",
    category: "tour",
    email: "rutamanglar.necocli@gmail.com",
    status: "active",
  },
];

/**
 * Dado un nombre de comercio (detectado por Alejandro en el chat),
 * retorna el correo oficial del aliado para notificarlo.
 * Si no encuentra coincidencia, retorna null (no envía correo al aliado).
 */
export function getMerchantEmail(businessName: string): string | null {
  if (!businessName) return null;
  const normalized = businessName.toLowerCase().trim();
  if (normalized.length < 3) return null; // Evitar matches con "el", "la", etc.

  const match = MERCHANT_DIRECTORY.find(
    (m) =>
      m.status === "active" &&
      m.name.toLowerCase().includes(normalized)
  );
  return match?.email ?? null;
}
