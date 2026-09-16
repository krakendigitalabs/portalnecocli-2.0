"use client";

import { useState } from "react";
import { confirmTicketOfflinePayment } from "@/app/actions/ticket-actions";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Gift, Loader2 } from "lucide-react";

export function OfflinePaymentButton({ ticketId, initialStatus }: { ticketId: string, initialStatus: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(initialStatus === "COMPLETED" ? "success" : "idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleConfirm = async () => {
    setStatus("loading");
    const result = await confirmTicketOfflinePayment(ticketId);
    
    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMessage(result.error || "Ocurrió un error");
    }
  };

  if (status === "success") {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-5 text-center shadow-inner"
      >
        <div className="flex justify-center mb-3">
          <div className="bg-emerald-100 p-3 rounded-full">
            <Gift className="w-8 h-8 text-emerald-600" />
          </div>
        </div>
        <h3 className="text-emerald-800 font-black text-lg mb-2">¡Pago Confirmado! Aquí tienes tu recompensa 🎁</h3>
        <p className="text-emerald-700 text-sm leading-relaxed max-w-sm mx-auto font-medium">
          Te has ganado un <strong>10% de descuento</strong> en tu próximo almuerzo en Necoclí. 
          Portal Necoclí te lo lleva a <strong>domicilio completamente GRATIS</strong> (Solo manejamos domicilios para esta oferta).
        </p>
        <div className="mt-4 bg-white/60 p-3 rounded-xl border border-emerald-200/50">
          <p className="text-xs text-emerald-900 leading-relaxed">
            <strong>Tu almuerzo incluye:</strong> Sopa de pescado, frijoles, arroz, ensalada, papitas, y proteína a elección (1/4 pollo, costilla, carne ahumada o pescado).<br/>
            <em>Válido de Lunes a Domingo.</em>
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="mt-6">
      <div className="bg-amber-50 border border-amber-200/50 rounded-2xl p-5 text-center">
        <h3 className="text-amber-800 font-bold mb-2 text-sm">¿Ya pagaste en la taquilla?</h3>
        <p className="text-amber-700 text-xs mb-4">Confirma tu pago y desbloquea un beneficio especial para tu almuerzo en Necoclí.</p>
        
        <button
          onClick={handleConfirm}
          disabled={status === "loading"}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
        >
          {status === "loading" ? (
            <><Loader2 className="w-5 h-5 animate-spin" /> Procesando...</>
          ) : (
            <><CheckCircle2 className="w-5 h-5" /> Confirmar mi pago en taquilla</>
          )}
        </button>
        {status === "error" && (
          <p className="text-rose-500 text-xs mt-2 font-semibold">{errorMessage}</p>
        )}
      </div>
    </div>
  );
}
