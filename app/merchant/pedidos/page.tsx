import type { Metadata } from "next";
import { OrdersPanel } from "@/components/dashboards/orders-panel";
import { SurfaceCard } from "@/components/ui/surface-card";
import { getOrdersByMerchant } from "@/lib/actions/orders";
import { requireRole } from "@/lib/auth/server";

export const metadata: Metadata = {
  title: "Mis Pedidos · Portal Necoclí",
  description:
    "Gestiona en tiempo real los pedidos y solicitudes de turistas asignados a tu negocio.",
};

/** Esta página solo la pueden ver aliados con rol "business" */
export default async function MerchantOrdersPage() {
  const session = await requireRole(["business"], { nextPath: "/merchant/pedidos" });

  // Cargar pedidos filtrados por el correo del comercio logueado
  const merchantEmail = session.user.email ?? undefined;
  const orders = await getOrdersByMerchant({ merchantEmail, limit: 100 });

  return (
    <SurfaceCard className="rounded-[28px] p-6 sm:p-8">
      {/* Cabecera de sección */}
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-teal-600">
          Centro de Operaciones · Tiempo Real
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Mis Pedidos y Solicitudes
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Acepta, gestiona y cierra las órdenes que los turistas hacen a través de{" "}
          <strong>Alejandro</strong>, el Guía Local.
        </p>
      </div>

      {/* Panel interactivo de órdenes */}
      <OrdersPanel orders={orders} />
    </SurfaceCard>
  );
}
