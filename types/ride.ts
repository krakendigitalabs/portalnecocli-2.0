import type { VehicleType } from "@/types/driver";

/**
 * Estados del ciclo de vida de una carrera (Ride).
 * - OPEN: Publicada en el tablero, esperando que un conductor la acepte.
 * - ACCEPTED: Un conductor la tomó, va en camino al cliente.
 * - IN_PROGRESS: Pasajero recogido, carrera en curso.
 * - COMPLETED: Conductor marcó la carrera como terminada. Comisión descontada.
 * - CANCELLED: Cancelada por el cliente, conductor o sistema.
 * - EXPIRED: Ningún conductor la aceptó dentro del tiempo límite.
 */
export type RideStatus =
  | "OPEN"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "EXPIRED";

/**
 * Origen de la solicitud de carrera.
 * - chatbot: Solicitada a través de Alejandro (IA).
 * - web_form: Solicitada desde el formulario público.
 * - phone: Solicitada por llamada telefónica (registro manual).
 * - walk_in: Cliente presencial (registro manual).
 */
export type RideSource = "chatbot" | "web_form" | "phone" | "walk_in";

/**
 * Representa una carrera de transporte en el sistema Neco-Dispatch.
 */
export interface Ride {
  /** ID del documento en Firestore */
  id: string;

  // --- Origen y Destino ---
  /** Punto de recogida del pasajero */
  origin: string;
  /** Destino final de la carrera */
  destination: string;
  /** Clave de la ruta para lookup de tarifa (ej. "via_san_sebastian") */
  route_key?: string;

  // --- Pricing ---
  /** Tarifa oficial diurna en COP */
  base_price: number;
  /** Indica si aplica tarifa nocturna (x2) */
  is_night_rate: boolean;
  /** Precio final cobrado al cliente: base_price * (is_night_rate ? 2 : 1) */
  final_price: number;
  /** Comisión del Portal Necoclí: final_price * PORTAL_TRANSPORT_COMMISSION */
  portal_commission: number;
  /** Monto neto informativo para el conductor: final_price - portal_commission */
  driver_net: number;

  // --- Actores ---
  /** Nombre del cliente/pasajero */
  client_name: string;
  /** Teléfono del cliente */
  client_phone: string;
  /** Correo electrónico del cliente (opcional) */
  client_email?: string;
  /** UID de Firebase del pasajero (si estaba logueado al pedir) */
  client_uid?: string;
  /** ID del conductor asignado (se puebla al aceptar) */
  driver_id?: string;
  /** Nombre del conductor asignado (denormalizado para UI) */
  driver_name?: string;
  /** Descripción del vehículo del conductor (denormalizado para UI) */
  driver_vehicle?: string;
  /** Teléfono de contacto del conductor */
  driver_phone?: string;
  /** Geolocalización en tiempo real del conductor (si está transmitiendo) */
  driver_location?: { lat: number; lng: number };

  // --- Estado ---
  /** Estado actual de la carrera */
  status: RideStatus;
  /** Canal de origen de la solicitud */
  source: RideSource;

  // --- Timestamps ---
  /** Fecha de creación (ISO 8601) */
  created_at: string;
  /** Fecha en que un conductor la aceptó */
  accepted_at?: string;
  /** Fecha en que el conductor inició el viaje */
  started_at?: string;
  /** Fecha de finalización exitosa */
  completed_at?: string;
  /** Fecha de cancelación */
  cancelled_at?: string;

  // --- Meta ---
  /** Notas adicionales del cliente (equipaje, hora, etc.) */
  notes?: string;
  /** Cantidad de pasajeros */
  passenger_count: number;
  /** Tipo de vehículo solicitado */
  vehicle_type_requested: VehicleType;
  /** Calificación del cliente al conductor (1-5) */
  rating?: number;
  /** Comentario del cliente sobre la carrera */
  rating_comment?: string;
  /** Motivo de cancelación si status === CANCELLED */
  cancellation_reason?: string;
  /** Quién canceló la carrera */
  cancelled_by?: "driver" | "customer" | "admin";
}

/**
 * Tipos de movimiento en la billetera virtual del conductor.
 * - topup: Recarga de saldo.
 * - commission: Descuento automático por carrera completada.
 * - refund: Devolución por carrera cancelada post-aceptación.
 * - adjustment: Ajuste manual del administrador.
 * - bonus: Bonificación promocional.
 */
export type WalletTransactionType = "topup" | "commission" | "refund" | "adjustment" | "bonus";

/**
 * Registro individual de un movimiento en la billetera virtual del conductor.
 * Proporciona trazabilidad financiera completa para auditoría.
 */
export interface WalletTransaction {
  /** ID del documento en Firestore */
  id: string;
  /** ID del conductor dueño de la billetera */
  driver_id: string;
  /** Tipo de movimiento */
  type: WalletTransactionType;
  /** Monto del movimiento en COP (positivo = ingresa, negativo = sale) */
  amount: number;
  /** Saldo resultante después de esta transacción */
  balance_after: number;
  /** ID de la carrera asociada (si es tipo commission o refund) */
  ride_id?: string;
  /** Descripción legible del movimiento */
  description: string;
  /** Fecha del movimiento (ISO 8601) */
  created_at: string;
  /** UID del actor que generó el movimiento ("system" o UID del admin) */
  created_by: string;
}
