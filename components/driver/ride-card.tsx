"use client";

import { useState, useTransition, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import type { Ride } from "@/types/ride";
import { updateRideFareAction, cancelRideAction } from "@/lib/rides/ride-operations";
import { completeRideAction, startRideAction } from "@/lib/rides/ride-actions";
import { SwipeButton } from "@/components/ui/swipe-button";

interface RideCardProps {
  ride: Ride;
  onAccept: (rideId: string) => void;
  isAccepting: boolean;
  walletBalance: number;
}

export const RideCard = memo(function RideCard({ ride, onAccept, isAccepting, walletBalance }: RideCardProps) {
  const hasEnoughBalance = walletBalance >= ride.portal_commission;

  const [isPending, startTransition] = useTransition();
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const [showUpdateFare, setShowUpdateFare] = useState(false);
  const [newFare, setNewFare] = useState(ride.base_price.toString());

  const handleStartRide = () => {
    startTransition(async () => {
      const res = await startRideAction(ride.id, ride.driver_id!);
      if (!res.success) alert(res.error);
    });
  };

  const handleComplete = () => {
    startTransition(async () => {
      const res = await completeRideAction(ride.id, ride.driver_id!);
      if (!res.success) alert(res.error);
    });
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

  const renderLocation = (loc: string, isDest: boolean) => {
    if (loc.includes(" - GPS: ")) {
      const [address, gps] = loc.split(" - GPS: ");
      return (
        <div className="flex flex-col">
          <span className={isDest ? "text-lg font-bold text-white leading-tight" : "text-sm text-white font-medium leading-tight"}>{address}</span>
          <span className="text-[10px] text-white/30 font-mono mt-0.5">GPS: {gps}</span>
        </div>
      );
    }
    return <span className={isDest ? "text-lg font-bold text-white" : "text-sm text-white font-medium"}>{loc}</span>;
  };

  const extractGps = (loc: string) => {
    if (loc.includes(" - GPS: ")) {
      const gps = loc.split(" - GPS: ")[1];
      const coords = gps.split(", ");
      if (coords.length === 2) return { lat: coords[0], lng: coords[1] };
    } else if (loc.startsWith("GPS: ")) {
      const gps = loc.replace("GPS: ", "");
      const coords = gps.split(", ");
      if (coords.length === 2) return { lat: coords[0], lng: coords[1] };
    }
    return null;
  };

  const originCoords = extractGps(ride.origin);
  const destCoords = extractGps(ride.destination);

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
        <div className="flex items-start gap-2">
          <span className="text-xl mt-0.5">{ride.status === "ACCEPTED" ? "🟢" : "📍"}</span>
          {renderLocation(ride.destination, true)}
        </div>
        {ride.is_night_rate && (
          <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-amber-500/30 shrink-0">
            🌙 Noche
          </span>
        )}
      </div>

      {/* Origen */}
      <div className="mb-4 pl-7">
        <p className="text-xs text-white/50 uppercase tracking-widest font-bold mb-1">Recoger en:</p>
        {renderLocation(ride.origin, false)}
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
          <div className="pt-2">
            <SwipeButton 
              onConfirm={() => onAccept(ride.id)} 
              text="DESLIZA PARA ACEPTAR 🚀" 
              disabled={isAccepting} 
              isPending={isAccepting} 
              theme="emerald" 
            />
          </div>
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
      {(ride.status === "ACCEPTED" || ride.status === "IN_PROGRESS") && (
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

          {/* Navegación con Waze */}
          {(originCoords && ride.status === "ACCEPTED") && (
            <a
              href={`https://waze.com/ul?ll=${originCoords.lat},${originCoords.lng}&navigate=yes`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#0099FF]/20 border border-[#0099FF]/50 text-[#0099FF] rounded-xl text-xs font-bold hover:bg-[#0099FF]/30 transition-all"
            >
              🗺️ Navegar a Recogida (Waze)
            </a>
          )}
          
          {(destCoords && ride.status === "IN_PROGRESS") && (
            <a
              href={`https://waze.com/ul?ll=${destCoords.lat},${destCoords.lng}&navigate=yes`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-purple-500/20 border border-purple-500/50 text-purple-400 rounded-xl text-xs font-bold hover:bg-purple-500/30 transition-all"
            >
              🗺️ Navegar al Destino (Waze)
            </a>
          )}

          {ride.status === "ACCEPTED" && (
            <div className="pt-2">
              <SwipeButton 
                onConfirm={handleStartRide} 
                text="DESLIZA SI RECOGISTE" 
                disabled={isPending} 
                isPending={isPending} 
                theme="teal" 
              />
            </div>
          )}

          {ride.status === "IN_PROGRESS" && (
            <div className="pt-2">
              <SwipeButton 
                onConfirm={handleComplete} 
                text="DESLIZA PARA FINALIZAR" 
                disabled={isPending} 
                isPending={isPending} 
                theme="blue" 
              />
            </div>
          )}

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

      {/* Manejo del estado CANCELADO por el cliente */}
      {ride.status === "CANCELLED" && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-center space-y-2">
          <p className="text-2xl">⚠️</p>
          <p className="text-sm font-bold text-red-400">VIAJE CANCELADO</p>
          <p className="text-xs text-white/60">
            {ride.cancellation_reason || "El pasajero ha cancelado esta carrera."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 w-full py-2 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-colors"
          >
            Entendido
          </button>
        </div>
      )}
    </motion.div>
  );
});
