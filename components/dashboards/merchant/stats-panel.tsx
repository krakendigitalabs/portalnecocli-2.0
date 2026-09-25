"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { SurfaceCard } from "@/components/ui/surface-card";
import { TrendingUp, Users, DollarSign, Calendar } from "lucide-react";

// Datos de demostración atractivos
const monthlyData = [
  { name: 'Ene', ingresos: 4500000, reservas: 32 },
  { name: 'Feb', ingresos: 5200000, reservas: 40 },
  { name: 'Mar', ingresos: 4800000, reservas: 35 },
  { name: 'Abr', ingresos: 6100000, reservas: 50 },
  { name: 'May', ingresos: 5900000, reservas: 45 },
  { name: 'Jun', ingresos: 7500000, reservas: 60 },
  { name: 'Jul', ingresos: 8200000, reservas: 75 },
];

const trafficData = [
  { name: 'L', vistas: 120 },
  { name: 'M', vistas: 140 },
  { name: 'X', vistas: 180 },
  { name: 'J', vistas: 220 },
  { name: 'V', vistas: 350 },
  { name: 'S', vistas: 480 },
  { name: 'D', vistas: 400 },
];

function formatCOP(value: number) {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  return `$${(value / 1000).toFixed(0)}K`;
}

export function StatsPanel() {
  return (
    <div className="space-y-8">
      {/* ─── Kpis Superiores ─── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SurfaceCard className="p-6 rounded-[24px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-teal/10 p-2 rounded-lg">
              <DollarSign className="w-4 h-4 text-teal" />
            </div>
            <p className="text-sm font-semibold text-ink/70">Ingresos Totales</p>
          </div>
          <p className="text-3xl font-extrabold text-ink">$42.2M</p>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="font-medium text-green-600">+12.5%</span>
            <span className="text-ink/40">vs mes anterior</span>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-6 rounded-[24px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-coral/10 p-2 rounded-lg">
              <Calendar className="w-4 h-4 text-coral" />
            </div>
            <p className="text-sm font-semibold text-ink/70">Reservas (Mes)</p>
          </div>
          <p className="text-3xl font-extrabold text-ink">75</p>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="font-medium text-green-600">+8.2%</span>
            <span className="text-ink/40">vs mes anterior</span>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-6 rounded-[24px]">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-400/10 p-2 rounded-lg">
              <Users className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-sm font-semibold text-ink/70">Visualizaciones</p>
          </div>
          <p className="text-3xl font-extrabold text-ink">3,420</p>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <TrendingUp className="w-3 h-3 text-green-600" />
            <span className="font-medium text-green-600">+22.4%</span>
            <span className="text-ink/40">vs mes anterior</span>
          </div>
        </SurfaceCard>
        
        <SurfaceCard className="p-6 rounded-[24px] bg-gradient-to-br from-ink to-ink/90 text-white border-0 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/10 p-2 rounded-lg">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm font-semibold text-white/80">Por liberar Escrow</p>
          </div>
          <p className="text-3xl font-extrabold text-white">$1.8M</p>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-white/60">Acreditación en 24h</span>
          </div>
        </SurfaceCard>
      </div>

      {/* ─── Gráfica Principal: Evolución de Ingresos ─── */}
      <SurfaceCard className="p-8 rounded-[32px] border border-ink/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-xl font-bold text-ink">Evolución de Ingresos y Reservas</h2>
            <p className="text-sm text-ink/60 mt-1">Rendimiento histórico procesado a través de Portal Necoclí.</p>
          </div>
          <select className="bg-sand/50 border border-ink/10 rounded-xl px-4 py-2 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal text-ink/80">
            <option>Últimos 7 meses</option>
            <option>Año 2026</option>
          </select>
        </div>

        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0D9488" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
              <YAxis 
                yAxisId="left"
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 12 }} 
                tickFormatter={formatCOP} 
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 12 }} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', fontWeight: 'bold' }}
                formatter={(value: any, name: any) => [
                  name === 'ingresos' ? `$${Number(value).toLocaleString('es-CO')}` : value,
                  name === 'ingresos' ? 'Ingresos COP' : 'Reservas'
                ]}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Area 
                yAxisId="left"
                type="monotone" 
                dataKey="ingresos" 
                stroke="#0D9488" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorIngresos)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#0D9488' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SurfaceCard>

      {/* ─── Gráficas Secundarias ─── */}
      <div className="grid gap-6 lg:grid-cols-2">
        <SurfaceCard className="p-8 rounded-[32px] border border-ink/5">
          <h2 className="text-xl font-bold text-ink mb-1">Tráfico de la Ficha (Semanal)</h2>
          <p className="text-sm text-ink/60 mb-6">Visualizaciones de tu negocio por día de la semana.</p>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="vistas" fill="#F43F5E" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-8 rounded-[32px] border border-ink/5 flex flex-col justify-center bg-gradient-to-br from-amber-400/10 via-transparent to-transparent">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm mb-4">
              <TrendingUp className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-2xl font-extrabold text-ink mb-2">¡Tu negocio está en llamas! 🔥</h3>
            <p className="text-ink/70 leading-relaxed mb-6 max-w-sm mx-auto">
              Tus vistas aumentaron un <strong>22%</strong> esta semana. Aprovecha el momento lanzando una promoción o activando un <strong>Boost de Posicionamiento</strong> en el Portal.
            </p>
            <button className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all">
              Activar Boost Ads
            </button>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
