import { notFound } from "next/navigation";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardPreview } from "@/components/dashboards/dashboard-preview";
import { dashboardPreviewsEnabled } from "@/lib/config/feature-flags";

export default function AdminPage() {
  if (!dashboardPreviewsEnabled) {
    notFound();
  }

  return (
    <AuthGuard
      allowedRoles={["admin"]}
      description="Inicia sesión con una cuenta administrativa autorizada para acceder al backoffice central."
      title="Backoffice protegido"
    >
      <DashboardPreview
        title="Panel administrativo"
        description="Base inicial para gestión operativa, negocios y métricas del ecosistema."
        metrics={[
          { label: "Negocios registrados", value: "24" },
          { label: "Categorías activas", value: "5" },
          { label: "Estado actual", value: "Fundación" },
        ]}
      />
    </AuthGuard>
  );
}
