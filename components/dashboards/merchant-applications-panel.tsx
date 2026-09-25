"use client";

import { useTransition, useState } from "react";
import { SurfaceCard } from "@/components/ui/surface-card";
import { approveMerchantApplication } from "@/lib/actions/merchant-application";
import { useAuthSession } from "@/hooks/use-auth-session";

type MerchantApplication = {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  category: string;
  nit: string;
  rnt?: string;
  camaraComercio?: string;
  address: string;
  description?: string;
  status: "pending" | "approved" | "rejected";
  createdAt?: any; // Firestore Timestamp
};

export function MerchantApplicationsPanel({ applications }: { applications: MerchantApplication[] }) {
  const session = useAuthSession();
  const [isPending, startTransition] = useTransition();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const pendingApps = applications.filter((app) => app.status === "pending");

  function handleApprove(id: string) {
    if (!session.user?.uid) return;
    if (confirm("¿Estás seguro de aprobar este aliado y darle acceso a la plataforma?")) {
      setLoadingId(id);
      startTransition(async () => {
        await approveMerchantApplication(id, session.user!.uid);
        setLoadingId(null);
      });
    }
  }

  return (
    <SurfaceCard className="rounded-[28px] p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-blue-600">
            Nuevas Alianzas B2B
          </p>
          <h2 className="mt-2 text-2xl font-bold text-ink">
            Solicitudes de Comercios Pendientes
          </h2>
          <p className="mt-1 text-sm text-ink/60">
            Comercios que llenaron el formulario en /aliados esperando aprobación para operar en Escrow.
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-blue-100 px-4 py-1.5 text-xs font-bold text-blue-800">
          {pendingApps.length} pendientes
        </span>
      </div>

      {pendingApps.length > 0 ? (
        <div className="grid gap-4">
          {pendingApps.map((app) => (
            <div key={app.id} className="flex flex-col gap-3 rounded-[18px] border border-ink/8 bg-white px-5 py-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-ink/5 pb-3">
                <div>
                  <p className="text-sm font-bold text-ink">{app.businessName} <span className="font-normal text-ink/60">({app.category})</span></p>
                  <p className="text-xs text-ink/50">{app.ownerName} · {app.email} · {app.phone}</p>
                </div>
                <div className="flex flex-col gap-1 text-right text-xs">
                  <span className="font-mono text-ink/70">NIT: {app.nit}</span>
                  {app.rnt && <span className="font-mono text-ink/70">RNT: {app.rnt}</span>}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-sm text-ink/80 italic leading-relaxed line-clamp-2 max-w-xl">
                  {app.description || "Sin descripción proporcionada."}
                </p>
                <button
                  onClick={() => handleApprove(app.id)}
                  disabled={isPending && loadingId === app.id}
                  className="shrink-0 rounded-full bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {isPending && loadingId === app.id ? "Aprobando..." : "✅ Aprobar Comercio"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-ink/8 bg-blue-50/50 px-6 py-10 text-center">
          <p className="text-3xl">🤝</p>
          <p className="mt-3 text-sm font-semibold text-blue-900">No hay solicitudes pendientes</p>
          <p className="mt-1 text-xs text-blue-700/60">
            Cuando nuevos negocios se registren en la plataforma, aparecerán aquí para tu revisión.
          </p>
        </div>
      )}
    </SurfaceCard>
  );
}
