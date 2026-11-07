import type { Metadata } from "next";
import { ATV_ROUTES } from "@/data/atv-routes";
import { AtvRouteCard } from "@/components/tours/atv-route-card";
import { Container } from "@/components/ui/container";
import { parseTripSearchParams, type TripSearchParams } from "@/lib/utils/trip-search-params";

export const metadata: Metadata = {
  title: "Tour Cuatrimotos Necoclí | Portal Necoclí",
  description:
    "Vive una experiencia inolvidable en cuatrimoto por las veredas, pantanos, playas y paisajes de Necoclí. 4 rutas disponibles con póliza incluida. Reserva con solo el 50% de anticipación.",
};

interface TourCuatrimotoPageProps {
  searchParams: Promise<TripSearchParams>;
}

export default async function TourCuatrimotoPage({ searchParams }: TourCuatrimotoPageProps) {
  const prefill = parseTripSearchParams(await searchParams);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/60 via-white to-white pb-20">
      {/* ─── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700 py-20 md:py-28">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-black/10 blur-3xl" />

        <Container className="relative max-w-5xl text-center text-white">
          <span className="inline-block bg-white/20 text-white/90 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            🏍️ Cuatrimotos · Necoclí, Antioquia
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
            Cuatrimotos
            <br />
            <span className="text-yellow-300">Necoclí</span>
          </h1>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto leading-relaxed mb-8">
            Vive una experiencia <strong className="text-yellow-200">inolvidable</strong> en cuatrimoto.
            Recorre pantanos, veredas, playas y paisajes únicos de Necoclí.
          </p>

          {/* Included badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {[
              { icon: "⛑️", label: "Cascos incluidos" },
              { icon: "🥽", label: "Gafas incluidas" },
              { icon: "🛡️", label: "Póliza por piloto" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-semibold text-white">{item.label}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─── Indicaciones importantes ──────────────────────────────────── */}
      <section className="py-10">
        <Container className="max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
              <span className="text-2xl shrink-0">📅</span>
              <div>
                <p className="font-bold text-amber-900 text-sm mb-1">Reserva con anticipación</p>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Las reservas deben realizarse con <strong>mínimo 1 día de anticipación</strong>.
                </p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex gap-3">
              <span className="text-2xl shrink-0">🪪</span>
              <div>
                <p className="font-bold text-blue-900 text-sm mb-1">Datos requeridos por piloto</p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Nombre completo, número de cédula y tipo de sangre (requeridos para la póliza de cada piloto).
                </p>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex gap-3">
              <span className="text-2xl shrink-0">💳</span>
              <div>
                <p className="font-bold text-green-900 text-sm mb-1">Pago del 50% para reservar</p>
                <p className="text-xs text-green-700 leading-relaxed">
                  Se reserva con el <strong>50% del valor total de la ruta</strong>. El saldo restante se paga el día del tour.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ─── Rutas disponibles ─────────────────────────────────────────── */}
      <section className="py-10">
        <Container className="max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-amber-600 font-bold tracking-[0.2em] uppercase text-xs mb-3">
              Elige tu aventura
            </p>
            <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-4">
              Rutas Disponibles
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Desde recorridos familiares de 2 horas hasta aventuras extremas de pantano.
              Todas las rutas incluyen equipamiento completo de seguridad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {ATV_ROUTES.map((route) => (
              <AtvRouteCard key={route.id} route={route} prefill={prefill} />
            ))}
          </div>
        </Container>
      </section>

      {/* ─── CTA WhatsApp ──────────────────────────────────────────────── */}
      <section className="py-12">
        <Container className="max-w-3xl">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-[32px] p-8 md:p-12 text-center text-white shadow-2xl shadow-amber-200">
            <h3 className="text-2xl md:text-3xl font-black mb-3">
              ¿Tienes dudas sobre alguna ruta?
            </h3>
            <p className="text-white/80 mb-6">
              Habla directamente con nuestro operador de cuatrimotos y resuelve todas tus preguntas.
            </p>
            <a
              href="https://wa.me/573217511866?text=%C2%A1Hola!%20Quiero%20información%20sobre%20el%20tour%20en%20cuatrimoto%20en%20Necoclí."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-white text-amber-700 font-bold px-8 py-4 rounded-full hover:bg-amber-50 transition-all hover:-translate-y-0.5 shadow-lg text-base"
            >
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar por WhatsApp
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
}
