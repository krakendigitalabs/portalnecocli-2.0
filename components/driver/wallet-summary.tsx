"use client";

interface WalletSummaryProps {
  balance: number;
  totalEarnings?: number;
  ridesCompleted?: number;
}

/**
 * Resumen compacto de la billetera virtual del conductor.
 * Siempre visible en la parte superior del dashboard.
 */
import Link from "next/link";
import { motion } from "framer-motion";

export function WalletSummary({
  balance,
  totalEarnings = 0,
  ridesCompleted = 0,
}: WalletSummaryProps) {
  const isLow = balance < 5000;
  const dailyGoal = 10;
  const progress = Math.min((ridesCompleted / dailyGoal) * 100, 100);
  const remaining = dailyGoal - ridesCompleted;

  return (
    <div className="bg-[#2A2D35] rounded-3xl p-5 border border-white/5 shadow-lg overflow-hidden relative">
      {/* Confetti / Glow effect if goal reached */}
      {progress >= 100 && (
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 via-amber-400/5 to-transparent pointer-events-none" />
      )}

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">
            Tu saldo
          </p>
          <p
            className={`text-3xl font-black ${isLow ? "text-red-400 animate-pulse" : "text-emerald-400"}`}
          >
            ${balance.toLocaleString("es-CO")}
          </p>
        </div>
        <Link
          href="/driver/billetera"
          className="bg-white/10 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-white/20 transition-all active:scale-95 flex items-center gap-1"
        >
          <span>💳</span> Recargar
        </Link>
      </div>

      {/* Daily Goal Gamification */}
      <div className="bg-black/30 rounded-2xl p-4 border border-white/5 relative z-10">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-xs font-bold text-white/80">Meta del Día</p>
            <p className="text-[10px] text-white/40 mt-0.5">
              {progress >= 100
                ? "¡Increíble! Alcanzaste tu meta. 🏆"
                : remaining === 1
                  ? "¡Solo 1 viaje más para la meta! 🔥"
                  : `Estás a ${remaining} viajes de tu meta.`}
            </p>
          </div>
          <span className="text-sm font-black text-white/90">
            {ridesCompleted}/{dailyGoal}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, type: "spring", bounce: 0.2 }}
            className={`h-full rounded-full relative ${progress >= 100 ? "bg-amber-400" : "bg-gradient-to-r from-blue-500 to-teal-400"}`}
          >
            {/* Shimmer effect */}
            <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </motion.div>
        </div>
      </div>

      {isLow && (
        <p className="text-[10px] text-red-400/80 mt-2">
          ⚠️ Saldo bajo. Recarga para seguir aceptando carreras.
        </p>
      )}
    </div>
  );
}
