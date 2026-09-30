"use client";

import { BarChart3 } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { TrafficSummary } from "@/lib/analytics/analytics-api";

export function AnalyticsDashboard({ data }: { data: TrafficSummary }) {
  return (
    <SurfaceCard className="rounded-[28px] p-8 col-span-full overflow-hidden">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-emerald-600 dark:text-emerald-400">
            Inteligencia de Negocios (GA4)
          </p>
          <h2 className="mt-2 text-2xl font-bold text-ink flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Tráfico y Rendimiento (Últimos 30 días)
          </h2>
          <p className="mt-1 text-sm text-ink/60">
            Métricas de adquisición de usuarios directamente de Google Analytics.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-[20px] border border-ink/8 bg-ink/[0.03] px-6 py-4">
          <p className="text-xs font-semibold uppercase text-ink/60 mb-1">Vistas de Página</p>
          <p className="text-3xl font-extrabold text-ink">{data.totalPageViews.toLocaleString()}</p>
        </div>
        <div className="rounded-[20px] border border-ink/8 bg-ink/[0.03] px-6 py-4">
          <p className="text-xs font-semibold uppercase text-ink/60 mb-1">Sesiones Totales</p>
          <p className="text-3xl font-extrabold text-emerald-700">
            {data.totalSessions.toLocaleString()}
          </p>
        </div>
        <div className="rounded-[20px] border border-ink/8 bg-ink/[0.03] px-6 py-4">
          <p className="text-xs font-semibold uppercase text-ink/60 mb-1">Usuarios Activos (30d)</p>
          <p className="text-3xl font-extrabold text-coral">
            {data.totalActiveUsers.toLocaleString()}
          </p>
        </div>
        <div className="rounded-[20px] border border-coral/30 bg-coral/5 px-6 py-4 relative overflow-hidden">
          <div className="absolute top-4 right-4 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-coral"></span>
          </div>
          <p className="text-xs font-semibold uppercase text-coral mb-1">En Tiempo Real (30m)</p>
          <p className="text-3xl font-extrabold text-coral">
            {data.realtimeActiveUsers?.toLocaleString() || 0}
          </p>
        </div>
      </div>

      <div className="w-full aspect-[21/9] min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data.trafficByDate}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f2e21" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#0f2e21" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff6b4a" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#ff6b4a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickFormatter={(val) => {
                const parts = val.split("-");
                if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
                return val;
              }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "none",
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ fontWeight: "bold", color: "#1f2937", marginBottom: "4px" }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area
              type="monotone"
              dataKey="screenPageViews"
              name="Vistas"
              stroke="#0f2e21"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorViews)"
            />
            <Area
              type="monotone"
              dataKey="activeUsers"
              name="Usuarios"
              stroke="#ff6b4a"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorUsers)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </SurfaceCard>
  );
}
