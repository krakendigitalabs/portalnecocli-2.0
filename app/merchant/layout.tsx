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
      eyebrow="Merchant Hub"
      title="Centro de operación del negocio"
      description="Gestión privada del perfil comercial, servicios, horarios y operación diaria del comercio."
    >
      {children}
    </DashboardShell>
  );
}
