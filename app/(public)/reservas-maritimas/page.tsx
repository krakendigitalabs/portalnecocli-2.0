import { Metadata } from "next";
import { MaritimeBookingWidget } from "@/components/marketplace/maritime-booking-widget";

export const metadata: Metadata = {
  title: "Reservas Marítimas | Portal Necoclí",
  description:
    "Reserva tus pasajes en lancha y planes de sol hacia Capurganá, Triganá, Acandí y más. Operado por Sol y Playa S.A.S y El Caribe S.A.S.",
};

export default function ReservasMaritimasPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 md:py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#0f2e21] mb-4">
          Navega hacia el Paraíso
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Reserva tu viaje marítimo con seguridad y confort. Alianza oficial de confianza turística
          con las mejores navieras de la región.
        </p>
      </div>

      <MaritimeBookingWidget />

      {/* SEO & Legal Information below the widget */}
      <div className="max-w-4xl mx-auto mt-20 pt-10 border-t border-gray-200">
        <details className="group">
          <summary className="text-xl font-bold text-gray-900 mb-4 cursor-pointer flex items-center justify-between list-none [&::-webkit-details-marker]:hidden bg-gray-50/50 hover:bg-gray-100/50 p-4 rounded-xl transition-colors">
            <span>Información Legal y Corporativa</span>
            <span className="text-sm font-semibold text-sky-600 flex items-center gap-1">
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
          <div className="prose prose-sm text-gray-600 px-4 pb-4 animate-in fade-in duration-500">
            <p>
              <strong>Proyecto de Confianza Turística:</strong> Este servicio de reserva es operado
              tecnológicamente por Kraken Digital Labs a través de Portal Necoclí, actuando como
              corredor tecnológico.
            </p>
            <p>
              El servicio de transporte marítimo es responsabilidad directa y exclusiva de nuestras
              navieras aliadas, quienes cuentan con todos los permisos y pólizas exigidas por la
              Capitanía de Puerto y la Dirección General Marítima (DIMAR):
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Transporte Marítimo Sol y Playa S.A.S</strong> - NIT: 901797992-1
              </li>
              <li>
                <strong>El Caribe S.A.S</strong> - NIT: 901000756-8
              </li>
            </ul>
            <p className="mt-4">
              Al generar su tiquete de pre-reserva, usted asegura su cupo en la embarcación. El pago
              final y definitivo se realiza de manera presencial en la taquilla de la naviera
              asignada, previo al embarque. Las tarifas para menores de edad indican que niños a
              partir de los 2 años cumplidos deben cancelar tarifa plena.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
}
