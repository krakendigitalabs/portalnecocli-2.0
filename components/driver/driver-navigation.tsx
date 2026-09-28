"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, History, Wallet, User } from "lucide-react";

export function DriverNavigation() {
  const pathname = usePathname();

  const navItems = [
    { name: "Inicio", path: "/driver", icon: Home },
    { name: "Historial", path: "/driver/historial", icon: History },
    { name: "Billetera", path: "/driver/billetera", icon: Wallet },
    { name: "Perfil", path: "/driver/perfil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-[#1A1D23]/90 backdrop-blur-xl border-t border-white/10 z-[100] pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-between px-6 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              href={item.path}
              className="relative flex flex-col items-center justify-center w-16 h-14"
            >
              {isActive && (
                <motion.div
                  layoutId="driver-nav-pill"
                  className="absolute inset-0 bg-emerald-500/20 rounded-2xl"
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <Icon
                className={`w-6 h-6 z-10 transition-colors duration-300 ${
                  isActive ? "text-emerald-400" : "text-white/40 group-hover:text-white/60"
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[10px] z-10 mt-1 font-medium transition-colors duration-300 ${
                  isActive ? "text-emerald-400" : "text-white/40"
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
