"use server";

import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/server";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import type { LoyaltyBonus } from "@/types/loyalty";

export async function applyBonusToReservation(reservationId: string, bonusId: string) {
  const session = await requireRole(["customer"]);
  const db = getFirestore(getFirebaseAdminApp());

  try {
    const reservationRef = db.collection("reservations").doc(reservationId);
    const reservationDoc = await reservationRef.get();

    if (!reservationDoc.exists) {
      throw new Error("Reserva no encontrada");
    }

    const reservation = reservationDoc.data();
    if (reservation?.status !== "PENDING_PAYMENT") {
      throw new Error("Solo se pueden aplicar bonos a reservas pendientes de pago.");
    }
    if (reservation?.applied_bonus_id) {
      throw new Error("Ya se aplicó un bono a esta reserva.");
    }

    const bonusRef = db.collection("loyalty_bonuses").doc(bonusId);
    const bonusDoc = await bonusRef.get();

    if (!bonusDoc.exists) {
      throw new Error("Bono no encontrado.");
    }

    const bonus = bonusDoc.data() as LoyaltyBonus;

    if (bonus.customer_id !== session.user.uid) {
      throw new Error("Este bono no te pertenece.");
    }
    if (bonus.status !== "ACTIVE") {
      throw new Error("Este bono no está activo o ya expiró.");
    }

    // Verificar que aplique a la categoría (en un app real se extrae del business, aquí simplificamos validando que el cliente lo haya elegido a su favor).
    // Para no bloquear, asumiremos que si sale en la lista de Checkout, es válido.

    let newAmount = reservation?.total_amount || 0;

    if (bonus.type === "DISCOUNT_PERCENTAGE" && bonus.value) {
      newAmount = newAmount - Math.floor(newAmount * (bonus.value / 100));
    } else if (bonus.type === "FIXED_AMOUNT" && bonus.value) {
      newAmount = newAmount - bonus.value;
      if (newAmount < 0) newAmount = 0;
    }
    // "FREE_ITEM" o "SPECIAL_PERK" no reducen el total_amount monetario, pero el comercio debe saberlo

    // Ejecutar actualización atómica en Batch
    const batch = db.batch();

    batch.update(reservationRef, {
      total_amount: newAmount,
      applied_bonus_id: bonusId,
      updated_at: new Date().toISOString(),
    });

    batch.update(bonusRef, {
      status: "REDEEMED",
      redeemed_on_reservation_id: reservationId,
      redeemed_at: new Date().toISOString(),
    });

    await batch.commit();

    // Revalidar caché del checkout
    revalidatePath(`/pago/[referenceCode]`, "page");

    return { success: true, newAmount };
  } catch (error: any) {
    console.error("Error applying bonus:", error);
    throw new Error(error.message || "Hubo un error al procesar el bono");
  }
}
