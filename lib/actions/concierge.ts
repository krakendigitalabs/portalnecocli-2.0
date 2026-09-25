"use server";

import { getFirestore } from "firebase-admin/firestore";
import { getMerchantEmail } from "@/data/merchantDirectory";
import { createReservation } from "@/data/reservationService";
import { sendPreReservationEmail } from "@/lib/email/resend";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import type { ConciergeRequest, RequestCategory } from "@/types/order";
import { COMMISSION_RATES } from "@/types/order";

// ─── ACCIÓN PRINCIPAL ─────────────────────────────────────────────────────────
export async function submitConciergeRequest(data: ConciergeRequest) {
  // ── PASO 1: Calcular comisión y precio válido ──────────────────────────────
  const rate = COMMISSION_RATES[data.category as RequestCategory] ?? COMMISSION_RATES.general;
  const validPrice =
    typeof data.estimatedPrice === "number" &&
    !isNaN(data.estimatedPrice) &&
    data.estimatedPrice > 0
      ? data.estimatedPrice
      : 0;
  const commission = validPrice > 0 ? Math.round(validPrice * rate) : 0;
  const referenceCode = `NEC-${Date.now().toString(36).toUpperCase()}`;
  const merchantEmail = data.businessName ? getMerchantEmail(data.businessName) : null;

  // ── PASO 2: Persistir en Firestore (CRÍTICO — si falla, retorna error) ─────
  let docId: string;
  try {
    const db = getFirestore(getFirebaseAdminApp());

    // Limpiar undefined properties manualmente para no romper Firestore
    const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== undefined));

    const docRef = await db.collection("concierge_requests").add({
      ...cleanData,
      estimatedPrice: validPrice > 0 ? validPrice : null,
      referenceCode,
      commission,
      merchantEmail,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    docId = docRef.id;
    console.log(`[concierge] ✅ Firestore OK → id: ${docId}`);
  } catch (err) {
    console.error("[concierge] ❌ Error guardando en Firestore:", err);
    return { success: false, error: "No se pudo guardar la solicitud." };
  }

  // ── PASO 3: Crear link de pago en Wompi (OPCIONAL — error no bloquea nada) ─
  let wompiReferenceCode: string | null = null;
  if (validPrice > 0) {
    try {
      const reservation = await createReservation({
        businessId: "portal-necocli-concierge",
        businessName: data.businessName || "Portal Necoclí (Plan a Medida)",
        totalAmount: validPrice * 100, // Wompi requiere centavos
        lead: {
          full_name: data.name,
          email: data.email,
          phone: data.phone,
          whatsapp: data.phone,
          notes: data.request,
        },
      });
      wompiReferenceCode = reservation.reference_code;
      console.log(`[concierge] ✅ Wompi OK → ref: ${wompiReferenceCode}`);
    } catch (err) {
      // ⚠️ NO retornamos error — el correo SÍ se envía aunque Wompi falle
      console.warn("[concierge] ⚠️ Wompi falló (no crítico, el correo se enviará igual):", err);
    }
  }

  // ── PASO 4: Enviar correo (CRÍTICO — se envía SIEMPRE si hay email válido) ─
  if (data.email?.includes("@")) {
    try {
      // Formatear precio de forma segura
      const priceDisplay = validPrice > 0 ? validPrice.toLocaleString("es-CO") : "Por confirmar";

      await sendPreReservationEmail({
        customerEmail: data.email,
        customerName: data.name,
        itinerary: data.request,
        estimatedPrice: priceDisplay,
        advice: data.advice ?? "Reservar con anticipación garantiza el mejor precio.",
        referenceCode: wompiReferenceCode ?? referenceCode,
        type: data.type ?? "reservation",
        merchantEmail,
      });
      console.log(`[concierge] ✅ Correo enviado → ${data.email}`);
    } catch (err) {
      // Log pero no retorna error — la solicitud ya fue guardada en Firestore
      console.error("[concierge] ❌ Error enviando correo:", err);
    }
  } else {
    console.warn(`[concierge] ⚠️ Correo omitido — email inválido: "${data.email}"`);
  }

  return { success: true, id: docId!, referenceCode };
}
