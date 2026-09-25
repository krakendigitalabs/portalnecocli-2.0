"use client";

import { motion } from "framer-motion";
import { BarChart3, ClipboardList, Home, QrCode, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/merchant", label: "Inicio", icon: Home },
  { href: "/merchant/operaciones", label: "Operaciones", icon: ClipboardList },
  { href: "/merchant/tickets", label: "Tickets", icon: QrCode },
  { href: "/merchant/estadisticas", label: "Métricas", icon: BarChart3 },
  { href: "/merchant/configuracion", label: "Config", icon: Settings },
];

export function MerchantBottomNav() {
  const pathname = usePathname();

  return (
    // Visible solo en mobile (md: hidden), con safe area para iPhone notch
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Blur glass effect */}
      <div className="absolute inset-0 bg-sand/90 backdrop-blur-xl border-t border-ink/8 shadow-[0_-4px_24px_rgba(24,32,42,0.08)]" />

      <ul className="relative flex items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          // Coincidencia exacta para Home, prefijo para el resto
          const isActive =
            href === "/merchant" ? pathname === "/merchant" : pathname.startsWith(href);

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="relative flex flex-col items-center justify-center gap-1 py-3 min-h-[56px] w-full"
                aria-current={isActive ? "page" : undefined}
              >
                {/* Pill indicadora de activo */}
                {isActive && (
                  <motion.span
                    layoutId="merchant-nav-pill"
                    className="absolute inset-x-1 top-1.5 h-8 rounded-full bg-teal/12"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}

                <Icon
                  className={`relative z-10 h-5 w-5 transition-colors duration-200 ${
                    isActive ? "text-teal" : "text-ink/40"
                  }`}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                <span
                  className={`relative z-10 text-[10px] font-semibold tracking-wide transition-colors duration-200 ${
                    isActive ? "text-teal" : "text-ink/40"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
