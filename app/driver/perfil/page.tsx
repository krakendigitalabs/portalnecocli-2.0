import { getFirestore } from "firebase-admin/firestore";
import {
  Activity,
  ArrowLeft,
  BadgeCheck,
  Car,
  Phone,
  Settings,
  ShieldCheck,
  Star,
  Wallet,
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

  // Generamos un avatar usando un placeholder basado en la inicial de su nombre
  const initial = driverProfile.full_name ? driverProfile.full_name.charAt(0).toUpperCase() : "C";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0D111A] pb-24 text-white">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-24 right-0 h-64 w-64 rounded-full bg-cyan-500/10 blur-[100px]" />

      <header className="sticky top-0 z-50 flex items-center gap-3 border-b border-white/5 bg-[#0D111A]/90 px-4 py-3 backdrop-blur-xl">
        <Link href="/driver" className="p-2 -ml-2 rounded-full hover:bg-white/10 transition">
          <ArrowLeft className="w-5 h-5 text-white/70" />
        </Link>
        <h1 className="text-base font-bold text-white">Mi Perfil</h1>
      </header>

      <main className="relative z-10 mx-auto max-w-lg space-y-6 px-4 pt-6">
        <section className="relative overflow-hidden rounded-3xl border border-emerald-400/25 bg-gradient-to-br from-[#111A2A] via-[#101826] to-[#0D1320] p-6 shadow-2xl shadow-emerald-900/20">
          <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-400/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 left-6 h-20 w-20 rounded-full bg-cyan-400/15 blur-2xl" />

          <div className="flex flex-col items-center">
            <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-[2rem] border border-emerald-300/30 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-500 text-4xl font-black text-[#042216] shadow-xl shadow-emerald-500/30">
              {initial}
            </div>
            <h2 className="text-center text-2xl font-black tracking-tight">
              {driverProfile.full_name}
            </h2>
            <div className="mt-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-300">
                <BadgeCheck className="h-3.5 w-3.5" />
                Conductor Activo
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-yellow-300/30 bg-yellow-300/10 px-3 py-1 text-xs font-bold text-yellow-300">
                <Star className="h-3.5 w-3.5 fill-yellow-300" />
                4.9
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-wide text-white/60">
                Viajes completados
              </p>
              <p className="mt-1 text-lg font-black">{totalRides}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <p className="text-[11px] uppercase tracking-wide text-white/60">Ganancia total</p>
              <p className="mt-1 truncate text-lg font-black text-emerald-300">
                ${totalNet.toLocaleString("es-CO")}
              </p>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-900/30 via-[#1A2234] to-[#151D2D] p-5 shadow-lg shadow-emerald-900/15">
          <h3 className="border-b border-emerald-500/20 pb-2 text-sm font-bold uppercase tracking-widest text-emerald-300">
            Rendimiento Histórico
          </h3>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <article className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="mb-2 flex items-center gap-2 text-white/60">
                <Wallet className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-wide">Ventas Generadas</p>
              </div>
              <p className="text-2xl font-black">${totalSales.toLocaleString("es-CO")}</p>
              <p className="mt-1 text-[10px] text-white/45">Bruto facturado</p>
            </article>
            <article className="rounded-2xl border border-emerald-400/25 bg-emerald-500/10 p-4">
              <div className="mb-2 flex items-center gap-2 text-emerald-200/80">
                <Activity className="h-4 w-4" />
                <p className="text-xs font-semibold uppercase tracking-wide">Tus Ganancias</p>
              </div>
              <p className="text-2xl font-black text-emerald-300">
                ${totalNet.toLocaleString("es-CO")}
              </p>
              <p className="mt-1 text-[10px] text-emerald-200/70">Libre para ti</p>
            </article>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-3">
            <span className="text-xs text-white/60 font-semibold">Carreras Completadas</span>
            <span className="rounded-lg bg-white/10 px-3 py-1 text-sm font-bold text-white">
              {totalRides} viajes
            </span>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#151A25] p-5 shadow-lg">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white/60">
            Datos del conductor
          </h3>

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
              <p className="text-xs text-white/40 uppercase tracking-widest font-bold">
                Identificación
              </p>
              <p className="font-semibold">CC: {driverProfile.identification_number}</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-[#151A25] p-2 shadow-lg">
          <button
            type="button"
            className="w-full rounded-2xl p-4 transition hover:bg-white/5 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-white/60" />
              <span className="font-medium text-white/90">Ajustes de la cuenta</span>
            </div>
            <ArrowLeft className="w-4 h-4 text-white/40 rotate-180" />
          </button>
        </section>

        <LogoutButton />
      </main>
    </div>
  );
}
