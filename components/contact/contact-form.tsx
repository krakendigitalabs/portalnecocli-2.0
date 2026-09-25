"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

type ContactFormData = {
  name: string;
  phone: string;
  email: string;
  message: string;
};

const inputBase =
  "w-full bg-white/60 backdrop-blur-sm border border-ink/10 rounded-2xl px-5 py-4 text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-green/40 focus:border-green/50 transition-all duration-300 text-base";

const labelBase = "block text-xs font-bold uppercase tracking-[0.12em] text-ink/50 mb-2";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          className="flex flex-col items-center justify-center py-16 text-center space-y-6"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          >
            <div className="w-24 h-24 rounded-full bg-green/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12 text-green" />
            </div>
          </motion.div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold text-ink">¡Mensaje enviado! 🌴</h3>
            <p className="text-ink/60 max-w-xs mx-auto text-sm leading-relaxed">
              Tu solicitud llegó a nuestro equipo. Recibirás una confirmación en tu correo en
              instantes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="text-sm text-green font-semibold hover:underline"
          >
            Enviar otra solicitud
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          {/* Nombre */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <label className={labelBase}>Nombre completo</label>
            <input
              {...register("name", { required: "El nombre es requerido" })}
              className={inputBase}
              placeholder="¿Cómo te llamas?"
              autoComplete="name"
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-coral flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name.message}
              </p>
            )}
          </motion.div>

          {/* Teléfono */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className={labelBase}>Teléfono / WhatsApp</label>
            <input
              {...register("phone", {
                required: "El teléfono es requerido",
                minLength: { value: 7, message: "Teléfono inválido" },
              })}
              className={inputBase}
              placeholder="+57 300 000 0000"
              autoComplete="tel"
              type="tel"
            />
            {errors.phone && (
              <p className="mt-1.5 text-xs text-coral flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.phone.message}
              </p>
            )}
          </motion.div>

          {/* Correo */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className={labelBase}>Correo electrónico</label>
            <input
              {...register("email", {
                required: "El correo es requerido",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Correo inválido" },
              })}
              className={inputBase}
              placeholder="tu@correo.com"
              autoComplete="email"
              type="email"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-coral flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.email.message}
              </p>
            )}
          </motion.div>

          {/* Mensaje */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className={labelBase}>¿En qué podemos asesorarte?</label>
            <textarea
              {...register("message", {
                required: "El mensaje es requerido",
                minLength: { value: 10, message: "Mínimo 10 caracteres" },
              })}
              rows={4}
              className={`${inputBase} resize-none`}
              placeholder="Cuéntanos sobre tu plan: destino, fechas, grupo, presupuesto..."
            />
            {errors.message && (
              <p className="mt-1.5 text-xs text-coral flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.message.message}
              </p>
            )}
          </motion.div>

          {/* Error global */}
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2 text-sm text-red-700"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Ocurrió un error. Por favor inténtalo de nuevo.</span>
            </motion.div>
          )}

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <button
              type="submit"
              disabled={status === "loading"}
              className="group w-full relative overflow-hidden bg-gradient-to-r from-green to-green/80 hover:from-green/90 hover:to-green text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-green/25 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {/* shimmer */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {status === "loading" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Solicitar asesoría
                </>
              )}
            </button>
            <p className="text-center text-xs text-ink/40 mt-3">
              Responderemos en menos de 24 horas · Sin spam, lo prometemos
            </p>
          </motion.div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
