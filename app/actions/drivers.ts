"use server";

import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import { getServerAuthSession } from "@/lib/auth/server";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email/resend";

export async function updateDriverStatusAction(
  driverId: string,
  newStatus: "active" | "rejected",
  reason?: string,
) {
  try {
    const session = await getServerAuthSession();
    // Validar permisos de SuperAdmin
    if (
      !session ||
      (!session.user.roles.includes("super_admin") && !session.user.roles.includes("admin"))
    ) {
      return { success: false, error: "No autorizado" };
    }

    const db = getFirestore(getFirebaseAdminApp());
    const driverRef = db.collection("drivers").doc(driverId);
    const driverDoc = await driverRef.get();

    if (!driverDoc.exists) {
      return { success: false, error: "Conductor no encontrado" };
    }

    const driverData = driverDoc.data()!;

    // 1. Actualizar estado en Firestore
    await driverRef.update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    });

    // 2. Enviar correo de notificación
    if (driverData.email) {
      const isAccepted = newStatus === "active";
      const subject = isAccepted
        ? "✅ ¡Bienvenido! Tu cuenta de Conductor ha sido activada"
        : "❌ Actualización sobre tu solicitud de Conductor";

      const statusMessage = isAccepted
        ? `<p style="font-size: 16px; color: #059669; font-weight: bold;">¡Felicidades! Tu cuenta ha sido APROBADA y está activa.</p>
           <p>Ya puedes ingresar a tu tablero y empezar a recibir carreras inmediatamente.</p>`
        : `<p style="font-size: 16px; color: #DC2626; font-weight: bold;">Tu solicitud ha sido DENEGADA.</p>
           <p>Motivo: ${reason || "No cumples con los requisitos actuales de la plataforma."}</p>`;

      const html = `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
          <h2 style="color: #0f2e21;">Hola ${driverData.full_name},</h2>
          <p>Te escribimos desde el equipo de <strong>Neco-Dispatch / Portal Necoclí</strong>.</p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            ${statusMessage}
          </div>
          ${
            isAccepted
              ? `
            <a href="https://tours.portalnecocli.com/driver" style="display: inline-block; background-color: #0f2e21; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Ir a mi Tablero de Conductor
            </a>
          `
              : ""
          }
          <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">
            Si tienes dudas, por favor contáctanos respondiendo a este correo.
          </p>
        </div>
      `;

      await sendEmail({
        to: driverData.email,
        subject,
        html,
      });
    }

    revalidatePath("/admin");
    return { success: true };
  } catch (error: any) {
    console.error("[NECO-DISPATCH] Error actualizando conductor:", error);
    return { success: false, error: error.message || "Error interno al actualizar estado" };
  }
}

export async function sendCustomEmailAction(
  driverEmails: string[],
  subject: string,
  messageHtml: string,
) {
  try {
    const session = await getServerAuthSession();
    // Validar permisos de SuperAdmin
    if (
      !session ||
      (!session.user.roles.includes("super_admin") && !session.user.roles.includes("admin"))
    ) {
      return { success: false, error: "No autorizado" };
    }

    if (!driverEmails || driverEmails.length === 0) {
      return { success: false, error: "No se seleccionaron destinatarios" };
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
        <h2 style="color: #0f2e21;">Aviso Importante - Portal Necoclí</h2>
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; color: #111827; line-height: 1.6;">
          ${messageHtml}
        </div>
        <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">
          Este es un mensaje administrativo enviado a la flota de Neco-Dispatch.
        </p>
      </div>
    `;

    // Enviar a todos como copia oculta (Bcc) es mejor práctica, pero nuestro sendEmail actual no tiene Bcc expuesto.
    // Para simplificar y enviar de forma masiva segura, enviaremos uno por uno o pasamos el array a "bcc".
    // Como sendEmail de resend acepta array en 'to', le pasaremos el array. Resend maneja arrays de hasta 50 destinatarios.

    // Filtramos correos válidos por seguridad
    const validEmails = driverEmails.filter((e) => e && e.includes("@"));

    if (validEmails.length === 0) return { success: false, error: "Ningún correo es válido" };

    await sendEmail({
      to: validEmails,
      subject: subject,
      html: html,
    });

    return { success: true, count: validEmails.length };
  } catch (error: any) {
    console.error("[NECO-DISPATCH] Error enviando correo masivo:", error);
    return { success: false, error: error.message || "Error interno al enviar correo" };
  }
}
