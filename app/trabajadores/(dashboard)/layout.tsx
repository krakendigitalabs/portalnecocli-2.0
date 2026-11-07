import { DashboardShell } from "@/components/layout/dashboard-shell";
import { requireWorkerAccess } from "@/lib/auth/workers";

type WorkerLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function WorkerLayout({ children }: WorkerLayoutProps) {
  await requireWorkerAccess();

  return (
    <DashboardShell
      eyebrow="Operación interna"
      title="Panel operativo de trabajadores"
      description="Espacio privado para coordinar y supervisar la operación diaria de Portal Necoclí."
    >
      {children}
    </DashboardShell>
  );
}
