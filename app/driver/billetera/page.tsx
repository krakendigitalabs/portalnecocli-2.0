import type { Metadata } from "next";
import { requireAuth } from "@/lib/auth/server";
import { getDriverProfile, getWalletTransactions } from "@/data/driverService";
import { redirect } from "next/navigation";
import { WalletSummary } from "@/components/driver/wallet-summary";
import { WalletRecharge } from "@/components/driver/wallet-recharge";
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

  const transactions = await getWalletTransactions(session.user.uid);

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

        <WalletRecharge userId={session.user.uid} />

        {/* Historial de Movimientos */}
        <div>
          <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4 px-2">
            Últimos Movimientos
          </h2>
          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.map((tx: any) => (
                <div
                  key={tx.id}
                  className="bg-white/5 rounded-2xl p-4 flex justify-between items-center border border-white/5"
                >
                  <div>
                    <p className="font-bold text-sm">
                      {tx.type === "TOPUP" ? "Recarga Nequi/Tarjeta" : "Comisión por Carrera"}
                    </p>
                    <p className="text-xs text-white/40">
                      Ref: {tx.gateway_ref || tx.ride_id || tx.id} ·{" "}
                      {new Date(tx.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <p
                    className={`font-bold text-sm ${tx.type === "TOPUP" ? "text-emerald-400" : "text-red-400"}`}
                  >
                    {tx.type === "TOPUP" ? "+ " : "- "}${tx.amount.toLocaleString("es-CO")}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-sm text-white/40 py-4">
                No hay movimientos recientes.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
