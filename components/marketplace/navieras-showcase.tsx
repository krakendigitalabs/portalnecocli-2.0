"use client";

import {
  Anchor,
  CheckCircle2,
  Clock,
  Info,
  MapPin,
  Ship,
  Sparkles,
  Sun,
  Umbrella,
  Waves,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NAVIERAS_DATA, type NavieraId } from "@/data/navieras";

const NAVIERA_LIST: NavieraId[] = ["sol-y-playa", "el-caribe"];

const THEMES: Record<
  NavieraId,
  {
    tabSelected: string;
    tabSpotlight: string;
    iconSelected: string;
    iconSpotlight: string;
    headerGradient: string;
    accentBadge: string;
    checkColor: string;
    priceBadge: string;
    borderSoft: string;
  }
> = {
  "sol-y-playa": {
    tabSelected:
      "z-10 scale-[1.03] border-amber-500 bg-gradient-to-br from-amber-50 via-orange-50/60 to-white shadow-lg shadow-amber-500/15 ring-2 ring-amber-400/30",
    tabSpotlight: "z-10 scale-[1.02] border-amber-400/80 bg-amber-50/40 shadow-md",
    iconSelected: "bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-sm",
    iconSpotlight: "bg-amber-100 text-amber-700",
    headerGradient: "from-amber-600 via-orange-600 to-amber-700",
    accentBadge: "bg-amber-100 text-amber-900 border-amber-200",
    checkColor: "text-amber-600",
    priceBadge: "bg-amber-50 text-amber-900 border-amber-200",
    borderSoft: "border-amber-200/80",
  },
  "el-caribe": {
    tabSelected:
      "z-10 scale-[1.03] border-cyan-600 bg-gradient-to-br from-cyan-50 via-teal-50/60 to-white shadow-lg shadow-cyan-600/15 ring-2 ring-cyan-500/25",
    tabSpotlight: "z-10 scale-[1.02] border-cyan-400/80 bg-cyan-50/40 shadow-md",
    iconSelected: "bg-gradient-to-br from-cyan-600 to-teal-600 text-white shadow-sm",
    iconSpotlight: "bg-cyan-100 text-cyan-700",
    headerGradient: "from-[#0b4f6c] via-[#0e7490] to-[#0f766e]",
    accentBadge: "bg-cyan-100 text-cyan-900 border-cyan-200",
    checkColor: "text-cyan-600",
    priceBadge: "bg-cyan-50 text-cyan-900 border-cyan-200",
    borderSoft: "border-cyan-200/80",
  },
};

export function NavierasShowcase() {
  const [selected, setSelected] = useState<NavieraId>("sol-y-playa");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [spotlightIndex, setSpotlightIndex] = useState(0);

  useEffect(() => {
    if (hasInteracted) return;
    const interval = setInterval(() => {
      setSpotlightIndex((prev) => (prev === 0 ? 1 : 0));
    }, 2600);
    return () => clearInterval(interval);
  }, [hasInteracted]);

  const activeNaviera = NAVIERAS_DATA[selected];
  const activeTheme = THEMES[selected];

  const handleSelect = (id: NavieraId) => {
    setHasInteracted(true);
    setSelected(id);
  };

  return (
    <section
      aria-label="Portafolio, tarifas y planes de las navieras oficiales"
      className="max-w-5xl mx-auto mt-14 space-y-8"
    >
      {/* Selector 50/50 equilibrado */}
      <div>
        <div className="text-center mb-6">
          <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 mb-2">
            Navieras Oficiales Aliadas · Tarifas 2026
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Compara y elige tu naviera
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-1.5">
            Toca una empresa para explorar sus rutas, tarifas, flota y planes Día de Sol.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Seleccionar naviera para ver portafolio"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {NAVIERA_LIST.map((id, index) => {
            const nav = NAVIERAS_DATA[id];
            const theme = THEMES[id];
            const isSelected = selected === id;
            const isSpotlight = !hasInteracted && spotlightIndex === index;
            const Icon = id === "sol-y-playa" ? Sun : Waves;

            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => handleSelect(id)}
                className={[
                  "flex items-center gap-4 rounded-3xl border p-5 text-left transition-all duration-500 ease-out cursor-pointer",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900",
                  isSelected
                    ? theme.tabSelected
                    : isSpotlight
                      ? theme.tabSpotlight
                      : "scale-[0.98] border-slate-200 bg-white opacity-85 hover:scale-[1.02] hover:opacity-100 hover:shadow-md",
                ].join(" ")}
              >
                <div
                  className={[
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-all duration-300",
                    isSelected
                      ? theme.iconSelected
                      : isSpotlight
                        ? theme.iconSpotlight
                        : "bg-slate-100 text-slate-600",
                  ].join(" ")}
                >
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base sm:text-lg font-black text-slate-900">
                      {nav.shortName}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${theme.accentBadge}`}
                    >
                      {nav.badgeLabel}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 truncate mt-0.5">{nav.tagline}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel de la naviera activa */}
      <div
        className={`overflow-hidden rounded-3xl border bg-white shadow-lg ${activeTheme.borderSoft}`}
      >
        {/* Cabecera corporativa */}
        <div className={`bg-gradient-to-r ${activeTheme.headerGradient} p-6 sm:p-8 text-white`}>
          <span className="inline-block rounded-full bg-white/15 border border-white/25 px-3 py-1 text-xs font-extrabold uppercase tracking-wider">
            NIT: {activeNaviera.nit} · Avalada DIMAR
          </span>
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight mt-2">
            {activeNaviera.legalName}
          </h3>
          <p className="mt-3 text-sm sm:text-base text-white/90 max-w-3xl leading-relaxed">
            {activeNaviera.summary}
          </p>

          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {activeNaviera.highlights.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white/10 border border-white/15 p-3.5 backdrop-blur-sm"
              >
                <p className="text-xs sm:text-sm font-extrabold text-white">{item.title}</p>
                <p className="text-xs text-white/80 mt-0.5">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-10">
          {/* SECCIÓN 1: PLANES DÍA DE SOL */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Sun className={`w-5 h-5 ${activeTheme.checkColor}`} aria-hidden="true" />
              <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                {activeNaviera.dayPasses.length > 1 ? "Planes Día de Sol" : "Plan Día de Sol"}
              </h4>
            </div>

            <div
              className={`grid gap-6 ${
                activeNaviera.dayPasses.length > 1 ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"
              }`}
            >
              {activeNaviera.dayPasses.map((plan) => (
                <article
                  key={plan.id}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-slate-50/70 p-6 shadow-sm"
                >
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-200">
                      <div>
                        {plan.featured && (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider mb-2 ${activeTheme.accentBadge}`}
                          >
                            <Sparkles className="w-3 h-3" aria-hidden="true" />
                            Plan Destacado
                          </span>
                        )}
                        <h5 className="text-lg sm:text-xl font-black text-slate-900">
                          {plan.title}
                        </h5>
                        <p className="text-xs sm:text-sm text-slate-600 mt-0.5">{plan.subtitle}</p>
                      </div>
                      <div
                        className={`rounded-2xl border px-4 py-2 text-right shrink-0 ${activeTheme.priceBadge}`}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-wider opacity-75">
                          Por persona
                        </p>
                        <p className="text-xl sm:text-2xl font-black">
                          {plan.price} <span className="text-xs font-bold">COP</span>
                        </p>
                      </div>
                    </div>

                    {/* Destinos */}
                    <div className="mt-4">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                        Destinos del recorrido
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {plan.destinations.map((dest) => (
                          <span
                            key={dest}
                            className="rounded-xl bg-white border border-slate-200 px-3 py-1 text-xs font-bold text-slate-800"
                          >
                            {dest}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Qué incluye */}
                    <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                      {plan.includes.map((inc) => (
                        <li
                          key={inc}
                          className="flex items-start gap-2 text-sm text-slate-700 font-medium"
                        >
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 mt-0.5 ${activeTheme.checkColor}`}
                            aria-hidden="true"
                          />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Opción Playa La Boquita */}
                    {plan.beachAlternative && (
                      <div className="mt-5 flex items-start gap-3 rounded-2xl bg-[#0d3b52] p-4 text-white">
                        <Umbrella
                          className="w-5 h-5 text-amber-300 shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <p className="text-xs sm:text-sm leading-relaxed text-cyan-50">
                          {plan.beachAlternative}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Horario, notas y botón de pre-reserva */}
                  <div className="mt-5 pt-4 border-t border-slate-200 space-y-2.5 text-xs text-slate-600">
                    <p className="flex items-start gap-2 font-semibold text-slate-700">
                      <Clock
                        className="w-4 h-4 shrink-0 mt-0.5 text-slate-500"
                        aria-hidden="true"
                      />
                      <span>{plan.schedule}</span>
                    </p>
                    {plan.note && (
                      <p className="flex items-start gap-2">
                        <Info
                          className="w-4 h-4 shrink-0 mt-0.5 text-slate-400"
                          aria-hidden="true"
                        />
                        <span>{plan.note}</span>
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent("change-booking-tab", { detail: "sol" }),
                        );
                        window.dispatchEvent(
                          new CustomEvent("select-naviera", {
                            detail: { id: selected, planId: plan.id },
                          }),
                        );
                        document
                          .getElementById("booking-widget")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 border cursor-pointer hover:shadow-md active:scale-95 text-center mt-3 ${
                        selected === "sol-y-playa"
                          ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-amber-500/20"
                          : "bg-cyan-700 hover:bg-cyan-800 text-white border-cyan-800 shadow-cyan-700/20"
                      }`}
                    >
                      Pre-reservar este plan en el cotizador ↑
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* SECCIÓN 2: RUTAS Y TARIFAS 2026 */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Anchor className={`w-5 h-5 ${activeTheme.checkColor}`} aria-hidden="true" />
              <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                Rutas y Tarifas de Referencia 2026
              </h4>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {activeNaviera.routes.map((item) => (
                <div
                  key={item.route}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-black text-slate-900">{item.route}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border shrink-0 ${activeTheme.accentBadge}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline justify-between pt-2 border-t border-slate-100 text-xs sm:text-sm">
                    <span className="text-slate-600">
                      Ida: <strong className="text-slate-900">{item.oneWay}</strong>
                    </span>
                    {item.roundTrip && (
                      <span className="text-slate-600">
                        Ida y vuelta: <strong className="text-slate-900">{item.roundTrip}</strong>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Rutas intermedias (El Caribe S.A.S) */}
            {activeNaviera.intermediateRoutes && (
              <div className="mt-5">
                <p className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                  Conexiones de regreso y tramos intermedios
                </p>
                <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3">
                  {activeNaviera.intermediateRoutes.map((item) => (
                    <div
                      key={item.route}
                      className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200/80 px-3.5 py-2.5 text-xs sm:text-sm"
                    >
                      <span className="font-semibold text-slate-700">{item.route}</span>
                      <span className="font-black text-slate-900">{item.oneWay}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="mt-4 rounded-2xl bg-slate-50 border border-slate-200/80 p-4 text-xs sm:text-sm text-slate-700 font-medium flex items-start gap-2.5">
              <Clock className="w-4 h-4 shrink-0 mt-0.5 text-slate-500" aria-hidden="true" />
              <span>{activeNaviera.routeScheduleNote}</span>
            </p>
          </div>

          {/* SECCIÓN 3: FLOTA TURÍSTICA (El Caribe S.A.S) */}
          {activeNaviera.fleet && (
            <div className="pt-6 border-t border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Ship className={`w-5 h-5 ${activeTheme.checkColor}`} aria-hidden="true" />
                  <h4 className="text-xl font-black text-slate-900">Flota Turística</h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeNaviera.fleet.capacities.map((cap) => (
                    <span
                      key={cap}
                      className="rounded-lg bg-cyan-50 border border-cyan-200 px-2.5 py-1 text-xs font-extrabold text-cyan-900"
                    >
                      {cap} pax
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-600 mb-4">{activeNaviera.fleet.summary}</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {activeNaviera.fleet.features.map((feat) => (
                  <div
                    key={feat.title}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <p className="text-sm font-bold text-slate-900">{feat.title}</p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
