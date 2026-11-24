import type { Metadata } from "next";
import {
  AlertTriangle,
  Ban,
  ChevronDown,
  Info,
  MessageCircle,
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import { MaritimeBookingWidget } from "@/components/marketplace/maritime-booking-widget";
import { NavierasShowcase } from "@/components/marketplace/navieras-showcase";
import { parseTripSearchParams, type TripSearchParams } from "@/lib/utils/trip-search-params";

export const metadata: Metadata = {
  title: "Reservas Marítimas desde Necoclí | Portal Necoclí",
  description:
    "Pre-reserva tus pasajes en lancha y Día de Sol desde Necoclí hacia Capurganá, Sapzurro, La Miel (Panamá), Playa Soledad, Bahía Aguacate, Triganá, Acandí y Titumate. Zarpe oficial desde la Base Náutica con Sol y Playa S.A.S y El Caribe S.A.S.",
  openGraph: {
    title: "Reservas Marítimas desde Necoclí | Portal Necoclí",
    description:
      "Salidas diarias y Planes Día de Sol visitando los paraísos del Golfo de Urabá y Panamá. Navieras oficiales avaladas por DIMAR.",
    type: "website",
    locale: "es_CO",
  },
};

interface ReservasMaritimasPageProps {
  searchParams: Promise<TripSearchParams>;
}

const BOOKING_HIGHLIGHTS = [
  {
    icon: Ticket,
    title: "1. Pre-reserva en línea",
    description:
      "Registras tu solicitud digital en el portal al instante y sin costo previo.",
  },
  {
    icon: PhoneCall,
    title: "2. Contacto y Asentamiento",
    description:
      "La naviera asignada te contacta de inmediato para asentar y validar los datos de los pasajeros.",
  },
  {
    icon: ShieldCheck,
    title: "3. Asegura tu cupo 100%",
    description:
      "Pagar a las cuentas oficiales de la naviera garantiza tu cupo; en taquilla corres alto riesgo de agotamiento.",
  },
];

const REPORT_WHATSAPP_URL =
  "https://wa.me/573115311257?text=Hola%2C%20deseo%20reportar%20una%20irregularidad%20en%20el%20transporte%20mar%C3%ADtimo%20en%20Necocl%C3%AD.";

export default async function ReservasMaritimasPage({ searchParams }: ReservasMaritimasPageProps) {
  const { date: initialDate, people: initialPeople } = parseTripSearchParams(await searchParams);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      {/* Cabecera */}
      <header className="max-w-5xl mx-auto mb-10 text-center">
        <span className="inline-block py-1.5 px-4 mb-4 text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100/90 border border-emerald-200 rounded-full shadow-sm">
          Plataforma Oficial de Navegación
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#0f2e21] tracking-tight mb-4">
          Navega hacia el Paraíso
        </h1>
        <p className="text-lg md:text-xl text-slate-700 max-w-3xl mx-auto font-medium leading-relaxed">
          Reserva tu viaje marítimo desde Necoclí con seguridad y confort absoluto. Alianza oficial de confianza turística con las mejores navieras de la región.
        </p>
      </header>

      {/* Widget de Reservas */}
      <section aria-label="Formulario de reservas marítimas" className="max-w-[85rem] mx-auto">
        <MaritimeBookingWidget initialDate={initialDate} initialPeople={initialPeople} />
      </section>

      {/* Portafolio Comercial y Tarifas de Navieras Aliadas */}
      <section aria-label="Navieras aliadas y tarifas" className="max-w-5xl mx-auto mt-14">
        <NavierasShowcase />
      </section>

      {/* Pasos del Proceso de Reserva y Comunicado Oficial */}
      <section aria-label="Cómo funciona la reserva" className="max-w-5xl mx-auto mt-10 space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          {BOOKING_HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex items-start gap-3.5 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm"
            >
              <div className="shrink-0 p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">{title}</h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Comunicado Oficial Ajustado: Pre-reserva, Asentamiento y Garantía de Cupo */}
        <div className="bg-white border border-amber-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="shrink-0 p-2 rounded-xl bg-amber-100 text-amber-800 mt-0.5">
              <Info className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <p className="font-extrabold text-slate-900 text-sm sm:text-base">
                Protocolo Oficial de Pre-reserva y Confirmación de Cupo
              </p>
              <p>
                Al generar su tiquete en el portal, usted registra una <strong>pre-reserva</strong>. Posteriormente, un asesor de la naviera seleccionada se comunicará directamente con usted para <strong>asentar y verificar los datos</strong> de los pasajeros.
              </p>
              <p>
                <strong>Para asegurar su cupo de manera definitiva:</strong> Debe realizar el pago a las <strong>cuentas oficiales suministradas por la naviera</strong>. A diferencia del pago en taquilla —donde es altamente probable que los puestos se agoten antes de su llegada debido a la alta afluencia—, el pago bancario anticipado con la naviera garantiza al 100% su abordaje en la embarcación.
              </p>
              <p className="text-xs text-slate-500 pt-1 border-t border-slate-100">
                Las tarifas para menores de edad indican que niños a partir de los 2 años cumplidos deben cancelar tarifa plena por disposiciones y pólizas marítimas obligatorias de la DIMAR.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Aviso Oficial de Seguridad Marítima (DIMAR y Alcaldía de Necoclí) */}
      <section aria-label="Aviso oficial de seguridad marítima" className="max-w-5xl mx-auto mt-12">
        <div className="overflow-hidden rounded-3xl border border-rose-200/90 bg-white shadow-md">
          {/* Encabezado de alerta */}
          <div className="bg-gradient-to-r from-[#123363] via-[#1b4682] to-[#123363] px-6 py-6 sm:px-8 text-white">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-600 px-3 py-1 text-xs font-black uppercase tracking-widest text-white shadow-sm">
              <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
              Turista
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-black uppercase tracking-tight leading-tight">
              ¡No arriesgues tu vida y la de tu familia!
            </h2>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Dos advertencias principales */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <div className="shrink-0 rounded-xl bg-rose-100 p-3 text-rose-700">
                  <Ban className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black uppercase text-[#123363]">
                    No compres tiquetes irregulares
                  </h3>
                  <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                    Compra solo en las empresas autorizadas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <div className="shrink-0 rounded-xl bg-rose-100 p-3 text-rose-700">
                  <ShieldAlert className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black uppercase text-[#123363]">
                    Evita cruzar el Golfo de Urabá
                  </h3>
                  <p className="mt-1 text-sm text-slate-700 leading-relaxed">
                    En embarcaciones sin medidas de seguridad exigidas por la autoridad marítima.
                  </p>
                </div>
              </div>
            </div>

            {/* Franja Base Náutica */}
            <div className="rounded-2xl bg-rose-600 px-5 py-4 text-center text-white shadow-sm">
              <p className="text-sm sm:text-base font-medium leading-relaxed">
                <strong className="font-black uppercase tracking-wide">La Base Náutica</strong> es el único lugar autorizado para zarpe de embarcaciones de transporte público de pasajeros.
              </p>
            </div>

            {/* Línea de denuncias y entidades */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-200">
              <div className="text-center sm:text-left">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Campaña oficial de seguridad marítima
                </p>
                <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-0.5">
                  Dirección General Marítima (DIMAR · Autoridad Marítima Colombiana) · Alcaldía de Necoclí
                </p>
              </div>

              <a
                href={REPORT_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-[#123363] px-5 py-2.5 text-sm font-extrabold text-white shadow-sm transition-all hover:bg-[#0c2447] hover:-translate-y-0.5 shrink-0"
              >
                <span className="text-rose-300 uppercase tracking-wider text-xs font-black">
                  Denuncias:
                </span>
                <MessageCircle className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>311 531 12 57</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Información Legal y Corporativa */}
      <section aria-label="Información legal y corporativa" className="max-w-4xl mx-auto mt-12 pt-10 border-t border-slate-200">
        <details className="group">
          <summary className="text-lg sm:text-xl font-bold text-slate-900 cursor-pointer flex items-center justify-between gap-4 list-none [&::-webkit-details-marker]:hidden bg-white border border-slate-200 hover:border-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 p-5 rounded-2xl shadow-sm transition-colors">
            <span>Información Legal y Corporativa</span>
            <span className="text-sm font-bold text-emerald-700 flex items-center gap-1.5 shrink-0">
              <span className="group-open:hidden">Leer información</span>
              <span className="hidden group-open:inline">Ocultar</span>
              <ChevronDown
                className="w-4 h-4 transition-transform duration-300 group-open:rotate-180"
                aria-hidden="true"
              />
            </span>
          </summary>

          <div className="prose prose-sm max-w-none text-slate-700 bg-white border border-t-0 border-slate-200 rounded-b-2xl -mt-2 pt-6 px-6 pb-6 font-medium leading-relaxed">
            <p>
              <strong className="text-slate-900">Proyecto de Confianza Turística:</strong> Este servicio de reserva es operado tecnológicamente por Kraken Digital Labs a través de Portal Necoclí, actuando como corredor tecnológico.
            </p>
            <p>
              El servicio de transporte marítimo es responsabilidad directa y exclusiva de nuestras navieras aliadas, quienes cuentan con todos los permisos y pólizas exigidas por la Capitanía de Puerto y la Dirección General Marítima (DIMAR):
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong className="text-slate-900">Transporte Marítimo Sol y Playa S.A.S</strong> — NIT: 901797992-1
              </li>
              <li>
                <strong className="text-slate-900">El Caribe S.A.S</strong> — NIT: 901000756-8
              </li>
            </ul>
            <div className="mt-5 pt-4 border-t border-slate-200/80 space-y-3">
              <p>
                <strong className="text-slate-900">Paso 1 (Pre-reserva):</strong> Al generar su tiquete en el portal, usted registra una <strong>pre-reserva</strong> de viaje de manera inmediata.
              </p>
              <p>
                <strong className="text-slate-900">Paso 2 (Asentamiento de Datos):</strong> Posteriormente, un asesor de la naviera asignada se comunicará con usted directamente para verificar los datos de los pasajeros, coordinar detalles del zarpe y formalizar la reserva.
              </p>
              <div className="not-prose p-4 bg-amber-50/90 border border-amber-200/90 rounded-xl text-amber-950 text-xs sm:text-sm leading-relaxed">
                <p className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                  <span>⚠️</span> Garantía de Cupo: Pago a Cuentas Oficiales vs. Pago en Taquilla
                </p>
                <p>
                  Si realiza el pago a las <strong>cuentas bancarias oficiales que le suministre la naviera</strong>, su cupo queda <strong>100% asegurado y confirmado</strong> en la embarcación. Por el contrario, si opta por pagar de manera presencial en la taquilla el día del viaje, <strong>es muy probable que los puestos se hayan agotado</strong> antes de su llegada a la taquilla debido a la alta afluencia de pasajeros hacia el Golfo de Urabá.
                </p>
              </div>
              <p className="text-xs text-slate-600 mb-0">
                Las tarifas para menores de edad indican que niños a partir de los 2 años cumplidos deben cancelar tarifa plena por disposiciones y pólizas marítimas obligatorias de la DIMAR.
              </p>
            </div>
          </div>
        </details>
      </section>
    </main>
  );
}
