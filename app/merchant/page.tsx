import { notFound } from "next/navigation";
import { DashboardPreview } from "@/components/dashboards/dashboard-preview";
import { dashboardPreviewsEnabled } from "@/lib/config/feature-flags";

export default function MerchantPage() {
  if (!dashboardPreviewsEnabled) {
    notFound();
  }

  return (
    <DashboardPreview
      title="Panel de comercio"
      description="Espacio inicial para hoteles, restaurantes, tours y operadores locales."
      metrics={[
        { label: "Perfil del negocio", value: "Pendiente" },
        { label: "Catálogo", value: "Base lista" },
        { label: "Próxima fase", value: "Marketplace" },
      ]}
    />
  );
}
