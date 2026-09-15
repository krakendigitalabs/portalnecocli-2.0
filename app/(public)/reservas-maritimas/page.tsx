import { Metadata } from "next";
import { MaritimeBookingWidget } from "@/components/marketplace/maritime-booking-widget";

export const metadata: Metadata = {
  title: "Reservas Marítimas | Portal Necoclí",
  description: "Reserva tus pasajes en lancha y planes de sol hacia Capurganá, Triganá, Acandí y más. Operado por Sol y Playa S.A.S y El Caribe S.A.S.",
};

export default function ReservasMaritimasPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 md:py-20 px-4 sm:px-6">
      
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#0f2e21] mb-4">
          Navega hacia el Paraíso
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Reserva tu viaje marítimo con seguridad y confort. Alianza oficial de confianza turística con las mejores navieras de la región.
        </p>
      </div>

      <MaritimeBookingWidget />

      {/* SEO & Legal Information below the widget */}
      <div className="max-w-4xl mx-auto mt-20 pt-10 border-t border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Información Legal y Corporativa</h3>
        <div className="prose prose-sm text-gray-600">
          <p>
            <strong>Proyecto de Confianza Turística:</strong> Este servicio de reserva es operado tecnológicamente por Kraken Digital Labs a través de Portal Necoclí, actuando como corredor tecnológico.
          </p>
          <p>
            El servicio de transporte marítimo es responsabilidad directa y exclusiva de nuestras navieras aliadas, quienes cuentan con todos los permisos y pólizas exigidas por la Capitanía de Puerto y la Dirección General Marítima (DIMAR):
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Transporte Marítimo Sol y Playa S.A.S</strong> - NIT: 901797992-1</li>
            <li><strong>El Caribe S.A.S</strong> - NIT: 901000756-8</li>
          </ul>
          <p className="mt-4">
            Al generar su tiquete de pre-reserva, usted asegura su cupo en la embarcación. El pago final y definitivo se realiza de manera presencial en la taquilla de la naviera asignada, previo al embarque. Las tarifas para menores de edad indican que niños a partir de los 2 años cumplidos deben cancelar tarifa plena.
          </p>
        </div>
      </div>
    </div>
  );
}
