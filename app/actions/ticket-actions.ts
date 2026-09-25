"use server";

import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";

export async function confirmTicketOfflinePayment(ticketId: string) {
  try {
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
    if (data?.status === "COMPLETED") {
      return { success: false, error: "Este tiquete ya fue confirmado previamente." };
    }

    await ref.update({
      status: "COMPLETED",
      offline_payment_confirmed: true,
      offline_payment_date: new Date().toISOString(),
    });

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
