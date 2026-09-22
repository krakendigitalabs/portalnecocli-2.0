import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

// Inicializamos Resend solo si hay API Key, de lo contrario lo evitamos en entornos donde no aplique.
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendPreReservationEmail(
  customerEmail: string,
  customerName: string,
  itinerary: string,
  estimatedPrice: string,
  advice: string
) {
  if (!resend) {
    console.warn("No RESEND_API_KEY found, skipping email.");
    return false;
  }

  try {
    const data = await resend.emails.send({
      from: "Portal Necoclí <reservas@portalnecocli.com>", // Requiere dominio verificado en Resend
      to: [customerEmail],
      bcc: ["reservas@portalnecocli.com"], // Copia de seguridad
      subject: `Resumen de tu Plan a Medida - Portal Necoclí`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1f2937;">
          <div style="text-align: center; padding: 20px; background-color: #0f766e; color: white; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">¡Hola, ${customerName}!</h1>
            <p style="margin: 5px 0 0; font-size: 16px;">Aquí tienes la pre-reserva de tu aventura</p>
          </div>
          
          <div style="padding: 30px; background-color: #f9fafb; border: 1px solid #e5e7eb; border-top: none;">
            <p>Hola <strong>${customerName}</strong>,</p>
            <p>Soy Alejandro, tu Guía Local. Tal como conversamos, he armado este plan a medida para tu próximo viaje:</p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
              <h3 style="margin-top: 0; color: #0f766e;">Detalle del Itinerario</h3>
              <p style="white-space: pre-wrap; line-height: 1.6;">${itinerary}</p>
            </div>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; font-weight: bold; color: #92400e;">💡 Nota Importante de Alejandro:</p>
              <p style="margin: 5px 0 0; color: #92400e; font-size: 14px;">${advice}</p>
            </div>

            <h2 style="text-align: center; color: #111827; margin: 30px 0 10px;">Valor Aproximado: <strong>$${estimatedPrice} COP</strong></h2>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://portalnecocli.com/pago/custom-plan-${Date.now()}" style="display: inline-block; background-color: #0f766e; color: white; text-decoration: none; padding: 14px 28px; border-radius: 50px; font-weight: bold; font-size: 16px;">Confirmar y Garantizar Precio</a>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Portal Necoclí. Todos los derechos reservados.</p>
            <p>Kraken Digital Labs - Necoclí, Colombia</p>
          </div>
        </div>
      `,
    });

    console.log("Email enviado:", data);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
