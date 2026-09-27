import type { Ride, RideStatus, WalletTransaction } from "@/types/ride";
import type { DriverProfile } from "@/types/driver";

/** Comisión del portal sobre cada carrera de transporte */
const PORTAL_TRANSPORT_COMMISSION = 0.1;

/** Minutos antes de que una carrera abierta expire */
const RIDE_EXPIRY_MINUTES = 5;

/**
 * Determina si la hora actual en Bogotá es tarifa nocturna (8pm - 5am).
 */
export function isNightRate(): boolean {
  const now = new Date();
  const bogotaHour = parseInt(
    now.toLocaleString("es-CO", { timeZone: "America/Bogota", hour: "numeric", hour12: false }),
    10,
  );
  return bogotaHour >= 20 || bogotaHour < 5;
}

/**
 * Calcula el pricing completo de una carrera a partir de la tarifa base.
 */
export function calculateRidePricing(basePrice: number, nightRate: boolean) {
  const finalPrice = nightRate ? basePrice * 2 : basePrice;
  const portalCommission = Math.round(finalPrice * PORTAL_TRANSPORT_COMMISSION);
  const driverNet = finalPrice - portalCommission;

  return {
    base_price: basePrice,
    is_night_rate: nightRate,
    final_price: finalPrice,
    portal_commission: portalCommission,
    driver_net: driverNet,
  };
}

/**
 * Genera el ID de referencia legible para una carrera.
 * Formato: RIDE-YYYYMMDD-XXX
 */
export function generateRideReference(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.floor(Math.random() * 900 + 100);
  return `RIDE-${dateStr}-${random}`;
}

/**
 * Valida si un conductor puede aceptar una carrera.
 * Retorna null si puede, o un string con el motivo del bloqueo.
 */
export function validateDriverCanAccept(driver: DriverProfile, ride: Ride): string | null {
  if (driver.status !== "active") {
    return "Tu cuenta no está activa. Contacta al administrador.";
  }
  if (driver.availability === "on_ride") {
    return "Ya estás en una carrera activa. Termínala primero.";
  }
  if (ride.status !== "OPEN") {
    return "Esta carrera ya fue tomada por otro conductor.";
  }

  const requiredBalance = ride.portal_commission;
  if (driver.wallet_balance < requiredBalance) {
    return `Saldo insuficiente. Necesitas al menos $${requiredBalance.toLocaleString("es-CO")} COP. Tu saldo: $${driver.wallet_balance.toLocaleString("es-CO")} COP.`;
  }

  return null;
}

/**
 * Valida si un conductor puede marcar una carrera como completada.
 */
export function validateDriverCanComplete(driver: DriverProfile, ride: Ride): string | null {
  if (ride.status !== "ACCEPTED" && ride.status !== "IN_PROGRESS") {
    return "Esta carrera no está en un estado que permita completarla.";
  }
  if (ride.driver_id !== driver.id) {
    return "No tienes permisos sobre esta carrera.";
  }

  return null;
}

/**
 * Construye el objeto WalletTransaction para el descuento de comisión.
 */
export function buildCommissionTransaction(
  driverId: string,
  ride: Ride,
  balanceAfter: number,
): Omit<WalletTransaction, "id"> {
  return {
    driver_id: driverId,
    type: "commission",
    amount: -ride.portal_commission,
    balance_after: balanceAfter,
    ride_id: ride.id,
    description: `Comisión carrera a ${ride.destination} ($${ride.final_price.toLocaleString("es-CO")})`,
    created_at: new Date().toISOString(),
    created_by: "system",
  };
}
