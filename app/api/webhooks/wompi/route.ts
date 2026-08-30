import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { holdFunds } from '@/data/escrowService';
import { EscrowTransaction, EscrowTransactionStatus } from '@/types/escrow';

/**
 * Expected structure for the Wompi Webhook Payload.
 * Strongly typed to avoid the use of "any".
 */
interface WompiWebhookPayload {
  event: string;
  data: {
    transaction: {
      id: string;
      status: string;
      reference: string;
      amount_in_cents: number;
      // Wompi allows sending custom metadata where we can store our business IDs
      customer_email?: string;
    };
  };
  signature: {
    checksum: string;
    properties: string[];
  };
  timestamp: number;
}

/**
 * Validates the cryptographic signature of the Wompi Webhook to ensure
 * the request genuinely originated from Wompi and wasn't tampered with.
 * 
 * @param {WompiWebhookPayload} payload - The complete JSON payload received.
 * @returns {boolean} True if the signature is valid, false otherwise.
 */
function isValidWompiSignature(payload: WompiWebhookPayload): boolean {
  const secret = process.env.WOMPI_EVENTS_SECRET;
  
  if (!secret || !payload.signature || !payload.signature.checksum || !payload.timestamp) {
    return false;
  }

  const { transaction } = payload.data;
  
  // Wompi concatenates: transaction.id + transaction.status + transaction.amount_in_cents + timestamp + secret
  const hashString = `${transaction.id}${transaction.status}${transaction.amount_in_cents}${payload.timestamp}${secret}`;
  
  const expectedChecksum = crypto
    .createHash('sha256')
    .update(hashString)
    .digest('hex');

  return expectedChecksum === payload.signature.checksum;
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as WompiWebhookPayload;

    // Security Validation: Verify payload integrity and origin
    if (!isValidWompiSignature(payload)) {
      console.warn('Wompi Webhook Error: Invalid cryptographic signature');
      return NextResponse.json({ error: 'Unauthorized: Invalid signature' }, { status: 401 });
    }

    // Process only if it's a transaction update event
    if (payload.event === 'transaction.updated') {
      const { transaction } = payload.data;

      // Check if transaction is APPROVED
      if (transaction.status === 'APPROVED') {
        
        // In a real scenario, you retrieve these from transaction metadata 
        // or by querying your DB using the transaction.reference. 
        // For this implementation, we construct the EscrowTransaction payload.
        const transactionData: EscrowTransaction = {
          id: transaction.id, // Using Wompi's transaction ID as our Escrow ID
          booking_id: `booking-${transaction.reference}`, // Extracted from metadata/reference
          buyer_id: 'extracted-buyer-id',                 // Extracted from metadata/reference
          merchant_id: 'extracted-merchant-id',           // Extracted from metadata/reference
          total_amount: transaction.amount_in_cents / 100, 
          portal_fee: (transaction.amount_in_cents / 100) * 0.1, // Example: 10% fee
          merchant_payout: (transaction.amount_in_cents / 100) * 0.9, 
          status: 'PENDING' as EscrowTransactionStatus, // Will be forced to HELD inside holdFunds
          gateway_ref: transaction.id,
          created_at: new Date().toISOString()
        };

        // Execute Escrow Business Logic: Hold the funds
        await holdFunds(transactionData);
        console.log(`[Escrow] Funds held successfully for transaction ${transaction.id}`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Wompi Webhook Internal Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
