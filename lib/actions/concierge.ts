"use server";

import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import { createReservation } from "@/data/reservationService";
import { getMerchantEmail } from "@/data/merchantDirectory";
import { sendPreReservationEmail } from "@/lib/email/resend";
import { COMMISSION_RATES } from "@/types/order";
import type { ConciergeRequest, RequestCategory } from "@/types/order";

// ─── ACCIÓN PRINCIPAL ─────────────────────────────────────────────────────────
export async function submitConciergeRequest(data: ConciergeRequest) {
  try {
    const db = getFirestore(getFirebaseAdminApp());

    // 1. Calcular comisión segura (POKA YOKE: Fallback a general si el LLM alucina la categoría)
    const rate = COMMISSION_RATES[data.category as RequestCategory] ?? COMMISSION_RATES.general;
    // POKA YOKE: Asegurar que estimatedPrice es un número válido mayor a 0
    const validPrice = (typeof data.estimatedPrice === "number" && !isNaN(data.estimatedPrice) && data.estimatedPrice > 0) 
      ? data.estimatedPrice 
      : 0;
    
    const commission = validPrice > 0 ? Math.round(validPrice * rate) : 0;

    // 2. Generar código de referencia único y legible
    const referenceCode = `NEC-${Date.now().toString(36).toUpperCase()}`;

    // 3. Buscar correo del aliado comercial (si aplica)
    const merchantEmail = data.businessName
      ? getMerchantEmail(data.businessName)
      : null;

    // 4. Persistir en Firestore (fuente de verdad)
    const docRef = await db.collection("concierge_requests").add({
      ...data,
      estimatedPrice: validPrice > 0 ? validPrice : null, // Guardar null si no es válido
      referenceCode,
      commission,
      merchantEmail,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 5. Crear reserva formal en Wompi (solo si hay precio válido > 0)
    let wompiReferenceCode: string | null = null;
    if (validPrice > 0) {
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
    }

    // 6. Disparar 4 correos simultáneos (cliente + ops + aliado)
    if (data.email?.includes("@")) {
      await sendPreReservationEmail({
        customerEmail: data.email,
        customerName: data.name,
        itinerary: data.request,
        estimatedPrice: data.estimatedPrice?.toLocaleString("es-CO") ?? "Por confirmar",
        advice: data.advice ?? "Reservar con anticipación garantiza el mejor precio.",
        referenceCode: wompiReferenceCode ?? referenceCode,
        type: data.type,
        merchantEmail,
      });
    }

    return { success: true, id: docRef.id, referenceCode };
  } catch (error) {
    console.error("[concierge] Error al procesar solicitud:", error);
    return { success: false, error: "No se pudo procesar la solicitud." };
  }
}
