"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Home,
  LogOut,
  QrCode,
  Settings,
  Store,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/merchant", label: "Inicio", icon: Home, exact: true },
  { href: "/merchant/operaciones", label: "Operaciones", icon: ClipboardList, exact: false },
  { href: "/merchant/tickets", label: "Tickets", icon: QrCode, exact: false },
  { href: "/merchant/estadisticas", label: "Métricas", icon: BarChart3, exact: false },
  { href: "/merchant/configuracion", label: "Configuración", icon: Settings, exact: false },
];

export function MerchantSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    // Solo visible en md+ (tablet y desktop)
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="hidden md:flex flex-col h-screen sticky top-0 bg-sand border-r border-ink/8 shrink-0 overflow-hidden z-40"
    >
      {/* ── Encabezado ── */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-ink/8">
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal text-white">
                <Store className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-ink leading-tight">Merchant Hub</p>
                <p className="truncate text-[10px] text-ink/45 leading-tight">Portal Necoclí</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {collapsed && (
          <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-teal text-white">
            <Store className="h-4 w-4" />
          </span>
        )}

        {/* Toggle colapso */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-ink/40 transition hover:bg-ink/8 hover:text-ink"
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* ── Links de navegación ── */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 min-h-[44px] text-sm font-medium transition-all duration-200 ${
                isActive ? "bg-teal/10 text-teal" : "text-ink/55 hover:bg-ink/5 hover:text-ink"
              }`}
            >
              {/* Indicador activo */}
              {isActive && (
                <motion.span
                  layoutId="merchant-sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-teal"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}

              <Icon
                className={`h-5 w-5 shrink-0 transition-colors ${isActive ? "text-teal" : "text-ink/40 group-hover:text-ink"}`}
                strokeWidth={isActive ? 2.5 : 1.8}
              />

              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    key="label"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="truncate overflow-hidden whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* ── Footer: Cerrar sesión ── */}
      <div className="border-t border-ink/8 p-2">
        <Link
          href="/api/auth/logout"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 min-h-[44px] text-sm font-medium text-ink/40 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-5 w-5 shrink-0" strokeWidth={1.8} />
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.span
                key="logout-label"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
                className="truncate overflow-hidden whitespace-nowrap"
              >
                Cerrar sesión
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
      </div>
    </motion.aside>
  );
}
