import { requireRole } from "@/lib/auth/server";
import { DashboardShell } from "@/components/layout/dashboard-shell";

type AdminLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await requireRole(["admin"], { nextPath: "/admin" });

  return (
    <DashboardShell
      eyebrow="Backoffice"
      title="Administración central"
      description="Base operativa para gobierno del marketplace, supervisión y evolución de módulos internos."
    >
      {children}
    </DashboardShell>
  );
}
