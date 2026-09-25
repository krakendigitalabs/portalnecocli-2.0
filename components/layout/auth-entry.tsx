"use client";

import { Briefcase, Clock, Gift, Heart, User } from "lucide-react";
import Link from "next/link";
import { useAuthSession } from "@/hooks/use-auth-session";
import { signOutCurrentUser } from "@/lib/firebase/auth";

function getDashboardHref(roles: string[]): string {
  if (roles.includes("super_admin") || roles.includes("admin")) return "/admin";
  if (roles.includes("business") || roles.includes("operator")) return "/merchant";
  return "/customer";
}

export function AuthEntry() {
  const session = useAuthSession();

  return (
    <div className="relative group">
      {/* Botón Principal (Gatillo del Dropdown) */}
      <button className="flex items-center gap-2 px-4 py-2 text-ink hover:text-green transition-colors rounded-full hover:bg-green/5">
        <div className="bg-ink/5 p-1.5 rounded-full">
          <User className="w-4 h-4 text-ink/70" />
        </div>
        <span className="text-sm font-bold">
          {session.user ? session.user.displayName || "Mi Cuenta" : "Mis viajes"}
        </span>
      </button>

      {/* Panel Desplegable (Dropdown) */}
      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-ink/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-[200] overflow-hidden">
        <div className="p-4 border-b border-ink/5">
          <h4 className="font-bold text-ink">
            {session.user ? "Mi panel de control" : "Organiza tu viaje"}
          </h4>
        </div>

        <div className="p-2 flex flex-col">
          <Link
            href="/customer/favoritos"
            className="flex items-center gap-3 px-3 py-3 hover:bg-sand rounded-xl transition-colors text-ink/80 hover:text-ink"
          >
            <Heart className="w-5 h-5" />
            <span className="text-sm font-medium">Favoritos</span>
          </Link>
          <Link
            href="/customer/vistos"
            className="flex items-center gap-3 px-3 py-3 hover:bg-sand rounded-xl transition-colors text-ink/80 hover:text-ink"
          >
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">Vistos recientemente</span>
          </Link>
          <Link
            href="/customer/reservas"
            className="flex items-center gap-3 px-3 py-3 hover:bg-sand rounded-xl transition-colors text-ink/80 hover:text-ink"
          >
            <Briefcase className="w-5 h-5" />
            <span className="text-sm font-medium">Mis Reservas</span>
          </Link>
          <Link
            href="/customer/bonos"
            className="flex items-center gap-3 px-3 py-3 hover:bg-sand rounded-xl transition-colors text-ink/80 hover:text-ink"
          >
            <Gift className="w-5 h-5 text-coral/80" />
            <span className="text-sm font-medium">Mis Bonos</span>
          </Link>
        </div>

        {/* Controles de Sesión */}
        {session.status === "loading" ? (
          <div className="p-3 border-t border-ink/5 bg-sand/50 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-ink/50">
              Cargando...
            </span>
          </div>
        ) : session.user ? (
          <div className="p-3 border-t border-ink/5 bg-sand/30 flex flex-col gap-2">
            <Link
              href={getDashboardHref(session.user.roles)}
              className="block text-center w-full bg-ink hover:bg-ink/90 text-white font-bold text-xs py-2.5 rounded-lg transition-colors"
            >
              Ir al Dashboard
            </Link>
            <button
              onClick={() => void signOutCurrentUser()}
              className="text-xs font-bold text-red-600 hover:text-red-700 w-full text-center py-2 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          <div className="p-3 border-t border-ink/5 bg-sand/30">
            <Link
              href="/ingresar"
              className="block text-center w-full bg-green hover:bg-green/90 text-white font-bold text-xs py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Iniciar sesión / Registrarse
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
