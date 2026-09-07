import Link from "next/link";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { SuperAdminDashboardData } from "@/lib/dashboards/data";
import type { EscrowTransaction } from "@/lib/validations/schemas";
import type { Reservation } from "@/types/reservation";

type AdminDashboardProps = {
  data: SuperAdminDashboardData;
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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: "Pendiente",
  PAID: "Pagado ✓",
  CONFIRMED: "Confirmado",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
};

const STATUS_COLOR: Record<string, string> = {
  PENDING_PAYMENT: "text-amber-600 bg-amber-50 border-amber-200",
  PAID: "text-teal bg-teal/8 border-teal/20",
  CONFIRMED: "text-teal bg-teal/8 border-teal/20",
  COMPLETED: "text-green-700 bg-green-50 border-green-200",
  CANCELLED: "text-ink/50 bg-ink/5 border-ink/10",
};

function KpiCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <SurfaceCard className="rounded-[24px] p-6">
      <p className={`text-3xl font-extrabold ${accent ?? "text-ink"}`}>{value}</p>
      <p className="mt-1 text-sm font-semibold text-ink">{label}</p>
      {sub && <p className="mt-0.5 text-xs text-ink/45">{sub}</p>}
    </SurfaceCard>
  );
}

function LeadRow({ reservation }: { reservation: Reservation }) {
  const statusColor = STATUS_COLOR[reservation.status] ?? "text-ink/50 bg-ink/5 border-ink/10";
  return (
    <div className="flex flex-col gap-3 rounded-[18px] border border-ink/8 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-ink">{reservation.lead?.full_name ?? "—"}</p>
        <p className="mt-0.5 text-xs text-ink/50">
          {reservation.business_name} · {formatDate(reservation.created_at)}
        </p>
        <p className="mt-0.5 text-xs text-ink/40 font-mono">{reservation.reference_code}</p>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-sm font-semibold text-ink">{formatCOP(reservation.total_amount / 100)}</p>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusColor}`}>
          {STATUS_LABEL[reservation.status] ?? reservation.status}
        </span>
        {reservation.escrow_transaction_id && (
          <Link
            href={`/tickets/${reservation.escrow_transaction_id}`}
            className="text-[10px] font-bold uppercase tracking-wider text-coral hover:underline"
          >
            Ver Ticket →
          </Link>
        )}
      </div>
    </div>
  );
}

function EscrowRow({ tx }: { tx: EscrowTransaction }) {
  return (
    <div className="flex flex-col gap-3 rounded-[18px] border border-ink/8 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-bold text-ink font-mono">
          #{(tx.id ?? "").slice(-8).toUpperCase()}
        </p>
        <p className="mt-0.5 text-xs text-ink/50">
          Negocio: {tx.businessId ?? "—"} · {tx.createdAt instanceof Date
            ? formatDate(tx.createdAt.toISOString())
            : "—"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-sm font-semibold text-ink">
          {formatCOP(tx.netAmountToBusiness)}
        </p>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${
            tx.status === "held"
              ? "text-coral bg-coral/8 border-coral/20"
              : tx.status === "released"
                ? "text-teal bg-teal/8 border-teal/20"
                : "text-ink/50 bg-ink/5 border-ink/10"
          }`}
        >
          {tx.status === "held" ? "⏳ Retenido" : tx.status === "released" ? "✓ Liberado" : tx.status}
        </span>
      </div>
    </div>
  );
}

export function AdminDashboard({ data }: AdminDashboardProps) {
  const { kpis, recentReservations, escrowTransactions, businesses, serviceTypeSummary } = data;

  return (
    <section className="space-y-10">
      {/* ─── Header Centro de Mando ─── */}
      <div className="relative overflow-hidden rounded-[32px] bg-ink p-8 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-teal/20 via-transparent to-coral/10" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-teal">
            🧠 Centro de Mando · Kraken Digital Labs
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-tight">
            Panel SuperAdmin
          </h1>
          <p className="mt-1 text-white/50 text-sm">
            Monitoreo en tiempo real de leads, escrow y operaciones de Portal Necoclí
          </p>
        </div>
      </div>

      {/* ─── KPIs Financieros ─── */}
      <div>
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.26em] text-ink/45">
          KPIs Financieros · Tiempo Real
        </p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Total Leads Capturados"
            value={String(kpis.totalLeads)}
            sub="Reservas registradas en Firestore"
            accent="text-teal"
          />
          <KpiCard
            label="Fondos Retenidos (Escrow)"
            value={formatCOP(kpis.totalHeldAmount)}
            sub="Pendientes de liberar al comercio"
            accent="text-coral"
          />
          <KpiCard
            label="Fondos Liberados"
            value={formatCOP(kpis.totalReleasedAmount)}
            sub="Transferidos exitosamente"
            accent="text-green-600"
          />
          <KpiCard
            label="Reservas Pendientes de Pago"
            value={String(kpis.pendingPaymentCount)}
            sub={`${kpis.paidCount} pagadas · ${kpis.completedCount} completadas`}
            accent="text-amber-600"
          />
        </div>
      </div>

      <div className="h-px w-full bg-ink/8" />

      {/* ─── Monitor de Leads ─── */}
      <SurfaceCard className="rounded-[28px] p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
              Base de Leads · Oro Comercial
            </p>
            <h2 className="mt-2 text-2xl font-bold text-ink">
              Reservas y Solicitudes Recientes
            </h2>
            <p className="mt-1 text-sm text-ink/60">
              Capturadas por el motor de triangulación. Cada fila es un lead de valor.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-teal/10 px-4 py-1.5 text-xs font-bold text-teal">
            {recentReservations.length} registros
          </span>
        </div>

        {recentReservations.length > 0 ? (
          <div className="space-y-3">
            {recentReservations.map((res) => (
              <LeadRow key={res.id} reservation={res} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-ink/8 bg-sand/40 px-6 py-10 text-center">
            <p className="text-3xl">📭</p>
            <p className="mt-3 text-sm font-semibold text-ink">No hay leads capturados aún</p>
            <p className="mt-1 text-xs text-ink/50">
              Las reservas comenzarán a aparecer aquí a medida que los turistas usen el portal
            </p>
          </div>
        )}
      </SurfaceCard>

      <div className="h-px w-full bg-ink/8" />

      {/* ─── Monitor Escrow Global ─── */}
      <SurfaceCard className="rounded-[28px] p-8">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
            Bóveda Escrow · Flujo de Fondos Global
          </p>
          <h2 className="mt-2 text-2xl font-bold text-ink">
            Transacciones de Retención y Liberación
          </h2>
        </div>

        {escrowTransactions.length > 0 ? (
          <div className="space-y-3">
            {escrowTransactions.map((tx) => (
              <EscrowRow key={tx.id} tx={tx} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink/50">
            No hay transacciones Escrow registradas aún. Se crearán automáticamente cuando se
            confirmen los pagos de Wompi.
          </p>
        )}
      </SurfaceCard>

      <div className="h-px w-full bg-ink/8" />

      {/* ─── Distribución por tipo de servicio ─── */}
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <SurfaceCard className="rounded-[28px] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
            Cobertura del marketplace
          </p>
          <h2 className="mt-3 text-2xl font-bold text-ink">Distribución por categoría</h2>
          <div className="mt-6 grid gap-3">
            {serviceTypeSummary.map((item) => (
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
          <h2 className="mt-3 text-2xl font-bold text-ink">
            Aliados del Ecosistema ({businesses.length})
          </h2>
          <div className="mt-6 space-y-3">
            {businesses.slice(0, 8).map((business) => (
              <div
                key={business.id}
                className="flex items-center justify-between rounded-[18px] border border-ink/8 bg-white px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{business.name}</p>
                  <p className="text-xs text-ink/50">{business.category} · tenant {business.tenantId}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-semibold text-teal">
                    {business.rating ? `⭐ ${business.rating.toFixed(1)}` : "Sin rating"}
                  </span>
                  <Link
                    href={`/negocios/${business.slug}`}
                    className="text-xs font-bold text-coral hover:underline"
                  >
                    Ver →
                  </Link>
                </div>
              </div>
            ))}
            {businesses.length > 8 && (
              <p className="text-center text-xs text-ink/40 pt-2">
                +{businesses.length - 8} negocios más en el ecosistema
              </p>
            )}
          </div>
        </SurfaceCard>
      </div>
    </section>
  );
}
