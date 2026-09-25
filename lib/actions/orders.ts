"use server";

import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import type { ConciergeRequest } from "@/types/order";

/** Estados posibles de una solicitud del Guía Local */
export type OrderStatus = NonNullable<ConciergeRequest["status"]>;

import { requireRole } from "@/lib/auth/server";

/** Cambia el estado de una solicitud en Firestore, validando la sesión del comercio */
export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
): Promise<{ success: boolean; error?: string }> {
  try {
    // POKA YOKE 1: Verificar que quien hace la petición es un aliado autenticado
    const session = await requireRole(["business"]);
    const merchantEmail = session.user.email;

    if (!orderId || orderId.length < 5) {
      return { success: false, error: "ID de solicitud inválido." };
    }

    // POKA YOKE 2: Evitar inyección de estados no permitidos
    const validStatuses: OrderStatus[] = [
      "pending",
      "accepted",
      "in_progress",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(newStatus)) {
      return { success: false, error: "Estado no permitido." };
    }

    const db = getFirestore(getFirebaseAdminApp());
    const docRef = db.collection("concierge_requests").doc(orderId);

    // POKA YOKE 3: Verificar que el pedido le pertenece al comercio (Zero Trust)
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return { success: false, error: "El pedido no existe." };
    }
    const orderData = docSnap.data();
    if (orderData?.merchantEmail !== merchantEmail) {
      return { success: false, error: "Acceso denegado: Este pedido pertenece a otro comercio." };
    }

    await docRef.update({
      status: newStatus,
      updatedAt: new Date().toISOString(),
    });

    // Revalidar el panel del comercio para que vea el cambio sin recargar
    revalidatePath("/merchant/pedidos");

    return { success: true };
  } catch (error) {
    console.error("[updateOrderStatus] Error:", error);
    return { success: false, error: "No se pudo actualizar el estado." };
  }
}

/** Carga las solicitudes filtrando por nombre de comercio y/o categoría */
export async function getOrdersByMerchant(filters: {
  merchantEmail?: string;
  category?: string;
  limit?: number;
}): Promise<ConciergeRequest[]> {
  try {
    const db = getFirestore(getFirebaseAdminApp());
    let query: FirebaseFirestore.Query = db
      .collection("concierge_requests")
      .orderBy("createdAt", "desc")
      .limit(filters.limit ?? 50);

    if (filters.merchantEmail) {
      query = query.where("merchantEmail", "==", filters.merchantEmail);
    }
    if (filters.category) {
      query = query.where("category", "==", filters.category);
    }

    const snap = await query.get();
    return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ConciergeRequest);
  } catch (error) {
    console.error("[getOrdersByMerchant] Error:", error);
    return [];
  }
}
