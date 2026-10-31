import { NextResponse } from "next/server";
import { z } from "zod";
import { getServerAuthSession } from "@/lib/auth/server";
import { sendEmail } from "@/lib/email/resend";
import { escapeHtml } from "@/lib/security/html";
import { enforceRateLimit, rateLimitPolicies } from "@/lib/security/rate-limit";

const driverRegistrationSchema = z.object({
  full_name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(30),
  whatsapp: z.string().trim().min(7).max(30),
  vehicle_type: z.enum(["mototaxi", "motocarro", "taxi", "lancha"]),
  vehicle_plate: z.string().trim().min(2).max(20),
  nequi_number: z.string().trim().min(5).max(30),
  vehicle_description: z.string().trim().max(500).optional(),
  cooperative: z.string().trim().max(120).optional(),
});

/**
 * POST /api/drivers/register
 * Registra un nuevo conductor en el sistema Neco-Dispatch.
 *
 * Exige que el usuario esté autenticado. Usa su UID como ID de documento.
 */
export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, rateLimitPolicies.driverRegistration);
  if (limited) {
    return limited;
  }

  try {
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json(
        { error: "No autorizado. Debes iniciar sesión primero." },
        { status: 401 },
      );
    }

    const body: unknown = await request.json();
    const parsedBody = driverRegistrationSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { error: "Los datos del conductor no son válidos." },
        { status: 400 },
      );
    }
    const data = parsedBody.data;

    // Construir el perfil del conductor
    const now = new Date().toISOString();
    const driverData = {
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp,
      vehicle_type: data.vehicle_type,
      vehicle_plate: data.vehicle_plate.toUpperCase(),
      vehicle_description: data.vehicle_description || "",
      cooperative: data.cooperative || "",
      status: "pending_approval",
      availability: "offline",
      wallet_balance: 0,
      payout_method: {
        type: "NEQUI" as const,
        account_number: data.nequi_number,
        account_holder_name: data.full_name,
        document_id: "",
      },
      total_rides_completed: 0,
      average_rating: 5.0,
      created_at: now,
      updated_at: now,
      user_id: session.user.uid,
    };

    // --- Persistencia en Firestore ---
    // Intentar guardar en Firestore si está configurado
    let firestoreId: string | null = null;
    try {
      const { hasFirebaseAdminConfig } = await import("@/lib/firebase/admin");
      if (hasFirebaseAdminConfig()) {
        const { getFirestore } = await import("firebase-admin/firestore");
        const { getFirebaseAdminApp } = await import("@/lib/firebase/admin");
        const db = getFirestore(getFirebaseAdminApp());

        // Usar el UID del usuario como ID del documento de conductor
        await db.collection("drivers").doc(session.user.uid).set(driverData);
        firestoreId = session.user.uid;
        console.log(`[NECO-DISPATCH] ✅ Conductor registrado en Firestore con UID: ${firestoreId}`);
      }

      // Enviar correo de confirmación de registro
      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
          <h2 style="color: #0f2e21;">¡Hola, ${escapeHtml(driverData.full_name)}!</h2>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0; color: #111827; line-height: 1.6;">
            <p style="font-size: 16px; color: #059669; font-weight: bold;">Hemos recibido tu solicitud de registro como Conductor.</p>
            <p>Tus datos están actualmente bajo revisión por nuestro equipo de logística. Una vez aprobada tu cuenta, te enviaremos una notificación para que puedas empezar a recibir solicitudes de viajes.</p>
          </div>
          <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">
            El equipo de Neco-Dispatch / Portal Necoclí
          </p>
        </div>
      `;

      await sendEmail({
        to: driverData.email,
        subject: "⏳ Tu solicitud de Conductor está en revisión",
        html: emailHtml,
      });
    } catch (fsError: unknown) {
      console.warn(
        "[NECO-DISPATCH] ⚠️ Firestore no disponible, registro guardado en log:",
        fsError instanceof Error ? fsError.message : fsError,
      );
    }

    // Log del registro (siempre, para observabilidad)
    console.log("[NECO-DISPATCH] 📝 Nuevo conductor registrado:", {
      id: firestoreId || "LOCAL_LOG",
      name: driverData.full_name,
      vehicle: `${driverData.vehicle_type} - ${driverData.vehicle_plate}`,
      phone: driverData.phone,
    });

    return NextResponse.json({
      success: true,
      message: "Registro exitoso. Tu solicitud está siendo revisada.",
      driver_id: firestoreId,
    });
  } catch (error: unknown) {
    console.error("[NECO-DISPATCH] ❌ Error en registro de conductor:", error);
    return NextResponse.json({ error: "Error interno al procesar el registro." }, { status: 500 });
  }
}
