"use client";

import { SurfaceCard } from "@/components/ui/surface-card";
import { updateDriverStatusAction } from "@/app/actions/drivers";
import { useState } from "react";

export function AllDriversPanel({ drivers }: { drivers: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const activeDrivers = drivers.filter((d) => d.status === "active");
  const rejectedDrivers = drivers.filter((d) => d.status === "rejected");

  async function handleStatus(driverId: string, status: "active" | "rejected") {
    setLoadingId(driverId);
    try {
      await updateDriverStatusAction(driverId, status);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <SurfaceCard className="rounded-[28px] p-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-teal">
            Neco-Dispatch
          </p>
          <h2 className="mt-2 text-2xl font-bold text-ink">Conductores Activos</h2>
          <p className="mt-1 text-sm text-ink/60">Flota operando en la plataforma.</p>
        </div>

        {activeDrivers.length > 0 ? (
          <div className="space-y-4">
            {activeDrivers.map((driver) => (
              <div
                key={driver.id}
                className="flex justify-between items-center rounded-[18px] border border-ink/8 bg-teal/5 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-bold text-ink">{driver.full_name}</p>
                  <p className="text-xs text-ink/60 mt-1">
                    {driver.phone} · {driver.vehicle_type}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-bold text-teal">
                    Saldo: ${driver.wallet_balance || 0}
                  </span>
                  <button
                    onClick={() => handleStatus(driver.id, "rejected")}
                    disabled={loadingId === driver.id}
                    className="text-[10px] text-red-500 uppercase font-bold hover:underline disabled:opacity-50"
                  >
                    Desactivar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink/50 text-center py-4">No hay conductores activos.</p>
        )}
      </SurfaceCard>

      <SurfaceCard className="rounded-[28px] p-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-red-600">
            Neco-Dispatch
          </p>
          <h2 className="mt-2 text-2xl font-bold text-ink">Conductores Rechazados</h2>
          <p className="mt-1 text-sm text-ink/60">Lista negra o solicitudes denegadas.</p>
        </div>

        {rejectedDrivers.length > 0 ? (
          <div className="space-y-4">
            {rejectedDrivers.map((driver) => (
              <div
                key={driver.id}
                className="flex justify-between items-center rounded-[18px] border border-ink/8 bg-red-50/50 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-bold text-ink">{driver.full_name}</p>
                  <p className="text-xs text-ink/60 mt-1">
                    {driver.phone} · {driver.vehicle_type}
                  </p>
                </div>
                <button
                  onClick={() => handleStatus(driver.id, "active")}
                  disabled={loadingId === driver.id}
                  className="text-[10px] text-teal uppercase font-bold hover:underline disabled:opacity-50"
                >
                  Restaurar
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink/50 text-center py-4">No hay conductores rechazados.</p>
        )}
      </SurfaceCard>
    </div>
  );
}
