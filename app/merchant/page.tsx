import type { Metadata } from "next";
import { MerchantDashboard } from "@/components/dashboards/merchant-dashboard";
import { requireRole } from "@/lib/auth/server";
import { getMerchantDashboardData } from "@/lib/dashboards/data";

export const metadata: Metadata = {
  title: "Dashboard Comercio | Portal Necoclí",
  description: "Gestiona tus reservas, saldos Escrow y operaciones desde el Merchant Hub.",
  robots: { index: false, follow: false },
};

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "¡Buenos días";
  if (hour < 18) return "¡Buenas tardes";
  return "¡Buenas noches";
}

export default async function MerchantPage() {
  const session = await requireRole(["business"], {
    nextPath: "/merchant",
  });

  const data = await getMerchantDashboardData(session.user.scope);

  return (
    <div className="space-y-8">
      {/* ── Encabezado de bienvenida ── */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-teal">
          Merchant Hub · Portal Necoclí
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-ink">
          {getGreeting()}, {session.user.displayName?.split(" ")[0] ?? "Aliado"}! 👋
        </h1>
        <p className="text-sm text-ink/55 max-w-xl">
          Aquí tienes el resumen de tu operación. Tus saldos Escrow y reservas activas en tiempo real.
        </p>
      </div>

      <MerchantDashboard data={data} />
    </div>
  );
}
