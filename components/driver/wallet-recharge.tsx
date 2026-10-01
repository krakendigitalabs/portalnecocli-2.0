"use client";

import { useState, useEffect } from "react";
import { WompiButton } from "@/components/checkout/wompi-button";
import { generateWompiSignature } from "@/app/actions/wompi";

const PREDEFINED_AMOUNTS = [20000, 50000, 100000];

export function WalletRecharge({ userId }: { userId: string }) {
  const [amount, setAmount] = useState<number>(PREDEFINED_AMOUNTS[0]);
  const [signature, setSignature] = useState<string | null>(null);
  const [reference, setReference] = useState<string>("");

  useEffect(() => {
    async function prepareSignature() {
      // Formato: TOPUP_UID_TIMESTAMP
      const newRef = `TOPUP_${userId}_${Date.now()}`;
      setReference(newRef);
      const amountInCents = amount * 100;

      try {
        const sig = await generateWompiSignature(newRef, amountInCents, "COP");
        setSignature(sig);
      } catch (err) {
        console.error("Error generando firma de Wompi:", err);
      }
    }

    prepareSignature();
  }, [amount, userId]);

  return (
    <div className="bg-[#2A2D35] rounded-3xl p-6 border border-white/5 text-center space-y-4 shadow-lg">
      <h2 className="text-lg font-bold text-white mb-2">Recargar Saldo</h2>
      <p className="text-sm text-white/60">
        Mantén tu saldo positivo para seguir recibiendo carreras. Pagos seguros por Wompi.
      </p>

      <div className="grid grid-cols-2 gap-3 mt-4 mb-6">
        {PREDEFINED_AMOUNTS.map((val) => (
          <button
            key={val}
            onClick={() => setAmount(val)}
            className={`py-3 rounded-2xl font-bold transition-colors border ${
              amount === val
                ? "bg-teal border-teal text-white"
                : "bg-white/5 border-white/10 text-white hover:bg-white/10"
            }`}
          >
            $ {val.toLocaleString("es-CO")}
          </button>
        ))}
        <button
          className="bg-white/5 text-white/50 border border-white/5 py-3 rounded-2xl font-bold opacity-50 cursor-not-allowed"
          disabled
        >
          Otro Valor
        </button>
      </div>

      {signature && reference ? (
        <WompiButton
          reference={reference}
          amountInCents={amount * 100}
          redirectUrl="/driver/billetera" // Vuelve aquí mismo al terminar
          signature={signature}
        />
      ) : (
        <div className="animate-pulse h-16 bg-white/5 rounded-2xl w-full flex items-center justify-center text-sm text-white/50">
          Preparando pasarela segura...
        </div>
      )}
    </div>
  );
}
