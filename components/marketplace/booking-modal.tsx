"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";

type Step = "form" | "summary" | "success";

interface LeadFormData {
  full_name: string;
  phone: string;
  email: string;
  whatsapp: string;
  check_in_date: string;
  check_out_date: string;
  adults_count: number;
  children_count: number;
  rooms_count: number;
  pets_included: boolean;
  notes: string;
}

interface BookingModalProps {
  businessId: string;
  businessName: string;
  priceRange?: string;
  mode?: "booking" | "order";
  onClose: () => void;
}

const initialFormData: LeadFormData = {
  full_name: "",
  phone: "",
  email: "",
  whatsapp: "",
  check_in_date: "",
  check_out_date: "",
  adults_count: 2,
  children_count: 0,
  rooms_count: 1,
  pets_included: false,
  notes: "",
};

/** Componente de formulario de reserva multi-paso con diseño Premium */
export function BookingModal({
  businessId,
  businessName,
  priceRange,
  mode = "booking",
  onClose,
}: BookingModalProps) {
  const [step, setStep] = useState<Step>("form");
  const [formData, setFormData] = useState<LeadFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Bloquear scroll del body cuando el modal está abierto
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const [referenceCode, setReferenceCode] = useState<string>("");
  const [error, setError] = useState<string>("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
  }

  function updateCounter(field: keyof LeadFormData, delta: number) {
    setFormData((prev) => {
      const currentValue = prev[field] as number;
      const newValue = Math.max(0, currentValue + delta);
      // Evitar 0 adultos o 0 habitaciones
      if ((field === "adults_count" || field === "rooms_count") && newValue === 0) {
        return prev;
      }
      return { ...prev, [field]: newValue };
    });
  }

  function validateForm(): boolean {
    if (!formData.full_name.trim()) {
      setError("Por favor ingresa tu nombre completo.");
      return false;
    }
    if (!formData.phone.trim()) {
      setError("Por favor ingresa tu número de teléfono.");
      return false;
    }
    if (!formData.check_in_date) {
      setError("Por favor selecciona una fecha de llegada o de servicio.");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Por favor ingresa un correo electrónico válido.");
      return false;
    }
    if (!formData.whatsapp.trim()) {
      setError("Por favor ingresa tu número de WhatsApp.");
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: businessId,
          business_name: businessName,
          lead: {
            full_name: formData.full_name,
            phone: formData.phone,
            email: formData.email,
            whatsapp: formData.whatsapp,
            check_in_date: formData.check_in_date,
            check_out_date: formData.check_out_date || undefined,
            adults_count: formData.adults_count,
            children_count: formData.children_count,
            rooms_count: formData.rooms_count,
            pets_included: formData.pets_included,
            notes: formData.notes || undefined,
          },
          total_amount: 0, // Se actualizará con el pago real de Wompi
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        reference_code?: string;
        error?: string;
      };

      if (!response.ok || !data.success) {
        throw new Error(data.error ?? "Error al crear la reserva.");
      }

      setReferenceCode(data.reference_code ?? "");
      setStep("success");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado. Inténtalo de nuevo.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const modalContent = (
    /* Backdrop */
    <div
      aria-modal="true"
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm sm:p-6"
      role="dialog"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Panel */}
      <div className="relative flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_24px_80px_rgba(24,32,42,0.18)] sm:rounded-[32px]">
        {/* Header degradado */}
        <div className="shrink-0 bg-gradient-to-r from-teal to-teal/80 px-6 py-5 sm:px-7 sm:py-6">
          <button
            aria-label="Cerrar formulario"
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
            type="button"
            onClick={onClose}
          >
            ✕
          </button>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-teal-100/70">
            Portal Necoclí · {mode === "order" ? "Pedido" : "Reserva"}
          </p>
          <h2 className="mt-1 text-xl font-bold text-white">{businessName}</h2>
          {priceRange && (
            <span className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white">
              {priceRange}
            </span>
          )}
        </div>

        {/* Cuerpo del modal */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          {/* ─── Paso 1: Formulario ─── */}
          {step === "form" && (
            <form id="booking-form" noValidate onSubmit={handleSubmit}>
              <p className="mb-5 text-sm leading-6 text-ink/65">
                Completa tus datos y nuestro equipo te contactará para confirmar disponibilidad y
                guiarte en el pago.
              </p>

              <div className="space-y-4">
                {/* Nombre */}
                <div>
                  <label
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/55"
                    htmlFor="full_name"
                  >
                    Nombre completo *
                  </label>
                  <input
                    autoComplete="name"
                    className="w-full rounded-xl border border-ink/14 bg-sand/40 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-teal/50 focus:ring-2 focus:ring-teal/10"
                    id="full_name"
                    name="full_name"
                    placeholder="Tu nombre completo"
                    required
                    type="text"
                    value={formData.full_name}
                    onChange={handleChange}
                  />
                </div>

                {/* Teléfono y WhatsApp en fila */}
                <div className={mode === "order" ? "hidden" : "grid gap-4 sm:grid-cols-2"}>
                  <div>
                    <label
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/55"
                      htmlFor="phone"
                    >
                      Teléfono *
                    </label>
                    <input
                      autoComplete="tel"
                      className="w-full rounded-xl border border-ink/14 bg-sand/40 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-teal/50 focus:ring-2 focus:ring-teal/10"
                      id="phone"
                      name="phone"
                      placeholder="3XX XXX XXXX"
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/55"
                      htmlFor="whatsapp"
                    >
                      WhatsApp *
                    </label>
                    <input
                      className="w-full rounded-xl border border-ink/14 bg-sand/40 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-teal/50 focus:ring-2 focus:ring-teal/10"
                      id="whatsapp"
                      name="whatsapp"
                      placeholder="3XX XXX XXXX"
                      required
                      type="tel"
                      value={formData.whatsapp}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Correo y Fechas en fila (o separados) */}
                <div>
                  <label
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/55"
                    htmlFor="email"
                  >
                    Correo electrónico *
                  </label>
                  <input
                    autoComplete="email"
                    className="w-full rounded-xl border border-ink/14 bg-sand/40 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-teal/50 focus:ring-2 focus:ring-teal/10"
                    id="email"
                    name="email"
                    placeholder="tu@correo.com"
                    required
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                {/* Calendario de fechas */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/55"
                      htmlFor="check_in_date"
                    >
                      Llegada / Fecha *
                    </label>
                    <input
                      className="w-full rounded-xl border border-ink/14 bg-sand/40 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-teal/50 focus:ring-2 focus:ring-teal/10 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
                      id="check_in_date"
                      name="check_in_date"
                      required
                      type="date"
                      value={formData.check_in_date}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/55"
                      htmlFor="check_out_date"
                    >
                      Salida (Opcional)
                    </label>
                    <input
                      className="w-full rounded-xl border border-ink/14 bg-sand/40 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-teal/50 focus:ring-2 focus:ring-teal/10 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100"
                      id="check_out_date"
                      name="check_out_date"
                      type="date"
                      min={formData.check_in_date || undefined}
                      value={formData.check_out_date}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Steppers de Huéspedes y Habitaciones */}
                <div
                  className={
                    mode === "order" ? "hidden" : "rounded-xl border border-ink/14 bg-sand/20 p-4"
                  }
                >
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink/55">
                    Huéspedes y Habitaciones
                  </p>

                  <div className="space-y-4">
                    {/* Adultos */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-ink">Adultos</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateCounter("adults_count", -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 text-ink transition hover:bg-ink/5 disabled:opacity-50"
                          disabled={formData.adults_count <= 1}
                        >
                          -
                        </button>
                        <span className="w-4 text-center text-sm font-semibold">
                          {formData.adults_count}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCounter("adults_count", 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 text-ink transition hover:bg-ink/5"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Niños */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="block text-sm font-medium text-ink">Niños</span>
                        <span className="text-xs text-ink/50">Edades 0-17</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateCounter("children_count", -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 text-ink transition hover:bg-ink/5 disabled:opacity-50"
                          disabled={formData.children_count <= 0}
                        >
                          -
                        </button>
                        <span className="w-4 text-center text-sm font-semibold">
                          {formData.children_count}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCounter("children_count", 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 text-ink transition hover:bg-ink/5"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Habitaciones */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-ink">Habitaciones</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateCounter("rooms_count", -1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 text-ink transition hover:bg-ink/5 disabled:opacity-50"
                          disabled={formData.rooms_count <= 1}
                        >
                          -
                        </button>
                        <span className="w-4 text-center text-sm font-semibold">
                          {formData.rooms_count}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCounter("rooms_count", 1)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-ink/20 text-ink transition hover:bg-ink/5"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Mascotas */}
                  <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4">
                    <span className="text-sm font-medium text-ink">¿Viajas con mascotas?</span>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        name="pets_included"
                        checked={formData.pets_included}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <div className="peer h-6 w-11 rounded-full bg-ink/20 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-white after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none"></div>
                    </label>
                  </div>
                </div>

                {/* Notas opcionales */}
                <div>
                  <label
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/55"
                    htmlFor="notes"
                  >
                    {mode === "order"
                      ? "Lista de tu pedido y dirección de entrega *"
                      : "Detalla tu solicitud (opcional)"}
                  </label>
                  <textarea
                    className="w-full resize-none rounded-xl border border-ink/14 bg-sand/40 px-4 py-3 text-sm text-ink outline-none transition placeholder:text-ink/35 focus:border-teal/50 focus:ring-2 focus:ring-teal/10"
                    id="notes"
                    name="notes"
                    placeholder={
                      mode === "order"
                        ? "Ej: 2 pacas de agua, 1 arroz. Entregar en Barrio El Pescador..."
                        : "Fechas, número de personas, preferencias..."
                    }
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 rounded-xl border border-coral/20 bg-coral/8 px-4 py-3">
                  <p className="text-sm font-medium text-coral">{error}</p>
                </div>
              )}

              {/* CTA */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  className="flex-1"
                  disabled={isSubmitting}
                  size="lg"
                  type="submit"
                  variant="primary"
                >
                  {isSubmitting
                    ? "Enviando…"
                    : mode === "order"
                      ? "Enviar pedido →"
                      : "Solicitar reserva →"}
                </Button>
                <Button size="lg" type="button" variant="secondary" onClick={onClose}>
                  Cancelar
                </Button>
              </div>

              <p className="mt-4 text-center text-xs text-ink/40">
                Al enviar confirmas que aceptas ser contactado por nuestro equipo para gestionar tu
                reserva.
              </p>
            </form>
          )}

          {/* ─── Paso 2: Éxito ─── */}
          {step === "success" && (
            <div className="py-4 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-teal/10 text-3xl">
                🌴
              </div>
              <h3 className="text-2xl font-bold text-ink">
                {mode === "order" ? "¡Pedido recibido!" : "¡Reserva recibida!"}
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                Hemos enviado la confirmación a{" "}
                <span className="font-semibold text-teal">{formData.email}</span>. Nuestro equipo se
                pondrá en contacto contigo en breve.
              </p>

              {/* Código de referencia */}
              <div className="mt-6 rounded-2xl border border-ink/10 bg-sand/50 px-6 py-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-coral">
                  Tu código de {mode === "order" ? "pedido" : "reserva"}
                </p>
                <p className="mt-2 text-3xl font-extrabold tracking-wider text-ink">
                  {referenceCode}
                </p>
                <p className="mt-1 text-xs text-ink/45">Guárdalo para hacer seguimiento</p>
              </div>

              {/* WhatsApp directo */}
              <a
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-[#1EBF5A]"
                href={`https://wa.me/573214537484?text=${encodeURIComponent(`Hola! Acabo de hacer un ${mode === "order" ? "pedido" : "reserva"} en ${businessName}. Mi código es: ${referenceCode}`)}`}
                rel="noreferrer"
                target="_blank"
              >
                <span>💬</span>
                Confirmar por WhatsApp
              </a>

              <Button className="mt-3 w-full" size="lg" variant="secondary" onClick={onClose}>
                Cerrar
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}
