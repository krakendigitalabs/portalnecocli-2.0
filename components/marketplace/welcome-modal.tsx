"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

// A simple server action that could be implemented to subscribe and grant bonus
import { subscribeAndGrantWelcomeBonus } from "@/app/actions/newsletter";

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if user already saw the modal
    const hasSeenModal = localStorage.getItem("necocli_welcome_seen");
    if (hasSeenModal) return;

    // Trigger on scroll to "Turistas" / Packages section
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Trigger roughly when scrolling down 600px (around the packages section)
      if (scrollY > 600 && !isOpen) {
        setIsOpen(true);
        localStorage.setItem("necocli_welcome_seen", "true");
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    try {
      await subscribeAndGrantWelcomeBonus(email);
      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      // Even if it fails (e.g. already subscribed), we show success to not block them
      setSuccess(true);
      setTimeout(() => setIsOpen(false), 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden z-10"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-colors z-20 text-white"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="bg-gradient-to-br from-green-600 to-green-900 p-8 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_0%,_transparent_100%)]" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 border border-white/30 backdrop-blur-md">
                  <Ticket className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-extrabold text-white mb-2 font-marker tracking-widest uppercase italic transform -rotate-2">
                  ¡ESPERA!
                </h3>
                <p className="text-green-50 font-medium text-sm">
                  No te vayas sin tu regalo de bienvenida
                </p>
              </div>
            </div>
            
            <div className="p-8 text-center bg-sand/10">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 space-y-4"
                >
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold text-ink">¡Bono Activado!</h4>
                  <p className="text-sm text-ink/70">Revisa tu correo o entra a tu cuenta. El descuento se aplicará automáticamente en el checkout.</p>
                </motion.div>
              ) : (
                <>
                  <h4 className="text-2xl font-bold text-ink mb-2">Lleva 10% de Descuento</h4>
                  <p className="text-sm text-ink/60 mb-6">
                    En tu primer tour o reserva de hotel. Solo dinos a dónde enviamos el código.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="email"
                      required
                      placeholder="Tu correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-5 py-4 bg-white border border-green-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-ink placeholder:text-ink/40 text-center shadow-inner"
                    />
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full h-14 bg-green-700 hover:bg-green-800 text-white rounded-full font-bold text-lg shadow-lg shadow-green-900/20 transition-all hover:-translate-y-1"
                    >
                      {isSubmitting ? "Activando..." : "¡Quiero mi 10% OFF!"}
                    </Button>
                  </form>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="mt-6 text-xs font-semibold text-ink/40 hover:text-ink/70 underline decoration-ink/20"
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
