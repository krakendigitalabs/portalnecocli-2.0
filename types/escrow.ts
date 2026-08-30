/**
 * Estados posibles para una transacción Escrow (Modelo de Depósito en Garantía).
 * 
 * - PENDING: La transacción fue creada pero el pago no ha sido confirmado.
 * - HELD: El pago fue confirmado y los fondos están retenidos (en garantía).
 * - RELEASED: El servicio fue prestado y los fondos se liberaron al comercio.
 * - REFUNDED: La transacción fue cancelada y el dinero se devolvió al cliente.
 * - DISPUTED: Existe un conflicto con el servicio; fondos bloqueados temporalmente.
 */
export type EscrowTransactionStatus = 'PENDING' | 'HELD' | 'RELEASED' | 'REFUNDED' | 'DISPUTED';

/**
 * Representa una transacción bajo el modelo Escrow.
 * Gestiona la trazabilidad desde el pago del cliente hasta la liquidación al comercio.
 */
export interface EscrowTransaction {
  /** Identificador único de la transacción Escrow */
  id: string;
  /** Identificador de la reserva (booking) asociada */
  booking_id: string;
  /** Identificador del cliente (comprador) */
  buyer_id: string;
  /** Identificador del comercio o aliado que prestará el servicio */
  merchant_id: string;
  /** Monto total pagado por el cliente */
  total_amount: number;
  /** Comisión retenida por Portal Necoclí */
  portal_fee: number;
  /** Monto final a liquidar al comercio (total_amount - portal_fee) */
  merchant_payout: number;
  /** Estado actual de la transacción */
  status: EscrowTransactionStatus;
  /** Referencia o ID de la pasarela de pagos externa (ej. Wompi, MercadoPago, etc.) */
  gateway_ref: string;
  /** Fecha de creación de la transacción (ISO 8601 string) */
  created_at: string;
  /** Fecha en la que los fondos fueron o serán liberados al comercio (ISO 8601 string) */
  release_date?: string;
}

/**
 * Método de pago configurado por el comercio para recibir sus liquidaciones (payouts).
 */
export interface PayoutMethod {
  /** Tipo de cuenta o billetera financiera */
  type: 'NEQUI' | 'BANCOLOMBIA' | 'DAVIPLATA' | 'OTHER';
  /** Número de cuenta, teléfono o identificador */
  account_number: string;
  /** Nombre del titular de la cuenta */
  account_holder_name: string;
  /** Documento de identidad del titular */
  document_id: string;
}

/**
 * Billetera del comercio aliado. 
 * Refleja sus saldos actuales dentro del modelo transaccional.
 */
export interface MerchantWallet {
  /** Identificador del comercio */
  merchant_id: string;
  /** Saldo disponible para ser retirado (fondos de transacciones en estado RELEASED) */
  available_balance: number;
  /** Saldo retenido en garantía (fondos de transacciones en estado HELD) */
  held_balance: number;
  /** Configuración de la cuenta bancaria o billetera digital para recibir liquidaciones */
  payout_method: PayoutMethod;
}
