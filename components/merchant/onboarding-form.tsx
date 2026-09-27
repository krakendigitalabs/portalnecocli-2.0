"use client";

import { useState } from "react";
import {
  UploadCloud,
  CheckCircle2,
  Building2,
  Tag,
  FileText,
  ChevronRight,
  CreditCard,
} from "lucide-react";
import { SurfaceCard } from "@/components/ui/surface-card";

type OnboardingFormProps = {
  userEmail: string;
  userName: string;
};

const CATEGORIES = [
  "Hotel / Hospedaje",
  "Transporte Turístico",
  "Restaurante / Alimentos",
  "Panadería",
  "Droguería",
  "Ferretería",
  "Tour Operador",
  "Otro",
];

export function OnboardingForm({ userEmail, userName }: OnboardingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simular guardado en backend
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <SurfaceCard className="p-12 text-center rounded-[32px] overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-teal/10 via-transparent to-transparent" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-teal" />
          </div>
          <h2 className="text-3xl font-bold text-ink mb-4">¡Solicitud Enviada con Éxito!</h2>
          <p className="text-ink/70 max-w-md mx-auto mb-8 text-lg">
            Hemos recibido los datos de tu comercio y el RUT. Nuestro equipo de Kraken Digital Labs
            verificará la información y activará tu panel de Merchant en las próximas 24 horas.
          </p>
          <a
            href="/merchant"
            className="bg-teal hover:bg-teal/90 text-white font-bold py-4 px-10 rounded-full transition-all shadow-soft text-sm uppercase tracking-wider"
          >
            Ir a mi perfil
          </a>
        </div>
      </SurfaceCard>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Sección 1: Datos Básicos */}
      <SurfaceCard className="p-8 rounded-[32px] border border-ink/5 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-coral/10 p-2.5 rounded-xl">
            <Building2 className="w-5 h-5 text-coral" />
          </div>
          <h3 className="text-xl font-bold text-ink">Información del Negocio</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-ink/80 uppercase tracking-wide">
              Nombre Completo del Comercio
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Hotel Las Palmas"
              className="w-full bg-sand/50 border border-ink/10 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-ink/80 uppercase tracking-wide">
              Categoría
            </label>
            <select
              required
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-sand/50 border border-ink/10 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all appearance-none"
            >
              <option value="" disabled>
                Selecciona el rubro principal
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-ink/80 uppercase tracking-wide">
              Teléfono de Contacto
            </label>
            <input
              type="tel"
              required
              placeholder="Ej: +57 300 000 0000"
              className="w-full bg-sand/50 border border-ink/10 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-ink/80 uppercase tracking-wide">
              Correo Electrónico Oficial
            </label>
            <input
              type="email"
              required
              defaultValue={userEmail}
              className="w-full bg-sand/50 border border-ink/10 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-semibold text-ink/80 uppercase tracking-wide">
              Dirección Física en Necoclí
            </label>
            <input
              type="text"
              required
              placeholder="Ej: Calle 50 #40-20, Barrio El Pescador"
              className="w-full bg-sand/50 border border-ink/10 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
            />
          </div>
        </div>
      </SurfaceCard>

      {/* Sección 2: Datos Bancarios (Payout Escrow) */}
      <SurfaceCard className="p-8 rounded-[32px] border border-ink/5 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-green-500/10 p-2.5 rounded-xl">
            <CreditCard className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-ink">Datos Bancarios para Pagos</h3>
            <p className="text-sm text-ink/60 mt-1">
              Aquí transferiremos el dinero de tus reservas (Sistema Escrow).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-ink/80 uppercase tracking-wide">
              Banco o Entidad
            </label>
            <select
              required
              className="w-full bg-sand/50 border border-ink/10 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all appearance-none"
            >
              <option value="" disabled selected>
                Selecciona tu banco
              </option>
              <option value="nequi">Nequi</option>
              <option value="bancolombia">Bancolombia (Ahorros)</option>
              <option value="bancolombia_corriente">Bancolombia (Corriente)</option>
              <option value="daviplata">Daviplata</option>
              <option value="davivienda">Davivienda</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-ink/80 uppercase tracking-wide">
              Número de Cuenta
            </label>
            <input
              type="text"
              required
              placeholder="Ej: 300 000 0000"
              className="w-full bg-sand/50 border border-ink/10 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
            />
          </div>
        </div>
      </SurfaceCard>

      {/* Sección 3: Oferta y Gancho */}
      <SurfaceCard className="p-8 rounded-[32px] border border-ink/5 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-amber-400/20 p-2.5 rounded-xl">
            <Tag className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-ink">Oferta Gancho (Promoción)</h3>
            <p className="text-sm text-ink/60 mt-1">
              Atrae a tu primer cliente con un combo o promoción especial diaria.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-ink/80 uppercase tracking-wide">
            ¿Cuál será tu oferta especial inicial?
          </label>
          <textarea
            required
            rows={3}
            placeholder="Ej: Si reservas 2 noches, te incluimos desayuno gratis. / Combo familiar de 4 almuerzos por el precio de 3."
            className="w-full bg-sand/50 border border-ink/10 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all resize-none"
          />
        </div>
      </SurfaceCard>

      {/* Sección 4: Documentación Legal y Visual */}
      <SurfaceCard className="p-8 rounded-[32px] border border-ink/5 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-ink/5 p-2.5 rounded-xl">
            <FileText className="w-5 h-5 text-ink" />
          </div>
          <h3 className="text-xl font-bold text-ink">Verificación y Marca</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logo Upload */}
          <div className="border-2 border-dashed border-ink/15 rounded-3xl p-6 flex flex-col items-center justify-center text-center hover:bg-ink/[0.02] transition-colors cursor-pointer group">
            <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6 text-teal" />
            </div>
            <h4 className="font-bold text-ink mb-1">Logo del Comercio</h4>
            <p className="text-xs text-ink/50 mb-4">PNG, JPG hasta 5MB</p>
            <input
              type="file"
              accept="image/*"
              className="text-sm text-ink/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-teal/10 file:text-teal hover:file:bg-teal/20"
            />
          </div>

          {/* RUT Upload */}
          <div className="border-2 border-dashed border-ink/15 rounded-3xl p-6 flex flex-col items-center justify-center text-center hover:bg-ink/[0.02] transition-colors cursor-pointer group">
            <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-coral" />
            </div>
            <h4 className="font-bold text-ink mb-1">RUT o Cámara de Comercio</h4>
            <p className="text-xs text-ink/50 mb-4">PDF obligatorio para pagos Escrow</p>
            <input
              type="file"
              required
              accept=".pdf,image/*"
              className="text-sm text-ink/60 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-coral/10 file:text-coral hover:file:bg-coral/20"
            />
          </div>
        </div>
      </SurfaceCard>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-ink hover:bg-ink/90 text-white font-bold py-4 px-10 rounded-full transition-all shadow-xl hover:shadow-2xl flex items-center gap-3 group disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span>Procesando solicitud...</span>
          ) : (
            <>
              <span>Enviar Solicitud de Afiliación</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
