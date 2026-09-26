import { MerchantBottomNav } from "@/components/dashboards/merchant/merchant-bottom-nav";
import { MerchantSidebar } from "@/components/dashboards/merchant/merchant-sidebar";
import { requireRole, requireScope } from "@/lib/auth/server";

type MerchantLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function MerchantLayout({ children }: MerchantLayoutProps) {
  await requireRole(["business", "driver"], {
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
    // Layout raíz: fila horizontal en desktop, columna en mobile
    <div className="flex min-h-screen bg-mist">
      {/* ── Sidebar: visible solo en tablet/desktop ── */}
      <MerchantSidebar />

      {/* ── Área de contenido principal ── */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        {/* Padding top estándar + padding bottom extra en mobile para la BottomNav */}
        <div className="px-4 py-6 md:px-8 md:py-10 pb-24 md:pb-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* ── Bottom Nav: visible solo en mobile ── */}
      <MerchantBottomNav />
    </div>
  );
}

