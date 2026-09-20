"use server";

import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import { getFirestore } from "firebase-admin/firestore";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
    
    const discountCode = `WELCOME-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

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
        code: discountCode
      });
    }
    
    // 3. Enviar correo real con Resend
    await resend.emails.send({
      from: "Portal Necoclí <guia@portalnecocli.com>", 
      to: [email],
      subject: `¡Bienvenido al Paraíso! Aquí está tu 10% de Descuento`,
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; color: #1E293B; background-color: #F8FAFC; padding: 40px; border-radius: 12px; border: 1px solid #E2E8F0;">
          <h1 style="color: #0F172A; text-align: center; margin-bottom: 10px;">¡Felicidades!</h1>
          <p style="text-align: center; font-size: 16px; margin-bottom: 30px;">Acabas de desbloquear tu membresía exclusiva.</p>
          
          <div style="background-color: #0F172A; color: #FFFFFF; padding: 30px; border-radius: 8px; text-align: center; border-bottom: 4px solid #F59E0B;">
            <p style="margin: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #94A3B8;">Tu Código de 10% de Descuento</p>
            <h2 style="margin: 15px 0 0 0; font-size: 32px; color: #FBBF24; letter-spacing: 4px;">${discountCode}</h2>
          </div>
          
          <p style="margin-top: 30px; font-size: 15px; line-height: 1.6;">Úsalo en tu próxima reserva de hotel o tour directamente en nuestra plataforma o mencionándolo a tu guía Alejandro.</p>
          <p style="font-size: 15px; line-height: 1.6;">Nos vemos pronto en la playa.</p>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #E2E8F0; text-align: center; font-size: 12px; color: #64748B;">
            <p><strong>Portal Necoclí 2.0</strong></p>
            <p>Descubre el Paraíso.</p>
          </div>
        </div>
      `,
    });
    
    return { success: true };
    
  } catch (error: any) {
    console.error("Error in newsletter subscription:", error);
    throw new Error("Error al suscribirse");
  }
}
