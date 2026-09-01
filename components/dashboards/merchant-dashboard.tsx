import Link from "next/link";
import { MetricCard } from "@/components/ui/metric-card";
import { SurfaceCard } from "@/components/ui/surface-card";
import { ReleaseFundsButton } from "@/components/dashboards/release-funds-button";
import type { MerchantDashboardData } from "@/lib/dashboards/data";

type MerchantDashboardProps = {
  data: MerchantDashboardData;
};

/** Formatea un número como pesos colombianos (COP) */
function formatCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function MerchantDashboard({ data }: MerchantDashboardProps) {
  const { wallet } = data;
  const totalManaged = wallet.available_balance + wallet.held_balance;

  return (
    <section className="space-y-8">
      {/* ─── Módulo Escrow: Saldos financieros ─── */}
      <div>
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.26em] text-coral">
          Módulo Escrow · Saldos en tiempo real
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {/* Saldo Disponible */}
          <SurfaceCard className="relative overflow-hidden rounded-[28px] p-7">
            <div className="absolute inset-0 bg-gradient-to-br from-teal/10 via-transparent to-transparent" />
            <div className="relative">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-teal/12 text-lg">
                ✓
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-teal/70">
                Saldo disponible
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-teal">
                {formatCOP(wallet.available_balance)}
              </p>
              <p className="mt-1 text-xs text-ink/50">Listo para retirar</p>
            </div>
          </SurfaceCard>

          {/* Saldo Retenido */}
          <SurfaceCard className="relative overflow-hidden rounded-[28px] p-7">
            <div className="absolute inset-0 bg-gradient-to-br from-coral/10 via-transparent to-transparent" />
            <div className="relative">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-coral/12 text-lg">
                ⏳
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-coral/80">
                En garantía (Escrow)
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-coral">
                {formatCOP(wallet.held_balance)}
              </p>
              <p className="mt-1 text-xs text-ink/50">Fondos en proceso de liberación</p>
            </div>
          </SurfaceCard>

          {/* Total Gestionado */}
          <SurfaceCard className="relative overflow-hidden rounded-[28px] p-7">
            <div className="absolute inset-0 bg-gradient-to-br from-ink/6 via-transparent to-transparent" />
            <div className="relative">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink/8 text-lg">
                💼
              </span>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-ink/50">
                Total gestionado
              </p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-ink">
                {formatCOP(totalManaged)}
              </p>
              <p className="mt-1 text-xs text-ink/50">Disponible + En garantía</p>
            </div>
          </SurfaceCard>
        </div>
      </div>

      {/* ─── Separador visual ─── */}
      <div className="h-px w-full bg-ink/8" />

      {/* ─── Historial de Transacciones Escrow ─── */}
      <SurfaceCard className="rounded-[28px] p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
          Flujo de Caja · Historial Escrow
        </p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
          Gestión de tus reservas y garantías
        </h2>
        
        {data.escrowTransactions && data.escrowTransactions.length > 0 ? (
          <div className="mt-6 space-y-4">
            {data.escrowTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex flex-col gap-4 rounded-[22px] border border-ink/8 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-lg font-semibold text-ink">
                    Boleto #{tx.reservationId.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-sm text-ink/68">
                    Pago Neto: {formatCOP(tx.netAmountToBusiness)} · Fecha: {tx.createdAt.toLocaleDateString("es-CO")}
                  </p>
                  {tx.officialTicketUrl && (
                    <a href={tx.officialTicketUrl} target="_blank" rel="noreferrer" className="text-xs font-medium text-coral hover:underline">
                      Ver Ticket Wompi
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  {tx.status === "held" ? (
                    <div className="flex items-center gap-4">
                      <span className="rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase text-coral">
                        Retenido en Garantía
                      </span>
                      <ReleaseFundsButton transactionId={tx.id || ""} />
                    </div>
                  ) : tx.status === "released" ? (
                    <span className="rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold uppercase text-teal">
                      Liberado ✓
                    </span>
                  ) : (
                    <span className="rounded-full bg-ink/10 px-3 py-1 text-xs font-semibold uppercase text-ink">
                      {tx.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-6 text-base leading-7 text-ink/70">
            Aún no tienes transacciones Escrow procesadas.
          </p>
        )}
      </SurfaceCard>

      {/* ─── Separador visual ─── */}
      <div className="h-px w-full bg-ink/8" />

      {/* ─── Métricas de operación ─── */}
      <div>
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.26em] text-ink/45">
          Métricas de operación
        </p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data.metrics.map((metric) => (
            <MetricCard key={metric.label} label={metric.label} value={metric.value} />
          ))}
        </div>
      </div>

      {/* ─── Scope y negocios ─── */}
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <SurfaceCard className="rounded-[28px] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
            Scope autorizado
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
            Cobertura actual de tu operación
          </h2>
          <div className="mt-6 grid gap-3">
            {data.serviceTypeSummary.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between rounded-[20px] border border-ink/8 bg-ink/[0.03] px-4 py-3"
              >
                <span className="text-sm font-medium capitalize text-ink/72">{item.label}</span>
                <span className="text-lg font-semibold text-ink">{item.value}</span>
              </div>
            ))}
          </div>
        </SurfaceCard>

        <SurfaceCard className="rounded-[28px] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
            Negocios bajo gestión
          </p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
            Fichas visibles dentro de tu tenant o scope
          </h2>

          {data.businesses.length > 0 ? (
            <div className="mt-6 space-y-4">
              {data.businesses.map((business) => (
                <div
                  key={business.id}
                  className="rounded-[22px] border border-ink/8 bg-white px-5 py-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-ink">{business.name}</p>
                      <p className="text-sm text-ink/68">
                        {business.category} · tenant {business.tenantId}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-semibold text-teal">
                        {business.rating ? `Rating ${business.rating.toFixed(1)}` : "Sin rating"}
                      </span>
                      <Link
                        className="text-sm font-semibold text-coral transition hover:text-coral/80"
                        href={`/negocios/${business.slug}`}
                      >
                        Abrir ficha
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-base leading-7 text-ink/70">
              Tu cuenta no tiene negocios visibles dentro del scope autorizado.
            </p>
          )}
        </SurfaceCard>
      </div>
    </section>
  );
}
