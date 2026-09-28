"use client";

import { useEffect, useState, useTransition } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import type { Ride } from "@/types/ride";
import { SurfaceCard } from "@/components/ui/surface-card";
import Link from "next/link";
import { cancelRideAction } from "@/lib/rides/ride-operations";
import dynamic from "next/dynamic";

const DriverTrackingMap = dynamic(() => import("./driver-tracking-map"), {
  ssr: false,
  loading: () => (
    <div className="h-[250px] w-full rounded-2xl bg-ink/5 animate-pulse flex items-center justify-center">
      <span className="text-ink/40 font-bold text-xs">Cargando GPS...</span>
    </div>
  ),
});

export function RideTrackingClient({ rideId, userId }: { rideId: string; userId: string }) {
  const [ride, setRide] = useState<Ride | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [isPending, startTransition] = useTransition();
  const [cancelReason, setCancelReason] = useState("");
  const [showCancel, setShowCancel] = useState(false);

  const handleCancel = () => {
    if (!cancelReason) return alert("Selecciona un motivo");
    startTransition(async () => {
      const res = await cancelRideAction(rideId, cancelReason, "customer");
      if (!res.success) {
        alert(res.error);
      } else {
        setShowCancel(false);
      }
    });
  };

  useEffect(() => {
    const db = getFirebaseDb();
    if (!db) return;
    
    // Importamos auth dinámicamente o de lib
    import("firebase/auth").then(({ getAuth, onAuthStateChanged }) => {
      const auth = getAuth();
      const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
          // El usuario ya está autenticado en el cliente, ahora sí podemos escuchar
          const rideRef = doc(db, "rides", rideId);
          const unsubscribeSnapshot = onSnapshot(
            rideRef,
            (docSnap) => {
              setLoading(false);
              if (docSnap.exists()) {
                const data = docSnap.data() as Ride;
                if (data.client_uid && data.client_uid !== userId) {
                  setError("No tienes permiso para ver este viaje.");
                  return;
                }
                setRide({ ...data, id: docSnap.id });
              } else {
                setError("La carrera no existe o fue cancelada.");
              }
            },
            (err) => {
              setError("Error al conectar con el servidor.");
              setLoading(false);
            },
          );
          
          // Limpiamos el snapshot si el componente se desmonta o cambia el auth state
          return () => unsubscribeSnapshot();
        } else {
          // Aún no hay usuario en el cliente, Next.js cookie session might exist but client is loading
        }
      });
      
      return () => unsubscribeAuth();
    });

  }, [rideId, userId]);

  if (loading) {
    return (
      <SurfaceCard className="p-8 text-center rounded-[32px]">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/4 bg-ink/10 mx-auto rounded"></div>
          <div className="h-12 w-1/2 bg-ink/10 mx-auto rounded"></div>
        </div>
      </SurfaceCard>
    );
  }

  if (error || !ride) {
    return (
      <SurfaceCard className="p-8 text-center rounded-[32px]">
        <p className="text-red-500 font-bold">{error}</p>
        <Link href="/" className="text-indigo-600 hover:underline mt-4 block text-sm">
          Volver al inicio
        </Link>
      </SurfaceCard>
    );
  }

  const renderLocation = (loc: string) => {
    if (loc.includes(" - GPS: ")) {
      const [address, gps] = loc.split(" - GPS: ");
      return (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-ink mt-0.5 leading-tight">{address}</span>
          <span className="text-[10px] text-ink/40 font-mono mt-0.5">GPS: {gps}</span>
        </div>
      );
    }
    return <p className="text-sm font-semibold text-ink mt-0.5">{loc}</p>;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-black text-ink tracking-tight mb-2">Rastreo de Carrera</h1>
        <p className="text-sm font-mono text-ink/50 uppercase tracking-widest">
          ID: {ride.id.slice(-8)}
        </p>
      </div>

      <SurfaceCard className="p-8 rounded-[32px] border-2 border-indigo-100 bg-white">
        {/* Status Header */}
        <div className="flex flex-col items-center justify-center py-6 border-b border-ink/5 mb-6">
          {ride.status === "OPEN" && (
            <>
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center animate-bounce mb-4">
                <span className="text-2xl">📡</span>
              </div>
              <h2 className="text-xl font-bold text-blue-900">Buscando Conductor...</h2>
              <p className="text-sm text-blue-700/60 mt-1">
                Notificando a los conductores cercanos.
              </p>
            </>
          )}

          {ride.status === "ACCEPTED" && (
            <>
              <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mb-4 ring-4 ring-teal/20">
                <span className="text-2xl">🏍️</span>
              </div>
              <h2 className="text-xl font-bold text-teal">¡Conductor en camino!</h2>
              <p className="text-sm text-teal/70 mt-1">
                Prepárate, tu conductor ha aceptado la carrera.
              </p>
            </>
          )}

          {ride.status === "IN_PROGRESS" && (
            <>
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4 ring-4 ring-indigo-200">
                <span className="text-2xl">🛺</span>
              </div>
              <h2 className="text-xl font-bold text-indigo-700">En camino al destino</h2>
              <p className="text-sm text-indigo-700/60 mt-1">
                Estás a bordo. ¡Disfruta el viaje!
              </p>
            </>
          )}

          {ride.status === "COMPLETED" && (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h2 className="text-xl font-bold text-green-700">Carrera Finalizada</h2>
              <p className="text-sm text-green-700/60 mt-1">Gracias por usar Neco-Dispatch.</p>
            </>
          )}

          {ride.status === "CANCELLED" && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <span className="text-2xl">❌</span>
              </div>
              <h2 className="text-xl font-bold text-red-700">Carrera Cancelada</h2>
              <p className="text-sm text-red-700/60 mt-1">
                Motivo: {ride.cancellation_reason || "Cancelada por el usuario"}
              </p>
            </>
          )}
        </div>

        {/* Ride Details */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-ink/40 uppercase tracking-wider">Origen</p>
              {renderLocation(ride.origin)}
            </div>
            <div>
              <p className="text-xs font-bold text-ink/40 uppercase tracking-wider">Destino</p>
              {renderLocation(ride.destination)}
            </div>
            <div>
              <p className="text-xs font-bold text-ink/40 uppercase tracking-wider">
                Vehículo Solicitado
              </p>
              <p className="text-sm font-semibold text-ink mt-0.5 capitalize">
                {ride.vehicle_type_requested}
              </p>
            </div>
          </div>

          <div className="space-y-4 bg-sand/30 p-5 rounded-2xl">
            <div>
              <p className="text-xs font-bold text-ink/40 uppercase tracking-wider">
                Tarifa a Pagar
              </p>
              <p className="text-3xl font-black text-coral mt-1">
                ${(ride.final_price || ride.base_price || 0).toLocaleString("es-CO")}{" "}
                <span className="text-sm font-semibold text-coral/60">COP</span>
              </p>
            </div>

            {(ride.status === "ACCEPTED" || ride.status === "IN_PROGRESS") && (
              <div className="mt-4 pt-4 border-t border-ink/10">
                <p className="text-xs font-bold text-teal uppercase tracking-wider mb-3">
                  Ubicación en tiempo real
                </p>
                {ride.driver_location ? (
                  <div className="mb-4 relative rounded-2xl overflow-hidden shadow-sm border border-ink/5">
                    <DriverTrackingMap
                      driverLat={ride.driver_location.lat}
                      driverLng={ride.driver_location.lng}
                      driverName={ride.driver_name || "Tu conductor"}
                      plate={ride.driver_vehicle?.split("-")[1] || "PENDIENTE"}
                    />
                  </div>
                ) : (
                  <div className="h-[250px] w-full rounded-2xl bg-gradient-to-r from-ink/5 via-ink/10 to-ink/5 bg-[length:200%_100%] animate-[shimmer_2s_infinite] border border-ink/5 flex flex-col items-center justify-center mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-ink to-transparent" />
                    <span className="text-4xl animate-bounce mb-2">🛰️</span>
                    <p className="text-xs font-bold text-ink/50 text-center px-4 relative z-10 tracking-widest uppercase">
                      Localizando Motocarro...
                    </p>
                  </div>
                )}
                
                <p className="text-xs font-bold text-teal uppercase tracking-wider">
                  Conductor Asignado
                </p>
                <p className="text-lg font-bold text-ink mt-1">{ride.driver_name}</p>
                <p className="text-xs font-mono text-ink/60 bg-white inline-block px-2 py-1 rounded mt-2 border border-ink/10">
                  PLACA: {ride.driver_vehicle?.split("-")[1] || "PENDIENTE"}
                </p>

                {ride.driver_phone && (
                  <div className="flex flex-col gap-2 mt-4">
                    <a
                      href={`tel:${ride.driver_phone}`}
                      className="flex-1 text-center bg-white border-2 border-teal text-teal font-bold py-2 rounded-xl text-xs hover:bg-teal/10 transition-colors"
                    >
                      📞 Llamar: {ride.driver_phone}
                    </a>
                    <a
                      href={`https://wa.me/57${ride.driver_phone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-center bg-teal text-white font-bold py-2 rounded-xl text-xs hover:bg-teal/90 transition-colors"
                    >
                      💬 WhatsApp: {ride.driver_phone}
                    </a>
                  </div>
                )}

                <p className="text-xs text-teal/80 font-semibold mt-4 animate-pulse">
                  📍 Tiempo estimado de llegada: ~3-5 min
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Cancellation Section */}
        {(ride.status === "OPEN" || ride.status === "ACCEPTED") && (
          <div className="mt-6 pt-6 border-t border-ink/5">
            {!showCancel ? (
              <button
                onClick={() => setShowCancel(true)}
                className="text-xs font-bold text-red-500 hover:underline"
              >
                Cancelar Carrera
              </button>
            ) : (
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                <p className="text-xs font-bold text-red-800 mb-2 uppercase tracking-wide">
                  Motivo de Cancelación
                </p>
                <select
                  className="w-full p-2 text-sm rounded-lg border border-red-200 bg-white mb-3 text-ink"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  disabled={isPending}
                >
                  <option value="">Selecciona una razón...</option>
                  <option value="El conductor demora mucho">El conductor demora mucho</option>
                  <option value="Cambié de planes">Cambié de planes</option>
                  <option value="Me equivoqué en la solicitud">Me equivoqué en la solicitud</option>
                  <option value="Conseguí otro transporte">Conseguí otro transporte</option>
                  <option value="La aplicación falló">La aplicación falló</option>
                </select>
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    disabled={isPending || !cancelReason}
                    className="flex-1 bg-red-600 text-white font-bold text-xs py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {isPending ? "Cancelando..." : "Confirmar Cancelación"}
                  </button>
                  <button
                    onClick={() => setShowCancel(false)}
                    disabled={isPending}
                    className="flex-1 bg-white text-ink font-bold text-xs py-2 rounded-lg border border-ink/20 hover:bg-ink/5"
                  >
                    No Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </SurfaceCard>

      <div className="text-center">
        <Link
          href="/customer/viajes"
          className="inline-block px-6 py-3 rounded-full bg-white border border-ink/10 text-sm font-bold text-ink hover:bg-sand transition-colors"
        >
          Volver a Mis Viajes
        </Link>
      </div>
    </div>
  );
}
