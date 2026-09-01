import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireRole } from "@/lib/auth/server";

type CustomerLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function CustomerLayout({ children }: CustomerLayoutProps) {
  await requireRole(["customer", "business", "admin", "super_admin"], {
    nextPath: "/customer",
  });

  return (
    <DashboardShell
      eyebrow="Mi Portal · Turista"
      title="Tu espacio personal en Necoclí"
      description="Gestiona tus reservas, estrellas de fidelidad, bonos activos y el historial de tus experiencias en el Golfo de Urabá."
    >
      {children}
    </DashboardShell>
  );
}
