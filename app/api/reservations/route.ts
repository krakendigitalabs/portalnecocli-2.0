import { NextResponse } from "next/server";
import type { ReservationLead } from "@/types/reservation";

interface CreateReservationRequestBody {
  business_id: string;
  lead: ReservationLead;
}

/**
 * POST /api/reservations
 * Reservations stay disabled until a trusted server-side pricing source is available.
 */
export async function POST(req: Request) {
  let body: CreateReservationRequestBody;

  try {
    body = (await req.json()) as CreateReservationRequestBody;
  } catch {
    return NextResponse.json({ error: "Cuerpo JSON inválido" }, { status: 400 });
  }

  if (
    !body?.business_id ||
    !body.lead?.full_name ||
    !body.lead?.email ||
    !body.lead?.phone ||
    !body.lead?.whatsapp
  ) {
    return NextResponse.json(
      {
        error:
          "Faltan campos obligatorios: business_id, lead.full_name, lead.email, lead.phone, lead.whatsapp",
      },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      error:
        "No se puede crear la reserva: el servidor todavía no tiene una tarifa configurada para este servicio.",
    },
    { status: 503 },
  );
}
