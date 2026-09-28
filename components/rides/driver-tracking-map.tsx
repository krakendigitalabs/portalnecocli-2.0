"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const driverIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function DriverTrackingMap({
  driverLat,
  driverLng,
  driverName,
  plate,
}: {
  driverLat: number;
  driverLng: number;
  driverName: string;
  plate: string;
}) {
  return (
    <div className="h-[250px] w-full rounded-2xl overflow-hidden shadow-inner border-2 border-white relative z-0">
      <MapContainer
        center={[driverLat, driverLng]}
        zoom={16}
        style={{ height: "100%", width: "100%" }}
        key={`${driverLat}-${driverLng}`} // Force re-render if it moves significantly? No, let Leaflet handle it ideally, but re-mounting is easier for a simple update
      >
        <TileLayer
          attribution='&copy; OSM'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[driverLat, driverLng]} icon={driverIcon}>
          <Popup>
            <p className="font-bold text-center m-0">{driverName}</p>
            <p className="text-xs text-center m-0 opacity-70">Placa: {plate}</p>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
