"use client";

import { useState } from "react";
import type { VehicleType } from "@/types/driver";

type FormData = {
  full_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  vehicle_type: VehicleType;
  vehicle_plate: string;
  vehicle_description: string;
  cooperative: string;
  nequi_number: string;
};

const VEHICLE_OPTIONS: { value: VehicleType; label: string; icon: string }[] = [
  { value: "mototaxi", label: "Mototaxi", icon: "🏍️" },
  { value: "motocarro", label: "Motocarro", icon: "🛺" },
  { value: "taxi", label: "Taxi", icon: "🚕" },
  { value: "lancha", label: "Lancha", icon: "🚤" },
];

export function DriverRegisterForm() {
  const [form, setForm] = useState<FormData>({
    full_name: "",
    email: "",
    phone: "",
    whatsapp: "",
    vehicle_type: "motocarro",
    vehicle_plate: "",
    vehicle_description: "",
    cooperative: "",
    nequi_number: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/drivers/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al registrarse");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-12 px-6">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold text-ink mb-2">¡Registro Exitoso!</h3>
        <p className="text-ink/70 max-w-md mx-auto mb-8">
          Tu solicitud fue enviada. Nuestro equipo revisará tus datos y te contactaremos por
          WhatsApp cuando tu cuenta esté activa. ¡Prepárate para recibir carreras!
        </p>
        <a
          href="/driver"
          className="inline-block px-8 py-4 bg-teal text-white font-bold text-lg rounded-2xl hover:bg-teal/90 transition-all shadow-lg shadow-teal/25"
        >
          Ir a mi Tablero
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg mx-auto">
      {/* Nombre y Correo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-semibold text-ink mb-1.5">
            Nombre completo
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            value={form.full_name}
            onChange={handleChange}
            placeholder="Ej: Carlos Pérez"
            className="w-full px-4 py-3 bg-white border border-ink/15 rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition-colors"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-ink mb-1.5">
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
            className="w-full px-4 py-3 bg-white border border-ink/15 rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition-colors"
          />
        </div>
      </div>

      {/* Celular */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-ink mb-1.5">
            Celular
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={form.phone}
            onChange={handleChange}
            placeholder="312 555 1234"
            className="w-full px-4 py-3 bg-white border border-ink/15 rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition-colors"
          />
        </div>
        <div>
          <label htmlFor="whatsapp" className="block text-sm font-semibold text-ink mb-1.5">
            WhatsApp
          </label>
          <input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            required
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="312 555 1234"
            className="w-full px-4 py-3 bg-white border border-ink/15 rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition-colors"
          />
        </div>
      </div>

      {/* Tipo de Vehículo */}
      <div>
        <label className="block text-sm font-semibold text-ink mb-2">Tipo de vehículo</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {VEHICLE_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.value}
              onClick={() => setForm((prev) => ({ ...prev, vehicle_type: opt.value }))}
              className={`flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all duration-200 ${
                form.vehicle_type === opt.value
                  ? "border-teal bg-teal/10 shadow-md shadow-teal/10"
                  : "border-ink/10 bg-white hover:border-ink/25"
              }`}
            >
              <span className="text-2xl">{opt.icon}</span>
              <span className="text-xs font-bold text-ink">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Placa y Descripción */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="vehicle_plate" className="block text-sm font-semibold text-ink mb-1.5">
            Placa / N° interno
          </label>
          <input
            id="vehicle_plate"
            name="vehicle_plate"
            type="text"
            required
            value={form.vehicle_plate}
            onChange={handleChange}
            placeholder="ABC-123"
            className="w-full px-4 py-3 bg-white border border-ink/15 rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="vehicle_description"
            className="block text-sm font-semibold text-ink mb-1.5"
          >
            Apodo del vehículo <span className="text-ink/40">(opcional)</span>
          </label>
          <input
            id="vehicle_description"
            name="vehicle_description"
            type="text"
            value={form.vehicle_description}
            onChange={handleChange}
            placeholder='Ej: "La Fiera 04"'
            className="w-full px-4 py-3 bg-white border border-ink/15 rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition-colors"
          />
        </div>
      </div>

      {/* Cooperativa */}
      <div>
        <label htmlFor="cooperative" className="block text-sm font-semibold text-ink mb-1.5">
          Cooperativa / Empresa <span className="text-ink/40">(opcional)</span>
        </label>
        <input
          id="cooperative"
          name="cooperative"
          type="text"
          value={form.cooperative}
          onChange={handleChange}
          placeholder="Neco Servicios, CoopTransNec..."
          className="w-full px-4 py-3 bg-white border border-ink/15 rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition-colors"
        />
      </div>

      {/* Nequi */}
      <div>
        <label htmlFor="nequi_number" className="block text-sm font-semibold text-ink mb-1.5">
          Nequi / Bancolombia para recibir pagos
        </label>
        <input
          id="nequi_number"
          name="nequi_number"
          type="tel"
          required
          value={form.nequi_number}
          onChange={handleChange}
          placeholder="Número Nequi o cuenta"
          className="w-full px-4 py-3 bg-white border border-ink/15 rounded-xl text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-teal/50 focus:border-teal transition-colors"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-4 bg-teal text-white font-bold text-lg rounded-2xl hover:bg-teal/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-teal/25"
      >
        {submitting ? "Enviando..." : "Registrarme como Conductor 🚀"}
      </button>

      <p className="text-center text-xs text-ink/50">
        Al registrarte aceptas los términos de servicio de Portal Necoclí.
        <br />
        Tu solicitud será revisada antes de activar tu cuenta.
      </p>
    </form>
  );
}
