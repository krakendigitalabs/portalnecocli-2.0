"use server";

import { z } from "zod";
import { EscrowRepo } from "@/lib/data/repositories/escrow-repo";
import { ReservationRepo } from "@/lib/data/repositories/reservation-repo";
import {
  BookingRequestData,
  BookingRequestSchema,
  RoutingTypeSchema,
} from "@/lib/validations/schemas";

export type BookingResponse = {
  success: boolean;
  message: string;
  whatsappLink?: string;
  ticketId?: string;
};

/**
 * Procesa la solicitud de reserva del cliente.
 * 1. Guarda el lead en Firestore (Visible para superadmin).
 * 2. Enruta según el Caso A o B.
 */
export async function processBookingRequest(data: BookingRequestData): Promise<BookingResponse> {
  try {
    // 1. Validar los datos de entrada
    const validatedData = BookingRequestSchema.parse(data);

    // 2. Guardar en Base de Datos (Reservations / Leads)
    const reservationId = await ReservationRepo.createReservation({
      customerId: "guest", // En el futuro puede ser el UID del usuario logueado
      customerName: validatedData.customerName,
      customerPhone: validatedData.customerPhone,
      customerEmail: validatedData.customerEmail,
      routingType: validatedData.routingType,
      status: "pending",
      businessId: validatedData.businessId,
      serviceName: validatedData.serviceName,
      reservationDate: validatedData.reservationDate,
      guests: validatedData.guests,
      totalAmount: validatedData.totalAmount,
    });

    // 3. Lógica de Enrutamiento (Triangulación)
    if (validatedData.routingType === "CASE_B") {
      // CASO B: Servicio Aliado Directo
      // TODO: En producción, buscar el teléfono real del negocio en la BD.
      // Por ahora, lo mandamos a un número central o al del negocio mockeado.
      const businessPhone = "573217511866"; // Número puente o del aliado

      const text = `¡Hola! Portal Necoclí me conectó con ustedes. Mi nombre es ${validatedData.customerName}. 
Deseo información o reservar: ${validatedData.serviceName} 
Para ${validatedData.guests} personas el día ${validatedData.reservationDate.toLocaleDateString()}. 
Reserva ID: ${reservationId}`;

      const whatsappUrl = `https://wa.me/${businessPhone}?text=${encodeURIComponent(text)}`;

      return {
        success: true,
        message:
          "¡Excelente elección! Como se trata de un servicio directo, te conectaremos con el aliado.",
        whatsappLink: whatsappUrl,
      };
    } else {
      // CASO A: Paquete Propio del Portal (Retención de fondos Escrow)
      if (!validatedData.totalAmount) {
        throw new Error("El monto total es requerido para paquetes propios (CASE_A).");
      }

      const escrowId = await EscrowRepo.createTransaction({
        reservationId,
        businessId: "portal_necocli_internal", // Es un servicio propio
        amountCollected: validatedData.totalAmount,
        platformFee: validatedData.totalAmount, // Todo queda en casa o se liquida a guías después
        netAmountToBusiness: 0,
        status: "held",
      });

      return {
        success: true,
        message: "¡Reserva pre-aprobada! Generando ticket de pago oficial...",
        ticketId: escrowId,
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
