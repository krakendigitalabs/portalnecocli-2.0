"use server";

import { z } from "zod";

// ─── Schemas ─────────────────────────────────────────────────────────────────

const RiderSchema = z.object({
  fullName: z.string().min(3, "Nombre completo requerido (mínimo 3 caracteres)"),
  cedula: z.string().min(5, "Número de cédula requerido"),
  bloodType: z.string().min(1, "Tipo de sangre requerido"),
  phone: z.string().optional().default(""),
  email: z
    .union([z.string().email("Correo inválido"), z.literal("")])
    .optional()
    .default(""),
});

const AtvBookingSchema = z.object({
  route: z.enum(["ruta1", "ruta2", "ruta3", "ruta4"], {
    message: "Selecciona una ruta válida",
  }),
  tourDate: z
    .string()
    .min(1, "Fecha del tour requerida")
    .refine((dateStr) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selected = new Date(dateStr);
      selected.setHours(0, 0, 0, 0);
      const diffDays = (selected.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays >= 1;
    }, "La reserva debe realizarse con mínimo 1 día de anticipación"),
  riders: z
    .array(RiderSchema)
    .min(1, "Debe haber al menos un piloto")
    .max(10, "Máximo 10 pilotos por reserva"),
  totalPrice: z.number().min(0, "Precio inválido"),
  depositAmount: z.number().min(0, "Monto del depósito inválido"),
});

export type AtvBookingServerInput = z.infer<typeof AtvBookingSchema>;

// ─── Action ──────────────────────────────────────────────────────────────────

export async function processAtvBooking(formData: AtvBookingServerInput) {
  try {
    const validated = AtvBookingSchema.parse(formData);

    // Generar ID único del ticket
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const ticketId = `TKT-ATV-${datePart}-${randomPart}`;

    // Fecha y hora Colombia
    const now = new Date();
    const registerDate = new Intl.DateTimeFormat("es-CO", {
      timeZone: "America/Bogota",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);
    const registerTime = new Intl.DateTimeFormat("es-CO", {
      timeZone: "America/Bogota",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(now);

    const routeLabels: Record<string, string> = {
      ruta1: "Ruta 1 — Árbol Mágico & Ciénaga del Salado (2h)",
      ruta2: "Ruta 2 — Veredas, Pantano & Finca de Frutales (3h)",
      ruta3: "Ruta 3 — Pantano, Playa & Mar con Almuerzo (5h)",
      ruta4: "Ruta 4 — Aventura Extrema: Pantano Extremo",
    };

    const p1 = validated.riders[0];

    const googleSheetsPayload = {
      ticketId,
      registerDate,
      registerTime,
      tourType: "Cuatrimoto",
      route: routeLabels[validated.route] ?? validated.route,
      tourDate: validated.tourDate,
      riderCount: validated.riders.length,
      totalPrice: validated.totalPrice,
      depositAmount: validated.depositAmount,
      // Titular
      name: p1?.fullName ?? "Sin nombre",
      cedula: p1?.cedula ?? "",
      bloodType: p1?.bloodType ?? "",
      phone: p1?.phone ?? "",
      email: p1?.email ?? "",
      // Todos los pilotos
      allNames: validated.riders.map((r) => r.fullName).join(", "),
      allCedulas: validated.riders.map((r) => r.cedula).join(", "),
      allBloodTypes: validated.riders.map((r) => r.bloodType).join(", "),
    };

    // Enviar a Google Sheets
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_ATV ?? process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (webhookUrl) {
      const urls = webhookUrl.split(",").map((u) => u.trim());
      for (const url of urls) {
        if (!url) continue;
        try {
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(googleSheetsPayload),
          });
          if (!res.ok) {
            console.warn(`[AtvBooking] Webhook error ${res.status} at ${url}`);
          }
        } catch (err) {
          console.warn("[AtvBooking] Webhook failed:", err);
        }
      }
    } else {
      console.warn("[AtvBooking] No webhook configured.");
    }

    // Enviar email de confirmación
    const firstEmail = validated.riders[0]?.email;
    if (process.env.RESEND_API_KEY && firstEmail) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        const riderRowsHtml = validated.riders
          .map(
            (r, i) => `
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;margin-bottom:10px;font-size:14px;">
            <strong style="color:#d97706;font-size:15px;">Piloto ${i + 1}: ${r.fullName}</strong><br/>
            <span style="color:#475569;">Cédula: ${r.cedula}</span><br/>
            <span style="color:#475569;">Tipo de sangre: ${r.bloodType}</span><br/>
            ${r.phone ? `<span style="color:#475569;">Teléfono: ${r.phone}</span><br/>` : ""}
            ${r.email ? `<span style="color:#475569;">Correo: ${r.email}</span>` : ""}
          </div>`,
          )
          .join("");

        await resend.emails.send({
          from: "Portal Necoclí <reservas@portalnecocli.com>",
          to: [firstEmail, "rodriguezgonzalezsimon@gmail.com", "portalnecocli@gmail.com"],
          replyTo: firstEmail,
          subject: `🏍️ Pre-reserva Cuatrimoto confirmada — ${ticketId}`,
          html: `
<div style="font-family:'Inter',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:32px;border:1px solid #e2e8f0;border-radius:16px;">
  <div style="text-align:center;margin-bottom:28px;">
    <h1 style="color:#d97706;margin:0;font-size:26px;font-weight:800;">🏍️ Cuatrimotos Necoclí</h1>
    <p style="color:#64748b;font-size:14px;margin-top:6px;">Portal Necoclí · Tu aventura comienza aquí</p>
  </div>
  <p style="font-size:16px;color:#1e293b;">Hola <strong>${validated.riders[0].fullName}</strong>,</p>
  <p style="font-size:15px;line-height:1.6;color:#334155;margin-top:8px;">Tu pre-reserva de <strong>${routeLabels[validated.route]}</strong> ha sido generada con éxito.</p>
  <div style="background:#fffbeb;border:2px dashed #f59e0b;padding:22px;text-align:center;border-radius:12px;margin:28px 0;">
    <span style="display:block;font-size:12px;color:#d97706;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">Código de Reserva</span>
    <strong style="font-size:30px;color:#92400e;letter-spacing:3px;">${ticketId}</strong>
  </div>
  <h3 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#d97706;border-bottom:2px solid #fde68a;padding-bottom:6px;margin-bottom:16px;">📋 Detalles del Tour</h3>
  <table style="width:100%;font-size:14px;color:#475569;margin-bottom:28px;border-collapse:collapse;">
    <tr><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;font-weight:600;width:46%;">Ruta:</td><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;text-align:right;">${routeLabels[validated.route]}</td></tr>
    <tr><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;font-weight:600;">Fecha del Tour:</td><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;text-align:right;">${validated.tourDate}</td></tr>
    <tr><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;font-weight:600;">Total Pilotos:</td><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;text-align:right;">${validated.riders.length}</td></tr>
    <tr><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;font-weight:600;">Valor Total Ruta:</td><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;text-align:right;color:#059669;font-weight:700;">$${validated.totalPrice.toLocaleString("es-CO")} COP</td></tr>
    <tr><td style="padding:9px 6px;font-weight:600;">Anticipo requerido (50%):</td><td style="padding:9px 6px;text-align:right;color:#d97706;font-weight:700;">$${validated.depositAmount.toLocaleString("es-CO")} COP</td></tr>
  </table>
  <h3 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#d97706;border-bottom:2px solid #fde68a;padding-bottom:6px;margin-bottom:16px;">🏍️ Pilotos Registrados</h3>
  <div style="margin-bottom:28px;">${riderRowsHtml}</div>
  <div style="background:#fffbeb;border:2px solid #f59e0b;border-radius:12px;padding:20px 22px;margin-bottom:22px;">
    <h3 style="font-size:14px;font-weight:800;color:#92400e;margin:0 0 10px;">📲 Cómo pagar tu anticipo</h3>
    <p style="font-size:13px;color:#78350f;margin:0 0 8px;">Envía el <strong>50% del valor total</strong> por Nequi o transferencia:</p>
    <p style="font-size:15px;font-weight:700;color:#92400e;margin:0;">Nequi: <span style="letter-spacing:1px;">3217511866</span></p>
    <p style="font-size:12px;color:#b45309;margin:10px 0 0;">⚠️ Envía el comprobante al WhatsApp del operador para confirmar tu reserva.</p>
  </div>
  <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:12px 16px;margin-bottom:25px;border-radius:4px;">
    <p style="margin:0;font-size:13px;color:#166534;"><strong>🛡️ Incluido en tu tour:</strong> Casco, gafas y póliza de accidente para cada piloto.</p>
  </div>
  <div style="background:#fee2e2;border-left:4px solid #ef4444;padding:12px 16px;margin-bottom:25px;border-radius:4px;">
    <p style="margin:0;font-size:13px;color:#991b1b;"><strong>⏰ Recuerda:</strong> Las reservas se realizan con mínimo 1 día de anticipación. Tu cupo queda asegurado al enviar el anticipo.</p>
  </div>
  <p style="font-size:14px;color:#64748b;text-align:center;">¡Te esperamos con el casco puesto! Gracias por elegir <a href="https://portalnecocli.com" style="color:#d97706;text-decoration:none;font-weight:600;">Portal Necoclí</a>.</p>
  <p style="font-size:12px;color:#94a3b8;text-align:center;margin-top:8px;">Gestionado por Kraken Digital Labs · portalnecocli.com</p>
</div>`,
        });
      } catch (emailErr) {
        console.warn("[AtvBooking] Email send failed:", emailErr);
      }
    }

    return {
      success: true as const,
      ticketId,
      message: "Pre-reserva de cuatrimoto generada con éxito",
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
    console.error("[AtvBooking] Unexpected error:", error);
    return { success: false as const, error: "Error interno al procesar la reserva" };
  }
}
