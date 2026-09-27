"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { RideCard } from "@/components/driver/ride-card";
import type { Ride } from "@/types/ride";

interface RideBoardProps {
  rides: Ride[];
  walletBalance: number;
  onAcceptRide: (rideId: string) => Promise<void>;
}

/**
 * Tablero en tiempo real de carreras disponibles para el conductor.
 * En producción se alimentará con Firestore onSnapshot.
 */
export function RideBoard({ rides, walletBalance, onAcceptRide }: RideBoardProps) {
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  const openRides = rides.filter((r) => r.status === "OPEN");
  const activeRide = rides.find((r) => r.status === "ACCEPTED" || r.status === "IN_PROGRESS");
  const [completing, setCompleting] = useState(false);

  async function handleAccept(rideId: string) {
    setAcceptingId(rideId);
    try {
      await onAcceptRide(rideId);
    } catch (err) {
      console.error("Error aceptando carrera:", err);
    } finally {
      setAcceptingId(null);
    }
  }

  async function handleComplete() {
    if (!activeRide) return;
    setCompleting(true);
    try {
      const { completeRideAction } = await import("@/lib/rides/ride-actions");
      const res = await completeRideAction(activeRide.id, activeRide.driver_id!);
      if (!res.success) {
        alert("Error al completar: " + res.error);
      } else {
        alert("¡Carrera Completada Exitosamente!");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCompleting(false);
    }
  }

  if (activeRide) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2 px-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-widest">
            Carrera en Curso
          </h2>
        </div>
        <RideCard
          ride={activeRide}
          onAccept={handleAccept}
          isAccepting={false}
          walletBalance={walletBalance}
        />
      </div>
    );
  }

  if (openRides.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-4">🏖️</span>
        <h3 className="text-xl font-bold text-white/80 mb-2">Sin carreras por ahora</h3>
        <p className="text-sm text-white/40 max-w-xs">
          Mantén esta pantalla abierta. Las nuevas carreras aparecerán automáticamente aquí.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1 mb-2">
        <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">
          🛺 Carreras Disponibles
        </h2>
        <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full">
          {openRides.length} {openRides.length === 1 ? "nueva" : "nuevas"}
        </span>
      </div>

      <AnimatePresence mode="popLayout">
        {openRides.map((ride) => (
          <RideCard
            key={ride.id}
            ride={ride}
            onAccept={handleAccept}
            isAccepting={acceptingId === ride.id}
            walletBalance={walletBalance}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
