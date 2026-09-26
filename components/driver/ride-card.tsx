"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { Ride } from "@/types/ride";

interface RideCardProps {
  ride: Ride;
  onAccept: (rideId: string) => void;
  isAccepting: boolean;
  walletBalance: number;
}

export function RideCard({ ride, onAccept, isAccepting, walletBalance }: RideCardProps) {
  const hasEnoughBalance = walletBalance >= ride.portal_commission;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-[#2A2D35] rounded-3xl p-5 border border-white/5 shadow-lg"
    >
      {/* Destino */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📍</span>
          <h3 className="text-lg font-bold text-white">{ride.destination}</h3>
        </div>
        {ride.is_night_rate && (
          <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-amber-500/30">
            🌙 Noche
          </span>
        )}
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
      </div>

      {/* Detalles del cliente */}
      <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
        <span className="flex items-center gap-1">
          👤 {ride.client_name}
        </span>
        <span className="flex items-center gap-1">
          👥 {ride.passenger_count} {ride.passenger_count === 1 ? "pasajero" : "pasajeros"}
        </span>
      </div>

      {ride.notes && (
        <p className="text-xs text-white/40 bg-white/5 rounded-xl px-3 py-2 mb-4">
          💬 {ride.notes}
        </p>
      )}

      {/* Comisión informativa */}
      <div className="flex items-center justify-between text-xs text-white/30 mb-4 px-1">
        <span>Comisión Portal: ${ride.portal_commission.toLocaleString("es-CO")}</span>
        <span>Neto: ${ride.driver_net.toLocaleString("es-CO")}</span>
      </div>

      {/* Botón de acción */}
      {hasEnoughBalance ? (
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
          <button className="w-full py-3 bg-white/10 text-white/80 font-semibold rounded-2xl hover:bg-white/15 transition-colors text-sm">
            Recargar Saldo →
          </button>
        </div>
      )}
    </motion.div>
  );
}
