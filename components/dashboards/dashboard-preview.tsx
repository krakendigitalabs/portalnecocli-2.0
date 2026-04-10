import { MetricCard } from "@/components/ui/metric-card";
import { SurfaceCard } from "@/components/ui/surface-card";

type DashboardMetric = { label: string; value: string };

type DashboardPreviewProps = {
  title: string;
  description: string;
  metrics: DashboardMetric[];
};

export function DashboardPreview({
  title,
  description,
  metrics,
}: DashboardPreviewProps) {
  return (
    <section className="space-y-8">
      <SurfaceCard className="rounded-[28px] p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
              Vista inicial
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
              {title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink/72">
              {description}
            </p>
          </div>
        </div>
      </SurfaceCard>
      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
          />
        ))}
      </div>
    </section>
  );
}
