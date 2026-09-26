import type { PayoutMethod } from "@/types/escrow";

/**
 * Tipos de vehículo soportados en el sistema de despacho.
 */
export type VehicleType = "mototaxi" | "motocarro" | "taxi" | "lancha";

/**
 * Estado del conductor en la plataforma.
 * - pending_approval: Registrado, esperando aprobación del admin.
 * - active: Aprobado y habilitado para operar.
 * - suspended: Suspendido temporalmente por el admin.
 * - inactive: Desactivado voluntariamente o por inactividad prolongada.
 */
export type DriverStatus = "pending_approval" | "active" | "suspended" | "inactive";

/**
 * Disponibilidad operativa del conductor en tiempo real.
 * - online: Conectado y listo para recibir carreras.
 * - offline: Desconectado, no recibe notificaciones.
 * - on_ride: Actualmente realizando una carrera.
 */
export type DriverAvailability = "online" | "offline" | "on_ride";

/**
 * Perfil completo de un conductor registrado en el sistema Neco-Dispatch.
 */
export interface DriverProfile {
  /** ID del documento en Firestore (auto-generado o UID de Auth) */
  id: string;
  /** UID de Firebase Auth vinculado */
  user_id: string;
  /** Nombre completo del conductor */
  full_name: string;
  /** Número de celular principal */
  phone: string;
  /** WhatsApp del conductor */
  whatsapp: string;
  /** URL de la foto de perfil (Firebase Storage) */
  photo_url?: string;
  /** Tipo de vehículo que opera */
  vehicle_type: VehicleType;
  /** Placa oficial o identificación interna del vehículo */
  vehicle_plate: string;
  /** Descripción informal del vehículo (ej. "La Fiera 04") */
  vehicle_description?: string;
  /** Cooperativa o empresa a la que pertenece */
  cooperative?: string;
  /** Estado de aprobación en la plataforma */
  status: DriverStatus;
  /** Disponibilidad operativa en tiempo real */
  availability: DriverAvailability;
  /** Saldo prepago en COP (billetera virtual) */
  wallet_balance: number;
  /** Método de pago configurado para recibir liquidaciones */
  payout_method?: PayoutMethod;
  /** Total de carreras completadas (contador acumulado) */
  total_rides_completed: number;
  /** Calificación promedio (1.0 - 5.0) */
  average_rating: number;
  /** Fecha de registro (ISO 8601) */
  created_at: string;
  /** Última actualización del perfil (ISO 8601) */
  updated_at: string;
}
