import type { Metadata } from "next";
import { BarChart3 } from "lucide-react";
import { requireRole } from "@/lib/auth/server";
import { StatsPanel } from "@/components/dashboards/merchant/stats-panel";

export const metadata: Metadata = {
  title: "Métricas y Estadísticas | Merchant Hub",
  description: "Revisa tu rendimiento, ingresos y métricas Escrow.",
  robots: { index: false, follow: false },
};

export default async function EstadisticasPage() {
  await requireRole(["business"], { nextPath: "/merchant/estadisticas" });

  return (
    <div className="space-y-8">
      {/* ── Encabezado ── */}
      <div className="space-y-1 mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-teal flex items-center gap-2">
          <BarChart3 className="h-3.5 w-3.5" />
          Rendimiento
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-ink">
          Métricas y Estadísticas
        </h1>
        <p className="text-sm text-ink/55 max-w-xl">
          Analiza el rendimiento de tus negocios y tus ingresos procesados.
        </p>
      </div>

      <StatsPanel />
    </div>
  );
}
