import { NextResponse } from "next/server";

/**
 * POST /api/drivers/register
 * Registra un nuevo conductor en el sistema Neco-Dispatch.
 *
 * En producción esto usaría Firebase Admin SDK para escribir en Firestore.
 * Mientras tanto, registramos los datos y loggeamos para validación.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validación de campos requeridos
    const requiredFields = ["full_name", "phone", "whatsapp", "vehicle_type", "vehicle_plate", "nequi_number"];
    for (const field of requiredFields) {
      if (!body[field] || String(body[field]).trim() === "") {
        return NextResponse.json(
          { error: `El campo '${field}' es obligatorio.` },
          { status: 400 },
        );
      }
    }

    // Validar tipo de vehículo
    const validTypes = ["mototaxi", "motocarro", "taxi", "lancha"];
    if (!validTypes.includes(body.vehicle_type)) {
      return NextResponse.json(
        { error: "Tipo de vehículo inválido." },
        { status: 400 },
      );
    }

    // Construir el perfil del conductor
    const now = new Date().toISOString();
    const driverData = {
      full_name: body.full_name.trim(),
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

        const docRef = await db.collection("drivers").add(driverData);
        firestoreId = docRef.id;
        console.log(`[NECO-DISPATCH] ✅ Conductor registrado en Firestore: ${firestoreId}`);
      }
    } catch (fsError: any) {
      console.warn("[NECO-DISPATCH] ⚠️ Firestore no disponible, registro guardado en log:", fsError.message);
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
    return NextResponse.json(
      { error: "Error interno al procesar el registro." },
      { status: 500 },
    );
  }
}
