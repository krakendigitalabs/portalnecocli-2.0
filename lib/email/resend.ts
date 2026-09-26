import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// ─── CONSTANTES DE MARCA ──────────────────────────────────────────────────────
const BRAND = {
  from: "Portal Necoclí <reservas@portalnecocli.com>",
  replyTo: "guia.portalnecocli@gmail.com",
  ops: ["portalnecocli@gmail.com", "guia.portalnecocli@gmail.com"],
  colorPrimary: "#0a7c6e",
  colorAccent: "#f59e0b",
  legal:
    "Plataforma operada por Kraken Digital Labs &bull; NIT: 8128036-5 &bull; Matr&iacute;cula: 21-579544-01 &bull; RNT: 232392 (Agencia de Viajes Operadora) &bull; C&aacute;mara de Comercio de Medell&iacute;n",
};

// ─── PLANTILLA HTML BASE ──────────────────────────────────────────────────────
function buildEmailHtml(opts: {
  customerName: string;
  title: string;
  subtitle: string;
  bodyRows: string;
  advice: string;
  estimatedPrice: string;
  checkoutUrl: string;
  ticketUrl: string;
  btnText: string;
}): string {
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- HEADER -->
        <tr>
          <td style="background:${BRAND.colorPrimary};border-radius:12px 12px 0 0;padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:800;letter-spacing:-0.5px;">
              🌴 Portal Necocl&iacute;
            </h1>
            <p style="margin:8px 0 0;color:#a7f3d0;font-size:15px;">Tu puerta al para&iacute;so de Necocl&iacute;</p>
          </td>
        </tr>

        <!-- SUBHEADER -->
        <tr>
          <td style="background:#065f46;padding:14px 40px;text-align:center;">
            <p style="margin:0;color:#d1fae5;font-size:13px;letter-spacing:1px;text-transform:uppercase;font-weight:600;">
              ${opts.title}
            </p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="background:#ffffff;padding:36px 40px;">
            <p style="margin:0 0 6px;font-size:20px;font-weight:700;color:#111827;">
              ¡Hola, ${opts.customerName}!
            </p>
            <p style="margin:0 0 28px;font-size:15px;color:#4b5563;">${opts.subtitle}</p>

            <!-- TICKET -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;margin-bottom:24px;">
              <tr style="background:#f9fafb;">
                <td colspan="2" style="padding:14px 20px;font-size:12px;font-weight:700;color:#6b7280;
                  letter-spacing:0.8px;text-transform:uppercase;border-bottom:1px solid #e5e7eb;">
                  Detalle de la Solicitud
                </td>
              </tr>
              ${opts.bodyRows}
            </table>

            <!-- NOTA ALEJANDRO -->
            <div style="background:#fffbeb;border-left:4px solid ${BRAND.colorAccent};
              border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:28px;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:700;color:#92400e;">
                💡 Nota de Alejandro, tu Gu&iacute;a Local:
              </p>
              <p style="margin:0;font-size:14px;color:#78350f;line-height:1.6;">${opts.advice}</p>
            </div>

            <!-- PRECIO -->
            <div style="text-align:center;margin-bottom:28px;">
              <p style="margin:0;font-size:13px;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">
                Valor Aproximado
              </p>
              <p style="margin:4px 0 0;font-size:32px;font-weight:800;color:#111827;">
                ${
                  opts.estimatedPrice &&
                  opts.estimatedPrice !== "undefined" &&
                  opts.estimatedPrice !== "0" &&
                  opts.estimatedPrice !== "null"
                    ? `$${opts.estimatedPrice} <span style="font-size:16px;color:#6b7280;">COP</span>`
                    : `<span style="font-size:20px;color:#6b7280;font-weight:600;">Por confirmar con el equipo</span>`
                }
              </p>
            </div>

            <!-- CTA BUTTONS -->
            <div style="text-align:center;">
              <!-- Botón principal: Pagar -->
              <a href="${opts.checkoutUrl}"
                style="display:inline-block;background:${BRAND.colorPrimary};color:#ffffff;
                text-decoration:none;padding:16px 36px;border-radius:50px;
                font-weight:700;font-size:16px;letter-spacing:0.3px;">
                ${opts.btnText} &rarr;
              </a>
              <!-- Separador -->
              <div style="margin:16px 0;border-top:1px solid #e5e7eb;"></div>
              <!-- Botón secundario: Ver Ticket Descargable -->
              <a href="${opts.ticketUrl}"
                style="display:inline-block;background:#ffffff;color:${BRAND.colorPrimary};
                text-decoration:none;padding:14px 32px;border-radius:50px;
                font-weight:700;font-size:15px;letter-spacing:0.3px;
                border:2px solid ${BRAND.colorPrimary};">
                🎫 Ver y Descargar mi Ticket
              </a>
              <p style="margin:10px 0 0;font-size:12px;color:#9ca3af;">
                Haz clic en el ticket para imprimirlo o guardarlo como PDF
              </p>
            </div>
          </td>
        </tr>

        <!-- FOOTER LEGAL -->
        <tr>
          <td style="background:#f9fafb;border-top:1px solid #e5e7eb;border-radius:0 0 12px 12px;
            padding:20px 40px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.7;">
              &copy; ${new Date().getFullYear()} <strong>Portal Necocl&iacute;</strong><br>
              <span style="font-size:10px;">${BRAND.legal}</span>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── FUNCIÓN PÚBLICA ──────────────────────────────────────────────────────────
export async function sendPreReservationEmail(opts: {
  customerEmail: string;
  customerName: string;
  itinerary: string;
  estimatedPrice: string;
  advice: string;
  referenceCode?: string;
  type?: "reservation" | "order";
  merchantEmail?: string | null;
}): Promise<boolean> {
  if (!resend) {
    console.warn("[Resend] Sin API Key — correo omitido.");
    return false;
  }

  const {
    customerEmail,
    customerName,
    itinerary,
    estimatedPrice,
    advice,
    referenceCode,
    type,
    merchantEmail,
  } = opts;

  const isOrder = type === "order";
  const code = referenceCode || `NEC-${Date.now()}`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL && process.env.NEXT_PUBLIC_BASE_URL !== "http://localhost:3000"
    ? process.env.NEXT_PUBLIC_BASE_URL
    : "https://tours.portalnecocli.com";

  const checkoutUrl = `${baseUrl}/pago/${code}`;
  const ticketUrl = `${baseUrl}/tickets/${code}`; // Pre-reserva pública (antes del pago)

  const title = isOrder ? "Confirmación de Pedido" : "Pre-Reserva Confirmada";
  const subtitle = isOrder
    ? "Soy Alejandro, tu Guía Local. Hemos recibido tu pedido y ya estamos coordinando la entrega."
    : "Soy Alejandro, tu Guía Local. Aquí tienes el resumen de tu plan a medida en Necoclí.";
  const btnText = isOrder ? "Pagar Pedido Ahora" : "Confirmar y Garantizar Precio";

  // Filas del ticket
  const bodyRows = `
    <tr>
      <td style="padding:14px 20px;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6;width:35%;font-weight:600;">
        Referencia
      </td>
      <td style="padding:14px 20px;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6;">
        <code style="font-size:13px;background:#f3f4f6;padding:2px 8px;border-radius:4px;">${code}</code>
      </td>
    </tr>
    <tr>
      <td style="padding:14px 20px;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6;font-weight:600;">
        Detalle
      </td>
      <td style="padding:14px 20px;font-size:14px;color:#374151;border-bottom:1px solid #f3f4f6;line-height:1.6;white-space:pre-wrap;">
        ${itinerary}
      </td>
    </tr>
    <tr>
      <td style="padding:14px 20px;font-size:14px;color:#374151;font-weight:600;">Fecha</td>
      <td style="padding:14px 20px;font-size:14px;color:#374151;">
        ${new Date().toLocaleDateString("es-CO", { dateStyle: "full" })}
      </td>
    </tr>
  `;

  const html = buildEmailHtml({
    customerName,
    title,
    subtitle,
    bodyRows,
    advice,
    estimatedPrice,
    checkoutUrl,
    ticketUrl,
    btnText,
  });

  // Destinatarios CC: ops internos + aliado comercial (si aplica)
  const ccList = [...BRAND.ops, ...(merchantEmail ? [merchantEmail] : [])];

  try {
    console.log(
      `[Resend] ⏳ Intentando enviar correo → to: ${customerEmail} | from: ${BRAND.from}`,
    );

    const { data, error } = await resend.emails.send({
      from: BRAND.from,
      replyTo: BRAND.replyTo,
      to: [customerEmail],
      cc: ccList,
      subject: `${title} — Portal Necoclí`,
      html,
    });

    if (error) {
      // ❌ Resend devolvió un error de negocio (dominio no verificado, API key inválida, etc.)
      console.error("[Resend] ❌ Error de API:", JSON.stringify(error, null, 2));
      console.error(`[Resend] ❌ Detalle: name=${error.name} | message=${error.message}`);
      return false;
    }

    console.log(
      `[Resend] ✅ OK → id: ${data?.id} | to: ${customerEmail} | cc: ${ccList.join(", ")}`,
    );
    return true;
  } catch (err: any) {
    console.error("[Resend] ❌ Excepción al enviar correo:", err?.message || err);
    return false;
  }
}
