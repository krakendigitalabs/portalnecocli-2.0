"use server";

import { z } from "zod";

const PassengerSchema = z.object({
  name: z.string().min(2, "Nombre del pasajero requerido (mínimo 2 caracteres)"),
  docType: z.enum(["CC", "CE", "TI", "PAS"]),
  docNum: z.string().min(5, "Número de documento requerido"),
  phone: z.string().optional().default(""),
  email: z.union([z.string().email("Correo inválido"), z.literal("")]).optional().default(""),
  petFriendly: z.boolean().default(false),
  allergies: z.boolean().default(false),
});

const BookingSchema = z.object({
  tripType: z.enum(["ruta", "sol", "yate"]),
  origin: z.string().min(1, "Origen requerido").default("Necoclí"),
  destination: z.string().min(1, "Destino requerido"),
  operator: z.enum(["caribe", "sol_playa"], { message: "Debe seleccionar una naviera" }),
  date: z.string().optional(),
  accommodation: z.enum(["none", "without_food", "food_standard", "food_exclusive"]),
  isSolidarityActive: z.boolean(),
  totalPrice: z.number().min(0, "Precio inválido"),
  journeyType: z.enum(["ida", "ida_vuelta"]).optional().default("ida_vuelta"),
  passengers: z.array(PassengerSchema).min(1, "Al menos un pasajero es requerido"),
});

export type MaritimeBookingInput = z.infer<typeof BookingSchema>;

export async function processMaritimeBooking(formData: MaritimeBookingInput) {
  try {
    // 1. Validate all data with Zod
    const validatedData = BookingSchema.parse(formData);

    // 2. Generate a unique Ticket ID with date prefix
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const ticketId = `TKT-MAR-${datePart}-${randomPart}`;

    // 3. Prepare flat payload for Google Sheets row
    const p1 = validatedData.passengers[0];
    
    // Obtener fecha y hora de Colombia para el registro
    const now = new Date();
    const registerDate = new Intl.DateTimeFormat("es-CO", { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
    const registerTime = new Intl.DateTimeFormat("es-CO", { timeZone: "America/Bogota", hour: "2-digit", minute: "2-digit", hour12: true }).format(now);

    const googleSheetsPayload = {
      ticketId,
      registerDate,
      registerTime,
      tripType: validatedData.tripType,
      journeyType: validatedData.journeyType === "ida" ? "Ida" : "Ida y Vuelta",
      origin: validatedData.origin,
      destination: validatedData.destination,
      operator: validatedData.operator === "caribe" ? "El Caribe S.A.S." : "Sol y Playa S.A.S.",
      travelDate: validatedData.date ?? "Sin fecha",
      accommodation: validatedData.accommodation,
      totalPrice: validatedData.totalPrice,
      solidarity: validatedData.isSolidarityActive ? "SI ($5.000 COP Motonecos)" : "NO",
      passengerCount: validatedData.passengers.length,
      
      // Datos del Titular / Representante
      name: p1?.name || "Sin nombre",
      docType: p1?.docType || "",
      docNum: p1?.docNum || "",
      phone: p1?.phone || "",
      email: p1?.email || "",
      
      // Indicadores booleanos
      petFriendly: validatedData.passengers.some((p) => p.petFriendly) ? "SI" : "NO",
      allergies: validatedData.passengers.some((p) => p.allergies) ? "SI" : "NO",
      
      // Consolidado para el resto de pasajeros separados por coma (No agrupados con texto adicional)
      allNames: validatedData.passengers.map(p => p.name).join(", "),
      allDocs: validatedData.passengers.map(p => `${p.docType} ${p.docNum}`).join(", "),
      allPhones: validatedData.passengers.map(p => p.phone || "N/A").join(", "),
      allEmails: validatedData.passengers.map(p => p.email || "N/A").join(", "),
    };

    // 4. Send to Google Sheets via Apps Script webhook(s) (non-blocking if not configured)
    let webhookEnv = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    
    // Soporte para enrutamiento a planillas separadas por naviera
    if (validatedData.operator === "caribe" && process.env.GOOGLE_SHEETS_WEBHOOK_CARIBE) {
      webhookEnv = process.env.GOOGLE_SHEETS_WEBHOOK_CARIBE;
    } else if (validatedData.operator === "sol_playa" && process.env.GOOGLE_SHEETS_WEBHOOK_SOLPLAYA) {
      webhookEnv = process.env.GOOGLE_SHEETS_WEBHOOK_SOLPLAYA;
    }

    if (webhookEnv) {
      // Soporta múltiples webhooks separados por coma
      const webhookUrls = webhookEnv.split(",").map((url) => url.trim());
      
      for (const url of webhookUrls) {
        if (!url) continue;
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(googleSheetsPayload),
          });

          const textResponse = await res.text();
          console.log(`[MaritimeBooking] GS Response (${res.status}):`, textResponse);

          if (!res.ok) {
            console.error(`[MaritimeBooking] Google Sheets webhook error at ${url} : ${res.status}`);
          }
        } catch (err) {
          console.warn("[MaritimeBooking] Failed to call webhook", url, err);
        }
      }
    } else {
      console.warn("[MaritimeBooking] GOOGLE_SHEETS_WEBHOOK_URL not configured — sync skipped.");
    }

    // 5. Send emails
    const firstPassengerEmail = validatedData.passengers[0]?.email;
    const operatorName = validatedData.operator === "caribe" ? "El Caribe S.A.S." : "Sol y Playa S.A.S.";
    const operatorEmail = validatedData.operator === "caribe" ? "reservas@elcaribesas.com" : "reservas@solyplayasas.com"; // TODO: Actualizar correos reales en variables de entorno

    if (process.env.RESEND_API_KEY && firstPassengerEmail) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Portal Necoclí <reservas@portalnecocli.com>", // Asegúrate de verificar este dominio en Resend
          to: [firstPassengerEmail, "portalnecocli@gmail.com", operatorEmail],
          subject: `🎟️ Tu Pre-reserva Marítima ha sido confirmada - ${ticketId} - ${operatorName}`,
          html: `
            <div style="font-family: 'Inter', sans-serif; max-w-lg mx-auto bg-white p-8 border border-gray-100 rounded-2xl shadow-sm text-gray-800">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #0369a1; margin: 0; font-size: 24px;">Portal Necoclí</h1>
                <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Tu viaje hacia el paraíso comienza aquí</p>
              </div>
              <p style="font-size: 16px;">Hola <strong>${validatedData.passengers[0].name}</strong>,</p>
              <p style="font-size: 16px; line-height: 1.5; color: #334155;">Tu pre-reserva para la ruta <strong>${validatedData.origin} → ${validatedData.destination}</strong> operada por <strong>${operatorName}</strong> ha sido generada con éxito. Por favor presenta el siguiente código en la taquilla de la naviera correspondiente para realizar el pago final y asegurar tu embarque:</p>
              <div style="background-color: #f0f9ff; border: 1px dashed #bae6fd; padding: 20px; text-align: center; border-radius: 12px; margin: 30px 0;">
                <span style="display: block; font-size: 12px; color: #0369a1; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Código de Reserva</span>
                <strong style="font-size: 28px; color: #0c4a6e; letter-spacing: 2px;">${ticketId}</strong>
              </div>
              <table style="width: 100%; font-size: 14px; color: #475569; margin-bottom: 30px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Tipo de Viaje:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">${validatedData.tripType.toUpperCase()} - ${validatedData.journeyType === "ida" ? "IDA" : "IDA Y VUELTA"}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Pasajeros:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">${validatedData.passengers.length}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Valor a pagar en taquilla:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right; color: #059669; font-weight: bold;">$${validatedData.totalPrice.toLocaleString("es-CO")} COP</td>
                </tr>
              </table>
              <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 12px 16px; margin-bottom: 25px; border-radius: 4px;">
                <p style="margin: 0; font-size: 13px; color: #92400e;">
                  <strong>🧳 Política de Equipaje:</strong> Tienes 10 kg incluidos por pasajero. El peso excedente tiene un valor de <strong>$2.000 COP</strong> por cada kilo adicional, pagaderos exclusivamente en la taquilla de la naviera.
                </p>
              </div>
              <p style="font-size: 14px; color: #64748b; text-align: center;">Te esperamos en el muelle. Gracias por elegir <a href="https://portalnecocli.com" style="color: #0ea5e9; text-decoration: none;">Portal Necoclí</a>.</p>
            </div>
          `
        });
      } catch (emailErr) {
        console.warn("[MaritimeBooking] Failed to send email:", emailErr);
      }
    }

    let wompiLink = undefined;
    // WOMPI DESACTIVADO HASTA NUEVA ORDEN - Pago directo en taquillas
    /*
    if (validatedData.isSolidarityActive) {
       const pubKey = process.env.NEXT_PUBLIC_WOMPI_TEST_KEY || process.env.NEXT_PUBLIC_WOMPI_KEY || "pub_test_XXX";
       wompiLink = `https://checkout.wompi.co/p/?public-key=${pubKey}&currency=COP&amount-in-cents=500000&reference=${ticketId}-APORTE`;
    }
    */

    return {
      success: true as const,
      ticketId,
      wompiLink,
      message: "Pre-reserva generada con éxito",
      data: googleSheetsPayload,
    };

  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues[0];
      return {
        success: false as const,
        error: `Validación: ${firstIssue.message}`,
        fieldErrors: error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
      };
    }
    console.error("[MaritimeBooking] Unexpected error:", error);
    return { success: false as const, error: "Error interno al procesar la reserva" };
  }
}
