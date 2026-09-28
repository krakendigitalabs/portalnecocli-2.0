"use client";

import { useState, useEffect, useCallback } from "react";
import { RideBoard } from "@/components/driver/ride-board";
import { WalletSummary } from "@/components/driver/wallet-summary";
import type { Ride } from "@/types/ride";
import { doc, updateDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";

import { useAvailableRides } from "@/lib/rides/use-rides";
import { acceptRideAction } from "@/lib/rides/ride-actions";

export function DriverDashboardClient({
  driverId,
  initialDriverName,
  initialWalletBalance,
  initialRidesCompleted,
  initialDriverStatus,
}: {
  driverId: string;
  initialDriverName: string;
  initialWalletBalance: number;
  initialRidesCompleted: number;
  initialDriverStatus: string;
}) {
  const { rides: liveRides, loading } = useAvailableRides(driverId);

  const [driverName] = useState(initialDriverName || "Conductor Nuevo");
  const [walletBalance, setWalletBalance] = useState(initialWalletBalance || 0);
  const [ridesCompleted] = useState(initialRidesCompleted || 0);
  const [isOnline, setIsOnline] = useState(true);

  const activeRide = liveRides.find((r) => r.status === "ACCEPTED" || r.status === "IN_PROGRESS");

  useEffect(() => {
    if (!isOnline || !activeRide) return;

    let watchId: number;
    const db = getFirebaseDb();
    if (!db) return;

    const rideRef = doc(db, "rides", activeRide.id);

    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Actualizamos directamente en Firestore sin pasar por un server action pesado
          updateDoc(rideRef, {
            driver_location: { lat: latitude, lng: longitude }
          }).catch(e => console.warn("No se pudo actualizar ubicación en vivo", e));
        },
        (error) => {
          console.warn("Error en GPS background:", error);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
      );
    }

    return () => {
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isOnline, activeRide?.id]);

  const handleAcceptRide = useCallback(async (rideId: string) => {
    // Llamada real al Server Action atómico (Fase 1: Desacoplado de UI)
    const res = await acceptRideAction(rideId, driverId);
    if (!res.success) {
      alert("Error al aceptar: " + res.error);
    }
    // Fase 3: Transición suave, el onSnapshot actualizará la UI instantáneamente sin alertas bloqueantes
  }, [driverId]);

  const toggleOnline = () => {
    setIsOnline(!isOnline);
    // Inicializar AudioContext en interacción del usuario para saltar política de Autoplay de Safari/Chrome
    if (!isOnline && typeof window !== "undefined") {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx && !(window as any).globalAudioContext) {
          const ctx = new AudioCtx();
          ctx.resume();
          (window as any).globalAudioContext = ctx;
        } else if ((window as any).globalAudioContext) {
          (window as any).globalAudioContext.resume();
        }
      } catch (e) {
        console.warn("No se pudo inicializar AudioContext", e);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1D23] text-white pb-24">
      {/* Header fijo */}
      <header className="sticky top-0 z-50 bg-[#1A1D23]/95 backdrop-blur-md border-b border-white/5 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <p className="text-xs text-white/40 font-medium">Neco-Dispatch</p>
            <p className="text-sm font-bold">{driverName}</p>
          </div>
          <button
            onClick={toggleOnline}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
              isOnline
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-white/10 text-white/50 border border-white/10"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-400 animate-pulse" : "bg-white/30"}`}
            />
            {isOnline ? "En Línea" : "Desconectado"}
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* Billetera */}
        <WalletSummary
          balance={walletBalance}
          ridesCompleted={ridesCompleted}
          totalEarnings={walletBalance}
        />

        {/* Tablero de carreras */}
        {initialDriverStatus === "pending_approval" ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-[#2A2D35] rounded-3xl p-6 border border-amber-500/30">
            <span className="text-5xl mb-4">⏳</span>
            <h3 className="text-xl font-bold text-amber-400 mb-2">Cuenta en Revisión</h3>
            <p className="text-sm text-white/70 max-w-xs">
              Tu solicitud está siendo revisada por nuestro equipo. Te notificaremos cuando tu
              cuenta esté activa para empezar a recibir carreras.
            </p>
          </div>
        ) : isOnline ? (
          <RideBoard rides={liveRides} walletBalance={walletBalance} onAcceptRide={handleAcceptRide} />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4 opacity-30">😴</span>
            <h3 className="text-lg font-bold text-white/40 mb-2">Estás desconectado</h3>
            <p className="text-sm text-white/25 max-w-xs">
              Activa tu estado &quot;En Línea&quot; para ver y aceptar carreras.
            </p>
          </div>
        )}
      </main>

    </div>
  );
}
