"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { SurfaceCard } from "@/components/ui/surface-card";
import { submitMerchantApplication } from "@/lib/actions/merchant-application";
import {
  MERCHANT_CATEGORIES,
  type MerchantApplicationInput,
} from "@/lib/validations/merchant-schema";

// ─── Helpers ───────────────────────────────────────────────────────────────────
function FieldError({ error }: { error?: string[] }) {
  if (!error?.length) return null;
  return <p className="mt-1 text-xs text-red-600">{error[0]}</p>;
}

function InputField({
  label,
  id,
  required,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  hint,
}: {
  label: string;
  id: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string[];
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none ring-0 transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
      />
      {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      <FieldError error={error} />
    </div>
  );
}

// ─── Formulario principal ──────────────────────────────────────────────────────
export function MerchantRegistrationForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Estado del formulario
  const [form, setForm] = useState<MerchantApplicationInput>({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    whatsapp: "",
    category: "hotel",
    nit: "",
    rnt: "",
    camaraComercio: "",
    address: "",
    description: "",
    termsAccepted: false,
  });

  function set(field: keyof MerchantApplicationInput) {
    return (value: string | boolean) => setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setGlobalError(null);

    startTransition(async () => {
      const result = await submitMerchantApplication(form);
      if (result.success) {
        setSuccess(true);
        // Redirigir al turista/aliado a una página de espera
        setTimeout(() => router.push("/aliados/gracias"), 1500);
      } else {
        setGlobalError(result.error ?? "Error desconocido.");
        setFieldErrors(result.fieldErrors ?? {});
      }
    });
  }

  // ─── Pantalla de éxito ────────────────────────────────────────────────────
  if (success) {
    return (
      <SurfaceCard className="rounded-[30px] p-10 text-center">
        <p className="text-5xl">🎉</p>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">¡Solicitud enviada con éxito!</h2>
        <p className="mt-2 text-slate-500">
          El equipo de Portal Necoclí revisará tu información y te contactará en menos de 48 horas.
        </p>
        <p className="mt-1 text-sm text-teal-600 font-semibold">Redirigiendo...</p>
      </SurfaceCard>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <SurfaceCard className="rounded-[28px] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-1">
          Paso 1 · Datos del Negocio
        </p>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Información comercial</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <InputField
            id="businessName"
            label="Nombre del negocio"
            required
            placeholder="ej: Hotel Brisa Marina"
            value={form.businessName}
            onChange={set("businessName")}
            error={fieldErrors.businessName}
          />
          <InputField
            id="ownerName"
            label="Nombre del responsable"
            required
            placeholder="ej: Carlos Ruiz"
            value={form.ownerName}
            onChange={set("ownerName")}
            error={fieldErrors.ownerName}
          />
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={form.category}
              onChange={(e) => set("category")(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
            >
              {MERCHANT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <FieldError error={fieldErrors.category} />
          </div>
          <InputField
            id="address"
            label="Dirección del negocio"
            required
            placeholder="ej: Cra 1 #5-23, Necoclí, Antioquia"
            value={form.address}
            onChange={set("address")}
            error={fieldErrors.address}
          />
        </div>
        <div className="mt-5">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-slate-700 mb-1.5"
          >
            Descripción breve <span className="text-slate-400 font-normal">(opcional)</span>
          </label>
          <textarea
            id="description"
            rows={3}
            maxLength={500}
            placeholder="Cuéntanos qué ofreces (máx. 500 caracteres)..."
            value={form.description}
            onChange={(e) => set("description")(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100 resize-none"
          />
        </div>
      </SurfaceCard>

      <SurfaceCard className="rounded-[28px] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-1">
          Paso 2 · Contacto y Verificación Legal
        </p>
        <h2 className="text-xl font-bold text-slate-900 mb-6">Datos fiscales y de contacto</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <InputField
            id="email"
            label="Correo de la empresa"
            required
            type="email"
            placeholder="negocio@gmail.com"
            value={form.email}
            onChange={set("email")}
            error={fieldErrors.email}
            hint="Este correo recibirá las órdenes de turistas."
          />
          <InputField
            id="phone"
            label="Teléfono"
            required
            type="tel"
            placeholder="3001234567"
            value={form.phone}
            onChange={set("phone")}
            error={fieldErrors.phone}
            hint="10 dígitos, sin espacios ni guiones."
          />
          <InputField
            id="whatsapp"
            label="WhatsApp"
            type="tel"
            placeholder="3001234567"
            value={form.whatsapp ?? ""}
            onChange={set("whatsapp")}
            error={fieldErrors.whatsapp}
            hint="Si es diferente al teléfono."
          />
          <InputField
            id="nit"
            label="NIT"
            required
            placeholder="8128036-5"
            value={form.nit}
            onChange={set("nit")}
            error={fieldErrors.nit}
            hint="Con dígito de verificación (ej: 8128036-5)."
          />
          <InputField
            id="rnt"
            label="RNT (Registro Nacional de Turismo)"
            placeholder="232392"
            value={form.rnt ?? ""}
            onChange={set("rnt")}
            error={fieldErrors.rnt}
            hint="Si tu negocio es turístico (hotel, tour, etc.)."
          />
          <InputField
            id="camaraComercio"
            label="Cámara de Comercio"
            placeholder="ej: Medellín, matrícula 21-579544-01"
            value={form.camaraComercio ?? ""}
            onChange={set("camaraComercio")}
            error={fieldErrors.camaraComercio}
          />
        </div>
      </SurfaceCard>

      {/* Términos y condiciones con desglose de comisión */}
      <SurfaceCard className="rounded-[28px] p-6 sm:p-8 border-2 border-teal-100 bg-teal-50/50">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-3">
          Modelo de Comisión · Transparencia Total
        </p>
        <div className="grid gap-2 sm:grid-cols-3 mb-5">
          {[
            { cat: "🏨 Hoteles", rate: "10%" },
            { cat: "🍽️ Restaurantes", rate: "6%" },
            { cat: "🏝️ Tours", rate: "12%" },
            { cat: "🚕 Taxis", rate: "10%" },
            { cat: "📦 Domicilios", rate: "6%" },
            { cat: "🏪 Comercios", rate: "6%" },
          ].map((item) => (
            <div
              key={item.cat}
              className="flex justify-between rounded-xl bg-white border border-teal-100 px-4 py-2.5 text-sm"
            >
              <span className="text-slate-600">{item.cat}</span>
              <span className="font-bold text-teal-700">{item.rate}</span>
            </div>
          ))}
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            id="termsAccepted"
            checked={form.termsAccepted}
            onChange={(e) => set("termsAccepted")(e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-teal-600 shrink-0"
          />
          <span className="text-sm text-slate-700 leading-relaxed">
            Acepto las comisiones de la plataforma Portal Necoclí y entiendo que el portal opera
            bajo un <strong>modelo Escrow (depósito en garantía)</strong>. Los fondos son retenidos
            y liberados tras la confirmación del servicio.
          </span>
        </label>
        <FieldError error={fieldErrors.termsAccepted} />
      </SurfaceCard>

      {/* Error global */}
      {globalError && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
          ⚠️ {globalError}
        </p>
      )}

      {/* Botón de envío */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-teal-600 py-4 text-base font-bold text-white shadow-lg transition hover:bg-teal-700 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Enviando solicitud..." : "✅ Enviar Solicitud de Alianza"}
      </button>
      <p className="text-center text-xs text-slate-400">
        El equipo revisará tu solicitud en menos de 48 horas. NIT Kraken Digital Labs: 8128036-5
      </p>
    </form>
  );
}
