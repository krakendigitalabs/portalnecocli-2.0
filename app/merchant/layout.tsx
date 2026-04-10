import { DashboardShell } from "@/components/layout/dashboard-shell";

type MerchantLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function MerchantLayout({ children }: MerchantLayoutProps) {
  return (
    <DashboardShell
      eyebrow="Merchant Hub"
      title="Espacio de negocios"
      description="Base lista para hoteles, restaurantes, tours y operadores que gestionarán su presencia en la plataforma."
    >
      {children}
    </DashboardShell>
  );
}
