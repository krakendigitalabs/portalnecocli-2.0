import { getFirestore } from "firebase-admin/firestore";
import {
  ArrowLeft,
  Car,
  CircleCheck,
  CircleOff,
  CirclePause,
  Clock3,
  Phone,
  Settings,
  ShieldCheck,
  Star,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDriverProfile } from "@/data/driverService";
import { requireAuth } from "@/lib/auth/server";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import { LogoutButton } from "./logout-button";

export const metadata: Metadata = {
  title: "Perfil del Conductor | Neco-Dispatch",
};

const statusStyles = {
  active: {
    label: "Conductor activo",
    className: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
    Icon: CircleCheck,
  },
  pending_approval: {
    label: "En revisión",
    className: "border-amber-500/40 bg-amber-500/10 text-amber-300",
    Icon: Clock3,
  },
  suspended: {
    label: "Suspendido",
    className: "border-rose-500/40 bg-rose-500/10 text-rose-300",
    Icon: CirclePause,
  },
  inactive: {
    label: "Inactivo",
    className: "border-white/20 bg-white/5 text-white/75",
    Icon: CircleOff,
  },
} as const;

function formatCurrency(value: number) {
  return `$${Math.round(value).toLocaleString("es-CO")}`;
}

function formatVehicleType(rawVehicleType?: string) {
  if (!rawVehicleType) {
    return "No registrado";
  }

  return rawVehicleType
    .replaceAll("_", " ")
    .split(" ")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export default async function DriverProfilePage() {
  const session = await requireAuth({ nextPath: "/driver/perfil" });
  const driverProfile = await getDriverProfile(session.user.uid);

  if (!driverProfile) {
    redirect("/conductores");
  }

  // Obtenemos los viajes completados para calcular las ventas
  const db = getFirestore(getFirebaseAdminApp());
  const ridesSnapshot = await db
    .collection("rides")
    .where("driver_id", "==", driverProfile.id)
    .where("status", "==", "COMPLETED")
    .get();

  let totalSales = 0;
  let totalNet = 0;

  ridesSnapshot.forEach((doc) => {
    const data = doc.data();
    totalSales += data.final_price || 0;
    totalNet += data.driver_net || data.final_price || 0;
  });

  const totalRides = ridesSnapshot.size;
  const initial = driverProfile.full_name ? driverProfile.full_name.charAt(0).toUpperCase() : "C";
  const status =
    statusStyles[driverProfile.status as keyof typeof statusStyles] ?? statusStyles.inactive;
  const StatusIcon = status.Icon;
  const rating =
    typeof driverProfile.average_rating === "number" &&
    Number.isFinite(driverProfile.average_rating)
      ? Math.max(0, Math.min(driverProfile.average_rating, 5))
      : null;
  const phoneNumber = driverProfile.phone_number ?? driverProfile.phone ?? "No registrado";
  const vehicleType = formatVehicleType(driverProfile.vehicle_type);
  const vehiclePlate = driverProfile.vehicle_plate ?? "Sin placa";
  const identification = driverProfile.identification_number ?? "No registrado";
  const joinedAt =
    typeof driverProfile.created_at === "string" && driverProfile.created_at.length > 0
      ? new Date(driverProfile.created_at).toLocaleDateString("es-CO", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : null;

  return (
    <div className="min-h-screen bg-[#1A1D23] pb-24 text-white">
      <header className="sticky top-0 z-50 bg-[#1A1D23]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <Link href="/driver" className="p-2 -ml-2 rounded-full hover:bg-white/10 transition">
          <ArrowLeft className="w-5 h-5 text-white/70" />
        </Link>
        <h1 className="text-base font-bold text-white">Mi Perfil</h1>
      </header>

      <main className="mx-auto max-w-lg space-y-6 px-4 pt-6">
        <div className="flex flex-col items-center justify-center pt-4 pb-2">
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#2A2D35] bg-gradient-to-tr from-emerald-500 to-teal-400 text-4xl font-bold shadow-lg shadow-emerald-500/20">
            {initial}
          </div>
          <h2 className="text-center text-2xl font-black">{driverProfile.full_name}</h2>
          {joinedAt ? (
            <p className="mt-1 text-xs text-white/50">Con nosotros desde {joinedAt}</p>
          ) : null}
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-bold ${status.className}`}
            >
              <StatusIcon className="h-3.5 w-3.5" />
              {status.label}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-white/5 px-3 py-1 text-sm font-bold text-yellow-400">
              <Star className="h-3.5 w-3.5 fill-yellow-400" />
              {rating ? rating.toFixed(1) : "Sin calificación"}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-900/40 to-[#2A2D35] rounded-3xl p-5 border border-emerald-500/20 space-y-4 shadow-lg shadow-emerald-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />

          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest border-b border-emerald-500/20 pb-2">
            Rendimiento Histórico
          </h3>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-xs text-white/50 font-semibold mb-1">Ventas Generadas</p>
              <p className="text-2xl font-black text-white">{formatCurrency(totalSales)}</p>
              <p className="text-[10px] text-white/40 mt-1">Bruto facturado</p>
            </div>
            <div>
              <p className="text-xs text-white/50 font-semibold mb-1">Tus Ganancias</p>
              <p className="text-2xl font-black text-emerald-400">{formatCurrency(totalNet)}</p>
              <p className="text-[10px] text-white/40 mt-1">Libre para ti</p>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between rounded-xl border border-white/5 bg-black/20 p-3">
            <span className="text-xs text-white/60 font-semibold">Carreras Completadas</span>
            <span className="rounded-lg bg-white/10 px-3 py-1 text-sm font-bold text-white">
              {totalRides} viajes
            </span>
          </div>
        </div>

        <div className="bg-[#2A2D35] rounded-3xl p-5 border border-white/5 space-y-4 shadow-lg">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">
            Información de la cuenta
          </h3>
          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Teléfono</p>
              <p className="font-semibold">{phoneNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
              <Car className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Vehículo</p>
              <p className="font-semibold">{vehicleType}</p>
              <p className="text-xs text-white/60 bg-white/5 inline-block px-2 py-0.5 rounded mt-1 font-mono">
                {vehiclePlate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold">
                Identificación
              </p>
              <p className="font-semibold">CC: {identification}</p>
            </div>
          </div>
        </div>

        <div className="bg-[#2A2D35] rounded-3xl p-2 border border-white/5 shadow-lg">
          <Link
            href="/driver/perfil/ajustes"
            className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-white/60" />
              <div className="text-left">
                <span className="font-medium text-white/90">Ajustes de la cuenta</span>
                <p className="text-xs text-white/45">
                  Próximamente: edición de perfil y preferencias
                </p>
              </div>
            </div>
            <ArrowLeft className="w-4 h-4 text-white/40 rotate-180" />
          </Link>
        </div>

        <LogoutButton />
      </main>
    </div>
  );
}
