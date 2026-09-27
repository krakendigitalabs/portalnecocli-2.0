import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/server";
import { getDriverProfile } from "@/data/driverService";
import { redirect } from "next/navigation";
import { WalletSummary } from "@/components/driver/wallet-summary";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Billetera | Neco-Dispatch",
  description: "Recarga saldo y gestiona tus pagos.",
};

export default async function DriverWalletPage() {
  const session = await requireAuth({ nextPath: "/driver/billetera" });

  const driverProfile = await getDriverProfile(session.user.uid);
  if (!driverProfile) {
    redirect("/conductores");
  }

  // TODO: Fetch wallet_transactions from Firestore for the history list.
  // For now, we just show the balance and top-up button.

  return (
    <div className="min-h-screen bg-[#1A1D23] text-white pb-24">
      {/* Header fijo */}
      <header className="sticky top-0 z-50 bg-[#1A1D23]/95 backdrop-blur-md border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <Link href="/driver" className="text-white/60 text-sm">
          ← Volver
        </Link>
        <h1 className="text-sm font-bold text-white">Billetera Neco-Dispatch</h1>
        <div className="w-10"></div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-6 space-y-6">
        <WalletSummary
          balance={driverProfile.wallet_balance || 0}
          ridesCompleted={driverProfile.total_rides_completed || 0}
          totalEarnings={driverProfile.wallet_balance || 0}
        />

        <div className="bg-[#2A2D35] rounded-3xl p-6 border border-white/5 text-center space-y-4 shadow-lg">
          <h2 className="text-lg font-bold text-white mb-2">Recargar Saldo</h2>
          <p className="text-sm text-white/60">
            Mantén tu saldo positivo para seguir recibiendo carreras. Puedes recargar vía Nequi,
            Bancolombia o PSE.
          </p>
          <div className="grid grid-cols-2 gap-3 mt-4">
            <button className="bg-teal text-white py-3 rounded-2xl font-bold hover:bg-teal/80 transition-colors">
              $ 20.000
            </button>
            <button className="bg-teal text-white py-3 rounded-2xl font-bold hover:bg-teal/80 transition-colors">
              $ 50.000
            </button>
            <button className="bg-teal text-white py-3 rounded-2xl font-bold hover:bg-teal/80 transition-colors">
              $ 100.000
            </button>
            <button className="bg-white/10 text-white py-3 rounded-2xl font-bold hover:bg-white/20 transition-colors">
              Otro Valor
            </button>
          </div>
          <p className="text-xs text-white/40 mt-4">
            Los pagos son procesados de forma segura por Wompi.
          </p>
        </div>

        {/* Historial de Movimientos */}
        <div>
          <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4 px-2">
            Últimos Movimientos
          </h2>
          <div className="space-y-3">
            {/* Demo data for now */}
            <div className="bg-white/5 rounded-2xl p-4 flex justify-between items-center border border-white/5">
              <div>
                <p className="font-bold text-sm">Comisión por Carrera</p>
                <p className="text-xs text-white/40">Marimonda (Juan Pérez)</p>
              </div>
              <p className="text-red-400 font-bold text-sm">- $6.600</p>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 flex justify-between items-center border border-white/5">
              <div>
                <p className="font-bold text-sm">Recarga Nequi</p>
                <p className="text-xs text-white/40">Wompi Transacción #123</p>
              </div>
              <p className="text-emerald-400 font-bold text-sm">+ $50.000</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
