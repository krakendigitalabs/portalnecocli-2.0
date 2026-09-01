import crypto from "crypto";
import { NextResponse } from "next/server";
import { EscrowRepo } from "@/lib/data/repositories/escrow-repo";
import { ReservationRepo } from "@/lib/data/repositories/reservation-repo";

interface WompiWebhookPayload {
  event: string;
  data: {
    transaction: {
      id: string;
      status: string;
      reference: string;
      amount_in_cents: number;
    };
  };
  signature: {
    checksum: string;
    properties: string[];
  };
  timestamp: number;
}

function isValidWompiSignature(payload: WompiWebhookPayload): boolean {
  const secret = process.env.WOMPI_EVENTS_SECRET;

  if (!secret || !payload.signature || !payload.signature.checksum || !payload.timestamp) {
    return false;
  }

  const { transaction } = payload.data;

  const hashString = `${transaction.id}${transaction.status}${transaction.amount_in_cents}${payload.timestamp}${secret}`;

  const expectedChecksum = crypto.createHash("sha256").update(hashString).digest("hex");

  return expectedChecksum === payload.signature.checksum;
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as WompiWebhookPayload;

    if (!isValidWompiSignature(payload)) {
      console.warn("Wompi Webhook Error: Invalid cryptographic signature");
      return NextResponse.json({ error: "Unauthorized: Invalid signature" }, { status: 401 });
    }

    if (payload.event === "transaction.updated") {
      const { transaction } = payload.data;

      if (transaction.status === "APPROVED") {
        // transaction.reference es nuestro Escrow ID (ticket ID)
        const escrowId = transaction.reference;

        const escrow = await EscrowRepo.getTransaction(escrowId);

        if (escrow) {
          // Actualizamos el estado del Escrow a 'held' (fondos capturados)
          // o a 'released' dependiendo de la lógica de negocio. Para Escrow es 'held'.
          await EscrowRepo.updateTransactionStatus(escrowId, "held");

          // Actualizamos el estado de la reserva a 'confirmed'
          await ReservationRepo.updateReservation(escrow.reservationId, { status: "confirmed" });

          console.log(`[Escrow] Pago procesado y fondos asegurados para ticket ${escrowId}`);
        } else {
          console.warn(`[Escrow] Webhook recibido para ticket desconocido: ${escrowId}`);
        }
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Wompi Webhook Internal Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
