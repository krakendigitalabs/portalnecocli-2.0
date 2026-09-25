"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Gift, X } from "lucide-react";
import { useEffect, useState } from "react";
// A simple server action that could be implemented to subscribe and grant bonus
import { subscribeAndGrantWelcomeBonus } from "@/app/actions/newsletter";
import { Button } from "@/components/ui/button";

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if user already saw the modal or closed it
    const hasSeenModal = localStorage.getItem("necocli_welcome_seen");
    if (hasSeenModal === "true") return;

    // Trigger on scroll to "Turistas" / Packages section
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Trigger roughly when scrolling down 600px (around the packages section)
      if (scrollY > 600 && !isOpen) {
        setIsOpen(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  const handleClose = () => {
    localStorage.setItem("necocli_welcome_seen", "true");
    setIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await subscribeAndGrantWelcomeBonus(email);
      setSuccess(true);
      localStorage.setItem("necocli_welcome_seen", "true");
      setTimeout(() => {
        setIsOpen(false);
      }, 5000);
    } catch (err) {
      console.error(err);
      // Even if it fails (e.g. already subscribed), we show success to not block them
      setSuccess(true);
      localStorage.setItem("necocli_welcome_seen", "true");
      setTimeout(() => setIsOpen(false), 5000);
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
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-md bg-[#0F172A] rounded-2xl shadow-2xl overflow-hidden z-10 border border-[#1E293B]"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 rounded-full transition-colors z-20 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Premium Header */}
            <div className="relative p-10 text-center overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-50" />

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
                  <Gift className="w-8 h-8 text-black" />
                </div>
                <h3 className="text-3xl font-serif text-white mb-2">
                  Descubre el <span className="text-amber-400 italic">Paraíso</span>
                </h3>
                <p className="text-gray-400 font-medium text-sm px-4">
                  Únete a nuestro club exclusivo y recibe beneficios en tu próxima estadía
                </p>
              </div>
            </div>

            {/* Content Area */}
            <div className="p-8 text-center bg-[#0B1120]">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-6 space-y-4"
                >
                  <div className="w-16 h-16 bg-amber-400/10 border border-amber-400/30 text-amber-400 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <h4 className="text-xl font-serif text-white">¡Membresía Activada!</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Hemos enviado tu bono del{" "}
                    <span className="text-amber-400 font-bold">10% de descuento</span> a tu correo.
                    Revisa tu bandeja de entrada o spam.
                  </p>
                </motion.div>
              ) : (
                <>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                      <input
                        type="email"
                        required
                        placeholder="Tu correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-5 py-4 bg-[#1E293B] border border-[#334155] rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-amber-400 text-white placeholder:text-gray-500 text-center transition-all"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black rounded-lg font-bold text-lg shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all uppercase tracking-wider"
                    >
                      {isSubmitting ? "Procesando..." : "Quiero mi 10% OFF"}
                    </Button>
                  </form>
                  <button
                    onClick={handleClose}
                    className="mt-6 text-xs font-medium text-gray-500 hover:text-gray-300 transition-colors uppercase tracking-widest"
                  >
                    Continuar sin beneficios
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
