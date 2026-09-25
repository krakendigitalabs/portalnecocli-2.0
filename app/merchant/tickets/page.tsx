import type { Metadata } from "next";
import { QrCode } from "lucide-react";
import { requireRole } from "@/lib/auth/server";
import { TicketRedemptionWidget } from "@/components/dashboards/merchant/ticket-redemption-widget";

export const metadata: Metadata = {
  title: "Redención de Tickets | Merchant Hub · Portal Necoclí",
  description: "Valida y redime los tickets de tus clientes para liberar fondos Escrow.",
  robots: { index: false, follow: false },
};

export default async function TicketsPage() {
  await requireRole(["business"], { nextPath: "/merchant" });

  return (
    <div className="space-y-8">
      {/* ── Encabezado ── */}
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-teal flex items-center gap-2">
          <QrCode className="h-3.5 w-3.5" />
          Control de Acceso
        </p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-ink">
          Redención de Tickets
        </h1>
        <p className="text-sm text-ink/55 max-w-xl">
          Ingresa el código del ticket del cliente para confirmar el servicio prestado y liberar los fondos retenidos en Escrow.
        </p>
      </div>

      <TicketRedemptionWidget />
    </div>
  );
}
