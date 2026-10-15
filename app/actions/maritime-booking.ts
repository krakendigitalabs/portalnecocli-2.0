"use server";

import { z } from "zod";

const PassengerSchema = z.object({
  name: z.string().min(2, "Nombre del pasajero requerido (mínimo 2 caracteres)"),
  docType: z.enum(["CC", "CE", "TI", "PAS"]),
  docNum: z.string().min(5, "Número de documento requerido"),
  phone: z.string().optional().default(""),
  email: z
    .union([z.string().email("Correo inválido"), z.literal("")])
    .optional()
    .default(""),
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
      allNames: validatedData.passengers.map((p) => p.name).join(", "),
      allDocs: validatedData.passengers.map((p) => `${p.docType} ${p.docNum}`).join(", "),
      allPhones: validatedData.passengers.map((p) => p.phone || "N/A").join(", "),
      allEmails: validatedData.passengers.map((p) => p.email || "N/A").join(", "),
    };

    // 4. Send to Google Sheets via Apps Script webhook(s) (non-blocking if not configured)
    let webhookEnv = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    // Soporte para enrutamiento a planillas separadas por naviera
    if (validatedData.operator === "caribe" && process.env.GOOGLE_SHEETS_WEBHOOK_CARIBE) {
      webhookEnv = process.env.GOOGLE_SHEETS_WEBHOOK_CARIBE;
    } else if (
      validatedData.operator === "sol_playa" &&
      process.env.GOOGLE_SHEETS_WEBHOOK_SOLPLAYA
    ) {
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
            console.error(
              `[MaritimeBooking] Google Sheets webhook error at ${url} : ${res.status}`,
            );
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
    const operatorName =
      validatedData.operator === "caribe" ? "El Caribe S.A.S." : "Sol y Playa S.A.S.";
    const operatorEmail =
      validatedData.operator === "caribe"
        ? process.env.CARIBE_SAS_EMAIL || "operadormaritimocaribesas@gmail.com"
        : process.env.SOL_PLAYA_EMAIL || "reservastransportessolyplaya@gmail.com";

    if (process.env.RESEND_API_KEY && firstPassengerEmail) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Build per-passenger HTML rows (email body)
        const passengerRowsEmail = validatedData.passengers
          .map(
            (p, i) => `
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;margin-bottom:10px;font-size:14px;">
            <strong style="color:#0369a1;font-size:15px;">Pasajero ${i + 1}: ${p.name}</strong><br/>
            <span style="color:#475569;">Documento: ${p.docType} ${p.docNum}</span><br/>
            ${p.phone ? `<span style="color:#475569;">Teléfono: ${p.phone}</span><br/>` : ""}
            ${p.email ? `<span style="color:#475569;">Correo: ${p.email}</span><br/>` : ""}
            ${p.petFriendly ? `<span style="display:inline-block;margin-top:6px;background:#ede9fe;color:#6d28d9;font-weight:700;font-size:12px;padding:3px 10px;border-radius:20px;">🐾 Viaja con Mascota (Pet Friendly)</span>` : ""}
            ${p.allergies ? `<span style="display:inline-block;margin-top:6px;background:#fee2e2;color:#b91c1c;font-weight:700;font-size:12px;padding:3px 10px;border-radius:20px;">⚠️ Tiene Alergias declaradas</span>` : ""}
          </div>`,
          )
          .join("");

        // Build per-passenger HTML for attached ticket
        const passengerCardsTicket = validatedData.passengers
          .map(
            (p, i) => `
          <div class="passenger-card">
            <div class="pname">Pasajero ${i + 1}: ${p.name}</div>
            <p><strong>Documento:</strong> ${p.docType} ${p.docNum}</p>
            ${p.phone ? `<p><strong>Teléfono:</strong> ${p.phone}</p>` : ""}
            ${p.email ? `<p><strong>Correo:</strong> ${p.email}</p>` : ""}
            <div style="margin-top:6px;">
              ${p.petFriendly ? `<span class="badge badge-pet">🐾 Viaja con Mascota (Pet Friendly)</span>` : ""}
              ${p.allergies ? `<span class="badge badge-allergy">⚠️ Tiene Alergias declaradas</span>` : ""}
            </div>
          </div>`,
          )
          .join("");

        const solidarityRow = validatedData.isSolidarityActive
          ? `<tr><td>Aporte Solidario Motonecos</td><td>$5.000 COP (Incluido)</td></tr>`
          : "";

        // Payment info per naviera
        const isCaribe = validatedData.operator === "caribe";
        const paymentInfoEmail = isCaribe
          ? `<div style="background:#f0fdf4;border:2px solid #22c55e;border-radius:12px;padding:20px 22px;margin-bottom:22px;">
  <h3 style="font-size:14px;font-weight:800;color:#15803d;margin:0 0 14px;text-transform:uppercase;letter-spacing:.5px;">💳 Cómo realizar tu pago — El Caribe S.A.S. / Viajes Altamar SAS</h3>
  <p style="font-size:13px;color:#166534;margin:0 0 10px;line-height:1.6;">Para asegurar tu cupo, realiza un abono del <strong>50% o más</strong> a la siguiente cuenta:</p>
  <table style="width:100%;font-size:14px;border-collapse:collapse;">
    <tr><td style="padding:7px 6px;border-bottom:1px solid #bbf7d0;font-weight:700;color:#166534;width:46%;">🏦 Banco</td><td style="padding:7px 6px;border-bottom:1px solid #bbf7d0;color:#14532d;">Bancolombia — Cuenta de Ahorros</td></tr>
    <tr><td style="padding:7px 6px;border-bottom:1px solid #bbf7d0;font-weight:700;color:#166534;">📄 Número de Cuenta</td><td style="padding:7px 6px;border-bottom:1px solid #bbf7d0;"><strong style="font-size:16px;letter-spacing:1px;color:#14532d;">55100011232</strong></td></tr>
    <tr><td style="padding:7px 6px;border-bottom:1px solid #bbf7d0;font-weight:700;color:#166534;">👤 A nombre de</td><td style="padding:7px 6px;border-bottom:1px solid #bbf7d0;color:#14532d;">Viajes Altamar SAS</td></tr>
    <tr><td style="padding:7px 6px;font-weight:700;color:#166534;">📲 Nequi / Llave</td><td style="padding:7px 6px;"><strong style="color:#14532d;">@transportenecocli</strong></td></tr>
  </table>
  <p style="font-size:12px;color:#4ade80;margin:12px 0 0;">⚠️ Envía el comprobante de pago al WhatsApp de la naviera para confirmar tu reserva.</p>
</div>`
          : `<div style="background:#f0fdf4;border:2px solid #22c55e;border-radius:12px;padding:20px 22px;margin-bottom:22px;">
  <h3 style="font-size:14px;font-weight:800;color:#15803d;margin:0 0 14px;text-transform:uppercase;letter-spacing:.5px;">💳 Cómo realizar tu pago — Transportes Sol y Playa S.A.S.</h3>
  <p style="font-size:13px;color:#166534;margin:0 0 10px;line-height:1.6;">Para asegurar tu cupo, realiza un abono del <strong>50% o más</strong> a la siguiente cuenta:</p>
  <table style="width:100%;font-size:14px;border-collapse:collapse;">
    <tr><td style="padding:7px 6px;border-bottom:1px solid #bbf7d0;font-weight:700;color:#166534;width:46%;">🏦 Banco</td><td style="padding:7px 6px;border-bottom:1px solid #bbf7d0;color:#14532d;">Bancolombia — Cuenta de Ahorros</td></tr>
    <tr><td style="padding:7px 6px;border-bottom:1px solid #bbf7d0;font-weight:700;color:#166534;">📄 Número de Cuenta</td><td style="padding:7px 6px;border-bottom:1px solid #bbf7d0;"><strong style="font-size:16px;letter-spacing:1px;color:#14532d;">73900001145</strong></td></tr>
    <tr><td style="padding:7px 6px;border-bottom:1px solid #bbf7d0;font-weight:700;color:#166534;">🔑 Número de Llave</td><td style="padding:7px 6px;border-bottom:1px solid #bbf7d0;"><strong style="font-size:16px;letter-spacing:1px;color:#14532d;">0048072607</strong></td></tr>
    <tr><td style="padding:7px 6px;font-weight:700;color:#166534;">👤 A nombre de</td><td style="padding:7px 6px;color:#14532d;">Transportes Sol y Playa S.A.S.</td></tr>
  </table>
  <p style="font-size:12px;color:#4ade80;margin:12px 0 0;">⚠️ Envía el comprobante de pago al WhatsApp de la naviera para confirmar tu reserva.</p>
</div>`;

        const paymentInfoTicket = isCaribe
          ? `<div class="payment-box">
  <h2>💳 Datos de Pago — El Caribe S.A.S. / Viajes Altamar SAS</h2>
  <p class="payment-note">Para asegurar tu cupo, realiza un abono del <strong>50% o más</strong>:</p>
  <table class="info">
    <tr><td>🏦 Banco</td><td>Bancolombia — Cuenta de Ahorros</td></tr>
    <tr><td>📄 Número de Cuenta</td><td><strong class="acct">55100011232</strong></td></tr>
    <tr><td>👤 A nombre de</td><td>Viajes Altamar SAS</td></tr>
    <tr><td>📲 Nequi / Llave</td><td><strong class="acct">@transportenecocli</strong></td></tr>
  </table>
  <p class="payment-note" style="margin-top:10px;">⚠️ Envía el comprobante de pago al WhatsApp de la naviera para confirmar tu reserva.</p>
</div>`
          : `<div class="payment-box">
  <h2>💳 Datos de Pago — Transportes Sol y Playa S.A.S.</h2>
  <p class="payment-note">Para asegurar tu cupo, realiza un abono del <strong>50% o más</strong>:</p>
  <table class="info">
    <tr><td>🏦 Banco</td><td>Bancolombia — Cuenta de Ahorros</td></tr>
    <tr><td>📄 Número de Cuenta</td><td><strong class="acct">73900001145</strong></td></tr>
    <tr><td>🔑 Número de Llave</td><td><strong class="acct">0048072607</strong></td></tr>
    <tr><td>👤 A nombre de</td><td>Transportes Sol y Playa S.A.S.</td></tr>
  </table>
  <p class="payment-note" style="margin-top:10px;">⚠️ Envía el comprobante de pago al WhatsApp de la naviera para confirmar tu reserva.</p>
</div>`;

        const attachmentHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Tiquete Pre-Reserva - ${ticketId}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Arial,sans-serif;background:#f0f9ff;color:#1e293b;padding:30px}
    .ticket{max-width:680px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.1)}
    .header{background:linear-gradient(135deg,#0369a1,#0ea5e9);color:#fff;padding:28px 32px;text-align:center}
    .header h1{font-size:26px;font-weight:800}
    .header p{font-size:13px;opacity:.85;margin-top:6px}
    .ticket-code{background:#f0f9ff;border:2px dashed #7dd3fc;border-radius:12px;margin:24px 32px;padding:20px;text-align:center}
    .ticket-code span{display:block;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#0369a1;margin-bottom:6px}
    .ticket-code strong{font-size:30px;color:#0c4a6e;letter-spacing:3px}
    .section{padding:0 32px 24px}
    .section h2{font-size:13px;font-weight:700;color:#0369a1;border-bottom:2px solid #e0f2fe;padding-bottom:8px;margin-bottom:14px;text-transform:uppercase;letter-spacing:.5px}
    table.info{width:100%;border-collapse:collapse;font-size:14px}
    table.info td{padding:9px 6px;border-bottom:1px solid #f1f5f9}
    table.info td:first-child{font-weight:600;color:#475569;width:46%}
    table.info td:last-child{color:#0f172a;text-align:right}
    .passenger-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px 16px;margin-bottom:12px;font-size:14px}
    .pname{font-size:15px;font-weight:700;color:#0369a1;margin-bottom:8px}
    .passenger-card p{margin:4px 0;color:#475569}
    .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:12px;font-weight:700;margin-top:6px;margin-right:6px}
    .badge-pet{background:#ede9fe;color:#6d28d9}
    .badge-allergy{background:#fee2e2;color:#b91c1c}
    .footer{background:#f8fafc;border-top:1px solid #e2e8f0;text-align:center;padding:18px 32px;font-size:12px;color:#94a3b8;line-height:1.8}
    .footer strong{color:#0369a1}
    .value-highlight{color:#059669;font-weight:700;font-size:15px}
    .acct{font-size:18px;letter-spacing:1.5px;color:#14532d}
    .payment-box{background:#f0fdf4;border:2px solid #22c55e;border-radius:12px;padding:20px 22px;margin:0 32px 24px}
    .payment-box h2{font-size:13px;font-weight:800;color:#15803d;margin:0 0 12px;text-transform:uppercase;letter-spacing:.5px}
    .payment-note{font-size:13px;color:#166534;margin:0 0 10px;line-height:1.6}
    .print-btn{display:block;text-align:center;margin:20px auto 0;padding:10px 28px;background:#0369a1;color:#fff;border:none;border-radius:8px;font-size:15px;cursor:pointer;font-weight:600}
    @media print{body{padding:0;background:#fff}.ticket{box-shadow:none}.print-btn{display:none}}
  </style>
</head>
<body>
  <div class="ticket">
    <div class="header">
      <h1>🛥️ Portal Necoclí</h1>
      <p>Tiquete Oficial de Pre-Reserva Marítima</p>
    </div>
    <div class="ticket-code">
      <span>Código de Reserva</span>
      <strong>${ticketId}</strong>
    </div>
    <div class="section">
      <h2>📍 Detalles del Viaje</h2>
      <table class="info">
        <tr><td>Origen</td><td>${validatedData.origin}</td></tr>
        <tr><td>Naviera</td><td>${operatorName}</td></tr>
        <tr><td>Destino</td><td>${validatedData.destination}</td></tr>
        <tr><td>Trayecto</td><td>${validatedData.journeyType === "ida" ? "Solo Ida" : "Ida y Vuelta"}</td></tr>
        <tr><td>Tipo de Plan</td><td>${validatedData.tripType.toUpperCase()}</td></tr>
        <tr><td>Fecha de Viaje</td><td>${validatedData.date ?? "Sin fecha"}</td></tr>
        <tr><td>Total Pasajeros</td><td>${validatedData.passengers.length}</td></tr>
        <tr><td>Fecha de Reserva</td><td>${registerDate} — ${registerTime}</td></tr>
        <tr><td>Valor a pagar en taquilla</td><td><span class="value-highlight">$${validatedData.totalPrice.toLocaleString("es-CO")} COP</span></td></tr>
        ${solidarityRow}
      </table>
    </div>
    <div class="section">
      <h2>👥 Pasajeros</h2>
      ${passengerCardsTicket}
    </div>
    ${paymentInfoTicket}
    <div class="section">
      <h2>🧳 Política de Equipaje</h2>
      <p style="font-size:13px;color:#92400e;background:#fffbeb;border-left:4px solid #f59e0b;padding:10px 14px;border-radius:4px;line-height:1.6;">
        Tienes <strong>10 kg incluidos</strong> por pasajero. El peso excedente tiene un valor de <strong>$2.000 COP</strong> por cada kilo adicional, pagaderos exclusivamente en la taquilla de la naviera.
      </p>
    </div>
    <div class="footer">
      Reserva gestionada por <strong>Portal Necoclí</strong> · Kraken Digital Labs<br/>
      Operado por <strong>${operatorName}</strong><br/>
      <a href="https://portalnecocli.com" style="color:#0369a1;text-decoration:none;">portalnecocli.com</a> · reservas@portalnecocli.com
    </div>
  </div>
  <button class="print-btn" onclick="window.print()">🖨️ Imprimir / Guardar como PDF</button>
</body>
</html>`;

        await resend.emails.send({
          from: "Portal Necoclí <reservas@portalnecocli.com>",
          to: [firstPassengerEmail, "portalnecocli@gmail.com", operatorEmail],
          replyTo: firstPassengerEmail,
          subject: `🎟️ Tu Pre-reserva Marítima confirmada - ${ticketId} - ${operatorName}`,
          html: `
<div style="font-family:'Inter',Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;padding:32px;border:1px solid #e2e8f0;border-radius:16px;">
  <div style="text-align:center;margin-bottom:28px;">
    <h1 style="color:#0369a1;margin:0;font-size:26px;font-weight:800;">Portal Necoclí</h1>
    <p style="color:#64748b;font-size:14px;margin-top:6px;">Tu viaje hacia el paraíso comienza aquí</p>
  </div>
  <p style="font-size:16px;color:#1e293b;">Hola <strong>${validatedData.passengers[0].name}</strong>,</p>
  <p style="font-size:15px;line-height:1.6;color:#334155;margin-top:8px;">Tu pre-reserva para la ruta <strong>${validatedData.origin} → ${validatedData.destination}</strong> operada por <strong>${operatorName}</strong> ha sido generada con éxito. Presenta el siguiente código en la taquilla de la naviera para realizar el pago final y asegurar tu embarque:</p>
  <div style="background:#f0f9ff;border:2px dashed #7dd3fc;padding:22px;text-align:center;border-radius:12px;margin:28px 0;">
    <span style="display:block;font-size:12px;color:#0369a1;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">Código de Reserva</span>
    <strong style="font-size:30px;color:#0c4a6e;letter-spacing:3px;">${ticketId}</strong>
  </div>
  <h3 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#0369a1;border-bottom:2px solid #e0f2fe;padding-bottom:6px;margin-bottom:16px;">📍 Detalles del Viaje</h3>
  <table style="width:100%;font-size:14px;color:#475569;margin-bottom:28px;border-collapse:collapse;">
    <tr><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;font-weight:600;width:46%;">Origen:</td><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;text-align:right;">${validatedData.origin}</td></tr>
    <tr><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;font-weight:600;">Naviera:</td><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;text-align:right;">${operatorName}</td></tr>
    <tr><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;font-weight:600;">Destino:</td><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;text-align:right;">${validatedData.destination}</td></tr>
    <tr><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;font-weight:600;">Trayecto:</td><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;text-align:right;">${validatedData.journeyType === "ida" ? "Solo Ida" : "Ida y Vuelta"}</td></tr>
    <tr><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;font-weight:600;">Tipo de Plan:</td><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;text-align:right;">${validatedData.tripType.toUpperCase()}</td></tr>
    <tr><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;font-weight:600;">Fecha de Viaje:</td><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;text-align:right;">${validatedData.date ?? "Sin fecha"}</td></tr>
    <tr><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;font-weight:600;">Total Pasajeros:</td><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;text-align:right;">${validatedData.passengers.length}</td></tr>
    <tr><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;font-weight:600;">Fecha de Reserva:</td><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;text-align:right;">${registerDate} ${registerTime}</td></tr>
    <tr><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;font-weight:600;">Valor a pagar en taquilla:</td><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;text-align:right;color:#059669;font-weight:700;">$${validatedData.totalPrice.toLocaleString("es-CO")} COP</td></tr>
    ${validatedData.isSolidarityActive ? `<tr><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;font-weight:600;">Aporte Solidario Motonecos:</td><td style="padding:9px 6px;border-bottom:1px solid #f1f5f9;text-align:right;">$5.000 COP (Incluido)</td></tr>` : ""}
  </table>
  <h3 style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#0369a1;border-bottom:2px solid #e0f2fe;padding-bottom:6px;margin-bottom:16px;">👥 Detalle de Pasajeros</h3>
  <div style="margin-bottom:28px;">${passengerRowsEmail}</div>
  ${paymentInfoEmail}
  <div style="background:#f0fdf4;border:1px solid #bbf7d0;padding:14px 16px;margin-bottom:18px;border-radius:8px;">
    <p style="margin:0;font-size:13px;color:#166534;"><strong>📎 Tiquete Adjunto:</strong> Encontrarás adjunto el archivo <code>tiquete-${ticketId}.html</code> con todos los datos del viaje y los pasajeros. Ábrelo en tu navegador e imprímelo o guárdalo como PDF para presentarlo en taquilla.</p>
  </div>
  <div style="background:#fffbeb;border-left:4px solid #f59e0b;padding:12px 16px;margin-bottom:25px;border-radius:4px;">
    <p style="margin:0;font-size:13px;color:#92400e;"><strong>🧳 Política de Equipaje:</strong> Tienes 10 kg incluidos por pasajero. El peso excedente tiene un valor de <strong>$2.000 COP</strong> por cada kilo adicional, pagaderos exclusivamente en la taquilla de la naviera.</p>
  </div>
  <p style="font-size:14px;color:#64748b;text-align:center;">Te esperamos en el muelle. Gracias por elegir <a href="https://portalnecocli.com" style="color:#0ea5e9;text-decoration:none;font-weight:600;">Portal Necoclí</a>.</p>
  <p style="font-size:12px;color:#94a3b8;text-align:center;margin-top:8px;">Gestionado por Kraken Digital Labs · portalnecocli.com</p>
</div>`,
          attachments: [
            {
              filename: `tiquete-${ticketId}.html`,
              content: Buffer.from(attachmentHtml).toString("base64"),
              contentType: "text/html",
            },
          ],
        });
      } catch (emailErr) {
        console.warn("[MaritimeBooking] Failed to send email:", emailErr);
      }
    }

    // WOMPI DESACTIVADO HASTA NUEVA ORDEN - Pago directo en taquillas
    // Al reactivar el bloque de abajo, cambiar `const` por `let`.
    const wompiLink: string | undefined = undefined;
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
