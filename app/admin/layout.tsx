import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/lib/auth/server";

type AdminLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function AdminLayout({ children }: AdminLayoutProps) {
  await requireRole(["super_admin", "admin"], { nextPath: "/admin" });

  return (
    <DashboardShell
      eyebrow="Backoffice"
      title="Administración central"
      description="Supervisión global de comercios, moderación, usuarios y control operativo del ecosistema."
    >
      {children}
    </DashboardShell>
  );
}
