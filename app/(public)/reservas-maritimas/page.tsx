import { Metadata } from "next";
import { MaritimeBookingWidget } from "@/components/marketplace/maritime-booking-widget";
import { parseTripSearchParams, type TripSearchParams } from "@/lib/utils/trip-search-params";

export const metadata: Metadata = {
  title: "Reservas Marítimas | Portal Necoclí",
  description:
    "Reserva tus pasajes en lancha y planes de sol hacia Capurganá, Triganá, Acandí y más. Operado por Sol y Playa S.A.S y El Caribe S.A.S.",
};

interface ReservasMaritimasPageProps {
  searchParams: Promise<TripSearchParams>;
}

export default async function ReservasMaritimasPage({ searchParams }: ReservasMaritimasPageProps) {
  const { date: initialDate, people: initialPeople } = parseTripSearchParams(await searchParams);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f1f5f9] via-[#f8fafc] to-white py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      {/* Cabecera Imponente */}
      <div className="max-w-5xl mx-auto mb-10 text-center">
        <span className="inline-block py-1.5 px-4 mb-4 text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100/90 border border-emerald-200 rounded-full shadow-sm">
          Plataforma Oficial de Navegación
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f2e21] tracking-tight mb-4 drop-shadow-sm">
          Navega hacia el Paraíso
        </h1>
        <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto font-medium leading-relaxed">
          Reserva tu viaje marítimo con seguridad y confort absoluto. Alianza oficial de confianza turística con las mejores navieras de la región.
        </p>
      </div>

      {/* Contenedor Ampliado sin doble borde */}
      <div className="max-w-[85rem] mx-auto transition-all duration-300">
        <MaritimeBookingWidget initialDate={initialDate} initialPeople={initialPeople} />
      </div>

      {/* Información Legal y Corporativa */}
      <div className="max-w-4xl mx-auto mt-20 pt-10 border-t border-slate-200">
        <details className="group">
          <summary className="text-xl font-bold text-slate-900 mb-4 cursor-pointer flex items-center justify-between list-none [&::-webkit-details-marker]:hidden bg-white border border-slate-200 hover:border-sky-400 p-5 rounded-2xl shadow-sm transition-all">
            <span>Información Legal y Corporativa</span>
            <span className="text-sm font-bold text-sky-700 flex items-center gap-1">
              <span className="group-open:hidden">Leer información</span>
              <span className="hidden group-open:inline">Ocultar</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </summary>
          <div className="prose prose-sm text-slate-700 px-4 pb-4 animate-in fade-in duration-500 font-medium leading-relaxed">
            <p>
              <strong className="text-slate-900">Proyecto de Confianza Turística:</strong> Este servicio de reserva es operado tecnológicamente por Kraken Digital Labs a través de Portal Necoclí, actuando como corredor tecnológico.
            </p>
            <p>
              El servicio de transporte marítimo es responsabilidad directa y exclusiva de nuestras navieras aliadas, quienes cuentan con todos los permisos y pólizas exigidas por la Capitanía de Puerto y la Dirección General Marítima (DIMAR):
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong className="text-slate-900">Transporte Marítimo Sol y Playa S.A.S</strong> - NIT: 901797992-1
              </li>
              <li>
                <strong className="text-slate-900">El Caribe S.A.S</strong> - NIT: 901000756-8
              </li>
            </ul>
            <p className="mt-4">
              Al generar su tiquete de pre-reserva, usted asegura su cupo en la embarcación. El pago final y definitivo se realiza de manera presencial en la taquilla de la naviera asignada, previo al embarque. Las tarifas para menores de edad indican que niños a partir de los 2 años cumplidos deben cancelar tarifa plena.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
