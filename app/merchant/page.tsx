import { DashboardPreview } from "@/components/dashboards/dashboard-preview";

export default function MerchantPage() {
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
