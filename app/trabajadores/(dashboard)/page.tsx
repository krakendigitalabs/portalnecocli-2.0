import { SurfaceCard } from "@/components/ui/surface-card";
import { requireWorkerAccess } from "@/lib/auth/workers";

export default async function WorkerDashboardPage() {
  const { user } = await requireWorkerAccess();

  return (
    <SurfaceCard className="rounded-[28px] p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
        Sesión autorizada
      </p>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
        Bienvenido, {user.displayName || "equipo de operación"}.
      </h2>
      <p className="mt-4 max-w-2xl text-base leading-7 text-ink/72">
        Desde aquí se incorporarán las herramientas operativas del equipo sin mezclar este acceso
        con los paneles públicos, comerciales o de transporte.
      </p>
    </SurfaceCard>
  );
}
