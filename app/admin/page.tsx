import { DashboardPreview } from "@/components/dashboards/dashboard-preview";

export default function AdminPage() {
  return (
    <DashboardPreview
      title="Panel administrativo"
      description="Base inicial para gestión operativa, negocios y métricas del ecosistema."
      metrics={[
        { label: "Negocios registrados", value: "24" },
        { label: "Categorías activas", value: "5" },
        { label: "Estado actual", value: "Fundación" },
      ]}
    />
  );
}
