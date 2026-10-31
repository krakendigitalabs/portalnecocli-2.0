"use client";

import { AlertCircle, Calendar, CheckCircle2, Loader2 } from "lucide-react";
import Image from "next/image";
import { type FormEvent, useState } from "react";

interface PackageOption {
  id: string;
  name: string;
  shortName: string;
  tags: string;
  description: string;
  imageUrl: string;
}

const PACKAGES: PackageOption[] = [
  {
    id: "sol-playa",
    name: "Paquete Completo (2 noches + Yate)",
    shortName: "Sol y Playa Express",
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
    tags: "SÁB & DOM · PAREJA · PISCINA + MAR",
    description:
      "Ideal para parejas que buscan una escapada rápida de fin de semana. Alojamiento premium y acceso a la playa.",
    imageUrl: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737748238/elegida_10_qeylgb.jpg",
  },
  {
    id: "full-vip",
    name: "Full VIP — Todo Incluido (2 días)",
    shortName: "Full Necoclí VIP",
    tags: "2 DÍAS · TODO INCLUIDO · PISCINA + MAR",
    description:
      "La experiencia definitiva. Sin preocupaciones, todo está resuelto para que vivas 2 días de puro lujo caribeño.",
    imageUrl: "https://res.cloudinary.com/dwxk79gt0/image/upload/v1737936904/slider_3_mymktw.png",
  },
  {
    id: "alojamiento-base",
    name: "Alojamiento Tradicional (1 Noche)",
    shortName: "Alojamiento",
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
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const selectedPackage = PACKAGES.find((p) => p.id === selectedId) || PACKAGES[0];
  const today = new Date();
  const minimumDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          message: [
            `Solicitud de disponibilidad para: ${selectedPackage.name}.`,
            `Fecha deseada: ${date || "Por definir"}.`,
            `Huéspedes: ${guests}. Noches/días: ${nights}.`,
            "La tarifa debe ser confirmada por el equipo antes de reservar.",
          ].join(" "),
        }),
      });

      const result = (await response.json()) as { success?: boolean; error?: string };
      if (!response.ok || !result.success) {
        throw new Error(result.error ?? "No fue posible enviar la solicitud.");
      }

      setStatus("success");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Ocurrió un error. Inténtalo nuevamente.",
      );
      setStatus("error");
    }
  }

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
              <p className="text-[10px] font-bold text-white/70 tracking-widest mb-1">TARIFA</p>
              <p className="text-xl font-black text-white">Por confirmar</p>
            </div>
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
        <h4 className="text-xl font-bold text-slate-900">Consulta disponibilidad</h4>
        <p className="text-sm text-slate-500 mb-6">
          Enviaremos tu solicitud al equipo para confirmar tarifa y disponibilidad. Aún no es una
          reserva ni un cobro.
        </p>

        {status === "success" ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
            <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-emerald-600" />
            <h5 className="font-bold text-emerald-900">Solicitud enviada</h5>
            <p className="mt-1 text-sm text-emerald-800">
              El equipo te contactará para confirmar disponibilidad y precio.
            </p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label
                htmlFor="experience-package"
                className="text-xs font-bold text-slate-500 tracking-wide"
              >
                OPCIÓN DEL PAQUETE
              </label>
              <select
                id="experience-package"
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  setStatus("idle");
                }}
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
              <label
                htmlFor="experience-name"
                className="text-xs font-bold text-slate-500 tracking-wide"
              >
                NOMBRE COMPLETO
              </label>
              <input
                id="experience-name"
                name="name"
                type="text"
                placeholder="Ej. Juan Pérez"
                autoComplete="name"
                maxLength={120}
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e5631]/20 focus:border-[#1e5631] transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="experience-phone"
                  className="text-xs font-bold text-slate-500 tracking-wide"
                >
                  TELÉFONO
                </label>
                <input
                  id="experience-phone"
                  name="phone"
                  type="tel"
                  placeholder="+57 300 000 0000"
                  autoComplete="tel"
                  maxLength={30}
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e5631]/20 focus:border-[#1e5631] transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="experience-email"
                  className="text-xs font-bold text-slate-500 tracking-wide"
                >
                  CORREO
                </label>
                <input
                  id="experience-email"
                  name="email"
                  type="email"
                  placeholder="juan@email.com"
                  autoComplete="email"
                  maxLength={254}
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e5631]/20 focus:border-[#1e5631] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5 relative">
                <label
                  htmlFor="experience-date"
                  className="text-xs font-bold text-slate-500 tracking-wide"
                >
                  FECHA
                </label>
                <div className="relative">
                  <input
                    id="experience-date"
                    name="date"
                    type="date"
                    min={minimumDate}
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="w-full rounded-xl border border-slate-200 pl-4 pr-10 py-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e5631]/20 focus:border-[#1e5631] transition-all"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="experience-nights"
                  className="text-xs font-bold text-slate-500 tracking-wide"
                >
                  DÍAS / NOCHES
                </label>
                <input
                  id="experience-nights"
                  name="nights"
                  type="number"
                  min="1"
                  max="30"
                  value={nights}
                  onChange={(e) => setNights(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e5631]/20 focus:border-[#1e5631] transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="experience-guests"
                  className="text-xs font-bold text-slate-500 tracking-wide"
                >
                  HUÉSPEDES
                </label>
                <input
                  id="experience-guests"
                  name="guests"
                  type="number"
                  min="1"
                  max="20"
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e5631]/20 focus:border-[#1e5631] transition-all"
                />
              </div>
            </div>

            {status === "error" && (
              <p
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                <AlertCircle className="mr-1 inline h-4 w-4" />
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="mt-6 w-full bg-[#1b4d2c] hover:bg-[#143a21] text-white rounded-2xl py-4 font-bold text-lg transition-colors shadow-lg shadow-[#1b4d2c]/30 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "loading" ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Enviando solicitud...
                </span>
              ) : (
                "Solicitar disponibilidad"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
