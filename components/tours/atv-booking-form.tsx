"use client";

import { useState, useTransition } from "react";
import { processAtvBooking } from "@/app/actions/atv-booking";
import type { AtvRoute, AtvRouteDetail, AtvRider } from "@/types/atv-booking";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

interface AtvBookingFormProps {
  route: AtvRouteDetail;
  onClose: () => void;
}

const emptyRider = (): AtvRider => ({
  fullName: "",
  cedula: "",
  bloodType: "",
  phone: "",
  email: "",
});

function getTomorrowDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0] ?? "";
}

export function AtvBookingForm({ route, onClose }: AtvBookingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [riders, setRiders] = useState<AtvRider[]>([emptyRider()]);
  const [tourDate, setTourDate] = useState(getTomorrowDate());
  const [successTicket, setSuccessTicket] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const riderCount = riders.length;
  // Price is per 2 people — scale for actual count (ceil to pairs)
  const pairsNeeded = Math.ceil(riderCount / 2);
  const totalPrice = route.isExtremeRoute ? 0 : route.priceForTwo * pairsNeeded;
  const depositAmount = Math.round(totalPrice * 0.5);

  function updateRider(index: number, field: keyof AtvRider, value: string) {
    setRiders((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)),
    );
  }

  function addRider() {
    if (riders.length < 10) {
      setRiders((prev) => [...prev, emptyRider()]);
    }
  }

  function removeRider(index: number) {
    if (riders.length > 1) {
      setRiders((prev) => prev.filter((_, i) => i !== index));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    startTransition(async () => {
      const result = await processAtvBooking({
        route: route.id as AtvRoute,
        tourDate,
        riders,
        totalPrice,
        depositAmount,
      });

      if (result.success) {
        setSuccessTicket(result.ticketId);
      } else {
        setErrorMsg(result.error);
      }
    });
  }

  if (successTicket) {
    return (
      <div className="text-center py-8 px-4">
        <div className="text-6xl mb-4">🏍️</div>
        <h3 className="text-2xl font-bold text-amber-700 mb-2">¡Pre-reserva confirmada!</h3>
        <p className="text-slate-600 mb-6">Tu código de reserva es:</p>
        <div className="bg-amber-50 border-2 border-dashed border-amber-400 rounded-2xl py-6 px-8 mb-6 inline-block">
          <span className="text-3xl font-black text-amber-900 tracking-widest">{successTicket}</span>
        </div>
        <p className="text-sm text-slate-500 mb-2">
          Hemos enviado los detalles a tu correo con las instrucciones de pago.
        </p>
        <p className="text-sm font-semibold text-amber-700 mb-6">
          Recuerda enviar el anticipo del 50% para asegurar tu cupo.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-3 rounded-full transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-200"
        >
          Cerrar
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Route summary */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🗺️</span>
          <div>
            <p className="font-bold text-amber-900">Ruta {route.number}: {route.title}</p>
            <p className="text-sm text-amber-700">{route.duration}</p>
            {route.isExtremeRoute ? (
              <p className="text-sm font-semibold text-red-600 mt-1">⚡ Ruta extrema — precio a convenir</p>
            ) : (
              <p className="text-sm text-amber-700 mt-1">
                Valor base (2 personas):{" "}
                <span className="font-bold">${route.priceForTwo.toLocaleString("es-CO")} COP</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Date */}
      <div>
        <label htmlFor="atv-tour-date" className="block text-sm font-semibold text-slate-700 mb-1">
          📅 Fecha del Tour <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-slate-500 mb-2">Mínimo 1 día de anticipación</p>
        <input
          id="atv-tour-date"
          type="date"
          required
          value={tourDate}
          min={getTomorrowDate()}
          onChange={(e) => setTourDate(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
        />
      </div>

      {/* Riders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-slate-700">
              🏍️ Pilotos <span className="text-red-500">*</span>
            </p>
            <p className="text-xs text-slate-500">Cada persona requiere póliza individual</p>
          </div>
          {riders.length < 10 && (
            <button
              type="button"
              onClick={addRider}
              className="text-xs bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
            >
              <span>+</span> Agregar piloto
            </button>
          )}
        </div>

        <div className="space-y-4">
          {riders.map((rider, index) => (
            <div
              key={`rider-${index}`}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">
                  Piloto {index + 1}
                </span>
                {riders.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRider(index)}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold"
                  >
                    Eliminar
                  </button>
                )}
              </div>

              {/* Full name */}
              <div>
                <label
                  htmlFor={`rider-name-${index}`}
                  className="block text-xs font-semibold text-slate-600 mb-1"
                >
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  id={`rider-name-${index}`}
                  type="text"
                  required
                  value={rider.fullName}
                  onChange={(e) => updateRider(index, "fullName", e.target.value)}
                  placeholder="Ej: Juan Carlos Martínez López"
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all bg-white"
                />
              </div>

              {/* Cédula & Blood type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor={`rider-cedula-${index}`}
                    className="block text-xs font-semibold text-slate-600 mb-1"
                  >
                    N.° Cédula <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={`rider-cedula-${index}`}
                    type="text"
                    required
                    value={rider.cedula}
                    onChange={(e) => updateRider(index, "cedula", e.target.value)}
                    placeholder="12345678"
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all bg-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`rider-blood-${index}`}
                    className="block text-xs font-semibold text-slate-600 mb-1"
                  >
                    Tipo de sangre <span className="text-red-500">*</span>
                  </label>
                  <select
                    id={`rider-blood-${index}`}
                    required
                    value={rider.bloodType}
                    onChange={(e) => updateRider(index, "bloodType", e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all bg-white"
                  >
                    <option value="">Seleccionar</option>
                    {BLOOD_TYPES.map((bt) => (
                      <option key={bt} value={bt}>
                        {bt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optional: phone & email (only first rider) */}
              {index === 0 && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="rider-phone-0"
                      className="block text-xs font-semibold text-slate-600 mb-1"
                    >
                      Teléfono <span className="text-slate-400">(opcional)</span>
                    </label>
                    <input
                      id="rider-phone-0"
                      type="tel"
                      value={rider.phone}
                      onChange={(e) => updateRider(0, "phone", e.target.value)}
                      placeholder="3XX XXX XXXX"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="rider-email-0"
                      className="block text-xs font-semibold text-slate-600 mb-1"
                    >
                      Correo <span className="text-slate-400">(para confirmación)</span>
                    </label>
                    <input
                      id="rider-email-0"
                      type="email"
                      value={rider.email}
                      onChange={(e) => updateRider(0, "email", e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Price summary */}
      {!route.isExtremeRoute && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-2">
          <p className="text-sm font-bold text-green-800">💰 Resumen de pago</p>
          <div className="flex justify-between text-sm text-green-700">
            <span>Pilotos: {riderCount} · Parejas: {pairsNeeded}</span>
            <span className="font-bold">${totalPrice.toLocaleString("es-CO")} COP</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-amber-700 border-t border-green-200 pt-2">
            <span>Anticipo requerido (50%)</span>
            <span>${depositAmount.toLocaleString("es-CO")} COP</span>
          </div>
          <p className="text-xs text-green-600">El saldo restante se paga el día del tour.</p>
        </div>
      )}

      {/* Included notice */}
      <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl p-3">
        <span className="text-lg">🛡️</span>
        <p className="text-xs text-blue-700">
          <strong>Incluido:</strong> Casco, gafas y póliza de accidente para cada piloto.
          {route.includesLunch && " · 🍽️ Almuerzo incluido en esta ruta."}
        </p>
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-200 text-base"
      >
        {isPending ? "Procesando reserva…" : "Confirmar Pre-reserva 🏍️"}
      </button>
      <p className="text-xs text-center text-slate-400">
        Al reservar aceptas los términos y la política de cancelación del tour.
      </p>
    </form>
  );
}
