"use server";

import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { authorizeServerAccess } from "@/lib/auth/server";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";

export async function confirmTicketOfflinePayment(ticketId: string) {
  try {
    const authorization = await authorizeServerAccess({
      roles: ["operator", "business", "admin", "super_admin"],
    });
    if (!authorization.ok) {
      return { success: false, error: "No autorizado" };
    }
    const { scope } = authorization.session.user;

    const db = getFirestore(getFirebaseAdminApp());
    // The ticket could be stored with doc ID = ticketId OR escrow_transaction_id = ticketId
    // Let's try doc ID first
    let ref = db.collection("reservations").doc(ticketId);
    let snap = await ref.get();

    if (!snap.exists) {
      // Try escrow_transaction_id
      const query = await db
        .collection("reservations")
        .where("escrow_transaction_id", "==", ticketId)
        .limit(1)
        .get();
      if (query.empty) {
        return { success: false, error: "Tiquete no encontrado" };
      }
      ref = query.docs[0].ref;
      snap = query.docs[0];
    }

    const data = snap.data();
    const transition = await db.runTransaction(async (tx) => {
      const fresh = await tx.get(ref);
      if (!fresh.exists) {
        return false;
      }

      const current = fresh.data();
      if (
        !scope.global &&
        (!current?.business_id || !scope.businessIds.includes(current.business_id))
      ) {
        return false;
      }

      const now = new Date().toISOString();
      if (current?.status === "PENDING_PAYMENT" && !current.escrow_transaction_id) {
        tx.update(ref, {
          status: "COMPLETED",
          offline_payment_confirmed: true,
          offline_payment_date: now,
          updated_at: now,
        });
        return true;
      }

      if (
        (current?.status !== "PAID" && current?.status !== "CONFIRMED") ||
        typeof current.escrow_transaction_id !== "string"
      ) {
        return false;
      }

      const escrowRef = db.collection("escrow_transactions").doc(current.escrow_transaction_id);
      const escrowSnap = await tx.get(escrowRef);
      const escrow = escrowSnap.data();
      if (
        !escrowSnap.exists ||
        escrow?.booking_id !== fresh.id ||
        escrow?.merchant_id !== current.business_id ||
        escrow?.status !== "HELD" ||
        typeof escrow?.merchant_payout !== "number" ||
        !Number.isFinite(escrow.merchant_payout) ||
        escrow.merchant_payout < 0
      ) {
        return false;
      }

      const walletRef = db.collection("merchant_wallets").doc(escrow.merchant_id);
      const walletSnap = await tx.get(walletRef);
      const wallet = walletSnap.data();
      if (
        !walletSnap.exists ||
        typeof wallet?.held_balance !== "number" ||
        !Number.isFinite(wallet.held_balance) ||
        typeof wallet?.available_balance !== "number" ||
        !Number.isFinite(wallet.available_balance) ||
        wallet.held_balance < escrow.merchant_payout
      ) {
        return false;
      }

      tx.update(ref, { status: "COMPLETED", updated_at: now });
      tx.update(escrowRef, { status: "RELEASED", release_date: now });
      tx.update(walletRef, {
        held_balance: FieldValue.increment(-escrow.merchant_payout),
        available_balance: FieldValue.increment(escrow.merchant_payout),
      });
      return true;
    });
    if (!transition) {
      return {
        success: false,
        error: "No autorizado o el estado del tiquete no permite confirmarlo.",
      };
    }

    // Send email notification to admin
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: "Portal Necoclí <reservas@portalnecocli.com>",
        to: ["portalnecocli@gmail.com"],
        subject: `🟢 Tiquete ${ticketId} Pagado en Taquilla`,
        html: `
          <div style="font-family: sans-serif; p-4;">
            <h3 style="color: #059669;">Confirmación de Pago Offline</h3>
            <p>El turista o la naviera ha confirmado el pago en taquilla del tiquete <strong>${ticketId}</strong>.</p>
            <p>Monto aproximado de reserva: $${(data?.total_amount || 0).toLocaleString("es-CO")} COP</p>
            <p>Estado actualizado exitosamente a COMPLETED en el sistema.</p>
          </div>
        `,
      });
    }

    revalidatePath(`/tickets/${ticketId}`);
    return { success: true };
  } catch (err: any) {
    console.error("Error confirming payment:", err);
    return { success: false, error: "Ocurrió un error al confirmar" };
  }
}
