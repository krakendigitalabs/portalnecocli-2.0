"use server";

import { markReservationAsPaid, getReservationById } from "@/data/reservationService";
import { awardLoyaltyStar } from "@/data/loyaltyService";
import { requireRole } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export async function processSimulatedPayment(reservationId: string) {
  // Asegurarnos de que el usuario está logueado para acumular sus recompensas
  const session = await requireRole(["customer", "business", "admin", "super_admin"], {
    nextPath: `/customer`,
  });

  const { user } = session;

  try {
    // 1. Obtener datos de la reserva
    const reservation = await getReservationById(reservationId);
    
    if (reservation.status !== "PENDING_PAYMENT") {
      throw new Error("La reserva no está pendiente de pago.");
    }

    // 2. Simular respuesta de Wompi y generar un ID de Transacción Escrow
    const escrowTransactionId = `ESCROW-WOMPI-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // 3. Marcar la reserva como pagada
    await markReservationAsPaid(reservationId, escrowTransactionId);

    // 4. Otorgar Estrella de Fidelidad (Recompensa)
    // Pasamos el customer_id de la reserva (o el del usuario logueado si es que acaba de reclamarla)
    const targetCustomerId = reservation.customer_id || user.uid;
    
    await awardLoyaltyStar({
      customerId: targetCustomerId,
      reservationId: reservationId,
      businessName: reservation.business_name,
    });

    // 5. Redirigir al cliente al panel de turista para que vea su premio y su calendario actualizado
    // o al detalle del ticket (iremos al dashboard de una vez, con feedback)
  } catch (error) {
    console.error("Error al procesar el pago simulado:", error);
    throw new Error("No se pudo procesar el pago. Intente nuevamente.");
  }
  
  // Hacemos el redirect fuera del bloque try/catch porque throw Error de redirect es capturado
  redirect("/customer?payment_success=true");
}
