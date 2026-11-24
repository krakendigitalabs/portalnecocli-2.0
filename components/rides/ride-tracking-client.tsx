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

const CANCEL_REASONS = [
  "El conductor demora mucho",
  "Cambié de planes",
  "Me equivoqué en la solicitud",
  "Conseguí otro transporte",
  "La aplicación falló",
] as const;

interface StatusUiConfig {
  icon: string;
  iconBg: string;
  title: string;
  titleColor: string;
  subtitle: string;
  subtitleColor: string;
}

const DEFAULT_STATUS_UI: StatusUiConfig = {
  icon: "📡",
  iconBg: "bg-blue-100",
  title: "Actualizando estado...",
  titleColor: "text-ink",
  subtitle: "Consultando la información de tu carrera.",
  subtitleColor: "text-ink/60",
};

const STATUS_UI: Record<string, StatusUiConfig> = {
  OPEN: {
    icon: "📡",
    iconBg: "bg-blue-100 animate-bounce",
    title: "Buscando Conductor...",
    titleColor: "text-blue-900",
    subtitle: "Notificando a los conductores cercanos.",
    subtitleColor: "text-blue-700/60",
  },
  ACCEPTED: {
    icon: "🏍️",
    iconBg: "bg-teal/10 ring-4 ring-teal/20",
    title: "¡Conductor en camino!",
    titleColor: "text-teal",
    subtitle: "Prepárate, tu conductor ha aceptado la carrera.",
    subtitleColor: "text-teal/70",
  },
  IN_PROGRESS: {
    icon: "🛺",
    iconBg: "bg-indigo-100 ring-4 ring-indigo-200",
    title: "En camino al destino",
    titleColor: "text-indigo-700",
    subtitle: "Estás a bordo. ¡Disfruta el viaje!",
    subtitleColor: "text-indigo-700/60",
  },
  COMPLETED: {
    icon: "✅",
    iconBg: "bg-green-100",
    title: "Carrera Finalizada",
    titleColor: "text-green-700",
    subtitle: "Gracias por usar Neco-Dispatch.",
    subtitleColor: "text-green-700/60",
  },
  CANCELLED: {
    icon: "❌",
    iconBg: "bg-red-100",
    title: "Carrera Cancelada",
    titleColor: "text-red-700",
    subtitle: "Cancelada por el usuario",
    subtitleColor: "text-red-700/60",
  },
};

function extractPlate(driverVehicle?: string | null): string {
  if (!driverVehicle?.trim()) return "PENDIENTE";
  const parts = driverVehicle.split("-");
  const plate = (parts.length > 1 ? parts[1] : parts[0]).trim();
  return plate || "PENDIENTE";
}

function buildWhatsAppUrl(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const normalized =
    digits.length === 10 && !digits.startsWith("57") ? `57${digits}` : digits;
  return `https://wa.me/${normalized}`;
}

function LocationDisplay({ location }: { location: string }) {
  if (location.includes(" - GPS: ")) {
    const [address, gps] = location.split(" - GPS: ");
    return (
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-ink mt-0.5 leading-tight">{address}</span>
        <span className="text-[10px] text-ink/40 font-mono mt-0.5">GPS: {gps}</span>
      </div>
    );
  }
  return <p className="text-sm font-semibold text-ink mt-0.5">{location}</p>;
}

export function RideTrackingClient({
  rideId,
  userId,
}: {
  rideId: string;
  userId: string;
}) {
  const [ride, setRide] = useState<Ride | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [isPending, startTransition] = useTransition();
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [showCancel, setShowCancel] = useState(false);

  const handleCancel = () => {
    if (!cancelReason) {
      setCancelError("Por favor selecciona un motivo antes de confirmar.");
      return;
    }

    setCancelError(null);
    startTransition(async () => {
      const res = await cancelRideAction(rideId, cancelReason, "customer");
      if (!res.success) {
        setCancelError(res.error || "No se pudo cancelar la carrera. Intenta de nuevo.");
      } else {
        setShowCancel(false);
        setCancelReason("");
      }
    });
  };

  useEffect(() => {
    const db = getFirebaseDb();
    if (!db) {
      setError("No se pudo conectar con el servicio de rastreo.");
      setLoading(false);
      return;
    }

    let isMounted = true;
    let unsubscribeAuth: (() => void) | null = null;
    let unsubscribeSnapshot: (() => void) | null = null;
    let authTimeout: ReturnType<typeof setTimeout> | null = null;

    const cleanupSnapshot = () => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }
    };

    import("firebase/auth")
      .then(({ getAuth, onAuthStateChanged }) => {
        if (!isMounted) return;

        const auth = getAuth();
        unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          cleanupSnapshot();
          if (authTimeout) {
            clearTimeout(authTimeout);
            authTimeout = null;
          }

          if (!user) {
            authTimeout = setTimeout(() => {
              if (isMounted) {
                setError(
                  "Tu sesión no está activa. Vuelve a iniciar sesión para rastrear el viaje.",
                );
                setLoading(false);
              }
            }, 4000);
            return;
          }

          const rideRef = doc(db, "rides", rideId);
          unsubscribeSnapshot = onSnapshot(
            rideRef,
            (docSnap) => {
              if (!isMounted) return;
              setLoading(false);

              if (!docSnap.exists()) {
                setRide(null);
                setError("La carrera no existe o fue eliminada.");
                return;
              }

              const data = docSnap.data() as Ride;
              const isOwner =
                !data.client_uid ||
                data.client_uid === user.uid ||
                data.client_uid === userId;

              if (!isOwner) {
                setRide(null);
                setError("No tienes permiso para ver este viaje.");
                return;
              }

              setError(null);
              setRide({ ...data, id: docSnap.id });
            },
            (err) => {
              if (!isMounted) return;
              console.error("[RideTracking] Error en onSnapshot:", err);
              setError(
                err.code === "permission-denied"
                  ? "No tienes permiso para ver este viaje."
                  : "Error al conectar con el servidor. Verifica tu conexión.",
              );
              setLoading(false);
            },
          );
        });
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("[RideTracking] Error cargando firebase/auth:", err);
        setError("Error al inicializar la autenticación.");
        setLoading(false);
      });

    return () => {
      isMounted = false;
      if (authTimeout) clearTimeout(authTimeout);
      cleanupSnapshot();
      if (unsubscribeAuth) unsubscribeAuth();
    };
  }, [rideId, userId]);

  if (loading) {
    return (
      <SurfaceCard className="p-8 text-center rounded-[32px]">
        <div className="animate-pulse space-y-4">
          <div className="h-4 w-1/4 bg-ink/10 mx-auto rounded" />
          <div className="h-12 w-1/2 bg-ink/10 mx-auto rounded" />
        </div>
      </SurfaceCard>
    );
  }

  if (error || !ride) {
    return (
      <SurfaceCard className="p-8 text-center rounded-[32px]">
        <p className="text-red-500 font-bold">{error || "No se encontró el viaje."}</p>
        <Link
          href="/"
          className="text-indigo-600 hover:underline mt-4 inline-block text-sm font-semibold"
        >
          Volver al inicio
        </Link>
      </SurfaceCard>
    );
  }

  const statusUI = STATUS_UI[ride.status] ?? DEFAULT_STATUS_UI;
  const plate = extractPlate(ride.driver_vehicle);
  const price = ride.final_price ?? ride.base_price ?? 0;
  const isTrackingActive =
    ride.status === "ACCEPTED" || ride.status === "IN_PROGRESS";
  const canCancel = ride.status === "OPEN" || ride.status === "ACCEPTED";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-black text-ink tracking-tight mb-2">
          Rastreo de Carrera
        </h1>
        <p className="text-sm font-mono text-ink/50 uppercase tracking-widest">
          ID: {ride.id.slice(-8)}
        </p>
      </div>

      <SurfaceCard className="p-8 rounded-[32px] border-2 border-indigo-100 bg-white">
        {/* Status Header */}
        <div
          aria-live="polite"
          className="flex flex-col items-center justify-center py-6 border-b border-ink/5 mb-6"
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${statusUI.iconBg}`}
          >
            <span className="text-2xl" aria-hidden="true">
              {statusUI.icon}
            </span>
          </div>
          <h2 className={`text-xl font-bold ${statusUI.titleColor}`}>{statusUI.title}</h2>
          <p className={`text-sm mt-1 ${statusUI.subtitleColor}`}>
            {ride.status === "CANCELLED"
              ? `Motivo: ${ride.cancellation_reason || statusUI.subtitle}`
              : statusUI.subtitle}
          </p>
        </div>

        {/* Ride Details */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-ink/40 uppercase tracking-wider">Origen</p>
              <LocationDisplay location={ride.origin} />
            </div>
            <div>
              <p className="text-xs font-bold text-ink/40 uppercase tracking-wider">Destino</p>
              <LocationDisplay location={ride.destination} />
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
                ${price.toLocaleString("es-CO")}{" "}
                <span className="text-sm font-semibold text-coral/60">COP</span>
              </p>
            </div>

            {isTrackingActive && (
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
                      plate={plate}
                    />
                  </div>
                ) : (
                  <div className="h-[250px] w-full rounded-2xl bg-ink/5 animate-pulse border border-ink/5 flex flex-col items-center justify-center mb-4">
                    <span className="text-4xl animate-bounce mb-2" aria-hidden="true">
                      🛰️
                    </span>
                    <p className="text-xs font-bold text-ink/50 text-center px-4 tracking-widest uppercase">
                      Localizando {ride.vehicle_type_requested || "vehículo"}...
                    </p>
                  </div>
                )}

                <p className="text-xs font-bold text-teal uppercase tracking-wider">
                  Conductor Asignado
                </p>
                <p className="text-lg font-bold text-ink mt-1">
                  {ride.driver_name || "Por confirmar"}
                </p>
                <p className="text-xs font-mono text-ink/60 bg-white inline-block px-2 py-1 rounded mt-2 border border-ink/10">
                  PLACA: {plate}
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
                      href={buildWhatsAppUrl(ride.driver_phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center bg-teal text-white font-bold py-2 rounded-xl text-xs hover:bg-teal/90 transition-colors"
                    >
                      💬 WhatsApp: {ride.driver_phone}
                    </a>
                  </div>
                )}

                {ride.status === "ACCEPTED" && (
                  <p className="text-xs text-teal/80 font-semibold mt-4 animate-pulse">
                    📍 Tu conductor va en camino al punto de recogida
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cancellation Section */}
        {canCancel && (
          <div className="mt-6 pt-6 border-t border-ink/5">
            {!showCancel ? (
              <button
                type="button"
                onClick={() => {
                  setCancelError(null);
                  setShowCancel(true);
                }}
                className="text-xs font-bold text-red-500 hover:underline"
              >
                Cancelar Carrera
              </button>
            ) : (
              <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                <label
                  htmlFor="cancel-reason-select"
                  className="block text-xs font-bold text-red-800 mb-2 uppercase tracking-wide"
                >
                  Motivo de Cancelación
                </label>
                <select
                  id="cancel-reason-select"
                  className="w-full p-2 text-sm rounded-lg border border-red-200 bg-white mb-3 text-ink"
                  value={cancelReason}
                  onChange={(e) => {
                    setCancelReason(e.target.value);
                    if (cancelError) setCancelError(null);
                  }}
                  disabled={isPending}
                >
                  <option value="">Selecciona una razón...</option>
                  {CANCEL_REASONS.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>

                {cancelError && (
                  <p role="alert" className="text-xs font-semibold text-red-700 mb-3">
                    {cancelError}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isPending || !cancelReason}
                    className="flex-1 bg-red-600 text-white font-bold text-xs py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {isPending ? "Cancelando..." : "Confirmar Cancelación"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCancel(false);
                      setCancelReason("");
                      setCancelError(null);
                    }}
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