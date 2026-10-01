"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { createRideAction } from "@/lib/rides/ride-actions";
import { useRouter } from "next/navigation";
import { SurfaceCard } from "@/components/ui/surface-card";
import { Button } from "@/components/ui/button";

// Fix default icons in leaflet for Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Calculate distance in KM using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function LocationMarker({
  position,
  setPosition,
}: {
  position: L.LatLng | null;
  setPosition: (pos: L.LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={redIcon}>
      <Popup>📍 Destino marcado</Popup>
    </Marker>
  );
}

export default function RideMapClient({
  userId,
  userName,
  userPhone,
}: {
  userId: string;
  userName: string;
  userPhone: string;
}) {
  const router = useRouter();
  const [origin, setOrigin] = useState<L.LatLng | null>(null);
  const [destination, setDestination] = useState<L.LatLng | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [notes, setNotes] = useState("");

  // Get user location on mount
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setOrigin(new L.LatLng(position.coords.latitude, position.coords.longitude));
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
          // Default to Necoclí center if error or denied
          setOrigin(new L.LatLng(8.4239, -76.7828));
        },
        { enableHighAccuracy: true },
      );
    } else {
      setOrigin(new L.LatLng(8.4239, -76.7828));
    }
  }, []);

  if (!origin) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-3xl bg-ink/5 animate-pulse">
        <p className="text-ink/40 font-bold uppercase tracking-widest text-xs">
          Cargando Satélite...
        </p>
      </div>
    );
  }

  const distance = destination
    ? calculateDistance(origin.lat, origin.lng, destination.lat, destination.lng)
    : 0;
  // Fare: Base 6600 for first 3 km, then + 1500 per km
  const estimatedFare = destination
    ? Math.max(6600, Math.round(6600 + Math.max(0, distance - 3) * 1500))
    : 0;

  async function getAddressFromCoords(lat: number, lng: number): Promise<string> {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      );
      const data = await res.json();
      if (data && data.address) {
        const road = data.address.road || data.address.pedestrian || "";
        const neighbourhood =
          data.address.neighbourhood ||
          data.address.suburb ||
          data.address.village ||
          data.address.town ||
          "Necoclí";
        let address = road ? `${road}, ${neighbourhood}` : neighbourhood;
        return `${address} - GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      }
    } catch (e) {
      console.error("Geocoding failed", e);
    }
    return `GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }

  async function handleRequestRide() {
    if (!origin || !destination) return;
    setLoading(true);
    setError("");

    try {
      const originAddress = await getAddressFromCoords(origin.lat, origin.lng);
      const destAddress = await getAddressFromCoords(destination.lat, destination.lng);

      const res = await createRideAction({
        clientUid: userId,
        clientName: userName,
        clientPhone: userPhone || "0000000000",
        origin: originAddress,
        destination: destAddress,
        vehicleType: "motocarro",
        passengerCount: 1,
        source: "web_form",
        estimatedFare: estimatedFare,
        notes: notes,
      });

      if (res.success && res.id) {
        router.push(`/customer/viajes/${res.id}`);
      } else {
        setError(res.error || "Error al solicitar la carrera");
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="h-[450px] w-full rounded-3xl overflow-hidden shadow-inner relative z-0 border-4 border-white">
        <MapContainer center={origin} zoom={15} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={origin} icon={greenIcon}>
            <Popup>Tu ubicación actual (Origen)</Popup>
          </Marker>
          <LocationMarker position={destination} setPosition={setDestination} />
        </MapContainer>

        {/* Overlay Instructions */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-ink/10 pointer-events-none w-11/12 max-w-sm">
          <p className="text-xs font-bold text-ink text-center">
            {destination ? "✅ Destino seleccionado" : "👆 Toca el mapa para marcar tu destino"}
          </p>
        </div>
      </div>

      <SurfaceCard className="p-6 rounded-[24px]">
        <div className="mb-6">
          <label className="block text-xs font-bold text-ink/60 uppercase tracking-wider mb-2">
            Detalles de ubicación (Opcional)
          </label>
          <input
            type="text"
            placeholder="Ej: Casa azul de dos pisos, frente a la tienda..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-ink/10 bg-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-teal/30 transition-all placeholder:text-ink/30"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-between items-center pt-4 border-t border-ink/5">
          <div className="space-y-1 text-center md:text-left w-full md:w-auto">
            <p className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">
              Resumen del Viaje
            </p>
            {destination ? (
              <>
                <p className="text-lg font-black text-ink">Distancia: {distance.toFixed(2)} km</p>
                <p className="text-3xl font-black text-coral">
                  ${estimatedFare.toLocaleString("es-CO")}{" "}
                  <span className="text-sm font-semibold text-coral/60">COP</span>
                </p>
              </>
            ) : (
              <p className="text-sm font-semibold text-ink/60">
                Marca tu destino en el mapa para calcular la tarifa.
              </p>
            )}
          </div>

          <Button
            onClick={handleRequestRide}
            disabled={!destination || loading}
            size="lg"
            className="w-full md:w-auto rounded-full font-bold tracking-wide py-6"
          >
            {loading ? "Procesando..." : "📍 Solicitar Vehículo"}
          </Button>
        </div>
        {error && <p className="text-red-500 text-xs text-center mt-4 font-bold">{error}</p>}
      </SurfaceCard>
    </div>
  );
}
