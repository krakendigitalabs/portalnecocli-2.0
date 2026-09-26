"use client";

import { useState } from "react";
import { RideBoard } from "@/components/driver/ride-board";
import { WalletSummary } from "@/components/driver/wallet-summary";
import type { Ride } from "@/types/ride";

/**
 * Demo data para visualizar el tablero del conductor.
 * En producción se reemplazará con Firestore onSnapshot listener.
 */
const DEMO_RIDES: Ride[] = [
  {
    id: "ride_001",
    origin: "Centro de Necoclí",
    destination: "Marimonda",
    route_key: "via_san_sebastian",
    base_price: 66000,
    is_night_rate: true,
    final_price: 132000,
    portal_commission: 13200,
    driver_net: 118800,
    client_name: "Juan Pérez",
    client_phone: "312-555-1234",
    status: "OPEN",
    source: "chatbot",
    created_at: new Date().toISOString(),
    passenger_count: 3,
    vehicle_type_requested: "motocarro",
    notes: "Llevan 2 maletas grandes",
  },
  {
    id: "ride_002",
    origin: "Centro de Necoclí",
    destination: "Totumo",
    route_key: "via_totumo",
    base_price: 27500,
    is_night_rate: false,
    final_price: 27500,
    portal_commission: 2750,
    driver_net: 24750,
    client_name: "María González",
    client_phone: "310-888-5678",
    status: "OPEN",
    source: "web_form",
    created_at: new Date().toISOString(),
    passenger_count: 1,
    vehicle_type_requested: "motocarro",
  },
  {
    id: "ride_003",
    origin: "Aeropuerto",
    destination: "Hotel Centro",
    route_key: "urbano",
    base_price: 6600,
    is_night_rate: false,
    final_price: 6600,
    portal_commission: 660,
    driver_net: 5940,
    client_name: "Carlos Ríos",
    client_phone: "300-111-2222",
    status: "OPEN",
    source: "phone",
    created_at: new Date().toISOString(),
    passenger_count: 2,
    vehicle_type_requested: "motocarro",
  },
];

export function DriverDashboardClient() {
  const [rides, setRides] = useState<Ride[]>(DEMO_RIDES);
  const [driverName] = useState("Carlos 'La Fiera'");
  const [walletBalance] = useState(15400);
  const [isOnline, setIsOnline] = useState(true);

  async function handleAcceptRide(rideId: string) {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 800));

    setRides((prev) =>
      prev.map((r) =>
        r.id === rideId
          ? { ...r, status: "ACCEPTED" as const, driver_id: "drv_demo", driver_name: driverName }
          : r,
      ),
    );
  }

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
            onClick={() => setIsOnline(!isOnline)}
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
        <WalletSummary balance={walletBalance} ridesCompleted={47} totalEarnings={2_340_000} />

        {/* Tablero de carreras */}
        {isOnline ? (
          <RideBoard rides={rides} walletBalance={walletBalance} onAcceptRide={handleAcceptRide} />
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

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-[#1A1D23]/95 backdrop-blur-md border-t border-white/5 z-50">
        <div className="max-w-lg mx-auto flex items-center justify-around py-3">
          {[
            { icon: "🏠", label: "Inicio", active: true },
            { icon: "📊", label: "Historial", active: false },
            { icon: "💳", label: "Billetera", active: false },
            { icon: "👤", label: "Perfil", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex flex-col items-center gap-0.5 text-xs ${
                item.active ? "text-teal-400" : "text-white/30"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
