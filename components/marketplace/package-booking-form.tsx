"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronUp, Calendar } from "lucide-react";

interface PackageOption {
  id: string;
  name: string;
  shortName: string;
  price: number;
  tags: string;
  description: string;
  imageUrl: string;
}

const PACKAGES: PackageOption[] = [
  {
    id: "sol-playa",
    name: "Paquete Completo (2 noches + Yate)",
    shortName: "Sol y Playa Express",
    price: 562500, // 375.000 + 50%
    tags: "2 NOCHES · YATE · COMIDAS INCLUIDAS",
    description:
      "Una escapada completa de 2 noches. Llegás la noche anterior, disfrutás un día de sol en yate con almuerzo...",
    imageUrl:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737933627/Playa_necocli_2_z5rgq9.jpg",
  },
  {
    id: "noche-express",
    name: "Noche Express — Pareja (Sáb o Dom)",
    shortName: "Noche Express",
    price: 375000, // 250.000 + 50%
    tags: "SÁB & DOM · PAREJA · PISCINA + MAR",
    description:
      "Ideal para parejas que buscan una escapada rápida de fin de semana. Alojamiento premium y acceso a la playa.",
    imageUrl: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737748238/elegida_10_qeylgb.jpg",
  },
  {
    id: "full-vip",
    name: "Full VIP — Todo Incluido (2 días)",
    shortName: "Full Necoclí VIP",
    price: 930000, // 620.000 + 50%
    tags: "2 DÍAS · TODO INCLUIDO · PISCINA + MAR",
    description:
      "La experiencia definitiva. Sin preocupaciones, todo está resuelto para que vivas 2 días de puro lujo caribeño.",
    imageUrl: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737936904/slider_3_mymktw.png",
  },
  {
    id: "alojamiento-base",
    name: "Alojamiento Tradicional (1 Noche)",
    shortName: "Alojamiento",
    price: 67500, // 45.000 + 50%
    tags: "1 NOCHE · DESAYUNO INCLUIDO",
    description:
      "Descansa cómodamente en instalaciones tradicionales con la brisa del mar y un desayuno típico para iniciar el día.",
    imageUrl:
      "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744003514/turismo_necocli_45_mxvzea.jpg",
  },
  {
    id: "tour-aventura",
    name: "Tour Guiado Aventura Extrema",
    shortName: "Aventura Extrema",
    price: 180000, // 120.000 + 50%
    tags: "FULL DAY · TRANSPORTE · GUÍA LOCAL",
    description:
      "Explora la selva, sumérgete en el lodo medicinal y finaliza con un recorrido en lancha. Ideal para aventureros.",
    imageUrl: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1744736290/guia_jontzc.jpg",
  },
];

export function PackageBookingForm() {
  const [selectedId, setSelectedId] = useState(PACKAGES[0].id);
  const [guests, setGuests] = useState(1);
  const [nights, setNights] = useState(1);

  const selectedPackage = PACKAGES.find((p) => p.id === selectedId) || PACKAGES[0];

  const total = selectedPackage.price * guests; // Simplificado para la demo

  return (
    <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 flex flex-col">
      {/* ─── HEADER CON IMAGEN Y PRECIO ─── */}
      <div className="relative h-64 w-full shrink-0">
        <Image
          src={selectedPackage.imageUrl}
          alt={selectedPackage.shortName}
          fill
          unoptimized
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#111c24]" />

        <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
          <div>
            <h3 className="text-3xl font-black text-white italic tracking-tight drop-shadow-md">
              {selectedPackage.shortName.toUpperCase()}
            </h3>
            <p className="text-white/90 text-sm mt-2 leading-relaxed drop-shadow max-w-[90%]">
              {selectedPackage.description}
            </p>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] font-bold text-white/70 tracking-widest mb-1">DESDE</p>
              <p className="text-2xl font-black text-white">
                $ {selectedPackage.price.toLocaleString("es-CO")}
              </p>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white text-xs font-bold hover:bg-white/20 transition">
              <ChevronUp className="w-4 h-4" />
              CERRAR
            </button>
          </div>
        </div>
      </div>

      {/* ─── INFO DEL PAQUETE ─── */}
      <div className="bg-[#f8f9f5] border-b border-slate-200 px-6 py-4">
        <p className="text-[10px] font-bold tracking-widest text-[#1e5631] uppercase">
          {selectedPackage.tags}
        </p>
        <p className="text-sm font-bold text-slate-900 mt-1">{selectedPackage.shortName}</p>
      </div>

      {/* ─── FORMULARIO ─── */}
      <div className="p-6 bg-white flex-1 overflow-y-auto">
        <h4 className="text-xl font-bold text-slate-900">Reserva tu lugar</h4>
        <p className="text-sm text-slate-500 mb-6">
          Completa tus datos para confirmar disponibilidad.
        </p>

        <form className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 tracking-wide">
              OPCIÓN DEL PAQUETE
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#1e5631]/20 focus:border-[#1e5631] transition-all"
            >
              {PACKAGES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 tracking-wide">
              NOMBRE COMPLETO
            </label>
            <input
              type="text"
              placeholder="Ej. Juan Pérez"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e5631]/20 focus:border-[#1e5631] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 tracking-wide">TELÉFONO</label>
              <input
                type="tel"
                placeholder="+57 300 000 0000"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e5631]/20 focus:border-[#1e5631] transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 tracking-wide">CORREO</label>
              <input
                type="email"
                placeholder="juan@email.com"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e5631]/20 focus:border-[#1e5631] transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1.5 relative">
              <label className="text-xs font-bold text-slate-500 tracking-wide">FECHA</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="mm/dd/aaaa"
                  className="w-full rounded-xl border border-slate-200 pl-4 pr-10 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e5631]/20 focus:border-[#1e5631] transition-all"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 tracking-wide">
                DÍAS / NOCHES
              </label>
              <input
                type="number"
                min="1"
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e5631]/20 focus:border-[#1e5631] transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 tracking-wide">HUÉSPEDES</label>
              <input
                type="number"
                min="1"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e5631]/20 focus:border-[#1e5631] transition-all"
              />
            </div>
          </div>

          <div className="mt-6 pt-2">
            <div className="bg-[#f4f6f3] rounded-2xl p-5 flex justify-between items-center border border-slate-100">
              <span className="text-xs font-bold text-slate-600 tracking-widest uppercase">
                Total a pagar:
              </span>
              <span className="text-xl font-black text-[#1e5631]">
                ${total.toLocaleString("es-CO")} COP
              </span>
            </div>
          </div>

          <button
            type="button"
            className="mt-6 w-full bg-[#1b4d2c] hover:bg-[#143a21] text-white rounded-2xl py-4 font-bold text-lg transition-colors shadow-lg shadow-[#1b4d2c]/30"
          >
            Reservar
          </button>
        </form>
      </div>
    </div>
  );
}
