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
export function WalletSummary({
  balance,
  totalEarnings = 0,
  ridesCompleted = 0,
}: WalletSummaryProps) {
  const isLow = balance < 5000;

  return (
    <div className="bg-[#2A2D35] rounded-2xl p-4 border border-white/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-0.5">
            Tu saldo
          </p>
          <p
            className={`text-2xl font-bold ${isLow ? "text-red-400 animate-pulse" : "text-teal-400"}`}
          >
            ${balance.toLocaleString("es-CO")}
          </p>
        </div>
        <button className="bg-teal-500/20 text-teal-400 text-xs font-bold px-4 py-2 rounded-xl hover:bg-teal-500/30 transition-colors border border-teal-500/20">
          + Recargar
        </button>
      </div>

      {(totalEarnings > 0 || ridesCompleted > 0) && (
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/5 text-xs text-white/40">
          <span>🛺 {ridesCompleted} carreras</span>
          <span>💰 ${totalEarnings.toLocaleString("es-CO")} ganados</span>
        </div>
      )}

      {isLow && (
        <p className="text-[10px] text-red-400/80 mt-2">
          ⚠️ Saldo bajo. Recarga para seguir aceptando carreras.
        </p>
      )}
    </div>
  );
}
