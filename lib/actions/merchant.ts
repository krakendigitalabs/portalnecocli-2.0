"use server";

import { revalidatePath } from "next/cache";
import { EscrowRepo } from "@/lib/data/repositories/escrow-repo";
import { ReservationRepo } from "@/lib/data/repositories/reservation-repo";
import { requireRole } from "@/lib/auth/server";

export async function releaseEscrowFunds(transactionId: string) {
  try {
    // 1. Verificar autorización (Solo negocios o admin)
    const session = await requireRole(["business", "admin"]);
    
    // 2. Obtener transacción
    const transaction = await EscrowRepo.getTransaction(transactionId);
    
    if (!transaction) {
      return { success: false, error: "Transacción no encontrada." };
    }

    if (transaction.status !== "held") {
      return { success: false, error: "La transacción no está retenida." };
    }

    // 3. (Opcional) Verificar que el usuario tenga permiso sobre el businessId
    if (session.role === "business" && transaction.businessId !== session.tenantId) {
      return { success: false, error: "No tienes permiso para liberar esta transacción." };
    }

    // 4. Actualizar Escrow a 'released'
    await EscrowRepo.updateTransactionStatus(transactionId, "released");

    // 5. Actualizar Reserva a 'completed'
    await ReservationRepo.updateReservation(transaction.reservationId, { status: "completed" });

    revalidatePath("/merchant");

    return { success: true };
  } catch (error) {
    console.error("[releaseEscrowFunds] Error:", error);
    return { success: false, error: "Error interno del servidor al liberar fondos." };
  }
}
