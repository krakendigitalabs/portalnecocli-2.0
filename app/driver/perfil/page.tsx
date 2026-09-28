import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/server";
import { getDriverProfile } from "@/data/driverService";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Phone, Settings, Star, ShieldCheck, Car } from "lucide-react";
import { LogoutButton } from "./logout-button";
import Image from "next/image";

import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import { getFirestore } from "firebase-admin/firestore";

export const metadata: Metadata = {
  title: "Perfil del Conductor | Neco-Dispatch",
};

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
    totalSales += (data.final_price || 0);
    totalNet += (data.driver_net || data.final_price || 0);
  });

  const totalRides = ridesSnapshot.size;

  // Generamos un avatar usando un placeholder basado en la inicial de su nombre
  const initial = driverProfile.full_name ? driverProfile.full_name.charAt(0).toUpperCase() : "C";

  return (
    <div className="min-h-screen bg-[#1A1D23] text-white pb-24">
      {/* Header fijo */}
      <header className="sticky top-0 z-50 bg-[#1A1D23]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <Link href="/driver" className="p-2 -ml-2 rounded-full hover:bg-white/10 transition">
          <ArrowLeft className="w-5 h-5 text-white/70" />
        </Link>
        <h1 className="text-base font-bold text-white">Mi Perfil</h1>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-6 space-y-6">
        {/* Avatar y Nombre */}
        <div className="flex flex-col items-center justify-center pt-4 pb-2">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-4xl font-bold shadow-lg shadow-emerald-500/20 mb-4 border-4 border-[#2A2D35]">
            {initial}
          </div>
          <h2 className="text-2xl font-black">{driverProfile.full_name}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
              Conductor Activo
            </span>
            <span className="flex items-center gap-1 text-yellow-400 text-sm font-bold bg-white/5 px-3 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-yellow-400" /> 4.9
            </span>
          </div>
        </div>

        {/* Rendimiento Financiero (Ventas Generadas) */}
        <div className="bg-gradient-to-br from-emerald-900/40 to-[#2A2D35] rounded-3xl p-5 border border-emerald-500/20 space-y-4 shadow-lg shadow-emerald-900/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
          
          <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-widest border-b border-emerald-500/20 pb-2">
            Rendimiento Histórico
          </h3>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-xs text-white/50 font-semibold mb-1">Ventas Generadas</p>
              <p className="text-2xl font-black text-white">${totalSales.toLocaleString("es-CO")}</p>
              <p className="text-[10px] text-white/40 mt-1">Bruto facturado</p>
            </div>
            <div>
              <p className="text-xs text-white/50 font-semibold mb-1">Tus Ganancias</p>
              <p className="text-2xl font-black text-emerald-400">${totalNet.toLocaleString("es-CO")}</p>
              <p className="text-[10px] text-white/40 mt-1">Libre para ti</p>
            </div>
          </div>

          <div className="bg-black/20 rounded-xl p-3 flex justify-between items-center border border-white/5 mt-2">
            <span className="text-xs text-white/60 font-semibold">Carreras Completadas</span>
            <span className="text-sm font-bold text-white bg-white/10 px-3 py-1 rounded-lg">
              {totalRides} viajes
            </span>
          </div>
        </div>

        {/* Datos del Conductor */}
        <div className="bg-[#2A2D35] rounded-3xl p-5 border border-white/5 space-y-4 shadow-lg">
          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Teléfono</p>
              <p className="font-semibold">{driverProfile.phone_number}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 border-b border-white/5 pb-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
              <Car className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Vehículo</p>
              <p className="font-semibold capitalize">{driverProfile.vehicle_type}</p>
              <p className="text-xs text-white/60 bg-white/5 inline-block px-2 py-0.5 rounded mt-1 font-mono">
                {driverProfile.vehicle_plate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Identificación</p>
              <p className="font-semibold">CC: {driverProfile.identification_number}</p>
            </div>
          </div>
        </div>

        {/* Ajustes Extra */}
        <div className="bg-[#2A2D35] rounded-3xl p-2 border border-white/5 shadow-lg">
          <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 rounded-2xl transition">
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-white/60" />
              <span className="font-medium text-white/90">Ajustes de la cuenta</span>
            </div>
            <ArrowLeft className="w-4 h-4 text-white/40 rotate-180" />
          </button>
        </div>

        {/* Botón de Cierre de Sesión */}
        <LogoutButton />
      </main>
    </div>
  );
}
