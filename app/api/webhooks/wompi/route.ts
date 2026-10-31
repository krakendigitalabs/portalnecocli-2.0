/**
 * Webhook Oficial de Wompi para Portal Necoclí.
 *
 * ARQUITECTURA DE SEGURIDAD (Agente 9):
 * - Valida la firma SHA-256 del evento usando WOMPI_EVENTS_SECRET.
 * - Solo procesa eventos "transaction.updated" con estado "APPROVED".
 * - Es idempotente: si la reserva ya está PAID, no reprocesa.
 * - Ejecuta el flujo completo: reserva PAID → EscrowTransaction (held) → LoyaltyStar.
 */
import { createHash, timingSafeEqual } from "node:crypto";
import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { awardLoyaltyStar } from "@/data/loyaltyService";
import { getReservationByReferenceCode } from "@/data/reservationService";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import type { EscrowTransaction, EscrowTransactionStatus } from "@/types/escrow";

type WompiTransaction = {
  id: string;
  status: string;
  reference: string;
  amount_in_cents: number;
  currency: string;
};

type WompiWebhookPayload = {
  event: string;
  data: { transaction: WompiTransaction } & Record<string, unknown>;
  signature: {
    checksum: string;
    properties: string[];
  };
  timestamp: number;
};

const REQUIRED_SIGNED_PROPERTIES = [
  "transaction.id",
  "transaction.status",
  "transaction.amount_in_cents",
  "transaction.reference",
  "transaction.currency",
];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function parsePayload(raw: unknown): WompiWebhookPayload | null {
  if (!isRecord(raw) || typeof raw.event !== "string") return null;
  const { data, signature, timestamp } = raw;
  if (!isRecord(data) || !isRecord(data.transaction)) return null;
  const tx = data.transaction;
  if (
    typeof tx.id !== "string" ||
    !tx.id ||
    typeof tx.status !== "string" ||
    typeof tx.reference !== "string" ||
    !tx.reference ||
    typeof tx.amount_in_cents !== "number" ||
    typeof tx.currency !== "string"
  ) {
    return null;
  }
  if (!isRecord(signature) || typeof signature.checksum !== "string" || !signature.checksum) {
    return null;
  }
  if (
    !Array.isArray(signature.properties) ||
    signature.properties.length === 0 ||
    !signature.properties.every((x) => typeof x === "string")
  ) {
    return null;
  }
  if (typeof timestamp !== "number" || !Number.isFinite(timestamp)) return null;
  return raw as unknown as WompiWebhookPayload;
}

function resolveSignedProperty(data: Record<string, unknown>, path: string): string | null {
  let cur: unknown = data;
  for (const key of path.split(".")) {
    if (!isRecord(cur) || !(key in cur)) return null;
    cur = cur[key];
  }
  if (typeof cur === "string" || typeof cur === "number" || typeof cur === "boolean") {
    return String(cur);
  }
  return null;
}

/**
 * Valida la firma del evento de Wompi (SHA-256): valores de signature.properties
 * + timestamp + WOMPI_EVENTS_SECRET. La firma es obligatoria en todos los entornos.
 */
function isValidWompiSignature(payload: WompiWebhookPayload): boolean {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  if (!secret) {
    console.error("[Wompi Webhook] WOMPI_EVENTS_SECRET no configurado.");
    return false;
  }

  const { properties, checksum } = payload.signature;
  if (!REQUIRED_SIGNED_PROPERTIES.every((p) => properties.includes(p))) return false;

  let values = "";
  for (const prop of properties) {
    const v = resolveSignedProperty(payload.data, prop);
    if (v === null) return false;
    values += v;
  }

  const expected = createHash("sha256").update(`${values}${payload.timestamp}${secret}`).digest();
  const received = Buffer.from(checksum.trim(), "hex");
  if (received.length !== expected.length) return false;
  return timingSafeEqual(expected, received);
}

export async function POST(req: NextRequest) {
  let payload: WompiWebhookPayload;

  try {
    const parsed = parsePayload(await req.json());
    if (!parsed) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    payload = parsed;
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

  // 3. Identificar si es una Recarga de Billetera (Neco-Dispatch) o una Reserva
  if (transaction.reference.startsWith("TOPUP_")) {
    const [, userId] = transaction.reference.split("_");

    if (
      transaction.currency !== "COP" ||
      !Number.isInteger(transaction.amount_in_cents) ||
      transaction.amount_in_cents <= 0 ||
      transaction.amount_in_cents % 100 !== 0
    ) {
      console.error("[Wompi Webhook] ❌ Monto/moneda TOPUP inválidos:", transaction.id);
      return NextResponse.json({ error: "Invalid TOPUP amount" }, { status: 400 });
    }

    if (!userId) {
      console.error("[Wompi Webhook] ❌ Referencia TOPUP inválida:", transaction.reference);
      return NextResponse.json({ error: "Invalid TOPUP reference" }, { status: 400 });
    }

    try {
      const db = getFirestore(getFirebaseAdminApp());
      const amountCOP = transaction.amount_in_cents / 100; // Convertimos de centavos a COP

      let duplicate = false;

      await db.runTransaction(async (t) => {
        duplicate = false;
        const txRef = db.collection("wallet_transactions").doc(`WOMPI-${transaction.id}`);
        const txDoc = await t.get(txRef);
        if (txDoc.exists) {
          duplicate = true;
          return;
        }

        const driverRef = db.collection("drivers").doc(userId);
        const driverDoc = await t.get(driverRef);

        if (!driverDoc.exists) {
          throw new Error("Driver not found");
        }

        const currentBalance = driverDoc.data()?.wallet_balance || 0;

        // Sumar la recarga al saldo
        t.update(driverRef, {
          wallet_balance: currentBalance + amountCOP,
        });

        // Registrar la transacción
        t.set(txRef, {
          driver_id: userId,
          type: "TOPUP",
          amount: amountCOP,
          gateway_ref: transaction.id,
          created_at: new Date().toISOString(),
          status: "APPROVED",
        });
      });

      if (duplicate) {
        console.log(`[Wompi Webhook] ℹ️ TOPUP ${transaction.id} ya procesado. Idempotente.`);
        return NextResponse.json({ message: "Already processed" }, { status: 200 });
      }

      console.log(`[Wompi Webhook] ✅ Recarga exitosa de ${amountCOP} para conductor ${userId}`);
      return NextResponse.json({ success: true, topup: true }, { status: 200 });
    } catch (error) {
      console.error("[Wompi Webhook] ❌ Error recargando saldo:", error);
      return NextResponse.json({ error: "Topup processing error" }, { status: 500 });
    }
  }

  // 4. Si no es TOPUP, buscar la reserva por reference_code
  const reservation = await getReservationByReferenceCode(transaction.reference);
  if (!reservation) {
    console.error(
      `[Wompi Webhook] ❌ Reserva con reference '${transaction.reference}' no encontrada.`,
    );
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }

  // 5. Idempotencia — no reprocesar si ya está pagada
  // Validar monto y moneda contra la reserva (total_amount en COP)
  const expectedCents = Math.round(reservation.total_amount * 100);
  if (
    transaction.currency !== "COP" ||
    !Number.isInteger(transaction.amount_in_cents) ||
    expectedCents <= 0 ||
    transaction.amount_in_cents !== expectedCents
  ) {
    console.error(`[Wompi Webhook] ❌ Monto/moneda no coinciden para reserva ${reservation.id}.`);
    return NextResponse.json({ error: "Amount or currency mismatch" }, { status: 400 });
  }

  // 6. ID de transacción Escrow = WOMPI- + transaction.id de Wompi
  const escrowTransactionId = `WOMPI-${transaction.id}`;

  try {
    const db = getFirestore(getFirebaseAdminApp());
    const reservationRef = db.collection("reservations").doc(reservation.id);
    const escrowRef = db.collection("escrow_transactions").doc(escrowTransactionId);
    const processed = await db.runTransaction(async (t) => {
      const reservationDoc = await t.get(reservationRef);
      const escrowDoc = await t.get(escrowRef);

      if (escrowDoc.exists) {
        return "duplicate" as const;
      }
      if (!reservationDoc.exists) {
        return "missing" as const;
      }

      const currentReservation = reservationDoc.data();
      if (currentReservation?.status === "PAID" || currentReservation?.status === "COMPLETED") {
        return "duplicate" as const;
      }
      if (currentReservation?.status !== "PENDING_PAYMENT") {
        return "invalid_state" as const;
      }

      const currentExpectedCents = Math.round((currentReservation.total_amount as number) * 100);
      if (
        !Number.isInteger(currentExpectedCents) ||
        currentExpectedCents <= 0 ||
        currentExpectedCents !== transaction.amount_in_cents ||
        currentReservation.business_id !== reservation.business_id
      ) {
        return "amount_mismatch" as const;
      }

      const totalAmount = transaction.amount_in_cents;
      const PLATFORM_FEE_RATE = 0.08;
      const platformFee = Math.round(totalAmount * PLATFORM_FEE_RATE);
      const merchantPayout = totalAmount - platformFee;
      const walletRef = db
        .collection("merchant_wallets")
        .doc(currentReservation.business_id as string);
      const walletDoc = await t.get(walletRef);
      const wallet = walletDoc.data();
      if (
        walletDoc.exists &&
        (typeof wallet?.held_balance !== "number" ||
          !Number.isFinite(wallet.held_balance) ||
          typeof wallet?.available_balance !== "number" ||
          !Number.isFinite(wallet.available_balance))
      ) {
        return "wallet_invalid" as const;
      }

      const escrowData: EscrowTransaction = {
        id: escrowTransactionId,
        booking_id: reservationDoc.id,
        buyer_id: currentReservation.customer_id ?? "anonymous",
        merchant_id: currentReservation.business_id,
        total_amount: totalAmount,
        portal_fee: platformFee,
        merchant_payout: merchantPayout,
        status: "HELD" as EscrowTransactionStatus,
        gateway_ref: transaction.id,
        created_at: new Date().toISOString(),
        release_date: undefined,
      };

      t.update(reservationRef, {
        status: "PAID",
        escrow_transaction_id: escrowTransactionId,
        updated_at: new Date().toISOString(),
      });
      t.create(escrowRef, escrowData);
      if (walletDoc.exists) {
        t.update(walletRef, {
          held_balance: FieldValue.increment(merchantPayout),
        });
      } else {
        t.create(walletRef, {
          merchant_id: currentReservation.business_id,
          available_balance: 0,
          held_balance: merchantPayout,
          payout_method: {
            type: "OTHER",
            account_number: "",
            account_holder_name: "",
            document_id: "",
          },
        });
      }
      return "processed" as const;
    });

    if (processed === "duplicate") {
      return NextResponse.json({ message: "Already processed" }, { status: 200 });
    }
    if (processed === "missing") {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }
    if (processed !== "processed") {
      return NextResponse.json({ error: "Reservation cannot be paid" }, { status: 409 });
    }

    // 9. Otorgar Estrella de Fidelidad al turista
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
