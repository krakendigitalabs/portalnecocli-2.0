import Link from "next/link";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole, requireScope } from "@/lib/auth/server";

type MerchantLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function MerchantLayout({ children }: MerchantLayoutProps) {
  await requireRole(["business"], {
    nextPath: "/merchant",
  });
  await requireScope(
    {
      requireAssignedScope: true,
    },
    {
      nextPath: "/merchant",
    },
  );

  return (
    <DashboardShell
      eyebrow="Merchant Hub · Portal Necoclí"
      title="Centro de operación del negocio"
      description="Gestión privada del perfil comercial, saldos Escrow, y pedidos activos de turistas."
    >
      {/* ─── Navegación de tabs ─── */}
      <nav className="flex gap-1 rounded-2xl border border-slate-100 bg-slate-50 p-1.5 w-fit">
        <Link
          href="/merchant"
          className="rounded-xl px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-900 hover:shadow-sm"
        >
          📊 Dashboard
        </Link>
        <Link
          href="/merchant/pedidos"
          className="rounded-xl px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-900 hover:shadow-sm"
        >
          📋 Pedidos
        </Link>
      </nav>
      {children}
    </DashboardShell>
  );
}
