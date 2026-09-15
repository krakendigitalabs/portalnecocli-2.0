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
  destination: z.string().min(1, "Destino requerido"),
  date: z.string().optional(),
  accommodation: z.enum(["none", "without_food", "food_standard", "food_exclusive"]),
  isSolidarityActive: z.boolean(),
  totalPrice: z.number().min(0, "Precio inválido"),
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
    const googleSheetsPayload = {
      ticketId,
      timestamp: new Date().toISOString(),
      tripType: validatedData.tripType,
      destination: validatedData.destination,
      travelDate: validatedData.date ?? "Sin fecha",
      accommodation: validatedData.accommodation,
      totalPrice: validatedData.totalPrice,
      solidarity: validatedData.isSolidarityActive ? "SI ($5.000 COP Motonecos)" : "NO",
      passengerCount: validatedData.passengers.length,
      passengers: validatedData.passengers
        .map((p, i) => `${i + 1}. ${p.name} (${p.docType}: ${p.docNum}) - Tel: ${p.phone} - Email: ${p.email}`)
        .join(" | "),
      petFriendly: validatedData.passengers.some((p) => p.petFriendly) ? "SI" : "NO",
      allergies: validatedData.passengers.some((p) => p.allergies) ? "SI" : "NO",
    };

    // 4. Send to Google Sheets via Apps Script webhook(s) (non-blocking if not configured)
    const webhookEnv = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (webhookEnv) {
      // Soporta múltiples webhooks separados por coma
      const webhookUrls = webhookEnv.split(",").map((url) => url.trim());
      
      for (const url of webhookUrls) {
        if (!url) continue;
        try {
          const sheetRes = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(googleSheetsPayload),
          });
          if (!sheetRes.ok) {
            console.warn("[MaritimeBooking] Google Sheets webhook error at", url, ":", sheetRes.status);
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
    if (process.env.RESEND_API_KEY && firstPassengerEmail) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Portal Necoclí <reservas@portalnecocli.com>", // Asegúrate de verificar este dominio en Resend
          to: [firstPassengerEmail, "portalnecocli@gmail.com"],
          subject: `🎟️ Tu Pre-reserva Marítima ha sido confirmada - ${ticketId}`,
          html: `
            <div style="font-family: 'Inter', sans-serif; max-w-lg mx-auto bg-white p-8 border border-gray-100 rounded-2xl shadow-sm text-gray-800">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #0369a1; margin: 0; font-size: 24px;">Portal Necoclí</h1>
                <p style="color: #64748b; font-size: 14px; margin-top: 5px;">Tu viaje hacia el paraíso comienza aquí</p>
              </div>
              <p style="font-size: 16px;">Hola <strong>${validatedData.passengers[0].name}</strong>,</p>
              <p style="font-size: 16px; line-height: 1.5; color: #334155;">Tu pre-reserva hacia <strong>${validatedData.destination}</strong> ha sido generada con éxito. Por favor presenta el siguiente código en la taquilla para realizar el pago final y asegurar tu embarque:</p>
              <div style="background-color: #f0f9ff; border: 1px dashed #bae6fd; padding: 20px; text-align: center; border-radius: 12px; margin: 30px 0;">
                <span style="display: block; font-size: 12px; color: #0369a1; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">Código de Reserva</span>
                <strong style="font-size: 28px; color: #0c4a6e; letter-spacing: 2px;">${ticketId}</strong>
              </div>
              <table style="width: 100%; font-size: 14px; color: #475569; margin-bottom: 30px; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong>Tipo de Viaje:</strong></td>
                  <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">${validatedData.tripType.toUpperCase()}</td>
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
              <p style="font-size: 14px; color: #64748b; text-align: center;">Te esperamos en el muelle. Gracias por elegir <a href="https://portalnecocli.com" style="color: #0ea5e9; text-decoration: none;">Portal Necoclí</a>.</p>
            </div>
          `
        });
      } catch (emailErr) {
        console.warn("[MaritimeBooking] Failed to send email:", emailErr);
      }
    }

    let wompiLink = undefined;
    if (validatedData.isSolidarityActive) {
       const pubKey = process.env.NEXT_PUBLIC_WOMPI_PUB_KEY || "pub_test_XXX";
       wompiLink = `https://checkout.wompi.co/p/?public-key=${pubKey}&currency=COP&amount-in-cents=500000&reference=${ticketId}-APORTE`;
    }

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
