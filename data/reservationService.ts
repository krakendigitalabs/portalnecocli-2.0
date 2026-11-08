/**
 * Servicio de Reservas para Portal Necoclí.
 * ARQUITECTURA: Usa el Admin SDK de Firebase (server-only).
 */
import "server-only";
import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import type { Reservation, ReservationLead, ReservationStatus } from "@/types/reservation";

function getDb() {
  return getFirestore(getFirebaseAdminApp());
}

/** Genera un código de referencia único legible para el cliente. */
function generateReferenceCode(): string {
  const date = new Date();
  const datePart = date.toISOString().slice(0, 10).replace(/-/g, "");
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `NEC-${datePart}-${randomPart}`;
}

/**
 * Crea una nueva reserva en Firestore con estado PENDING_PAYMENT.
 */
export async function createReservation(params: {
  businessId: string;
  businessName: string;
  lead: ReservationLead;
  totalAmount: number;
  customerId?: string;
}): Promise<Reservation> {
  const db = getDb();
  const ref = db.collection("reservations").doc();
  const now = new Date().toISOString();

  const reservation: Reservation = {
    id: ref.id,
    business_id: params.businessId,
    business_name: params.businessName,
    lead: params.lead,
    status: "PENDING_PAYMENT",
    total_amount: params.totalAmount,
    created_at: now,
    updated_at: now,
    reference_code: generateReferenceCode(),
    ...(params.customerId ? { customer_id: params.customerId } : {}),
  };

  await ref.set(reservation);
  return reservation;
}

/**
 * Vincula una transacción Escrow a una reserva y la marca como PAID.
 */
export async function markReservationAsPaid(
  reservationId: string,
  escrowTransactionId: string,
  customerId?: string,
): Promise<void> {
  const db = getDb();

  const updateData: any = {
    status: "PAID" as ReservationStatus,
    escrow_transaction_id: escrowTransactionId,
    updated_at: new Date().toISOString(),
  };

  if (customerId) {
    updateData.customer_id = customerId;
  }

  await db.collection("reservations").doc(reservationId).update(updateData);
}

/**
 * Marca la reserva como COMPLETED.
 * El llamador debe luego ejecutar releaseFunds() en el escrowService.
 */
export async function completeReservation(reservationId: string): Promise<Reservation> {
  const db = getDb();
  const ref = db.collection("reservations").doc(reservationId);
  const snap = await ref.get();

  if (!snap.exists) {
    throw new Error(`Reserva ${reservationId} no encontrada.`);
  }

  const reservation = snap.data() as Reservation;

  if (reservation.status !== "PAID" && reservation.status !== "CONFIRMED") {
    throw new Error(
      `La reserva ${reservationId} no puede completarse desde el estado: ${reservation.status}`,
    );
  }

  await ref.update({
    status: "COMPLETED" as ReservationStatus,
    updated_at: new Date().toISOString(),
  });

  return { ...reservation, status: "COMPLETED" };
}

/** Obtiene una reserva por ID. */
export async function getReservationById(reservationId: string): Promise<Reservation> {
  const db = getDb();
  const snap = await db.collection("reservations").doc(reservationId).get();

  if (!snap.exists) {
    throw new Error(`Reserva ${reservationId} no encontrada.`);
  }

  return snap.data() as Reservation;
}

/**
 * Obtiene todas las reservas de un cliente ordenadas por fecha (más reciente primero).
 */
export async function getReservationsByCustomer(customerId: string): Promise<Reservation[]> {
  try {
    const db = getDb();
    const snap = await db
      .collection("reservations")
      .where("customer_id", "==", customerId)
      // .orderBy("created_at", "desc") // Eliminado para no forzar la creación manual de un índice compuesto
      // .limit(20)
      .get();

    const reservations = snap.docs.map((doc) => doc.data() as Reservation);

    // Ordenamiento y límite en memoria (Seguro para MVP y volúmenes moderados)
    return reservations
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 20);
  } catch (error) {
    console.error("Error obteniendo reservas:", error);
    return [];
  }
}

/**
 * Obtiene todas las reservas dirigidas a un comercio específico (Aliado).
 */
export async function getReservationsByBusiness(businessId: string): Promise<Reservation[]> {
  try {
    const db = getDb();
    const snap = await db.collection("reservations").where("business_id", "==", businessId).get();

    const reservations = snap.docs.map((doc) => doc.data() as Reservation);

    // Ordenamiento en memoria, más recientes primero
    return reservations.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  } catch (error) {
    console.error("Error obteniendo reservas del negocio:", error);
    return [];
  }
}

/**
 * Obtiene una reserva buscando por su reference_code.
 * Utilizado en la vista pública de checkout/pago.
 */
export async function getReservationByReferenceCode(
  referenceCode: string,
): Promise<Reservation | null> {
  const db = getDb();
  const snap = await db
    .collection("reservations")
    .where("reference_code", "==", referenceCode)
    .limit(1)
    .get();

  if (snap.empty) {
    return null;
  }

  return snap.docs[0].data() as Reservation;
}

/**
 * Obtiene una solicitud de Concierge (AI) por referenceCode.
 * Estas solicitudes se guardan en la colección `concierge_requests`
 * y NO tienen una reserva en Firestore `reservations`.
 */
export async function getConciergeRequestByCode(
  referenceCode: string,
): Promise<Record<string, unknown> | null> {
  const db = getDb();
  const snap = await db
    .collection("concierge_requests")
    .where("referenceCode", "==", referenceCode)
    .limit(1)
    .get();

  if (snap.empty) {
    return null;
  }

  return snap.docs[0].data() as Record<string, unknown>;
}

/**
 * Obtiene una reserva buscando por su escrow_transaction_id.
 * Utilizado para generar el Ticket Digital Oficial.
 */
export async function getReservationByEscrowId(escrowId: string): Promise<Reservation | null> {
  const db = getDb();
  const snap = await db
    .collection("reservations")
    .where("escrow_transaction_id", "==", escrowId)
    .limit(1)
    .get();

  if (snap.empty) {
    return null;
  }

  return snap.docs[0].data() as Reservation;
}
