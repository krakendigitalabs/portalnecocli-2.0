"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Sun, Waves } from "lucide-react";

export type NavieraId = "sol_playa" | "caribe";
export type NavieraName = "Sol y Playa S.A.S" | "El Caribe S.A.S";
export type NavieraValue = NavieraId | NavieraName;

export interface NavieraThemeConfig {
  selectedCard: string;
  spotlightCard: string;
  hoverCard: string;
  selectedIcon: string;
  spotlightIcon: string;
  selectedTitle: string;
  selectedSubtitle: string;
  checkIcon: string;
  badge: string;
  ctaButton: string;
  focusRing: string;
}

const SOL_Y_PLAYA_THEME: NavieraThemeConfig = {
  selectedCard:
    "z-10 scale-[1.03] border-amber-500 bg-gradient-to-br from-amber-50 via-orange-50/70 to-white shadow-lg shadow-amber-500/15 ring-2 ring-amber-400/30",
  spotlightCard:
    "z-10 scale-[1.03] border-amber-400/80 bg-amber-50/40 shadow-md",
  hoverCard:
    "hover:z-10 hover:scale-[1.03] hover:border-amber-400 hover:bg-amber-50/30 hover:opacity-100 hover:shadow-md",
  selectedIcon:
    "bg-gradient-to-br from-amber-500 to-orange-500 text-white scale-105 shadow-sm shadow-amber-500/30",
  spotlightIcon: "bg-amber-100 text-amber-700 scale-105",
  selectedTitle: "text-amber-950 font-black",
  selectedSubtitle: "text-amber-800/90 font-semibold",
  checkIcon: "text-amber-600",
  badge: "bg-amber-100 text-amber-900 border-amber-300 font-bold",
  ctaButton: "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-amber-500/30",
  focusRing: "focus-visible:ring-amber-500",
};

const CARIBE_THEME: NavieraThemeConfig = {
  selectedCard:
    "z-10 scale-[1.03] border-cyan-600 bg-gradient-to-br from-cyan-50 via-teal-50/70 to-white shadow-lg shadow-cyan-600/15 ring-2 ring-cyan-500/25",
  spotlightCard:
    "z-10 scale-[1.03] border-cyan-400/80 bg-cyan-50/40 shadow-md",
  hoverCard:
    "hover:z-10 hover:scale-[1.03] hover:border-cyan-400 hover:bg-cyan-50/30 hover:opacity-100 hover:shadow-md",
  selectedIcon:
    "bg-gradient-to-br from-cyan-600 to-teal-600 text-white scale-105 shadow-sm shadow-cyan-600/30",
  spotlightIcon: "bg-cyan-100 text-cyan-700 scale-105",
  selectedTitle: "text-cyan-950 font-black",
  selectedSubtitle: "text-cyan-800/90 font-semibold",
  checkIcon: "text-cyan-600",
  badge: "bg-cyan-100 text-cyan-900 border-cyan-300 font-bold",
  ctaButton: "bg-gradient-to-r from-cyan-600 to-teal-600 text-white hover:from-cyan-700 hover:to-teal-700 shadow-cyan-600/30",
  focusRing: "focus-visible:ring-cyan-500",
};

export const NAVIERA_THEMES: Record<string, NavieraThemeConfig> = {
  "Sol y Playa S.A.S": SOL_Y_PLAYA_THEME,
  sol_playa: SOL_Y_PLAYA_THEME,
  "El Caribe S.A.S": CARIBE_THEME,
  caribe: CARIBE_THEME,
};

interface NavieraOption {
  id: NavieraId;
  name: NavieraName;
  subtitle: string;
  icon: typeof Sun;
}

const NAVIERAS: NavieraOption[] = [
  {
    id: "sol_playa",
    name: "Sol y Playa S.A.S",
    subtitle: "Naviera oficial · DIMAR",
    icon: Sun,
  },
  {
    id: "caribe",
    name: "El Caribe S.A.S",
    subtitle: "Naviera oficial · DIMAR",
    icon: Waves,
  },
];

interface NavieraSelectorProps {
  value: NavieraValue | "";
  onChange: (value: NavieraId) => void;
  /** Si es true, alterna aleatoriamente cuál aparece a la izquierda en cada visita */
  randomizeOrder?: boolean;
  className?: string;
}

export function NavieraSelector({
  value,
  onChange,
  randomizeOrder = false,
  className = "",
}: NavieraSelectorProps) {
  const [options, setOptions] = useState<NavieraOption[]>(NAVIERAS);
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Orden aleatorio opcional solo en cliente para evitar desajustes de hidratación
  useEffect(() => {
    if (randomizeOrder && Math.random() < 0.5) {
      setOptions([NAVIERAS[1], NAVIERAS[0]]);
    }
  }, [randomizeOrder]);

  // Efecto de spotlight / zoom alternado mientras el usuario aún no elige ni pasa el cursor
  useEffect(() => {
    if (value || isHovering) return;

    const interval = setInterval(() => {
      setSpotlightIndex((prev) => (prev === 0 ? 1 : 0));
    }, 2400);

    return () => clearInterval(interval);
  }, [value, isHovering]);

  const activeTheme = value ? NAVIERA_THEMES[value] : null;

  return (
    <div
      className={`rounded-[28px] border-2 border-slate-200 bg-white px-5 py-4 shadow-sm transition-all ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-black uppercase tracking-wider text-slate-700">
          Naviera <span className="text-rose-500">*</span>
        </span>

        {value && activeTheme ? (
          <span
            className={`rounded-full border px-3 py-1 text-[11px] font-bold transition-all shadow-sm ${activeTheme.badge}`}
          >
            ✓ Seleccionada: {value === "sol_playa" ? "Sol y Playa S.A.S" : value === "caribe" ? "El Caribe S.A.S" : value}
          </span>
        ) : (
          <span className="text-[11px] font-bold text-sky-600 animate-pulse">
            Elige una opción
          </span>
        )}
      </div>

      <div
        role="radiogroup"
        aria-label="Seleccionar naviera"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
      >
        {options.map((naviera, index) => {
          const Icon = naviera.icon;
          const theme = NAVIERA_THEMES[naviera.id];
          const isSelected = value === naviera.id || value === naviera.name;
          const isSpotlight = !value && !isHovering && spotlightIndex === index;
          const isDimmed =
            (Boolean(value) && !isSelected) ||
            (!value && !isHovering && !isSpotlight);

          return (
            <button
              key={naviera.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(naviera.id)}
              className={[
                "group relative flex items-center gap-3.5 rounded-2xl border-2 p-3.5 text-left transition-all duration-500 ease-out motion-reduce:transition-none cursor-pointer",
                "focus-visible:outline-none focus-visible:ring-2",
                theme.focusRing,
                isSelected
                  ? theme.selectedCard
                  : isSpotlight
                    ? theme.spotlightCard
                    : isDimmed
                      ? `scale-[0.97] border-slate-200 bg-slate-50/70 opacity-75 ${theme.hoverCard}`
                      : `border-slate-200 bg-white ${theme.hoverCard}`,
              ].join(" ")}
            >
              <div
                className={[
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
                  isSelected
                    ? theme.selectedIcon
                    : isSpotlight
                      ? theme.spotlightIcon
                      : "bg-slate-100 text-slate-600 group-hover:scale-105",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className={`truncate text-sm font-bold transition-colors ${
                    isSelected ? theme.selectedTitle : "text-slate-900"
                  }`}
                >
                  {naviera.name}
                </p>
                <p
                  className={`truncate text-xs font-semibold transition-colors ${
                    isSelected ? theme.selectedSubtitle : "text-slate-500"
                  }`}
                >
                  {naviera.subtitle}
                </p>
              </div>

              {isSelected && (
                <CheckCircle2
                  className={`h-5 w-5 shrink-0 ${theme.checkIcon}`}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
