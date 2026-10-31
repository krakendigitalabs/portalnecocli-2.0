import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/auth/api";
import type { ServerAuthSession } from "@/lib/auth/server";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";

interface CompleteReservationRequestBody {
  reservation_id: string;
}

/**
 * POST /api/reservations/complete
 * Marca la reserva como COMPLETED y libera los fondos Escrow al comercio.
 * Llamado por el operador/admin desde el dashboard cuando el cliente asistió.
 *
 * Seguridad: requiere sesión con rol business/operator/admin/super_admin. El comercio
 * y el escrow se toman de la reserva almacenada, nunca del cliente.
 */
export async function POST(req: Request) {
  const access = await requireApiAccess({
    roles: ["business", "operator", "admin", "super_admin"],
  });

  if (access instanceof NextResponse) {
    return access;
  }

  const session = access as ServerAuthSession;

  try {
    const body = (await req.json()) as Partial<CompleteReservationRequestBody>;

    if (!body || typeof body.reservation_id !== "string" || !body.reservation_id.trim()) {
      return NextResponse.json({ error: "Falta el campo: reservation_id" }, { status: 400 });
    }

    const db = getFirestore(getFirebaseAdminApp());
    const reservationRef = db.collection("reservations").doc(body.reservation_id);
    const result = await db.runTransaction(async (transaction) => {
      const reservationSnap = await transaction.get(reservationRef);
      if (!reservationSnap.exists) {
        return { status: 404 as const, error: "Reserva no encontrada" };
      }

      const reservation = reservationSnap.data();
      if (
        !session.user.scope.global &&
        (!reservation?.business_id ||
          !session.user.scope.businessIds.includes(reservation.business_id))
      ) {
        return { status: 403 as const, error: "Forbidden" };
      }

      if (reservation?.status !== "PAID" && reservation?.status !== "CONFIRMED") {
        return {
          status: 409 as const,
          error: `La reserva no puede completarse desde el estado: ${reservation?.status}`,
        };
      }

      const escrowId = reservation.escrow_transaction_id;
      if (typeof escrowId !== "string" || !escrowId) {
        return { status: 409 as const, error: "La reserva no tiene escrow asociado" };
      }

      const escrowRef = db.collection("escrow_transactions").doc(escrowId);
      const escrowSnap = await transaction.get(escrowRef);
      const escrow = escrowSnap.data();
      if (
        !escrowSnap.exists ||
        escrow?.booking_id !== reservationSnap.id ||
        escrow?.merchant_id !== reservation.business_id ||
        escrow?.status !== "HELD" ||
        typeof escrow?.merchant_payout !== "number" ||
        !Number.isFinite(escrow.merchant_payout) ||
        escrow.merchant_payout < 0
      ) {
        return { status: 409 as const, error: "Escrow no válido para esta reserva" };
      }

      const walletRef = db.collection("merchant_wallets").doc(escrow.merchant_id);
      const walletSnap = await transaction.get(walletRef);
      const wallet = walletSnap.data();
      if (
        !walletSnap.exists ||
        typeof wallet?.held_balance !== "number" ||
        !Number.isFinite(wallet.held_balance) ||
        typeof wallet?.available_balance !== "number" ||
        !Number.isFinite(wallet.available_balance) ||
        wallet.held_balance < escrow.merchant_payout
      ) {
        return { status: 409 as const, error: "Saldo retenido del comercio no válido" };
      }

      const now = new Date().toISOString();
      transaction.update(reservationRef, {
        status: "COMPLETED",
        updated_at: now,
      });
      transaction.update(escrowRef, {
        status: "RELEASED",
        release_date: now,
      });
      transaction.update(walletRef, {
        held_balance: FieldValue.increment(-escrow.merchant_payout),
        available_balance: FieldValue.increment(escrow.merchant_payout),
      });

      return {
        status: 200 as const,
        reservationId: reservationSnap.id,
        merchantId: escrow.merchant_id,
      };
    });

    if (result.status !== 200) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    console.log(
      `[Escrow] Reserva ${result.reservationId} completada. Fondos liberados a comercio ${result.merchantId}.`,
    );

    return NextResponse.json(
      { success: true, reservation_id: result.reservationId, status: "COMPLETED" },
      { status: 200 },
    );
  } catch (error) {
    console.error("[Complete Reservation] Error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
