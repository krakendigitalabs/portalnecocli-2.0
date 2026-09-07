"use client";

import { useState } from "react";
import { Loader2, Unlock, CheckCircle2 } from "lucide-react";
import { releaseEscrowFunds } from "@/lib/actions/merchant";
import { useRouter } from "next/navigation";

type ReleaseFundsButtonProps = {
  transactionId: string;
};

export function ReleaseFundsButton({ transactionId }: ReleaseFundsButtonProps) {
  const [state, setState] = useState<"idle" | "confirming" | "pending" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handleRelease() {
    if (state === "confirming") {
      // Usuario confirmó — ejecutar liberación
      setState("pending");
      setErrorMessage(null);

      const result = await releaseEscrowFunds(transactionId);

      if (result.success) {
        setState("success");
        // Refrescar la página para reflejar el nuevo saldo disponible
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        setState("error");
        setErrorMessage(result.error ?? "Error desconocido.");
      }
    } else {
      // Primera pulsación: pedir confirmación
      setState("confirming");
    }
  }

  function handleCancel() {
    setState("idle");
  }

  if (state === "success") {
    return (
      <span className="flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1.5 text-xs font-semibold text-teal">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Fondos liberados
      </span>
    );
  }

  if (state === "error") {
    return (
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs font-semibold text-red-600">
          Error: {errorMessage}
        </span>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="text-xs text-ink/50 underline hover:text-ink"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (state === "confirming") {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-amber-700">¿Confirmar liberación?</span>
        <button
          type="button"
          onClick={handleRelease}
          className="rounded-full bg-teal px-3 py-1 text-xs font-bold text-white transition hover:bg-teal/90"
        >
          Sí, liberar
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-full bg-ink/8 px-3 py-1 text-xs font-bold text-ink/60 transition hover:bg-ink/12"
        >
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleRelease}
      disabled={state === "pending"}
      className="flex items-center gap-1.5 rounded-full bg-teal/10 px-4 py-2 text-xs font-semibold text-teal transition hover:bg-teal/20 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {state === "pending" ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Liberando...
        </>
      ) : (
        <>
          <Unlock className="h-3.5 w-3.5" />
          Liberar Fondos
        </>
      )}
    </button>
  );
}
