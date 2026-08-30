/**
 * Datos del lead (cliente) capturados en el formulario de reserva.
 * Se almacena en Firestore y se usa para el envío de correo.
 */
export interface ReservationLead {
  full_name: string;
  phone: string;
  email: string;
  whatsapp: string;
  check_in_date?: string;
  check_out_date?: string;
  adults_count?: number;
  children_count?: number;
  rooms_count?: number;
  pets_included?: boolean;
  notes?: string;
}

/**
 * Estados del flujo de reserva.
 * - PENDING_PAYMENT: Lead capturado, esperando pago.
 * - PAID: Pago confirmado por Wompi, fondos en HELD.
 * - CONFIRMED: Operador confirmó la reserva manualmente.
 * - COMPLETED: Cliente asistió, fondos liberados al comercio.
 * - CANCELLED: Reserva cancelada antes de prestar el servicio.
 */
export type ReservationStatus =
  | 'PENDING_PAYMENT'
  | 'PAID'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

/**
 * Reserva completa que vincula a un cliente con un negocio y una transacción Escrow.
 */
export interface Reservation {
  id: string;
  /** ID del negocio (FeaturedBusiness.id) */
  business_id: string;
  business_name: string;
  /** UID del cliente autenticado (opcional si reserva como anónimo) */
  customer_id?: string;
  /** Datos del cliente recogidos en el formulario */
  lead: ReservationLead;
  status: ReservationStatus;
  /** ID de la transacción Escrow (se popula tras confirmación de pago) */
  escrow_transaction_id?: string;
  /** Monto total en COP */
  total_amount: number;
  created_at: string;
  updated_at: string;
  /** Referencia legible para mostrar al cliente (ej: NEC-20260829-001) */
  reference_code: string;
}
