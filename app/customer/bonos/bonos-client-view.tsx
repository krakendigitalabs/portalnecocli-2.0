"use client";

import { CheckCircle2, Copy, Gift, Share2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { LoyaltyBonus } from "@/types/loyalty";

const BONUS_STATUS_COLOR: Record<string, string> = {
  ACTIVE: "text-coral bg-coral/8 border-coral/20",
  REDEEMED: "text-ink/50 bg-ink/5 border-ink/10",
  EXPIRED: "text-ink/40 bg-ink/5 border-ink/10",
};

const DAYS_MAP: Record<number, string> = {
  1: "Lun",
  2: "Mar",
  3: "Mié",
  4: "Jue",
  5: "Vie",
  6: "Sáb",
  0: "Dom",
};

function formatValidDays(days?: number[]): string {
  if (!days || days.length === 0) return "Válido todos los días";
  if (days.length === 7) return "Válido todos los días";

  if (days.length === 3 && days.includes(5) && days.includes(6) && days.includes(0))
    return "Válido solo fines de semana";
  if (
    days.length === 4 &&
    days.includes(1) &&
    days.includes(2) &&
    days.includes(3) &&
    days.includes(4)
  )
    return "Válido de Lunes a Jueves";

  const daysNames = days.map((d) => DAYS_MAP[d]);
  return `Válido: ${daysNames.join(", ")}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BonosClientView({ bonuses }: { bonuses: LoyaltyBonus[] }) {
  const [tab, setTab] = useState<"ACTIVE" | "HISTORY">("ACTIVE");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeBonuses = bonuses.filter((b) => b.status === "ACTIVE");
  const historyBonuses = bonuses.filter((b) => b.status !== "ACTIVE");

  const displayBonuses = tab === "ACTIVE" ? activeBonuses : historyBonuses;

  const handleShare = async (bonus: LoyaltyBonus) => {
    const text = `¡Me acabo de ganar una recompensa en Portal Necoclí! 🎁\n\n${bonus.title}: ${bonus.description}\n\nReserva en tours.portalnecocli.com y gana tú también.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mi Recompensa en Necoclí",
          text: text,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback a copiar al portapapeles
      await navigator.clipboard.writeText(text);
      setCopiedId(bonus.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Tabs */}
      <div className="flex p-1 bg-ink/5 rounded-full w-fit">
        <button
          onClick={() => setTab("ACTIVE")}
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
            tab === "ACTIVE" ? "bg-white text-ink shadow-sm" : "text-ink/60 hover:text-ink"
          }`}
        >
          Activos ({activeBonuses.length})
        </button>
        <button
          onClick={() => setTab("HISTORY")}
          className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
            tab === "HISTORY" ? "bg-white text-ink shadow-sm" : "text-ink/60 hover:text-ink"
          }`}
        >
          Historial ({historyBonuses.length})
        </button>
      </div>

      {displayBonuses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {displayBonuses.map((bonus) => (
            <SurfaceCard
              key={bonus.id}
              className="p-0 rounded-[28px] overflow-hidden flex flex-col transition-all hover:shadow-lg"
            >
              <div
                className={`p-6 ${bonus.status === "ACTIVE" ? "bg-gradient-to-br from-amber-400/15 via-coral/5 to-transparent" : "bg-ink/5"}`}
              >
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${BONUS_STATUS_COLOR[bonus.status]}`}
                  >
                    {bonus.status === "ACTIVE"
                      ? "Activo"
                      : bonus.status === "REDEEMED"
                        ? "Usado"
                        : "Expirado"}
                  </span>

                  {bonus.status === "ACTIVE" && (
                    <button
                      onClick={() => handleShare(bonus)}
                      className="bg-white rounded-full p-2 shadow-sm border border-ink/5 text-teal hover:bg-teal/10 transition-colors"
                      title="Compartir con amigos"
                    >
                      {copiedId === bonus.id ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <Share2 className="w-5 h-5" />
                      )}
                    </button>
                  )}
                  {bonus.status !== "ACTIVE" && (
                    <div className="bg-white rounded-full p-2 shadow-sm border border-ink/5 text-ink/40">
                      <Gift className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-ink leading-tight">
                  {bonus.title || "Bono de Recompensa"}
                </h3>
                <p className="text-ink/70 text-sm mt-2 font-medium">{bonus.description}</p>
                <div className="mt-4 pt-4 border-t border-ink/10 space-y-1">
                  <p className="text-ink/60 text-xs font-semibold uppercase tracking-wider">
                    ⏱️ {formatValidDays(bonus.valid_days)}
                  </p>
                  <p className="text-coral/80 text-xs font-bold uppercase tracking-wider">
                    {bonus.status === "ACTIVE"
                      ? `⏳ Expira el ${formatDate(bonus.expires_at)}`
                      : `Generado el ${formatDate(bonus.created_at)}`}
                  </p>
                </div>
              </div>

              <div className="p-6 bg-white border-t border-ink/5 flex justify-between items-center">
                <div>
                  <p className="text-xs uppercase tracking-widest text-ink/40 font-semibold mb-1">
                    Código Promocional
                  </p>
                  <p
                    className={`text-xl font-bold font-mono tracking-wider ${bonus.status === "ACTIVE" ? "text-ink" : "text-ink/40 line-through"}`}
                  >
                    {bonus.code}
                  </p>
                </div>
                {bonus.status === "ACTIVE" && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(bonus.code);
                      setCopiedId(bonus.code);
                      setTimeout(() => setCopiedId(null), 2000);
                    }}
                    className="p-2 text-ink/40 hover:text-ink bg-ink/5 rounded-full transition-colors"
                  >
                    {copiedId === bonus.code ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                )}
              </div>
            </SurfaceCard>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[28px] shadow-soft border border-ink/5 p-12 flex flex-col items-center justify-center min-h-[350px] text-center relative overflow-hidden">
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

            <h3 className="text-2xl font-bold text-ink mb-3">
              {tab === "ACTIVE"
                ? "Aún no tienes recompensas activas"
                : "No tienes historial de bonos"}
            </h3>
            <p className="text-ink/60 max-w-md mx-auto mb-10 leading-relaxed">
              Completa 5 reservas para desbloquear bonos sorpresa en restaurantes, hoteles, tours,
              odontologías y más aliados.
            </p>

            {tab === "ACTIVE" && (
              <Link
                href="/negocios"
                className="bg-coral hover:bg-coral/90 text-white font-bold py-3.5 px-8 rounded-full transition-all shadow-soft inline-block"
              >
                Explorar para ganar estrellas
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
