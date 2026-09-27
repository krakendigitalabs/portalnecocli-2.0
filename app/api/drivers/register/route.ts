import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/lib/auth/server";
import { sendEmail } from "@/lib/email/resend";

/**
 * POST /api/drivers/register
 * Registra un nuevo conductor en el sistema Neco-Dispatch.
 *
 * Exige que el usuario esté autenticado. Usa su UID como ID de documento.
 */
export async function POST(request: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json(
        { error: "No autorizado. Debes iniciar sesión primero." },
        { status: 401 },
      );
    }

    const body = await request.json();

    // Validación de campos requeridos
    const requiredFields = [
      "full_name",
      "email",
      "phone",
      "whatsapp",
      "vehicle_type",
      "vehicle_plate",
      "nequi_number",
    ];
    for (const field of requiredFields) {
      if (!body[field] || String(body[field]).trim() === "") {
        return NextResponse.json({ error: `El campo '${field}' es obligatorio.` }, { status: 400 });
      }
    }

    // Validar tipo de vehículo
    const validTypes = ["mototaxi", "motocarro", "taxi", "lancha"];
    if (!validTypes.includes(body.vehicle_type)) {
      return NextResponse.json({ error: "Tipo de vehículo inválido." }, { status: 400 });
    }

    // Construir el perfil del conductor
    const now = new Date().toISOString();
    const driverData = {
      full_name: body.full_name.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      whatsapp: body.whatsapp.trim(),
      vehicle_type: body.vehicle_type,
      vehicle_plate: body.vehicle_plate.trim().toUpperCase(),
      vehicle_description: body.vehicle_description?.trim() || "",
      cooperative: body.cooperative?.trim() || "",
      status: "pending_approval",
      availability: "offline",
      wallet_balance: 0,
      payout_method: {
        type: "NEQUI" as const,
        account_number: body.nequi_number.trim(),
        account_holder_name: body.full_name.trim(),
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
          <h2 style="color: #0f2e21;">¡Hola, ${driverData.full_name}!</h2>
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
    } catch (fsError: any) {
      console.warn(
        "[NECO-DISPATCH] ⚠️ Firestore no disponible, registro guardado en log:",
        fsError.message,
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
  } catch (error: any) {
    console.error("[NECO-DISPATCH] ❌ Error en registro de conductor:", error);
    return NextResponse.json({ error: "Error interno al procesar el registro." }, { status: 500 });
  }
}
