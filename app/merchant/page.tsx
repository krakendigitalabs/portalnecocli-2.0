import { notFound } from "next/navigation";
import { AuthGuard } from "@/components/auth/auth-guard";
import { DashboardPreview } from "@/components/dashboards/dashboard-preview";
import { dashboardPreviewsEnabled } from "@/lib/config/feature-flags";

export default function MerchantPage() {
  if (!dashboardPreviewsEnabled) {
    notFound();
  }

  return (
    <AuthGuard
      allowedRoles={["admin", "business", "operator"]}
      description="Inicia sesión con una cuenta de negocio u operación para entrar al hub privado de comercios."
      title="Hub de negocios protegido"
    >
      <DashboardPreview
        title="Panel de comercio"
        description="Espacio inicial para hoteles, restaurantes, tours y operadores locales."
        metrics={[
          { label: "Perfil del negocio", value: "Pendiente" },
          { label: "Catálogo", value: "Base lista" },
          { label: "Próxima fase", value: "Marketplace" },
        ]}
      />
    </AuthGuard>
  );
}
