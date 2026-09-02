import { Gift } from "lucide-react";
import Link from "next/link";
import { getLoyaltyBonuses } from "@/data/loyaltyService";
import { requireRole } from "@/lib/auth/server";
import { SurfaceCard } from "@/components/ui/surface-card";

const BONUS_STATUS_COLOR: Record<string, string> = {
  ACTIVE: "text-coral bg-coral/8 border-coral/20",
  REDEEMED: "text-ink/50 bg-ink/5 border-ink/10",
  EXPIRED: "text-ink/40 bg-ink/5 border-ink/10",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BonosPage() {
  const session = await requireRole(["customer", "business", "admin", "super_admin"], {
    nextPath: "/customer/bonos",
  });

  const { user } = session;
  const bonuses = await getLoyaltyBonuses(user.uid);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-ink tracking-tight">Tus Bonos</h2>
        <p className="text-ink/60 mt-2">
          Canjea tus bonos de 50% de descuento en tu próxima experiencia en Necoclí.
        </p>
      </div>

      {bonuses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {bonuses.map((bonus) => (
            <SurfaceCard key={bonus.id} className="p-0 rounded-[28px] overflow-hidden flex flex-col">
              <div className={`p-6 ${bonus.status === 'ACTIVE' ? 'bg-gradient-to-br from-amber-400/15 via-coral/5 to-transparent' : 'bg-ink/5'}`}>
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${BONUS_STATUS_COLOR[bonus.status]}`}
                  >
                    {bonus.status === "ACTIVE" ? "Activo" : bonus.status === "REDEEMED" ? "Redimido" : "Expirado"}
                  </span>
                  <div className="bg-white rounded-full p-2 shadow-sm border border-ink/5">
                    <Gift className={`w-5 h-5 ${bonus.status === 'ACTIVE' ? 'text-coral' : 'text-ink/40'}`} />
                  </div>
                </div>
                <h3 className="text-3xl font-extrabold text-ink">{bonus.discount_percentage}% OFF</h3>
                <p className="text-ink/60 text-sm mt-1">
                  {bonus.status === "ACTIVE" 
                    ? `Válido hasta el ${formatDate(bonus.expires_at)}`
                    : `Generado el ${formatDate(bonus.created_at)}`
                  }
                </p>
              </div>
              
              <div className="p-6 bg-white border-t border-ink/5 flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase tracking-widest text-ink/40 font-semibold mb-1">Código Promocional</p>
                  <p className={`text-xl font-bold font-mono tracking-wider ${bonus.status === 'ACTIVE' ? 'text-ink' : 'text-ink/40 line-through'}`}>
                    {bonus.code}
                  </p>
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[28px] shadow-soft border border-ink/5 p-12 flex flex-col items-center justify-center min-h-[450px] text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/5 via-coral/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-coral/20 blur-xl rounded-full" />
                <div className="bg-white border border-coral/20 p-5 rounded-full relative z-10 shadow-sm">
                  <Gift className="w-12 h-12 text-coral fill-coral/10" />
                </div>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-ink mb-3">Aún no tienes bonos</h3>
            <p className="text-ink/60 max-w-md mx-auto mb-10 leading-relaxed">
              Completa 5 reservas oficiales a través de Portal Necoclí para desbloquear automáticamente tu primer bono del 50% de descuento.
            </p>
            
            <Link 
              href="/negocios"
              className="bg-coral hover:bg-coral/90 text-white font-bold py-3.5 px-8 rounded-full transition-all shadow-soft inline-block"
            >
              Explorar para ganar estrellas
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
