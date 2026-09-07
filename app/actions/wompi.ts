"use server";

import { createHash } from "crypto";

/**
 * Genera la firma de integridad para el Widget de Wompi.
 * El string a firmar es: reference + amountInCents + currency + integrityKey
 * La firma se calcula con SHA-256.
 *
 * @docs https://docs.wompi.co/docs/colombia/widget-checkout-web/#configuracion-del-widget
 */
export async function generateWompiSignature(
  reference: string,
  amountInCents: number,
  currency = "COP",
): Promise<string> {
  const integrityKey =
    process.env.NODE_ENV === "production"
      ? process.env.WOMPI_INTEGRITY_SECRET
      : process.env.WOMPI_TEST_INTEGRITY_SECRET;

  if (!integrityKey) {
    throw new Error("WOMPI_INTEGRITY_SECRET no está configurado en las variables de entorno.");
  }

  const stringToSign = `${reference}${amountInCents}${currency}${integrityKey}`;
  const signature = createHash("sha256").update(stringToSign).digest("hex");

  return signature;
}
