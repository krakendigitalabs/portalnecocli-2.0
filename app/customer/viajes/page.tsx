import { getServerAuthSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import type { Ride } from "@/types/ride";
import Link from "next/link";
import { SurfaceCard } from "@/components/ui/surface-card";

export default async function CustomerRidesPage() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/ingresar");
  }

  const db = getFirestore(getFirebaseAdminApp());

  // Buscar las carreras de este usuario (las más recientes primero)
  const snap = await db.collection("rides").where("client_uid", "==", session.user.uid).get();

  const rides = snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }) as Ride)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const activeRides = rides.filter((r) => r.status === "OPEN" || r.status === "ACCEPTED");
  const pastRides = rides.filter((r) => r.status === "COMPLETED" || r.status === "CANCELLED");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black text-ink tracking-tight">Mis Viajes y Domicilios</h2>
        <p className="mt-2 text-ink/60">
          Historial y rastreo de tus transportes con Neco-Dispatch.
        </p>
      </div>

        <section>
          <h2 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            En Curso
          </h2>
          {activeRides.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {activeRides.map((ride) => (
                <Link key={ride.id} href={`/customer/viajes/${ride.id}`}>
                  <SurfaceCard className="p-5 rounded-[24px] hover:border-blue-500 transition-colors border-2 border-transparent">
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className={`text-xs font-bold uppercase px-2 py-1 rounded-md ${
                          ride.status === "OPEN"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-teal/10 text-teal"
                        }`}
                      >
                        {ride.status === "OPEN" ? "Buscando conductor" : "Conductor Asignado"}
                      </span>
                      <span className="text-xs font-mono text-ink/40">
                        {new Date(ride.created_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-ink truncate mb-1">{ride.destination}</p>
                    <p className="text-xs text-ink/60">Origen: {ride.origin}</p>

                    {ride.status === "ACCEPTED" && ride.driver_name && (
                      <div className="mt-4 pt-3 border-t border-ink/5 flex items-center justify-between">
                        <span className="text-xs font-semibold text-teal">
                          🏍️ {ride.driver_name}
                        </span>
                        <span className="text-xs font-bold text-ink/50 bg-ink/5 px-2 py-0.5 rounded">
                          {ride.driver_vehicle?.split("-")[1]}
                        </span>
                      </div>
                    )}
                  </SurfaceCard>
                </Link>
              ))}
            </div>
          ) : (
            <SurfaceCard className="p-8 text-center rounded-[24px] border border-ink/5 border-dashed bg-transparent">
              <p className="text-ink/50 text-sm">No tienes viajes en curso en este momento.</p>
            </SurfaceCard>
          )}
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink mb-4 text-ink/50">Historial Pasado</h2>
          {pastRides.length > 0 ? (
            <div className="space-y-3">
              {pastRides.map((ride) => (
                <SurfaceCard
                  key={ride.id}
                  className="p-0 rounded-[20px] opacity-80 overflow-hidden"
                >
                  <details className="group">
                    <summary className="flex justify-between items-center p-4 cursor-pointer hover:bg-ink/5 transition-colors list-none [&::-webkit-details-marker]:hidden">
                      <div>
                        <p className="text-sm font-bold text-ink">{ride.destination}</p>
                        <p className="text-xs text-ink/50">
                          {new Date(ride.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <p className="text-sm font-bold text-ink">
                            ${(ride.final_price || ride.base_price || 0).toLocaleString("es-CO")}
                          </p>
                          <p
                            className={`text-[10px] font-bold uppercase mt-1 ${ride.status === "COMPLETED" ? "text-green-600" : "text-red-500"}`}
                          >
                            {ride.status === "COMPLETED" ? "Completado" : "Cancelado"}
                          </p>
                        </div>
                        <span className="text-ink/30 group-open:rotate-180 transition-transform">
                          ▼
                        </span>
                      </div>
                    </summary>
                    <div className="p-4 pt-0 border-t border-ink/5 bg-sand/30">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-3">
                        <div>
                          <p className="text-[10px] font-bold text-ink/40 uppercase">Conductor</p>
                          <p className="text-xs font-semibold text-ink">
                            {ride.driver_name || "Sin asignar"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-ink/40 uppercase">
                            Vehículo / Placa
                          </p>
                          <p className="text-xs font-semibold text-ink">
                            {ride.driver_vehicle || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-ink/40 uppercase">
                            Teléfono Contacto
                          </p>
                          <p className="text-xs font-semibold text-ink">
                            {ride.driver_phone || "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-ink/40 uppercase">
                            Fecha y Hora (Franja)
                          </p>
                          <p className="text-xs font-semibold text-ink">
                            {new Date(ride.created_at).toLocaleString("es-CO")}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-ink/40 uppercase">Pasajeros</p>
                          <p className="text-xs font-semibold text-ink">
                            {ride.passenger_count || 1} Persona(s)
                          </p>
                        </div>
                      </div>
                    </div>
                  </details>
                </SurfaceCard>
              ))}
            </div>
          ) : (
            <p className="text-ink/40 text-sm">No hay historial de viajes.</p>
          )}
        </section>
    </div>
  );
}
