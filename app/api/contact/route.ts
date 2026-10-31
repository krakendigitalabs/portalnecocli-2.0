import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { escapeHtml } from "@/lib/security/html";
import { enforceRateLimit, rateLimitPolicies } from "@/lib/security/rate-limit";

const contactSchema = z.object({
  name: z.string().trim().min(2, "El nombre es requerido").max(120),
  phone: z.string().trim().min(7, "El teléfono es requerido").max(30),
  email: z.string().email("Correo inválido"),
  message: z.string().trim().min(10, "El mensaje debe tener al menos 10 caracteres").max(3000),
});

export async function POST(req: NextRequest) {
  const limited = await enforceRateLimit(req, rateLimitPolicies.contact);
  if (limited) {
    return limited;
  }

  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("[Contact] RESEND_API_KEY no configurada; no se pudo enviar el mensaje.");
      return NextResponse.json(
        { success: false, error: "El servicio de contacto no está disponible temporalmente." },
        { status: 503 },
      );
    }

    const resend = new Resend(apiKey);
    const fromAddress = "Portal Necoclí <guia@portalnecocli.com>";
    const portalEmail = "guia@portalnecocli.com";
    const safeName = escapeHtml(data.name);
    const safePhone = escapeHtml(data.phone);
    const safeEmail = escapeHtml(data.email);
    const safeMessage = escapeHtml(data.message);
    const firstName = data.name.split(/\s+/)[0];

    // 1. Email al equipo de Portal Necoclí (notificación interna)
    const internalEmail = await resend.emails.send({
      from: fromAddress,
      to: [portalEmail],
      subject: `📩 Nueva solicitud de asesoría — ${firstName.replace(/[\r\n]/g, "")}`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head><meta charset="UTF-8"/></head>
        <body style="margin:0;padding:0;background:#fcfaf6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fcfaf6;padding:40px 20px;">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 40px rgba(0,0,0,0.08);">
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(135deg,#0f2e21 0%,#0f5c5c 100%);padding:36px 40px;text-align:center;">
                    <img src="https://res.cloudinary.com/dr50ioh9h/image/upload/v1746587440/Dise%C3%B1o_sin_t%C3%ADtulo_pvwjh9.png" alt="Portal Necoclí" height="56" style="height:56px;object-fit:contain;"/>
                    <p style="color:rgba(255,255,255,0.7);font-size:13px;margin:12px 0 0;letter-spacing:0.08em;text-transform:uppercase;">Nueva Solicitud de Asesoría</p>
                  </td>
                </tr>
                <!-- Body -->
                <tr>
                  <td style="padding:40px;">
                    <p style="color:#0f2e21;font-size:20px;font-weight:700;margin:0 0 28px;">¡Nuevo cliente potencial, Equipo! 🌴</p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:14px 18px;background:#f8f2ea;border-radius:12px;margin-bottom:10px;">
                          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#dd6b42;font-weight:700;">Nombre</p>
                          <p style="margin:6px 0 0;font-size:16px;color:#18202a;font-weight:600;">${safeName}</p>
                        </td>
                      </tr>
                      <tr><td style="height:8px;"></td></tr>
                      <tr>
                        <td style="padding:14px 18px;background:#f8f2ea;border-radius:12px;">
                          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#dd6b42;font-weight:700;">Teléfono</p>
                          <p style="margin:6px 0 0;font-size:16px;color:#18202a;font-weight:600;">${safePhone}</p>
                        </td>
                      </tr>
                      <tr><td style="height:8px;"></td></tr>
                      <tr>
                        <td style="padding:14px 18px;background:#f8f2ea;border-radius:12px;">
                          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#dd6b42;font-weight:700;">Correo electrónico</p>
                          <p style="margin:6px 0 0;font-size:16px;color:#18202a;font-weight:600;">${safeEmail}</p>
                        </td>
                      </tr>
                      <tr><td style="height:8px;"></td></tr>
                      <tr>
                        <td style="padding:14px 18px;background:#f8f2ea;border-radius:12px;">
                          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#dd6b42;font-weight:700;">Mensaje / Solicitud</p>
                          <p style="margin:6px 0 0;font-size:15px;color:#18202a;line-height:1.6;">${safeMessage}</p>
                        </td>
                      </tr>
                    </table>
                    <div style="margin-top:32px;text-align:center;">
                      <a href="https://wa.me/57${data.phone.replace(/\D/g, "")}?text=Hola%20${encodeURIComponent(data.name)}%2C%20recibimos%20tu%20solicitud%20en%20Portal%20Necocl%C3%AD%20y%20estamos%20listos%20para%20asesorarte.%20%F0%9F%8C%B4"
                        style="display:inline-block;background:#25D366;color:#fff;font-weight:700;font-size:14px;padding:14px 28px;border-radius:50px;text-decoration:none;">
                        📲 Responder por WhatsApp
                      </a>
                    </div>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding:24px 40px;border-top:1px solid rgba(0,0,0,0.06);text-align:center;">
                    <p style="margin:0;font-size:12px;color:#18202a99;">© 2025 Kraken Digital Labs · Portal Necoclí 2.0</p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    });
    if (internalEmail.error) {
      console.error("[Contact] Failed to send internal notification:", internalEmail.error);
      return NextResponse.json(
        { success: false, error: "No se pudo enviar la solicitud. Inténtalo nuevamente." },
        { status: 502 },
      );
    }

    // 2. Email de confirmación al cliente (auto-respuesta luxury)
    const confirmationEmail = await resend.emails.send({
      from: fromAddress,
      to: [data.email],
      subject: `Tu solicitud fue recibida, ${firstName.replace(/[\r\n]/g, "")} 🌴`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head><meta charset="UTF-8"/></head>
        <body style="margin:0;padding:0;background:#fcfaf6;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#fcfaf6;padding:40px 20px;">
            <tr><td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 4px 40px rgba(0,0,0,0.08);">
                <!-- Hero Banner -->
                <tr>
                  <td style="background:linear-gradient(135deg,#0f2e21 0%,#0f5c5c 60%,#1a7a4a 100%);padding:48px 40px;text-align:center;">
                    <img src="https://res.cloudinary.com/dr50ioh9h/image/upload/v1746587440/Dise%C3%B1o_sin_t%C3%ADtulo_pvwjh9.png" alt="Portal Necoclí" height="64" style="height:64px;object-fit:contain;margin-bottom:20px;"/>
                    <h1 style="color:#fff;font-size:28px;font-weight:800;margin:0 0 10px;letter-spacing:-0.02em;">¡Bienvenido a Necoclí, ${safeName}!</h1>
                    <p style="color:rgba(255,255,255,0.75);font-size:15px;margin:0;line-height:1.6;">Tu solicitud de asesoría ha llegado a nuestro equipo.</p>
                  </td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding:40px;">
                    <p style="color:#18202a;font-size:16px;line-height:1.8;margin:0 0 24px;">
                      Hola <strong>${safeName}</strong>, recibimos tu solicitud con mucho entusiasmo.
                      El paraíso de Necoclí te espera, y nuestro equipo especializado se pondrá en 
                      contacto contigo muy pronto para ayudarte a diseñar <strong>la experiencia perfecta</strong>.
                    </p>
                    <!-- Detalles enviados -->
                    <div style="background:#f8f2ea;border-radius:16px;padding:24px;margin-bottom:28px;">
                      <p style="margin:0 0 16px;font-size:13px;text-transform:uppercase;letter-spacing:0.1em;color:#dd6b42;font-weight:700;">Tu solicitud</p>
                      <p style="margin:0 0 6px;font-size:14px;color:#18202a99;"><strong style="color:#18202a;">Teléfono:</strong> ${safePhone}</p>
                      <p style="margin:0 0 12px;font-size:14px;color:#18202a99;"><strong style="color:#18202a;">Correo:</strong> ${safeEmail}</p>
                      <p style="margin:0;font-size:14px;color:#18202a;line-height:1.7;border-top:1px solid rgba(0,0,0,0.07);padding-top:12px;">${safeMessage}</p>
                    </div>
                    <!-- CTA WhatsApp -->
                    <div style="text-align:center;margin-bottom:32px;">
                      <p style="color:#18202a99;font-size:14px;margin-bottom:16px;">¿Tienes prisa? Escríbenos directamente:</p>
                      <a href="https://wa.me/573217511866?text=Hola!%20Soy%20${encodeURIComponent(data.name)}%20y%20quiero%20informaci%C3%B3n%20sobre%20mi%20asesor%C3%ADa."
                        style="display:inline-block;background:#25D366;color:#fff;font-weight:700;font-size:15px;padding:16px 32px;border-radius:50px;text-decoration:none;letter-spacing:0.02em;">
                        💬 WhatsApp Directo
                      </a>
                    </div>
                    <!-- Experiencias destacadas -->
                    <div style="border-top:1px solid rgba(0,0,0,0.06);padding-top:28px;">
                      <p style="text-align:center;font-size:13px;color:#18202a99;margin-bottom:18px;text-transform:uppercase;letter-spacing:0.08em;">Mientras tanto, inspírate</p>
                      <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="32%" style="text-align:center;padding:12px 8px;background:#f8f2ea;border-radius:14px;">
                            <p style="font-size:24px;margin:0;">🏝️</p>
                            <p style="font-size:12px;font-weight:700;color:#0f2e21;margin:8px 0 0;">Tour Islas</p>
                          </td>
                          <td width="4%"></td>
                          <td width="32%" style="text-align:center;padding:12px 8px;background:#f8f2ea;border-radius:14px;">
                            <p style="font-size:24px;margin:0;">🌅</p>
                            <p style="font-size:12px;font-weight:700;color:#0f2e21;margin:8px 0 0;">Día de Sol</p>
                          </td>
                          <td width="4%"></td>
                          <td width="32%" style="text-align:center;padding:12px 8px;background:#f8f2ea;border-radius:14px;">
                            <p style="font-size:24px;margin:0;">⛵</p>
                            <p style="font-size:12px;font-weight:700;color:#0f2e21;margin:8px 0 0;">Yate Privado</p>
                          </td>
                        </tr>
                      </table>
                    </div>
                  </td>
                </tr>
                <!-- Footer -->
                <tr>
                  <td style="padding:24px 40px;background:#0f2e21;text-align:center;">
                    <p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.6);">© 2025 Kraken Digital Labs · Portal Necoclí 2.0</p>
                    <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.4);">portalnecocli.com · Necoclí, Antioquia, Colombia</p>
                  </td>
                </tr>
              </table>
            </td></tr>
          </table>
        </body>
        </html>
      `,
    });
    if (confirmationEmail.error) {
      console.error("[Contact] Failed to send customer confirmation:", confirmationEmail.error);
      return NextResponse.json(
        { success: false, error: "No se pudo enviar la solicitud. Inténtalo nuevamente." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    console.error("[Contact API]", error);
    return NextResponse.json(
      { success: false, error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
