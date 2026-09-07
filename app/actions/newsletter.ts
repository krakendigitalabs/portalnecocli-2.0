"use server";

import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import { getFirestore } from "firebase-admin/firestore";

export async function subscribeAndGrantWelcomeBonus(email: string) {
  const db = getFirestore(getFirebaseAdminApp());
  
  try {
    // 1. Guardar en Newsletter Leads
    const leadRef = db.collection("newsletter_leads").doc(email);
    const leadDoc = await leadRef.get();
    
    if (leadDoc.exists) {
      // Ya estaba suscrito, no damos bono otra vez
      throw new Error("Ya estás suscrito.");
    }
    
    await leadRef.set({
      email,
      subscribed_at: new Date().toISOString(),
      source: "WELCOME_MODAL"
    });
    
    // 2. Intentar buscar un customer_id asociado a este correo
    const usersSnapshot = await db.collection("users").where("email", "==", email).limit(1).get();
    
    let customerId = null;
    if (!usersSnapshot.empty) {
      customerId = usersSnapshot.docs[0].id;
    }
    
    // Si encontramos al usuario, le metemos el bono a la billetera directamente
    if (customerId) {
      await db.collection("loyalty_bonuses").add({
        customer_id: customerId,
        type: "DISCOUNT_PERCENTAGE",
        value: 10,
        title: "Regalo de Bienvenida",
        description: "10% de descuento en tu próxima aventura o estadía.",
        valid_days: [], // Válido todos los días
        status: "ACTIVE",
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
        code: `WELCOME-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      });
    }
    
    // En un sistema real aquí se enviaría un correo con Resend / SendGrid con el código
    // Por ahora, asumimos éxito.
    
    return { success: true };
    
  } catch (error: any) {
    console.error("Error in newsletter subscription:", error);
    throw new Error("Error al suscribirse");
  }
}
