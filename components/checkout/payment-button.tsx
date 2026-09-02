"use client";

import { CreditCard, Loader2 } from "lucide-react";
import { useTransition } from "react";
import { processSimulatedPayment } from "@/app/actions/checkout";

type Props = {
  reservationId: string;
};

export function PaymentButton({ reservationId }: Props) {
  const [isPending, startTransition] = useTransition();

  const handlePayment = () => {
    startTransition(async () => {
      try {
        await processSimulatedPayment(reservationId);
      } catch (error) {
        // En Next.js, 'redirect()' lanza un error que NO debe ser atrapado.
        // Verificamos si el error es una redirección, en cuyo caso lo volvemos a lanzar.
        if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
          throw error;
        }
        alert("Ocurrió un error procesando el pago. Intenta de nuevo.");
      }
    });
  };

  return (
    <button 
      onClick={handlePayment}
      disabled={isPending}
      className="w-full relative overflow-hidden group bg-[#0014B4] hover:bg-[#001090] text-white rounded-[16px] py-4 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
    >
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
      <div className="flex items-center justify-center gap-3 relative z-10">
        {isPending ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <CreditCard className="w-5 h-5" />
        )}
        <span className="font-extrabold tracking-wide">
          {isPending ? "Procesando pago seguro..." : "Pagar con Wompi"}
        </span>
      </div>
    </button>
  );
}
