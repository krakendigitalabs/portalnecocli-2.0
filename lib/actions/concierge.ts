"use server";

import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import { Resend } from "resend";
import { createReservation } from "@/data/reservationService";

const resend = new Resend(process.env.RESEND_API_KEY);

export type ConciergeRequest = {
  name: string;
  email: string;
  phone: string;
  request: string;
  estimatedPrice?: number;
  status?: "pending" | "in_progress" | "completed";
  createdAt?: Date | string;
};

export async function submitConciergeRequest(data: ConciergeRequest) {
  try {
    // 1. Guardar en Firestore
    const db = getFirestore(getFirebaseAdminApp());
    const docRef = await db.collection("concierge_requests").add({
      ...data,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    // 1.5. Crear Reserva Formal para el Checkout Wompi si hay un precio estimado
    let referenceCode = null;
    if (data.estimatedPrice) {
      const reservation = await createReservation({
        businessId: "portal-necocli-concierge",
        businessName: "Portal Necoclí (Plan a Medida)",
        totalAmount: data.estimatedPrice * 100, // Wompi requiere centavos
        lead: {
          full_name: data.name,
          email: data.email,
          phone: data.phone,
          whatsapp: data.phone,
          notes: data.request,
        },
      });
      referenceCode = reservation.reference_code;
    }

    // 2. Enviar email a Portal Necoclí
    await resend.emails.send({
      from: "Alejandro <guia@portalnecocli.com>", // Replace with verified domain if different
      to: ["guia@portalnecocli.com"],
      subject: `Nueva Solicitud de Domicilio/Reserva - ${data.name}`,
      html: `
        <h1>Nueva Solicitud de Conserjería</h1>
        <p><strong>Nombre:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Teléfono:</strong> ${data.phone}</p>
        <p><strong>Solicitud:</strong> ${data.request}</p>
      `,
    });

    // 3. Enviar email de confirmación al cliente
    if (data.email) {
      await resend.emails.send({
        from: "Alejandro <guia@portalnecocli.com>", 
        to: [data.email],
        subject: `Hemos recibido tu solicitud - Portal Necoclí`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h1 style="color: #0f2e21;">Hola, ${data.name}!</h1>
            <p>Soy Alejandro, tu guía de Portal Necoclí.</p>
            <p>He recibido tu solicitud y nuestro equipo ya está trabajando para brindarte la mejor experiencia:</p>
            <blockquote style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #10b981;">
              "${data.request}"
            </blockquote>
            <p>Nos pondremos en contacto contigo pronto al número ${data.phone}.</p>
            <p>Recuerda que podemos hacer las compras por ti y llevarlas a cualquier parte de Necoclí.</p>
            <p>Saludos cordiales,</p>
            <p><strong>Alejandro</strong><br>Portal Necoclí 2.0</p>
          </div>
        `,
      });
    }

    return { success: true, id: docRef.id, referenceCode };
  } catch (error) {
    console.error("Error submitting concierge request:", error);
    return { success: false, error: "No se pudo procesar la solicitud." };
  }
}
