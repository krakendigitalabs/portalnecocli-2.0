import type { Metadata } from "next";
import { MerchantRegistrationForm } from "@/components/auth/merchant-registration-form";
import { Container } from "@/components/ui/container";
import { SurfaceCard } from "@/components/ui/surface-card";

export const metadata: Metadata = {
  title: "Regístrate como Aliado · Portal Necoclí",
  description:
    "Conecta tu hotel, restaurante, tour, transporte o comercio con miles de turistas que visitan Necoclí. Registro gratuito, comisión solo por ventas reales.",
  alternates: {
    canonical: "https://portalnecocli.com/aliados",
  },
  openGraph: {
    title: "Sé Aliado de Portal Necoclí",
    description: "Conecta tu negocio con turistas reales. Sin costo fijo, solo comisión por venta.",
    url: "https://portalnecocli.com/aliados",
  },
};

export default function AliadosPage() {
  return (
    <main>
      <Container className="pb-16 pt-8 space-y-10 max-w-3xl">
        {/* ─── Hero del portal ─── */}
        <SurfaceCard className="relative overflow-hidden rounded-[32px] p-8 md:p-10">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-sky-400/5 pointer-events-none" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-600">
              Portal Necoclí · Alianzas B2B
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Conecta tu negocio con el turismo de Necoclí
            </h1>
            <p className="mt-4 text-base leading-relaxed text-slate-600 max-w-2xl">
              Únete a la plataforma digital de turismo más completa del Caribe colombiano. Sin costo
              de afiliación, sin mensualidades. Solo pagas cuando generas ventas reales. El sistema
              se encarga del cobro, la logística y los correos.{" "}
              <strong className="text-slate-800">
                Tú solo te preocupas por dar el mejor servicio.
              </strong>
            </p>
            {/* Beneficios */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                {
                  emoji: "🤝",
                  title: "Alianza sin riesgo",
                  desc: "Sin cuota mensual. Solo comisión por venta real.",
                },
                {
                  emoji: "📧",
                  title: "Órdenes automáticas",
                  desc: "Recibe pedidos directo en tu correo desde el chatbot.",
                },
                {
                  emoji: "💰",
                  title: "Escrow seguro",
                  desc: "El portal garantiza el pago antes de que entregues el servicio.",
                },
              ].map((b) => (
                <div key={b.title} className="rounded-2xl border border-slate-100 bg-white p-4">
                  <p className="text-2xl">{b.emoji}</p>
                  <p className="mt-2 text-sm font-bold text-slate-800">{b.title}</p>
                  <p className="mt-1 text-xs text-slate-500 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </SurfaceCard>

        {/* ─── Formulario de registro ─── */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">Formulario de Registro</h2>
          <p className="text-sm text-slate-500 mb-6">
            Completa los datos con información real y verificable. El equipo de Kraken Digital Labs
            revisará tu solicitud en menos de <strong>48 horas hábiles</strong>.
          </p>
          <MerchantRegistrationForm />
        </div>
      </Container>
    </main>
  );
}
