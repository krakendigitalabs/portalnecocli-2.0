import { NextResponse } from "next/server";
import { z } from "zod";

const reservationRequestSchema = z.object({
  business_id: z.string().trim().min(1).max(128),
  lead: z
    .object({
      full_name: z.string().trim().min(2).max(120),
      email: z.string().trim().email().max(254),
      phone: z.string().trim().min(7).max(30),
      whatsapp: z.string().trim().min(7).max(30),
    })
    .passthrough(),
});

/**
 * POST /api/reservations
 * Reservations stay disabled until a trusted server-side pricing source is available.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo JSON inválido" }, { status: 400 });
  }

  const parsedBody = reservationRequestSchema.safeParse(body);
  if (!parsedBody.success) {
    return NextResponse.json({ error: "Los datos de la reserva no son válidos." }, { status: 400 });
  }

  return NextResponse.json(
    {
      error:
        "No se puede crear la reserva: el servidor todavía no tiene una tarifa configurada para este servicio.",
    },
    { status: 503 },
  );
}
