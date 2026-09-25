/**
 * Webhook Oficial de Wompi para Portal Necoclí.
 *
 * ARQUITECTURA DE SEGURIDAD (Agente 9):
 * - Valida la firma SHA-256 del evento usando WOMPI_EVENTS_SECRET.
 * - Solo procesa eventos "transaction.updated" con estado "APPROVED".
 * - Es idempotente: si la reserva ya está PAID, no reprocesa.
 * - Ejecuta el flujo completo: reserva PAID → EscrowTransaction (held) → LoyaltyStar.
 */
import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { holdFunds } from "@/data/escrowService";
import { awardLoyaltyStar } from "@/data/loyaltyService";
import { getReservationByReferenceCode, markReservationAsPaid } from "@/data/reservationService";
import type { EscrowTransaction, EscrowTransactionStatus } from "@/types/escrow";

type WompiWebhookPayload = {
  event: string;
  data: {
    transaction: {
      id: string;
      status: string;
      reference: string;
      amount_in_cents: number;
      currency: string;
    };
  };
  signature?: {
    checksum: string;
    properties: string[];
  };
  timestamp: number;
};

/**
 * Valida la firma del evento de Wompi usando SHA-256.
 * Concatena: propiedades del payload + timestamp + secret
 */
function isValidWompiSignature(payload: WompiWebhookPayload): boolean {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  if (!secret) {
    console.error("[Wompi Webhook] WOMPI_EVENTS_SECRET no configurado.");
    return false;
  }

  if (!payload.signature?.checksum || !payload.timestamp) {
    // En desarrollo/test, permitir sin firma
    if (process.env.NODE_ENV !== "production") return true;
    return false;
  }

  const { transaction } = payload.data;
  // Wompi firma: id + status + amount_in_cents + timestamp + secret
  const hashString = `${transaction.id}${transaction.status}${transaction.amount_in_cents}${payload.timestamp}${secret}`;
  const expectedChecksum = createHash("sha256").update(hashString).digest("hex");

  return expectedChecksum === payload.signature.checksum;
}

export async function POST(req: NextRequest) {
  let payload: WompiWebhookPayload;

  try {
    payload = (await req.json()) as WompiWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // 1. Validar firma (seguridad perimetral)
  if (!isValidWompiSignature(payload)) {
    console.warn("[Wompi Webhook] ⚠️ Firma inválida — posible ataque de replay.");
    return NextResponse.json({ error: "Unauthorized: Invalid signature" }, { status: 401 });
  }

  // 2. Solo procesar transacciones aprobadas
  if (payload.event !== "transaction.updated") {
    return NextResponse.json({ message: `Evento '${payload.event}' ignorado.` }, { status: 200 });
  }

  const { transaction } = payload.data;

  if (transaction.status !== "APPROVED") {
    console.log(
      `[Wompi Webhook] Transacción ${transaction.id} — Estado: ${transaction.status}. Ignorando.`,
    );
    return NextResponse.json({ message: "Estado no aprobado." }, { status: 200 });
  }

  // 3. Buscar la reserva por reference_code (que usamos como reference en Wompi)
  const reservation = await getReservationByReferenceCode(transaction.reference);
  if (!reservation) {
    console.error(
      `[Wompi Webhook] ❌ Reserva con reference '${transaction.reference}' no encontrada.`,
    );
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }

  // 4. Idempotencia — no reprocesar si ya está pagada
  if (reservation.status === "PAID" || reservation.status === "COMPLETED") {
    console.log(`[Wompi Webhook] ℹ️ Reserva ${reservation.id} ya procesada. Idempotente.`);
    return NextResponse.json({ message: "Already processed" }, { status: 200 });
  }

  // 5. ID de transacción Escrow = WOMPI- + transaction.id de Wompi
  const escrowTransactionId = `WOMPI-${transaction.id}`;

  try {
    // 6. Marcar la reserva como PAID en Firestore
    await markReservationAsPaid(reservation.id, escrowTransactionId, reservation.customer_id);

    // 7. Calcular comisiones y registrar en la bóveda Escrow (HELD)
    const totalAmount = transaction.amount_in_cents;
    const PLATFORM_FEE_RATE = 0.08; // 8% Take Rate del Portal
    const platformFee = Math.round(totalAmount * PLATFORM_FEE_RATE);
    const netAmountToBusiness = totalAmount - platformFee;

    const escrowData: EscrowTransaction = {
      id: escrowTransactionId,
      booking_id: reservation.id,
      buyer_id: reservation.customer_id ?? "anonymous",
      merchant_id: reservation.business_id,
      total_amount: totalAmount,
      portal_fee: platformFee,
      merchant_payout: netAmountToBusiness,
      status: "HELD" as EscrowTransactionStatus,
      gateway_ref: transaction.id,
      created_at: new Date().toISOString(),
      release_date: undefined,
    };

    await holdFunds(escrowData);

    // 8. Otorgar Estrella de Fidelidad al turista
    if (reservation.customer_id) {
      await awardLoyaltyStar({
        customerId: reservation.customer_id,
        reservationId: reservation.id,
        businessName: reservation.business_name,
      });
    }

    console.log(
      `[Wompi Webhook] ✅ Flujo completo para reserva ${reservation.id} — Escrow: ${escrowTransactionId}`,
    );
    return NextResponse.json(
      { success: true, reservationId: reservation.id, escrowId: escrowTransactionId },
      { status: 200 },
    );
  } catch (error) {
    console.error("[Wompi Webhook] ❌ Error en el flujo de procesamiento:", error);
    return NextResponse.json({ error: "Internal processing error" }, { status: 500 });
  }
}

// Wompi puede enviar GET para verificar la existencia del endpoint
export async function GET() {
  return NextResponse.json({
    status: "Portal Necoclí — Wompi Webhook Activo ✓",
    version: "2.0",
    engine: "Kraken Digital Labs",
    timestamp: new Date().toISOString(),
  });
}
