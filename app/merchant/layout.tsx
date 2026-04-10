import { requireRole, requireScope } from "@/lib/auth/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";

type MerchantLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function MerchantLayout({ children }: MerchantLayoutProps) {
  await requireRole(["admin", "business", "operator"], {
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
      eyebrow="Merchant Hub"
      title="Espacio de negocios"
      description="Base lista para hoteles, restaurantes, tours y operadores que gestionarán su presencia en la plataforma."
    >
      {children}
    </DashboardShell>
  );
}
