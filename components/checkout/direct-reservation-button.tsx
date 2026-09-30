"use client";

import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { processDirectReservation } from "@/app/actions/checkout";

type Props = {
  reservationId: string;
};

export function DirectReservationButton({ reservationId }: Props) {
  const [isPending, startTransition] = useTransition();

  const handleReservation = () => {
    startTransition(async () => {
      try {
        await processDirectReservation(reservationId);
      } catch (error) {
        if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
          throw error;
        }
        alert("Ocurrió un error procesando la reserva. Intenta de nuevo.");
      }
    });
  };

  return (
    <button
      onClick={handleReservation}
      disabled={isPending}
      className="block w-full text-sm text-center text-ink/60 mt-4 font-bold hover:text-ink hover:underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Procesando...
        </span>
      ) : (
        "Solo reservar"
      )}
    </button>
  );
}
