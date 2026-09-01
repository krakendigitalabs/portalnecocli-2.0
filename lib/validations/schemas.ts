import { z } from "zod";

// ==========================================
// 1. PROFILES (Usuarios y Negocios)
// ==========================================
export const UserRoleSchema = z.enum(["admin", "business", "operator", "customer"]);

export const ProfileSchema = z.object({
  uid: z.string().min(1),
  role: UserRoleSchema,
  email: z.string().email(),
  fullName: z.string().min(2),
  phone: z.string().optional(),

  // Específico para rol 'business'
  businessName: z.string().optional(),
  businessType: z.enum(["hotel", "tour", "food", "transport"]).optional(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Profile = z.infer<typeof ProfileSchema>;

// ==========================================
// 2. RESERVATIONS (Motor de Enrutamiento)
// ==========================================
// CASE_A: Paquete Portal (Logística interna y pago retenido)
// CASE_B: Servicio Aliado (Puente directo al comercio)
export const RoutingTypeSchema = z.enum(["CASE_A", "CASE_B"]);
export const ReservationStatusSchema = z.enum(["pending", "confirmed", "completed", "cancelled"]);

export const ReservationSchema = z.object({
  id: z.string().optional(), // Opcional al crear, Firestore lo auto-genera
  customerId: z.string(),
  customerName: z.string(),
  customerPhone: z.string(),
  customerEmail: z.string().email(),

  routingType: RoutingTypeSchema,
  status: ReservationStatusSchema,

  businessId: z.string().optional(), // Requerido en CASE_B, opcional si es paquete genérico
  serviceName: z.string(),
  reservationDate: z.date(),
  guests: z.number().int().min(1),
  specialRequests: z.string().optional(),

  // Total transaccional (solo aplica si hay pago gestionado por el portal)
  totalAmount: z.number().min(0).optional(),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Reservation = z.infer<typeof ReservationSchema>;

// ==========================================
// 3. ESCROW TRANSACTIONS (Motor de Recaudo B2B)
// ==========================================
export const EscrowStatusSchema = z.enum(["held", "released", "refunded", "disputed"]);

export const EscrowTransactionSchema = z.object({
  id: z.string().optional(),
  reservationId: z.string(), // Link a la reserva que originó el pago
  businessId: z.string(), // El negocio al que se le debe liberar el pago

  amountCollected: z.number().min(1),
  platformFee: z.number().min(0),
  netAmountToBusiness: z.number().min(0),

  status: EscrowStatusSchema,

  // URL o referencia del Ticket Oficial generado
  officialTicketUrl: z.string().url().optional(),
  paymentMethod: z.enum(["nequi", "efectivo", "tarjeta"]).optional(),

  createdAt: z.date(),
  releasedAt: z.date().optional(), // Cuándo se le pagó al comercio
});

export type EscrowTransaction = z.infer<typeof EscrowTransactionSchema>;

// ==========================================
// 4. FORMS & ACTIONS (Data Contracts)
// ==========================================
export const BookingRequestSchema = z.object({
  customerName: z.string().min(2, "El nombre es muy corto"),
  customerPhone: z.string().min(7, "El teléfono no es válido"),
  customerEmail: z.string().email("Correo electrónico inválido"),

  businessId: z.string().optional(),
  serviceName: z.string().min(2),
  reservationDate: z.date(),
  guests: z.number().int().min(1),

  routingType: RoutingTypeSchema,
  totalAmount: z.number().optional(), // Si es paquete portal (CASE_A)
});

export type BookingRequestData = z.infer<typeof BookingRequestSchema>;
