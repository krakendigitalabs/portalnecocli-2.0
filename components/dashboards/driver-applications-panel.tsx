"use client";

import { useState } from "react";
import { SurfaceCard } from "@/components/ui/surface-card";
import { updateDriverStatusAction } from "@/app/actions/drivers";

export function DriverApplicationsPanel({ applications }: { applications: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleStatus(driverId: string, status: "active" | "rejected") {
    setLoadingId(driverId);
    setError(null);
    setSuccess(null);

    try {
      const res = await updateDriverStatusAction(driverId, status);
      if (res.success) {
        setSuccess(`Conductor ${status === "active" ? "aprobado" : "rechazado"} exitosamente.`);
      } else {
        setError(res.error || "Error al actualizar");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <SurfaceCard className="rounded-[28px] p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-600">
            Neco-Dispatch · Logística
          </p>
          <h2 className="mt-2 text-2xl font-bold text-ink">Solicitudes de Conductores</h2>
          <p className="mt-1 text-sm text-ink/60">
            Aprueba o rechaza a los conductores para que puedan empezar a trabajar.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-blue-100 px-4 py-1.5 text-xs font-bold text-blue-800">
          {applications.length} pendientes
        </span>
      </div>

      {error && <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-xl">{error}</div>}
      {success && (
        <div className="mb-4 text-sm text-green-600 bg-green-50 p-3 rounded-xl">{success}</div>
      )}

      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center rounded-[18px] border border-ink/8 bg-white px-5 py-4"
            >
              <div>
                <p className="text-sm font-bold text-ink">{app.full_name}</p>
                <p className="text-xs text-ink/60 mt-1">
                  📧 {app.email || "Sin correo"} · 📱 {app.phone}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className="bg-sand/50 text-ink/70 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">
                    {app.vehicle_type}
                  </span>
                  <span className="bg-sand/50 text-ink/70 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">
                    Placa: {app.vehicle_plate}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={() => handleStatus(app.id, "active")}
                  disabled={loadingId === app.id}
                  className="flex-1 md:flex-none px-4 py-2 bg-teal text-white rounded-xl text-sm font-bold hover:bg-teal/90 transition-colors disabled:opacity-50"
                >
                  {loadingId === app.id ? "..." : "Aprobar"}
                </button>
                <button
                  onClick={() => handleStatus(app.id, "rejected")}
                  disabled={loadingId === app.id}
                  className="flex-1 md:flex-none px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-bold hover:bg-red-200 transition-colors disabled:opacity-50"
                >
                  {loadingId === app.id ? "..." : "Rechazar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-ink/8 bg-blue-50/50 px-6 py-10 text-center">
          <p className="text-3xl">🏍️</p>
          <p className="mt-3 text-sm font-semibold text-blue-900">No hay conductores pendientes</p>
          <p className="mt-1 text-xs text-blue-700/60">Todas las solicitudes han sido revisadas.</p>
        </div>
      )}
    </SurfaceCard>
  );
}
