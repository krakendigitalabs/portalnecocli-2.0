/**
 * Servicio Escrow para Portal Necoclí.
 * ARQUITECTURA: Usa el Admin SDK de Firebase (server-only) para operar
 * correctamente desde API Routes y Server Actions en Next.js App Router.
 */
import "server-only";
import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import { EscrowTransaction, MerchantWallet, EscrowTransactionStatus } from '@/types/escrow';

function getDb() {
  return getFirestore(getFirebaseAdminApp());
}

/**
 * Inserta un nuevo registro de transacción Escrow en estado HELD (retenido).
 * Se invoca típicamente tras la confirmación de un pago exitoso (ej. desde el webhook de Wompi).
 * 
 * @param {EscrowTransaction} transactionData - Datos completos de la transacción.
 * @returns {Promise<void>} Promesa vacía al completarse correctamente.
 */
export async function holdFunds(transactionData: EscrowTransaction): Promise<void> {
  const db = getDb();
  const dataToSave: EscrowTransaction = {
    ...transactionData,
    status: 'HELD' as EscrowTransactionStatus,
    created_at: new Date().toISOString()
  };
  await db.collection('escrow_transactions').doc(transactionData.id).set(dataToSave);
}

/**
 * Libera los fondos de una transacción en garantía, pasando su estado a RELEASED.
 * Además, actualiza la billetera (MerchantWallet) del aliado, moviendo el dinero
 * del saldo retenido al saldo disponible.
 * 
 * @param {string} transactionId - ID de la transacción a liberar.
 * @param {string} merchantId - ID del comercio propietario de los fondos.
 * @returns {Promise<void>} Promesa vacía al completarse correctamente.
 */
export async function releaseFunds(transactionId: string, merchantId: string): Promise<void> {
  const db = getDb();
  const transactionRef = db.collection('escrow_transactions').doc(transactionId);
  const transactionSnap = await transactionRef.get();

  if (!transactionSnap.exists) {
    throw new Error(`La transacción ${transactionId} no existe.`);
  }

  const transaction = transactionSnap.data() as EscrowTransaction;

  if (transaction.status !== 'HELD') {
    throw new Error(`La transacción ${transactionId} no está retenida (Estado actual: ${transaction.status}).`);
  }

  if (transaction.merchant_id !== merchantId) {
    throw new Error('El merchantId proporcionado no coincide con el beneficiario de la transacción.');
  }

  // 1. Actualizar el estado de la transacción a RELEASED
  await transactionRef.update({
    status: 'RELEASED' as EscrowTransactionStatus,
    release_date: new Date().toISOString()
  });

  // 2. Mover el dinero en la billetera del comercio
  const walletRef = db.collection('merchant_wallets').doc(merchantId);
  const walletSnap = await walletRef.get();

  if (!walletSnap.exists) {
    throw new Error(`La billetera del comercio ${merchantId} no fue encontrada.`);
  }

  const wallet = walletSnap.data() as MerchantWallet;
  const payoutAmount = transaction.merchant_payout;

  // Actualización transaccional de saldos con Admin SDK
  const batch = db.batch();
  batch.update(walletRef, {
    held_balance: wallet.held_balance - payoutAmount,
    available_balance: wallet.available_balance + payoutAmount
  });
  await batch.commit();
}

/**
 * Obtiene los saldos actuales (retenido y disponible) de un comercio específico.
 * 
 * @param {string} merchantId - ID del comercio a consultar.
 * @returns {Promise<MerchantWallet>} Los datos de la billetera del comercio.
 */
export async function getMerchantBalance(merchantId: string): Promise<MerchantWallet> {
  const db = getDb();
  const walletSnap = await db.collection('merchant_wallets').doc(merchantId).get();

  if (!walletSnap.exists) {
    throw new Error(`No se encontró billetera para el comercio ${merchantId}.`);
  }

  return walletSnap.data() as MerchantWallet;
}
