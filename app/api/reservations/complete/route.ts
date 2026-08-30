import { NextResponse } from 'next/server';
import { releaseFunds } from '@/data/escrowService';
import { completeReservation } from '@/data/reservationService';

interface CompleteReservationRequestBody {
  reservation_id: string;
  merchant_id: string;
  escrow_transaction_id: string;
}

/**
 * POST /api/reservations/complete
 * Marca la reserva como COMPLETED y libera los fondos Escrow al comercio.
 * Llamado por el operador/admin desde el dashboard cuando el cliente asistió.
 * 
 * Seguridad: En producción, este endpoint debe estar protegido
 * verificando que el usuario autenticado tiene el rol 'business' o 'admin'.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CompleteReservationRequestBody;

    if (!body.reservation_id || !body.merchant_id || !body.escrow_transaction_id) {
      return NextResponse.json(
        { error: 'Faltan campos: reservation_id, merchant_id, escrow_transaction_id' },
        { status: 400 }
      );
    }

    // 1. Marcar reserva como COMPLETED en Firestore
    const reservation = await completeReservation(body.reservation_id);

    // 2. Liberar los fondos Escrow al comercio
    await releaseFunds(body.escrow_transaction_id, body.merchant_id);

    console.log(
      `[Escrow] Reserva ${reservation.id} completada. Fondos liberados a comercio ${body.merchant_id}.`
    );

    return NextResponse.json(
      { success: true, reservation_id: reservation.id, status: 'COMPLETED' },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Complete Reservation] Error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
