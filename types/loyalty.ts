/**
 * Estrella dorada ganada por el turista al completar una experiencia.
 * Tras 5 estrellas, el 6to viaje aplica 50% de descuento automático.
 */
export interface LoyaltyStar {
  id: string;
  /** UID del turista */
  customer_id: string;
  /** ID de la reserva que generó la estrella */
  reservation_id: string;
  /** Nombre del negocio/servicio */
  business_name: string;
  /** Fecha en que se ganó la estrella */
  earned_at: string;
}

/**
 * Perfil de fidelización del turista en Portal Necoclí.
 * Se crea automáticamente al registrarse con rol 'customer'.
 */
export interface LoyaltyProfile {
  customer_id: string;
  /** Nombre completo del turista */
  display_name: string;
  email: string;
  /** Estrellas doradas acumuladas (lifetime) */
  total_stars: number;
  /** Estrellas en el ciclo actual (se resetean al usar el bono) */
  stars_in_cycle: number;
  /** Número de bonos al 50% que ha redimido */
  bonuses_redeemed: number;
  /** Si tiene un bono activo disponible para usar */
  has_active_bonus: boolean;
  /** Código único del bono activo (nulo si no hay bono disponible) */
  active_bonus_code: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Bono de descuento del 50% generado al completar 5 estrellas en un ciclo.
 */
export interface LoyaltyBonus {
  id: string;
  customer_id: string;
  /** Código legible del bono (ej: BONO-NEC-2026-XXXX) */
  code: string;
  discount_percentage: 50;
  status: 'ACTIVE' | 'REDEEMED' | 'EXPIRED';
  /** Reserva en la que se redimió el bono */
  redeemed_on_reservation_id?: string;
  created_at: string;
  expires_at: string;
  redeemed_at?: string;
}

/** Número de estrellas por ciclo para obtener el bono */
export const LOYALTY_STARS_PER_CYCLE = 5;
/** Porcentaje de descuento del bono */
export const LOYALTY_BONUS_DISCOUNT = 50;
