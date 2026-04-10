import { DashboardShell } from "@/components/layout/dashboard-shell";

type AdminLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function AdminLayout({ children }: AdminLayoutProps) {
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
