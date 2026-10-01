import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/server";
import { getDriverProfile } from "@/data/driverService";
import { redirect } from "next/navigation";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import { getFirestore } from "firebase-admin/firestore";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Historial de Carreras | Neco-Dispatch",
};

export default async function DriverHistoryPage() {
  const session = await requireAuth({ nextPath: "/driver/historial" });
  const driverProfile = await getDriverProfile(session.user.uid);

  if (!driverProfile) {
    redirect("/conductores");
  }

  const db = getFirestore(getFirebaseAdminApp());

  // Traemos todas las carreras del conductor y filtramos en memoria
  // para evitar problemas de índices compuestos faltantes en Firestore
  const ridesSnapshot = await db
    .collection("rides")
    .where("driver_id", "==", driverProfile.id)
    .get();

  const historyRides = ridesSnapshot.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as any)
    .filter((r) => r.status === "COMPLETED" || r.status === "CANCELLED")
    .sort((a, b) => (b.created_at || 0) - (a.created_at || 0));

  const extractLocation = (loc: string) => loc.split(" - GPS: ")[0];

  return (
    <div className="min-h-screen bg-[#1A1D23] text-white pb-24">
      {/* Header fijo */}
      <header className="sticky top-0 z-50 bg-[#1A1D23]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center gap-3">
        <Link href="/driver" className="p-2 -ml-2 rounded-full hover:bg-white/10 transition">
          <ArrowLeft className="w-5 h-5 text-white/70" />
        </Link>
        <div>
          <h1 className="text-base font-bold text-white">Historial de Carreras</h1>
          <p className="text-xs text-white/50">{historyRides.length} viajes registrados</p>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-6 space-y-4">
        {historyRides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4 opacity-50">📋</span>
            <h3 className="text-xl font-bold text-white/80 mb-2">Sin historial</h3>
            <p className="text-sm text-white/40 max-w-xs">
              Aún no has completado ni cancelado ninguna carrera.
            </p>
          </div>
        ) : (
          historyRides.map((ride) => {
            const isCompleted = ride.status === "COMPLETED";
            const date = new Date(ride.created_at).toLocaleDateString("es-CO", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={ride.id}
                className="bg-[#2A2D35] border border-white/5 rounded-2xl p-4 flex gap-4 items-start shadow-lg"
              >
                <div className="pt-1">
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-bold text-white/90">{date}</p>
                    {isCompleted ? (
                      <span className="text-sm font-black text-emerald-400">
                        +${(ride.driver_net || ride.final_price).toLocaleString("es-CO")}
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-red-400 uppercase tracking-wider bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                        Cancelada
                      </span>
                    )}
                  </div>
                  <div className="space-y-1 mt-2">
                    <p className="text-xs text-white/60 line-clamp-1">
                      <span className="text-white/40 mr-1">📍</span>
                      {extractLocation(ride.destination)}
                    </p>
                  </div>
                  {ride.cancellation_reason && (
                    <p className="text-xs text-red-300 mt-2 bg-red-500/10 p-2 rounded-lg border border-red-500/20">
                      Motivo: {ride.cancellation_reason}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
