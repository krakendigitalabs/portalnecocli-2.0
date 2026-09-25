"use server";

import { FieldValue, getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import type { MerchantApplicationInput } from "@/lib/validations/merchant-schema";
import { MerchantApplicationSchema } from "@/lib/validations/merchant-schema";

// Re-exportar tipos para que el formulario cliente los pueda importar desde aquí
export type { MerchantApplicationInput };

// ─── ACCIÓN: Registrar solicitud de aliado ─────────────────────────────────────
export async function submitMerchantApplication(
  rawData: MerchantApplicationInput,
): Promise<{ success: boolean; error?: string; fieldErrors?: Record<string, string[]> }> {
  // 1. Validación estricta con Zod (lado servidor — no se puede bypassear desde el cliente)
  const parsed = MerchantApplicationSchema.safeParse(rawData);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors as Record<string, string[]>;
    return { success: false, error: "Hay errores en el formulario.", fieldErrors };
  }

  const data = parsed.data;

  try {
    const db = getFirestore(getFirebaseAdminApp());

    // 2. Prevenir duplicados: un mismo correo no puede tener 2 solicitudes activas
    const existing = await db
      .collection("merchant_applications")
      .where("email", "==", data.email)
      .where("status", "in", ["pending", "approved"])
      .limit(1)
      .get();

    if (!existing.empty) {
      return {
        success: false,
        error:
          "Ya existe una solicitud registrada con este correo. Si tienes dudas, escríbenos por WhatsApp.",
      };
    }

    // 3. Guardar en Firestore con status "pending" — espera aprobación del SuperAdmin
    await db.collection("merchant_applications").add({
      ...data,
      status: "pending", // pending | approved | rejected
      reviewedBy: null, // UID del admin que aprueba
      reviewedAt: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // 4. Revalidar panel del SuperAdmin para que vea la nueva solicitud en tiempo real
    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("[submitMerchantApplication] Error:", error);
    return { success: false, error: "No se pudo enviar la solicitud. Inténtalo de nuevo." };
  }
}

// ─── ACCIÓN: Aprobar aliado (Solo SuperAdmin) ──────────────────────────────────
export async function approveMerchantApplication(
  applicationId: string,
  adminUid: string,
): Promise<{ success: boolean; error?: string }> {
  if (!applicationId || !adminUid) {
    return { success: false, error: "Parámetros inválidos." };
  }

  try {
    const db = getFirestore(getFirebaseAdminApp());
    await db.collection("merchant_applications").doc(applicationId).update({
      status: "approved",
      reviewedBy: adminUid,
      reviewedAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    revalidatePath("/admin");
    return { success: true };
  } catch (error) {
    console.error("[approveMerchantApplication] Error:", error);
    return { success: false, error: "No se pudo aprobar la solicitud." };
  }
}
