import Link from "next/link";
import { MetricCard } from "@/components/ui/metric-card";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { MerchantDashboardData } from "@/lib/dashboards/data";

type MerchantDashboardProps = {
  data: MerchantDashboardData;
};

export function MerchantDashboard({ data }: MerchantDashboardProps) {
  return (
    <section className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
          />
        ))}
      </div>

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
                <span className="text-sm font-medium capitalize text-ink/72">
                  {item.label}
                </span>
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
