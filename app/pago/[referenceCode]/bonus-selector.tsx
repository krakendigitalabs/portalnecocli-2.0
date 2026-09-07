"use client";

import { useState } from "react";
import type { LoyaltyBonus } from "@/types/loyalty";
import { Gift, Loader2, CheckCircle2 } from "lucide-react";
import { applyBonusToReservation } from "@/app/actions/bonus";

export function BonusSelector({ 
  bonuses, 
  reservationId,
  appliedBonusId
}: { 
  bonuses: LoyaltyBonus[]; 
  reservationId: string;
  appliedBonusId?: string | null;
}) {
  const [isApplying, setIsApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeBonuses = bonuses.filter(b => b.status === "ACTIVE");

  if (appliedBonusId) {
    return (
      <div className="bg-coral/10 border border-coral/20 p-4 rounded-xl flex items-start gap-3 mt-6">
        <CheckCircle2 className="text-coral w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="text-coral font-bold text-sm">Bono Aplicado Exitosamente</p>
          <p className="text-coral/80 text-xs">El descuento se ha reflejado en el total a pagar.</p>
        </div>
      </div>
    );
  }

  if (activeBonuses.length === 0) return null;

  const handleApply = async (bonusId: string) => {
    setIsApplying(true);
    setError(null);
    try {
      await applyBonusToReservation(reservationId, bonusId);
      // El Server Action hará revalidatePath y actualizará todo.
    } catch (err: any) {
      setError(err.message);
      setIsApplying(false);
    }
  };

  return (
    <div className="mt-6 border-t border-ink/5 pt-6">
      <div className="flex items-center gap-2 text-ink mb-3">
        <Gift className="w-5 h-5 text-coral" />
        <h4 className="font-bold">Tienes {activeBonuses.length} recompensa(s) aplicable(s)</h4>
      </div>
      
      {error && (
        <div className="text-red-500 text-xs bg-red-50 p-2 rounded mb-3">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {activeBonuses.map(bonus => (
          <div key={bonus.id} className="bg-amber-50/50 border border-amber-200/50 p-3 rounded-xl flex items-center justify-between gap-4 transition-colors hover:bg-amber-50">
            <div>
              <p className="text-sm font-bold text-ink">{bonus.title}</p>
              <p className="text-xs text-ink/60">{bonus.description}</p>
            </div>
            <button
              onClick={() => handleApply(bonus.id)}
              disabled={isApplying}
              className="shrink-0 bg-ink text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-ink/80 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isApplying ? <Loader2 className="w-3 h-3 animate-spin" /> : "Aplicar"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
