"use client";

import { motion } from "framer-motion";
import {
  Anchor,
  Calendar,
  CheckCircle2,
  CreditCard,
  MapPin,
  Printer,
  ShieldCheck,
  Ship,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export type TripType = "ruta" | "sol" | "yate";

export interface MaritimePassenger {
  name: string;
  docType: string;
  docNum: string;
  phone: string;
  petFriendly: boolean;
  allergies: boolean;
}

export interface MaritimeBoardingPassProps {
  ticketId: string;
  tripType: TripType;
  destination: string;
  date?: string;
  passengers: MaritimePassenger[];
  accommodation: string;
  totalPrice: number;
  isSolidarityActive: boolean;
  createdAt?: string;
}

const TRIP_LABELS: Record<TripType, string> = {
  ruta: "Ruta Diaria",
  sol: "Plan Día de Sol",
  yate: "Yate Exclusivo Privado",
};

const NAVIERA_BY_TRIP: Record<TripType, string> = {
  ruta: "Transporte Marítimo Sol y Playa S.A.S",
  sol: "El Caribe S.A.S",
  yate: "El Caribe S.A.S",
};

const NIT_BY_TRIP: Record<TripType, string> = {
  ruta: "NIT: 901797992-1",
  sol: "NIT: 901000756-8",
  yate: "NIT: 901000756-8",
};

// Simple inline SVG QR code (visual representation - in production replace with a real QR lib like qrcode.react)
function QRBlock({ value }: { value: string }) {
  // Generate a seeded pattern based on the ticketId
  const cells = Array.from({ length: 9 }, (_, row) =>
    Array.from({ length: 9 }, (_, col) => {
      const hash = (value.charCodeAt((row * 9 + col) % value.length) + row + col) % 3;
      return hash === 0;
    }),
  );

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="border-2 border-[#0f2e21] p-2 rounded-lg bg-white">
        <svg width="80" height="80" viewBox="0 0 9 9" xmlns="http://www.w3.org/2000/svg">
          {/* Finder patterns (corners - always filled) */}
          <rect x="0" y="0" width="3" height="3" fill="#0f2e21" />
          <rect x="0.5" y="0.5" width="2" height="2" fill="white" />
          <rect x="1" y="1" width="1" height="1" fill="#0f2e21" />

          <rect x="6" y="0" width="3" height="3" fill="#0f2e21" />
          <rect x="6.5" y="0.5" width="2" height="2" fill="white" />
          <rect x="7" y="1" width="1" height="1" fill="#0f2e21" />

          <rect x="0" y="6" width="3" height="3" fill="#0f2e21" />
          <rect x="0.5" y="6.5" width="2" height="2" fill="white" />
          <rect x="1" y="7" width="1" height="1" fill="#0f2e21" />

          {/* Data cells */}
          {cells.map((row, r) =>
            row.map((filled, c) => {
              // Skip the finder pattern areas
              const inCorner = (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3);
              if (inCorner) return null;
              return filled ? (
                <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#0f2e21" />
              ) : null;
            }),
          )}
        </svg>
      </div>
      <p className="text-[9px] font-mono text-gray-500 tracking-widest">{value}</p>
    </div>
  );
}

export function MaritimeBoardingPass({
  ticketId,
  tripType,
  destination,
  date,
  passengers,
  accommodation,
  totalPrice,
  isSolidarityActive,
}: MaritimeBoardingPassProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const accommodationLabel =
    accommodation === "with_food"
      ? "Con Alimentación"
      : accommodation === "without_food"
        ? "Sin Alimentación"
        : "Solo Transporte";

  const tripColor =
    tripType === "yate"
      ? "from-amber-900 to-amber-700"
      : tripType === "sol"
        ? "from-orange-600 to-yellow-500"
        : "from-[#0f2e21] to-[#1a5c40]";

  const tripAccent =
    tripType === "yate"
      ? "text-amber-400"
      : tripType === "sol"
        ? "text-yellow-300"
        : "text-emerald-400";

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Print Button (hidden in print) */}
      <div className="no-print flex justify-end mb-4">
        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#0f2e21] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#1a5c40] transition-colors"
        >
          <Printer className="w-4 h-4" />
          Imprimir Tiquete
        </button>
      </div>

      {/* ===== BOARDING PASS ===== */}
      <motion.div
        ref={printRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 print:shadow-none print:rounded-none"
        id="boarding-pass"
      >
        {/* HEADER - Gradient stripe */}
        <div className={`bg-gradient-to-r ${tripColor} p-6 relative overflow-hidden`}>
          {/* Background animated boat */}
          <motion.div
            animate={{ x: ["-100%", "110%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 opacity-10"
          >
            <Ship className="w-32 h-32 text-white" />
          </motion.div>

          <div className="relative z-10 flex justify-between items-start">
            <div>
              <Image
                src="https://res.cloudinary.com/dwxk79gt0/image/upload/v1751910298/logo_portal_necocli_ak1mbd.png"
                alt="Portal Necoclí"
                width={110}
                height={36}
                className="object-contain mb-3 brightness-0 invert"
              />
              <p className={`text-xs font-bold uppercase tracking-widest ${tripAccent} mb-1`}>
                TIQUETE DE PRE-RESERVA · CONFIRMACIÓN POR NAVIERA
              </p>
              <h2 className="text-white text-2xl font-bold">{TRIP_LABELS[tripType]}</h2>
            </div>

            {tripType === "yate" ? (
              <Anchor className="w-12 h-12 text-white/40" />
            ) : (
              <Ship className="w-12 h-12 text-white/40" />
            )}
          </div>
        </div>

        {/* ROUTE STRIP */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Origen</p>
            <p className="text-2xl font-black text-[#0f2e21]">NCL</p>
            <p className="text-xs text-gray-500">Necoclí</p>
          </div>

          <div className="flex-1 relative flex items-center justify-center">
            <div className="w-full h-px bg-gray-300" />
            <Ship className="w-8 h-8 text-emerald-600 absolute bg-gray-50 px-1" />
          </div>

          <div className="text-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Destino</p>
            <p className="text-2xl font-black text-[#0f2e21]">
              {destination.substring(0, 3).toUpperCase()}
            </p>
            <p className="text-xs text-gray-500">{destination}</p>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="p-6 flex gap-6">
          {/* Left: Details */}
          <div className="flex-1 space-y-5">
            {/* Key Data Row */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Fecha
                </p>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <p className="font-semibold text-sm text-gray-900">
                    {date
                      ? new Date(date).toLocaleDateString("es-CO", {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        })
                      : "Confirmar"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Pasajeros
                </p>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <p className="font-semibold text-sm text-gray-900">{passengers.length}</p>
                </div>
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                  Alojamiento
                </p>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <p className="font-semibold text-sm text-gray-900">{accommodationLabel}</p>
                </div>
              </div>
            </div>

            {/* Dashed divider */}
            <div className="border-t border-dashed border-gray-200" />

            {/* Passengers List */}
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                Listado de Pasajeros
              </p>
              <div className="space-y-2">
                {passengers.map((p, i) => (
                  <div
                    key={p.docNum ? `p-${p.docNum}` : `passenger-${i + 1}`}
                    className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#0f2e21] text-white text-[9px] font-bold flex items-center justify-center">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {p.name || `Pasajero ${i + 1}`}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          {p.docType} {p.docNum}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {p.petFriendly && (
                        <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                          🐾 Mascota
                        </span>
                      )}
                      {p.allergies && (
                        <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
                          🚫🐟 Alergia
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-dashed border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">
                    Total Estimado de la Reserva
                  </p>
                  <p className="text-3xl font-black text-[#0f2e21]">
                    ${totalPrice.toLocaleString("es-CO")}{" "}
                    <span className="text-sm font-normal text-gray-400">COP</span>
                  </p>
                  {isSolidarityActive && (
                    <p className="text-[10px] text-rose-500 mt-1">
                      Incluye $5.000 donación Motonecos ❤️
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">Pago Protegido</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: QR + Naviera */}
          <div className="w-40 flex flex-col items-center gap-4 pl-6 border-l border-dashed border-gray-200">
            <QRBlock value={ticketId} />

            <div className="text-center space-y-1 mt-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
                Operador
              </p>
              <p className="text-xs font-semibold text-gray-700 leading-tight text-center">
                {NAVIERA_BY_TRIP[tripType]}
              </p>
              <p className="text-[9px] text-gray-400">{NIT_BY_TRIP[tripType]}</p>
            </div>
          </div>
        </div>

        {/* FOOTER STRIP */}
        <div className="bg-[#0f2e21] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="https://res.cloudinary.com/dwxk79gt0/image/upload/v1747861208/logo-kraken-blanco-negro_om3uor.png"
              alt="Kraken Digital Labs"
              width={80}
              height={24}
              className="object-contain opacity-60 invert"
            />
            <div className="h-6 w-px bg-white/20" />
            <div>
              <p className="text-white/50 text-[9px] uppercase tracking-widest">
                Proyecto de Confianza Turística
              </p>
              <p className="text-white/80 text-[10px]">Portal Necoclí · Kraken Digital Labs</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/60 text-[9px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="uppercase tracking-widest font-bold">Pre-reserva verificada</span>
          </div>
        </div>

        {/* TEAR LINE */}
        <div className="relative">
          <div className="absolute -left-3 top-1/2 w-6 h-6 bg-gray-100 rounded-full" />
          <div className="absolute -right-3 top-1/2 w-6 h-6 bg-gray-100 rounded-full" />
          <div className="border-t border-dashed border-gray-300 mx-6" />
        </div>

        {/* INSTRUCTIONS STUB */}
        <div className="px-6 py-4 bg-gray-50 flex items-start gap-3">
          <CreditCard className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <p className="text-[11px] text-gray-600 leading-relaxed">
            <strong>1. Pre-reserva generada:</strong> Un asesor de la naviera te contactará para
            asentar los datos de los pasajeros.
            <strong> 2. Asegura tu cupo:</strong> Consigna a las cuentas bancarias oficiales de la
            naviera para garantizar tu embarque al 100%; el pago presencial en taquilla está sujeto
            a disponibilidad y alto riesgo de que se agoten los puestos. Niños desde los 2 años
            cumplidos abonan tarifa plena (DIMAR).
          </p>
        </div>
      </motion.div>

      {/* Solidarity confirmation */}
      {isSolidarityActive && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4 flex items-center gap-3 bg-rose-50 border border-rose-100 rounded-xl px-4 py-3"
        >
          <Image
            src="https://res.cloudinary.com/dwxk79gt0/image/upload/v1747866989/Copia_de_MOTONECO_247_rlibh1.png"
            alt="Motonecos"
            width={32}
            height={32}
            className="object-contain"
          />
          <p className="text-sm text-rose-700">
            <strong>¡Gracias!</strong> Tu aporte de $5.000 COP apoyará a la asociación Motonecos,
            ayudando a niños vulnerables con trastornos mentales. 🙏
          </p>
        </motion.div>
      )}

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white; }
          #boarding-pass { max-width: 100%; box-shadow: none; }
        }
      `}</style>
    </div>
  );
}
