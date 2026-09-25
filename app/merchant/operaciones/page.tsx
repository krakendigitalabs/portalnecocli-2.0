import type { Metadata } from "next";
import { ClipboardList } from "lucide-react";
import { requireRole } from "@/lib/auth/server";
import { getMerchantDashboardData } from "@/lib/dashboards/data";
import { OperationsPanel } from "@/components/dashboards/merchant/operations-panel";

export const metadata: Metadata = {
  title: "Operaciones | Merchant Hub · Portal Necoclí",
  description: "Gestiona tus reservas y pedidos activos.",
  robots: { index: false, follow: false },
};

export default async function OperacionesPage() {
  const session = await requireRole(["business"], { nextPath: "/merchant" });
  const data = await getMerchantDashboardData(session.user.scope);

  return (
    <div className="space-y-8">
      {/* ── Encabezado ── */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-teal flex items-center gap-2">
          <ClipboardList className="h-3.5 w-3.5" />
          Gestión Operativa
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-ink">
          Reservas y Pedidos
        </h1>
        <p className="text-sm text-ink/55 max-w-xl">
          Acepta, rechaza o confirma las solicitudes de tus turistas en tiempo real.
        </p>
      </div>

      <OperationsPanel reservations={data.reservations} />
    </div>
  );
}
