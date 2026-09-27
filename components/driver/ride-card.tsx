"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Ride } from "@/types/ride";
import { updateRideFareAction, cancelRideAction } from "@/lib/rides/ride-operations";
import { completeRideAction } from "@/lib/rides/ride-actions";

interface RideCardProps {
  ride: Ride;
  onAccept: (rideId: string) => void;
  isAccepting: boolean;
  walletBalance: number;
}

export function RideCard({ ride, onAccept, isAccepting, walletBalance }: RideCardProps) {
  const hasEnoughBalance = walletBalance >= ride.portal_commission;

  const [isPending, startTransition] = useTransition();
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [showUpdateFare, setShowUpdateFare] = useState(false);
  const [newFare, setNewFare] = useState(ride.base_price.toString());

  const handleComplete = () => {
    if (confirm("¿Confirmas que completaste esta carrera y recibiste el pago?")) {
      startTransition(async () => {
        const res = await completeRideAction(ride.id, ride.driver_id!);
        if (!res.success) alert(res.error);
      });
    }
  };

  const handleCancel = () => {
    if (!cancelReason) return alert("Selecciona un motivo válido.");
    startTransition(async () => {
      const res = await cancelRideAction(ride.id, cancelReason, "driver");
      if (!res.success) alert(res.error);
    });
  };

  const handleUpdateFare = () => {
    const val = parseInt(newFare);
    if (isNaN(val) || val < 1000) return alert("Monto inválido");
    startTransition(async () => {
      const res = await updateRideFareAction(ride.id, val);
      if (res.success) {
        setShowUpdateFare(false);
      } else {
        alert(res.error);
      }
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`rounded-3xl p-5 shadow-lg border ${
        ride.status === "ACCEPTED"
          ? "bg-[#1E293B] border-emerald-500/30"
          : "bg-[#2A2D35] border-white/5"
      }`}
    >
      {/* Destino */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{ride.status === "ACCEPTED" ? "🟢" : "📍"}</span>
          <h3 className="text-lg font-bold text-white">{ride.destination}</h3>
        </div>
        {ride.is_night_rate && (
          <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-amber-500/30">
            🌙 Noche
          </span>
        )}
      </div>

      {/* Origen */}
      <div className="mb-4">
        <p className="text-xs text-white/50 uppercase tracking-widest font-bold">Recoger en:</p>
        <p className="text-sm text-white font-medium">{ride.origin}</p>
      </div>

      {/* Precio */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold text-emerald-400">
          ${ride.final_price.toLocaleString("es-CO")}
        </span>
        {ride.is_night_rate && (
          <span className="text-xs text-white/40 line-through">
            ${ride.base_price.toLocaleString("es-CO")}
          </span>
        )}
        <span className="text-xs text-white/30">COP</span>

        {ride.status === "ACCEPTED" && !showUpdateFare && (
          <button
            onClick={() => setShowUpdateFare(true)}
            className="ml-auto text-xs text-blue-400 hover:underline"
          >
            ✏️ Reasignar Tarifa
          </button>
        )}
      </div>

      {/* Update Fare Form */}
      {showUpdateFare && (
        <div className="bg-white/5 p-3 rounded-xl mb-4 border border-white/10">
          <p className="text-xs text-white/70 mb-2">Ingresa el nuevo precio base (sin nocturno):</p>
          <div className="flex gap-2">
            <input
              type="number"
              value={newFare}
              onChange={(e) => setNewFare(e.target.value)}
              className="bg-black/30 border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 flex-1"
            />
            <button
              disabled={isPending}
              onClick={handleUpdateFare}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-500"
            >
              {isPending ? "..." : "Guardar"}
            </button>
            <button
              disabled={isPending}
              onClick={() => setShowUpdateFare(false)}
              className="bg-white/10 text-white px-3 py-1.5 rounded-lg text-xs hover:bg-white/20"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Detalles del cliente */}
      <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
        <span className="flex items-center gap-1">👤 {ride.client_name}</span>
        <span className="flex items-center gap-1">
          👥 {ride.passenger_count} {ride.passenger_count === 1 ? "pax" : "pax"}
        </span>
      </div>

      {ride.notes && (
        <p className="text-xs text-white/40 bg-white/5 rounded-xl px-3 py-2 mb-4">
          💬 {ride.notes}
        </p>
      )}

      {/* Comisión informativa */}
      {ride.status === "OPEN" && (
        <div className="flex items-center justify-between text-xs text-white/30 mb-4 px-1">
          <span>Comisión Portal: ${ride.portal_commission.toLocaleString("es-CO")}</span>
          <span>Neto: ${ride.driver_net.toLocaleString("es-CO")}</span>
        </div>
      )}

      {/* Botón de acción */}
      {ride.status === "OPEN" &&
        (hasEnoughBalance ? (
          <button
            onClick={() => onAccept(ride.id)}
            disabled={isAccepting}
            className="w-full py-4 bg-emerald-500 text-white font-bold text-lg rounded-2xl hover:bg-emerald-400 active:scale-[0.97] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/30 animate-pulse-soft"
          >
            {isAccepting ? "Asignando..." : "¡YO LA HAGO! 🚀"}
          </button>
        ) : (
          <div className="text-center">
            <p className="text-xs text-red-400 mb-2">
              Saldo insuficiente. Necesitas ${ride.portal_commission.toLocaleString("es-CO")} COP
            </p>
            <Link
              href="/driver/billetera"
              className="w-full inline-block py-3 bg-white/10 text-white/80 font-semibold rounded-2xl hover:bg-white/15 transition-colors text-sm"
            >
              Recargar Saldo →
            </Link>
          </div>
        ))}

      {/* Acciones de viaje en curso */}
      {ride.status === "ACCEPTED" && (
        <div className="space-y-3">
          <div className="flex flex-col gap-2">
            <a
              href={`tel:${ride.client_phone}`}
              className="flex-1 bg-white/10 border border-white/20 text-white text-center py-3 rounded-xl text-xs font-bold hover:bg-white/20"
            >
              📞 Llamar: {ride.client_phone}
            </a>
            <a
              href={`https://wa.me/57${ride.client_phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 bg-emerald-600/30 border border-emerald-500/50 text-emerald-400 text-center py-3 rounded-xl text-xs font-bold hover:bg-emerald-600/50"
            >
              💬 WhatsApp: {ride.client_phone}
            </a>
          </div>

          <button
            onClick={handleComplete}
            disabled={isPending}
            className="w-full py-4 bg-emerald-500 text-white font-black text-lg rounded-2xl hover:bg-emerald-400 shadow-lg shadow-emerald-500/30 disabled:opacity-50"
          >
            {isPending ? "Completando..." : "✅ FINALIZAR CARRERA"}
          </button>

          {!showCancel ? (
            <button
              onClick={() => setShowCancel(true)}
              className="w-full text-center py-2 text-xs font-bold text-red-400 hover:text-red-300"
            >
              Cancelar Carrera
            </button>
          ) : (
            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl">
              <p className="text-xs font-bold text-red-400 mb-2 uppercase">Motivo de Cancelación</p>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                disabled={isPending}
                className="w-full bg-black/40 text-white text-sm border border-red-500/20 rounded-lg p-2 mb-3 outline-none"
              >
                <option value="">Seleccionar...</option>
                <option value="Accidente">Accidente</option>
                <option value="Vehículo varado">Vehículo varado</option>
                <option value="Me paró el tránsito">Me paró el tránsito</option>
                <option value="No deseo atenderlo">No deseo atenderlo</option>
                <option value="El cliente no aparece">El cliente no aparece</option>
                <option value="Problemas con la tarifa">Problemas con la tarifa</option>
              </select>
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  disabled={isPending || !cancelReason}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-red-500 disabled:opacity-50"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setShowCancel(false)}
                  disabled={isPending}
                  className="flex-1 bg-white/10 text-white py-2 rounded-lg text-xs font-bold hover:bg-white/20"
                >
                  Volver
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
