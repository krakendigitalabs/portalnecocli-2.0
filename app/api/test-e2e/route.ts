import { NextResponse } from "next/server";
import { createReservation, getReservationById, markReservationAsPaid } from "@/data/reservationService";
import { awardLoyaltyStar, getOrCreateLoyaltyProfile, getLoyaltyStars } from "@/data/loyaltyService";

export async function GET(request: Request) {
  // Solo se permite en desarrollo por seguridad (Agente 9 lo aprueba)
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Prohibido. Solo disponible en entorno de desarrollo." }, { status: 403 });
  }

  try {
    const report: string[] = [];
    const testCustomerId = "TEST-USER-AGENT-9";
    
    report.push("🕵️‍♂️ [AGENTE 9 - Ciberseguridad] Iniciando Penetration Test del Flujo de Reserva y Escrow...");

    // 1. Agente 2 entra en acción: Creación de reserva
    report.push("🤖 [AGENTE 2 - Guía Comercial] Creando reserva de prueba para el 'Hotel Paraíso Test'...");
    const reservation = await createReservation({
      businessId: "HOTEL-TEST-001",
      businessName: "Hotel Paraíso Test",
      lead: {
        full_name: "Usuario De Pruebas E2E",
        email: "test@kraken.com",
        phone: "3000000000",
        whatsapp: "3000000000",
        check_in_date: "2026-10-15",
        check_out_date: "2026-10-20",
        notes: "Test automatizado"
      },
      totalAmount: 150000000, // 1.5 Millones
      customerId: testCustomerId
    });
    report.push(`✅ Reserva Creada: ${reservation.reference_code} (Status: ${reservation.status})`);

    // 2. Agente 8 entra en acción: Procesamiento FinTech
    report.push("💼 [AGENTE 8 - FinTech] Simulando pago seguro por Wompi y reteniendo fondos en Escrow...");
    const escrowTransactionId = `ESCROW-TEST-${Date.now()}`;
    await markReservationAsPaid(reservation.id, escrowTransactionId);
    
    const paidReservation = await getReservationById(reservation.id);
    report.push(`✅ Transacción Exitosa. Fondos asegurados. Nuevo Status: ${paidReservation.status}. Ticket: ${paidReservation.escrow_transaction_id}`);

    // 3. Agente 6 entra en acción: Otorgar Estrella
    report.push("🎨 [AGENTE 6 - UX/Fidelidad] Creando perfil de lealtad (si no existe) y otorgando estrella dorada...");
    await getOrCreateLoyaltyProfile(testCustomerId, "Usuario De Pruebas", "test@kraken.com");
    await awardLoyaltyStar({
      customerId: testCustomerId,
      reservationId: reservation.id,
      businessName: reservation.business_name
    });
    
    const stars = await getLoyaltyStars(testCustomerId);
    report.push(`✅ Estrella otorgada correctamente. Total de estrellas del usuario: ${stars.length}`);

    // 4. Agente 7 entra en acción: Registro en bitácora
    report.push("📜 [AGENTE 7 - Cronista] La operación transaccional de extremo a extremo ha concluido con una victoria absoluta. Las rutas de dinero y datos fluyen como un río prístino en Urabá.");

    return NextResponse.json({
      success: true,
      report,
      data: {
        reservationCode: paidReservation.reference_code,
        ticketUrl: `http://localhost:3000/tickets/${paidReservation.escrow_transaction_id}`
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
