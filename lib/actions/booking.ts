"use server";

import { Resend } from "resend";
import { EscrowRepo } from "@/lib/data/repositories/escrow-repo";
import { createReservation } from "@/data/reservationService";
import {
  BookingRequestData,
  BookingRequestSchema,
} from "@/lib/validations/schemas";

export type BookingResponse = {
  success: boolean;
  message: string;
  whatsappLink?: string;
  ticketId?: string;
  reservationId?: string;
  totalAmount?: number;
  serviceName?: string;
};

// ─── Email helpers ────────────────────────────────────────────────────────────

function buildPortalEmail(data: BookingRequestData, reservationId: string, totalAmount: number) {
  const fecha = data.reservationDate instanceof Date
    ? data.reservationDate.toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })
    : String(data.reservationDate);

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f8f4;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f8f4;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 40px rgba(0,0,0,0.10);">
  <!-- Header -->
  <tr>
    <td style="background:linear-gradient(135deg,#0f2e21 0%,#1a6b4a 100%);padding:36px 40px;text-align:center;">
      <img src="https://res.cloudinary.com/dwxk79gt0/image/upload/v1755929246/icono_portal_necocli_nw9wle.png" alt="Portal Necoclí" height="60" style="height:60px;object-fit:contain;"/>
      <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:12px 0 0;letter-spacing:0.12em;text-transform:uppercase;">Nueva Reserva Recibida 🌴</p>
    </td>
  </tr>
  <!-- Body -->
  <tr>
    <td style="padding:40px;">
      <p style="color:#0f2e21;font-size:20px;font-weight:700;margin:0 0 6px;">¡Nueva solicitud de reserva, equipo! 🎉</p>
      <p style="color:#666;font-size:14px;margin:0 0 28px;">ID de Reserva: <strong>#${reservationId}</strong></p>

      <!-- Datos del paquete -->
      <div style="background:#e8f5ec;border-left:4px solid #1a6b4a;border-radius:0 12px 12px 0;padding:18px 20px;margin-bottom:20px;">
        <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#1a6b4a;font-weight:700;">📦 Paquete / Servicio</p>
        <p style="margin:0;font-size:17px;color:#0f2e21;font-weight:700;">${data.serviceName}</p>
      </div>

      <!-- Datos del cliente -->
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:12px 16px;background:#f8f2ea;border-radius:10px;margin-bottom:8px;">
            <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#dd6b42;font-weight:700;">👤 Cliente</p>
            <p style="margin:4px 0 0;font-size:15px;color:#18202a;font-weight:600;">${data.customerName}</p>
          </td>
        </tr>
        <tr><td style="height:8px;"></td></tr>
        <tr>
          <td style="padding:12px 16px;background:#f8f2ea;border-radius:10px;">
            <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#dd6b42;font-weight:700;">📞 Teléfono / WhatsApp</p>
            <p style="margin:4px 0 0;font-size:15px;color:#18202a;font-weight:600;">${data.customerPhone}</p>
          </td>
        </tr>
        <tr><td style="height:8px;"></td></tr>
        <tr>
          <td style="padding:12px 16px;background:#f8f2ea;border-radius:10px;">
            <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#dd6b42;font-weight:700;">✉️ Correo</p>
            <p style="margin:4px 0 0;font-size:15px;color:#18202a;font-weight:600;">${data.customerEmail}</p>
          </td>
        </tr>
        <tr><td style="height:8px;"></td></tr>
        <tr>
          <td style="padding:12px 16px;background:#f8f2ea;border-radius:10px;">
            <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#dd6b42;font-weight:700;">📅 Fecha Reserva</p>
            <p style="margin:4px 0 0;font-size:15px;color:#18202a;font-weight:600;">${fecha}</p>
          </td>
        </tr>
        <tr><td style="height:8px;"></td></tr>
        <tr>
          <td style="padding:12px 16px;background:#f8f2ea;border-radius:10px;">
            <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#dd6b42;font-weight:700;">⏱️ Días / Noches</p>
            <p style="margin:4px 0 0;font-size:15px;color:#18202a;font-weight:600;">${data.days || 1}</p>
          </td>
        </tr>
        <tr><td style="height:8px;"></td></tr>
        <tr>
          <td style="padding:12px 16px;background:#f8f2ea;border-radius:10px;">
            <p style="margin:0;font-size:10px;text-transform:uppercase;letter-spacing:0.1em;color:#dd6b42;font-weight:700;">👥 Personas / Cupos</p>
            <p style="margin:4px 0 0;font-size:15px;color:#18202a;font-weight:600;">${data.guests}</p>
          </td>
        </tr>
        <tr><td style="height:8px;"></td></tr>
        <tr>
          <td style="padding:14px 16px;background:#0f2e21;border-radius:10px;text-align:center;">
            <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,0.6);font-weight:700;">💰 TOTAL A COBRAR</p>
            <p style="margin:6px 0 0;font-size:26px;color:#F5C842;font-weight:800;">$${totalAmount.toLocaleString("es-CO")} COP</p>
          </td>
        </tr>
      </table>

      <!-- WhatsApp CTA -->
      <div style="margin-top:28px;text-align:center;">
        <a href="https://wa.me/57${data.customerPhone.replace(/\D/g, "")}?text=Hola%20${encodeURIComponent(data.customerName)}%2C%20recibimos%20tu%20reserva%20en%20Portal%20Necocl%C3%AD%20para%20${encodeURIComponent(data.serviceName)}%20%F0%9F%8C%B4%20%C2%A1Estamos%20listos!"
          style="display:inline-block;background:#25D366;color:#fff;font-weight:700;font-size:14px;padding:14px 28px;border-radius:50px;text-decoration:none;">
          📲 Confirmar por WhatsApp
        </a>
      </div>
    </td>
  </tr>
  <tr>
    <td style="padding:20px 40px;border-top:1px solid rgba(0,0,0,0.06);text-align:center;">
      <p style="margin:0;font-size:12px;color:#18202a99;">© ${new Date().getFullYear()} Kraken Digital Labs · Portal Necoclí 2.0</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function buildClientEmail(data: BookingRequestData, reservationId: string, totalAmount: number) {
  const firstName = data.customerName.split(" ")[0];
  const fecha = data.reservationDate instanceof Date
    ? data.reservationDate.toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" })
    : String(data.reservationDate);

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f8f4;font-family:'Helvetica Neue',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f8f4;padding:40px 20px;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 40px rgba(0,0,0,0.10);">
  <!-- Hero -->
  <tr>
    <td style="background:linear-gradient(135deg,#0f2e21 0%,#1a6b4a 60%,#0f5c5c 100%);padding:48px 40px;text-align:center;">
      <img src="https://res.cloudinary.com/dwxk79gt0/image/upload/v1755929246/icono_portal_necocli_nw9wle.png" alt="Portal Necoclí" height="72" style="height:72px;object-fit:contain;margin-bottom:16px;"/>
      <h1 style="color:#fff;font-size:26px;font-weight:800;margin:0 0 8px;">¡Reserva Confirmada, ${firstName}! 🌴</h1>
      <p style="color:rgba(255,255,255,0.75);font-size:14px;margin:0;">Tu aventura en Necoclí ya está en camino.</p>
    </td>
  </tr>
  <!-- Content -->
  <tr>
    <td style="padding:40px;">
      <p style="color:#18202a;font-size:15px;line-height:1.8;margin:0 0 28px;">
        Hola <strong>${data.customerName}</strong>, recibimos tu solicitud de reserva con éxito. 
        Nuestro equipo te contactará pronto para confirmar los detalles y guiarte en el proceso de pago.
      </p>

      <!-- Resumen del paquete -->
      <div style="background:#e8f5ec;border-radius:16px;padding:24px;margin-bottom:20px;">
        <p style="margin:0 0 14px;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;color:#1a6b4a;font-weight:700;">📦 Tu Reserva</p>
        <p style="margin:0 0 8px;font-size:18px;color:#0f2e21;font-weight:700;">${data.serviceName}</p>
        <p style="margin:0;font-size:13px;color:#666;">ID de Reserva: <strong>#${reservationId}</strong></p>
      </div>

      <!-- Datos del cliente -->
      <div style="background:#f8f2ea;border-radius:16px;padding:24px;margin-bottom:20px;">
        <p style="margin:0 0 14px;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;color:#dd6b42;font-weight:700;">📋 Tus Datos</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.06);">
              <span style="font-size:13px;color:#666;">Nombre</span>
              <strong style="float:right;font-size:13px;color:#18202a;">${data.customerName}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.06);">
              <span style="font-size:13px;color:#666;">Teléfono</span>
              <strong style="float:right;font-size:13px;color:#18202a;">${data.customerPhone}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.06);">
              <span style="font-size:13px;color:#666;">Correo</span>
              <strong style="float:right;font-size:13px;color:#18202a;">${data.customerEmail}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.06);">
              <span style="font-size:13px;color:#666;">Fecha</span>
              <strong style="float:right;font-size:13px;color:#18202a;">${fecha}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0;border-bottom:1px solid rgba(0,0,0,0.06);">
              <span style="font-size:13px;color:#666;">Días / Noches</span>
              <strong style="float:right;font-size:13px;color:#18202a;">${data.days || 1}</strong>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 0;">
              <span style="font-size:13px;color:#666;">Personas</span>
              <strong style="float:right;font-size:13px;color:#18202a;">${data.guests}</strong>
            </td>
          </tr>
        </table>
      </div>

      <!-- Total -->
      <div style="background:#0f2e21;border-radius:16px;padding:20px 24px;text-align:center;margin-bottom:28px;">
        <p style="margin:0 0 4px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:rgba(255,255,255,0.6);">Total a Pagar</p>
        <p style="margin:0;font-size:32px;font-weight:800;color:#F5C842;">$${totalAmount.toLocaleString("es-CO")} COP</p>
        <p style="margin:8px 0 0;font-size:12px;color:rgba(255,255,255,0.5);">Nuestro equipo te indicará cómo proceder con el pago</p>
      </div>

      <!-- WhatsApp CTA -->
      <div style="text-align:center;margin-bottom:28px;">
        <p style="color:#18202a99;font-size:14px;margin-bottom:14px;">¿Tienes preguntas? Escríbenos directamente:</p>
        <a href="https://wa.me/573217511866?text=Hola!%20Soy%20${encodeURIComponent(data.customerName)}%20y%20tengo%20una%20reserva%20%23${reservationId}%20para%20${encodeURIComponent(data.serviceName)}"
          style="display:inline-block;background:#25D366;color:#fff;font-weight:700;font-size:15px;padding:16px 32px;border-radius:50px;text-decoration:none;">
          💬 WhatsApp Portal Necoclí
        </a>
      </div>

      <!-- Inspiración -->
      <div style="border-top:1px solid rgba(0,0,0,0.06);padding-top:24px;text-align:center;">
        <p style="font-size:13px;color:#18202a99;margin-bottom:16px;text-transform:uppercase;letter-spacing:0.08em;">Te espera el paraíso</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td width="32%" style="text-align:center;padding:12px 6px;background:#f8f2ea;border-radius:12px;">
              <p style="font-size:22px;margin:0;">🏖️</p>
              <p style="font-size:11px;font-weight:700;color:#0f2e21;margin:6px 0 0;">Playas Vírgenes</p>
            </td>
            <td width="4%"></td>
            <td width="32%" style="text-align:center;padding:12px 6px;background:#f8f2ea;border-radius:12px;">
              <p style="font-size:22px;margin:0;">🌅</p>
              <p style="font-size:11px;font-weight:700;color:#0f2e21;margin:6px 0 0;">Atardeceres</p>
            </td>
            <td width="4%"></td>
            <td width="32%" style="text-align:center;padding:12px 6px;background:#f8f2ea;border-radius:12px;">
              <p style="font-size:22px;margin:0;">🍽️</p>
              <p style="font-size:11px;font-weight:700;color:#0f2e21;margin:6px 0 0;">Gastronomía</p>
            </td>
          </tr>
        </table>
      </div>
    </td>
  </tr>
  <tr>
    <td style="padding:20px 40px;background:#0f2e21;text-align:center;">
      <p style="margin:0 0 6px;font-size:13px;color:rgba(255,255,255,0.6);">© ${new Date().getFullYear()} Kraken Digital Labs · Portal Necoclí 2.0</p>
      <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.4);">portalnecocli.com · Necoclí, Antioquia, Colombia</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// ─── Main action ──────────────────────────────────────────────────────────────

export async function processBookingRequest(data: BookingRequestData): Promise<BookingResponse> {
  try {
    const validatedData = BookingRequestSchema.parse(data);

    // 1. Save in DB
    const reservation = await createReservation({
      businessId: validatedData.businessId || "portal_necocli_internal",
      businessName: validatedData.serviceName,
      lead: {
        full_name: validatedData.customerName,
        phone: validatedData.customerPhone,
        email: validatedData.customerEmail,
        whatsapp: validatedData.customerPhone,
        check_in_date: validatedData.reservationDate.toISOString(),
        adults_count: validatedData.guests,
        days: validatedData.days || 1,
      },
      totalAmount: validatedData.totalAmount || 0,
      customerId: "guest",
    });
    const reservationId = reservation.id;
    const totalAmount = validatedData.totalAmount || 0;

    // 2. Send emails via Resend
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const from = "Portal Necoclí <guia@portalnecocli.com>";
      const portalEmail = "guia@portalnecocli.com";

      // Email to portal (internal notification)
      await resend.emails.send({
        from,
        to: [portalEmail],
        subject: `🌴 Nueva Reserva: ${validatedData.serviceName} — ${validatedData.customerName}`,
        html: buildPortalEmail(validatedData, reservationId, totalAmount),
      });

      // Email to client (confirmation)
      await resend.emails.send({
        from,
        to: [validatedData.customerEmail],
        subject: `✅ Reserva confirmada en Portal Necoclí — ${validatedData.serviceName}`,
        html: buildClientEmail(validatedData, reservationId, totalAmount),
      });
    } else {
      console.warn("[Booking] RESEND_API_KEY no configurada. Emails omitidos.");
    }

    // 3. Routing logic
    if (validatedData.routingType === "CASE_B") {
      const businessPhone = "573217511866";
      const text = `¡Hola! Portal Necoclí me conectó con ustedes. Mi nombre es ${validatedData.customerName}. 
Deseo información o reservar: ${validatedData.serviceName} 
Para ${validatedData.guests} personas el día ${validatedData.reservationDate.toLocaleDateString("es-CO")}. 
Reserva ID: ${reservationId}`;

      return {
        success: true,
        message: "¡Excelente elección! Te conectaremos con el aliado para gestionar tu reserva.",
        whatsappLink: `https://wa.me/${businessPhone}?text=${encodeURIComponent(text)}`,
      };
    } else {
      if (!validatedData.totalAmount) {
        throw new Error("El monto total es requerido para paquetes propios (CASE_A).");
      }

      const escrowId = await EscrowRepo.createTransaction({
        reservationId,
        businessId: "portal_necocli_internal",
        amountCollected: validatedData.totalAmount,
        platformFee: validatedData.totalAmount,
        netAmountToBusiness: 0,
        status: "held",
      });

      return {
        success: true,
        message: `¡Reserva registrada! Revisa tu correo ${validatedData.customerEmail} para ver los detalles completos.`,
        ticketId: escrowId,
        reservationId,
        totalAmount,
        serviceName: validatedData.serviceName,
      };
    }
  } catch (error) {
    console.error("Error en processBookingRequest:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado al procesar la reserva.",
    };
  }
}
