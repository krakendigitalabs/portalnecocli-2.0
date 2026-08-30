import { NextResponse } from 'next/server';
import { createReservation } from '@/data/reservationService';
import type { ReservationLead } from '@/types/reservation';

interface CreateReservationRequestBody {
  business_id: string;
  business_name: string;
  lead: ReservationLead;
  total_amount: number;
}

/**
 * POST /api/reservations
 * Crea una reserva con estado PENDING_PAYMENT y envía el correo de confirmación.
 * Retorna la reserva creada con su código de referencia para mostrar al cliente.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateReservationRequestBody;

    // Validación básica de campos requeridos
    if (
      !body.business_id ||
      !body.lead?.full_name ||
      !body.lead?.email ||
      !body.lead?.phone ||
      !body.lead?.whatsapp
    ) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: business_id, lead.full_name, lead.email, lead.phone, lead.whatsapp' },
        { status: 400 }
      );
    }

    // Crear la reserva en Firestore
    const reservation = await createReservation({
      businessId: body.business_id,
      businessName: body.business_name,
      lead: body.lead,
      totalAmount: body.total_amount ?? 0,
    });

    // Envío de correo de confirmación usando Resend
    // Se hace de forma no bloqueante: si falla el correo, la reserva ya fue creada
    void sendConfirmationEmail(reservation.lead.email, {
      clientName: reservation.lead.full_name,
      businessName: reservation.business_name,
      referenceCode: reservation.reference_code,
      whatsapp: reservation.lead.whatsapp,
    }).catch((emailError) => {
      console.error('[Reservations API] Error sending confirmation email:', emailError);
    });

    return NextResponse.json(
      {
        success: true,
        reservation_id: reservation.id,
        reference_code: reservation.reference_code,
        status: reservation.status,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Reservations API] Internal error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error interno del servidor' }, { status: 500 });
  }
}

/** Parámetros para el correo de confirmación de reserva */
interface ConfirmationEmailParams {
  clientName: string;
  businessName: string;
  referenceCode: string;
  whatsapp: string;
}

/**
 * Envía el correo de confirmación de reserva al cliente usando la API de Resend.
 * Requiere RESEND_API_KEY en variables de entorno.
 */
async function sendConfirmationEmail(
  to: string,
  params: ConfirmationEmailParams
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY no configurada. Correo de confirmación omitido.');
    return;
  }

  const htmlBody = `
    <div style="font-family: 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; color: #18202A;">
      <div style="background: linear-gradient(135deg, #0F5C5C 0%, #18202A 100%); padding: 40px; border-radius: 16px 16px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">Portal Necoclí 🌴</h1>
        <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 14px;">Reserva recibida con éxito</p>
      </div>
      <div style="background: #FAFAFA; padding: 40px; border: 1px solid #E8EEF0; border-top: none; border-radius: 0 0 16px 16px;">
        <p style="font-size: 18px; font-weight: 600; margin: 0 0 8px;">Hola, ${params.clientName} 👋</p>
        <p style="color: #5A6475; line-height: 1.7; margin: 0 0 24px;">
          Hemos recibido tu solicitud de reserva en <strong>${params.businessName}</strong>. 
          En breve nuestro equipo se pondrá en contacto contigo para confirmar disponibilidad y detalles del servicio.
        </p>
        <div style="background: white; border: 1px solid #E8EEF0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; color: #DD6B42; font-weight: 600;">Código de reserva</p>
          <p style="margin: 0; font-size: 28px; font-weight: 800; color: #18202A; letter-spacing: 0.05em;">${params.referenceCode}</p>
          <p style="margin: 8px 0 0; font-size: 12px; color: #9BA3AF;">Guarda este código para hacer seguimiento de tu reserva.</p>
        </div>
        <p style="color: #5A6475; line-height: 1.7; margin: 0 0 24px;">
          También puedes contactarnos directamente por WhatsApp para cualquier consulta o cambio.
        </p>
        <a href="https://wa.me/57${params.whatsapp.replace(/\D/g, '')}" 
           style="display: inline-block; background: #25D366; color: white; padding: 14px 28px; border-radius: 100px; text-decoration: none; font-weight: 600; font-size: 14px;">
          Chatear por WhatsApp
        </a>
        <hr style="border: none; border-top: 1px solid #E8EEF0; margin: 32px 0;" />
        <p style="margin: 0; font-size: 12px; color: #9BA3AF; text-align: center;">
          Portal Necoclí · Necoclí, Antioquia · 
          <a href="https://portal-necocli.vercel.app" style="color: #0F5C5C;">portal-necocli.vercel.app</a>
        </p>
      </div>
    </div>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Portal Necoclí <reservas@portalnecocli.com>',
      to: [to],
      subject: `✅ Reserva recibida: ${params.referenceCode} - ${params.businessName}`,
      html: htmlBody,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Resend API error: ${response.status} - ${errorText}`);
  }
}
