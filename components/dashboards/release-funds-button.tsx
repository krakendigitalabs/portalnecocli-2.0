"use client";

import { useState } from "react";
import { releaseEscrowFunds } from "@/lib/actions/merchant";

type ReleaseFundsButtonProps = {
  transactionId: string;
};

export function ReleaseFundsButton({ transactionId }: ReleaseFundsButtonProps) {
  const [isPending, setIsPending] = useState(false);

  async function handleRelease() {
    setIsPending(true);
    const result = await releaseEscrowFunds(transactionId);
    
    if (result.success) {
      alert("Fondos liberados y pasados a tu saldo disponible exitosamente.");
    } else {
      alert("Error: " + result.error);
    }
    setIsPending(false);
  }

  return (
    <button
      type="button"
      onClick={handleRelease}
      disabled={isPending}
      className="rounded-full bg-teal/10 px-4 py-2 text-sm font-semibold text-teal transition hover:bg-teal/20 disabled:opacity-50"
    >
      {isPending ? "Liberando..." : "Liberar Fondos"}
    </button>
  );
}
