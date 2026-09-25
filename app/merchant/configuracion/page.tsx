import type { Metadata } from "next";
import { Settings } from "lucide-react";
import { requireRole } from "@/lib/auth/server";
import { SettingsPanel } from "@/components/dashboards/merchant/settings-panel";

export const metadata: Metadata = {
  title: "Configuración | Merchant Hub",
  description: "Ajustes de cuenta, métodos de pago y perfiles de negocios.",
  robots: { index: false, follow: false },
};

export default async function ConfiguracionPage() {
  await requireRole(["business"], { nextPath: "/merchant/configuracion" });

  return (
    <div className="space-y-8">
      {/* ── Encabezado ── */}
      <div className="space-y-1 mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-teal flex items-center gap-2">
          <Settings className="h-3.5 w-3.5" />
          Preferencias
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-ink">
          Configuración Operativa
        </h1>
        <p className="text-sm text-ink/55 max-w-xl">
          Administra tus métodos de pago para liquidación y ajusta los detalles de tu cuenta.
        </p>
      </div>

      <SettingsPanel />
    </div>
  );
}
