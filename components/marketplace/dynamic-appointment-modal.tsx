"use client";

import { useState } from "react";

interface ModalProps {
  businessName: string;
  category: string; 
  isOpen: boolean;
  onClose: () => void;
}

export function DynamicAppointmentModal({ businessName, category, isOpen, onClose }: ModalProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    servicio: "",
    fecha: "",
    lugarAtencion: "En Local",
    origen: "",
    destino: "",
  });

  if (!isOpen) return null;

  const categoryLower = category?.toLowerCase() || "";
  const isBeauty = categoryLower.includes("peluqueria") || categoryLower.includes("belleza") || categoryLower.includes("estetica");
  const isTransport = categoryLower.includes("motocarro") || categoryLower.includes("transporte") || categoryLower.includes("taxi") || categoryLower.includes("motonecos");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          businessName, 
          category,
          ...form
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        throw new Error("Error en servidor");
      }
    } catch {
      alert("Hubo un error al enviar la solicitud. Por favor intenta de nuevo.");
      setStatus("idle");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] max-w-lg w-full p-6 md:p-8 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 font-bold text-xl">✕</button>

        <h3 className="text-2xl font-bold text-ink mb-1">{businessName}</h3>
        <p className="text-xs text-slate-500 mb-6">Completa tus datos para coordinar tu servicio.</p>

        {status === "success" ? (
          <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl text-center font-medium border border-emerald-200 animate-in zoom-in duration-300">
            ✅ Solicitud recibida con éxito. El negocio se pondrá en contacto contigo pronto.
            <button
              onClick={onClose}
              className="mt-4 w-full bg-emerald-600 text-white font-bold py-2 rounded-xl text-sm"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* CAMPOS BÁSICOS */}
            <div>
              <label htmlFor="nombre" className="block text-xs font-bold uppercase text-slate-600 mb-1">Nombre Completo *</label>
              <input id="nombre" type="text" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-teal outline-none transition-all" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="telefono" className="block text-xs font-bold uppercase text-slate-600 mb-1">Teléfono / WhatsApp *</label>
                <input id="telefono" type="tel" required value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-teal outline-none transition-all" />
              </div>
              <div>
                <label htmlFor="correo" className="block text-xs font-bold uppercase text-slate-600 mb-1">Correo Electrónico</label>
                <input id="correo" type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-teal outline-none transition-all" />
              </div>
            </div>

            {/* DINÁMICO: PELUQUERÍA / ESTÉTICA */}
            {isBeauty && (
              <>
                <div>
                  <label htmlFor="servicio" className="block text-xs font-bold uppercase text-slate-600 mb-1">Servicio Solicitado *</label>
                  <input id="servicio" type="text" required placeholder="Ej: Corte, Tinte, Manicure..." value={form.servicio} onChange={(e) => setForm({ ...form, servicio: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-teal outline-none transition-all" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fecha" className="block text-xs font-bold uppercase text-slate-600 mb-1">Fecha deseada *</label>
                    <input id="fecha" type="date" required value={form.fecha} onChange={(e) => setForm({ ...form, fecha: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-teal outline-none transition-all" />
                  </div>
                  <div>
                    <label htmlFor="lugarAtencion" className="block text-xs font-bold uppercase text-slate-600 mb-1">Lugar de Atención *</label>
                    <select id="lugarAtencion" value={form.lugarAtencion} onChange={(e) => setForm({ ...form, lugarAtencion: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-teal outline-none transition-all bg-white">
                      <option value="En Local">En el Local</option>
                      <option value="A Domicilio">A Domicilio</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {/* DINÁMICO: MOTOCARROS / TRANSPORTE */}
            {isTransport && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="origen" className="block text-xs font-bold uppercase text-slate-600 mb-1">Punto de Recogida *</label>
                  <input id="origen" type="text" required placeholder="Ej: Hotel / Centro" value={form.origen} onChange={(e) => setForm({ ...form, origen: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-teal outline-none transition-all" />
                </div>
                <div>
                  <label htmlFor="destino" className="block text-xs font-bold uppercase text-slate-600 mb-1">Destino *</label>
                  <input id="destino" type="text" required placeholder="Ej: Muelle / Playa" value={form.destino} onChange={(e) => setForm({ ...form, destino: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-teal outline-none transition-all" />
                </div>
              </div>
            )}

            {/* DINÁMICO: GENERAL (Si no es belleza ni transporte) */}
            {!isBeauty && !isTransport && (
              <div>
                <label htmlFor="mensaje" className="block text-xs font-bold uppercase text-slate-600 mb-1">Servicio / Mensaje *</label>
                <textarea id="mensaje" required rows={3} value={form.servicio} onChange={(e) => setForm({ ...form, servicio: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:border-teal outline-none transition-all" placeholder="Cuéntanos qué necesitas..."></textarea>
              </div>
            )}

            <button type="submit" disabled={status === "submitting"} className="w-full bg-teal text-white font-bold py-3.5 rounded-full hover:bg-teal/90 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
              {status === "submitting" ? (
                <> <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enviando... </>
              ) : (
                "Confirmar Solicitud →"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}