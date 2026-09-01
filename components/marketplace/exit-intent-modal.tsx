"use client";

import { AnimatePresence, motion } from "framer-motion";
import { TicketPercent, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function ExitIntentModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Solo en desktop, cuando el mouse sale de la ventana por arriba (intentando cerrar la pestaña)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
        // Guardar en sessionStorage para no molestarlo de nuevo en esta sesión
        sessionStorage.setItem("exit_intent_shown", "true");
      }
    };

    if (!sessionStorage.getItem("exit_intent_shown")) {
      document.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasTriggered]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    // Simular guardado
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => setIsVisible(false), 3000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-[30px] bg-white shadow-2xl"
          >
            {/* Header decorativo tropical */}
            <div className="bg-gradient-to-br from-gold to-green p-6 text-center text-white relative">
              <button
                onClick={() => setIsVisible(false)}
                className="absolute right-4 top-4 rounded-full bg-white/20 p-1 text-white hover:bg-white/40 transition"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 shadow-inner">
                <TicketPercent className="w-8 h-8 text-white" />
              </div>
              <h2 className="font-tropical text-3xl tracking-widest uppercase">¡Espera!</h2>
              <p className="mt-2 text-sm font-medium opacity-90">
                No te vayas sin tu regalo de bienvenida
              </p>
            </div>

            <div className="p-6 text-center">
              {isSuccess ? (
                <div className="py-6">
                  <h3 className="text-xl font-bold text-green mb-2">¡Bono enviado! 🌴</h3>
                  <p className="text-ink/70">
                    Revisa tu correo. Tu cupón de descuento ya está en camino.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-ink">Lleva 10% de Descuento</h3>
                  <p className="mt-3 text-sm text-ink/70">
                    En tu primer tour o reserva de hotel. Solo dinos a dónde enviamos el código.
                  </p>
                  <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
                    <input
                      type="email"
                      placeholder="Tu correo electrónico"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-full border border-ink/10 bg-sand px-4 py-3 text-sm text-ink outline-none transition focus:border-green/50 focus:ring-2 focus:ring-green/10"
                    />
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full rounded-full bg-green hover:bg-green/90 text-white font-bold py-3 shadow-lg"
                    >
                      {isSubmitting ? "Generando..." : "¡Quiero mi descuento!"}
                    </Button>
                  </form>
                  <button
                    onClick={() => setIsVisible(false)}
                    className="mt-4 text-xs text-ink/50 underline hover:text-ink"
                  >
                    No gracias, prefiero pagar precio completo
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
