"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { SurfaceCard } from "@/components/ui/surface-card";
import type { AuthUser } from "@/types/auth";
import type { LoyaltyBonus, LoyaltyProfile, LoyaltyStar } from "@/types/loyalty";
import { LOYALTY_STARS_PER_CYCLE } from "@/types/loyalty";
import type { Reservation } from "@/types/reservation";

type CustomerDashboardProps = {
  user: AuthUser;
  loyaltyProfile: LoyaltyProfile;
  recentStars: LoyaltyStar[];
  bonuses: LoyaltyBonus[];
  reservations: Reservation[];
};

const RESERVATION_STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: "Pendiente de pago",
  PAID: "Pagado ✓",
  CONFIRMED: "Confirmado ✓",
  COMPLETED: "Completado 🌴",
  CANCELLED: "Cancelado",
};

const RESERVATION_STATUS_COLOR: Record<string, string> = {
  PENDING_PAYMENT: "text-amber-600 bg-amber-50 border-amber-200",
  PAID: "text-teal bg-teal/8 border-teal/20",
  CONFIRMED: "text-teal bg-teal/8 border-teal/20",
  COMPLETED: "text-green-700 bg-green-50 border-green-200",
  CANCELLED: "text-ink/50 bg-ink/5 border-ink/10",
};

const BONUS_STATUS_COLOR: Record<string, string> = {
  ACTIVE: "text-coral bg-coral/8 border-coral/20",
  REDEEMED: "text-ink/50 bg-ink/5 border-ink/10",
  EXPIRED: "text-ink/40 bg-ink/5 border-ink/10",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Barra de progreso de estrellas del ciclo actual */
function StarProgressBar({ current, total }: { current: number; total: number }) {
  const percentage = Math.min((current / total) * 100, 100);
  const starsLeft = total - current;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-ink/50">
          Ciclo actual
        </span>
        <span className="text-sm font-bold text-ink">
          {current}/{total} ⭐
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-ink/8">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-ink/50">
        {starsLeft > 0
          ? `${starsLeft} experiencia${starsLeft > 1 ? "s" : ""} más para obtener tu bono del 50%`
          : "¡Tienes un bono activo disponible! 🎉"}
      </p>
    </div>
  );
}

export function CustomerDashboard({
  user,
  loyaltyProfile,
  recentStars,
  bonuses,
  reservations,
}: CustomerDashboardProps) {
  const activeBonus = bonuses.find((b) => b.status === "ACTIVE");
  const pendingReservations = reservations.filter(
    (r) => r.status === "PENDING_PAYMENT" || r.status === "CONFIRMED",
  );

  return (
    <section className="space-y-8">
      {/* ─── Saludo personalizado ─── */}
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-teal to-teal/70 text-2xl text-white shadow-soft">
          {(user.displayName ?? user.email ?? "T").charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-ink/45">
            Bienvenido de vuelta
          </p>
          <h2 className="text-2xl font-bold text-ink">
            {user.displayName ?? user.email ?? "Turista"}
          </h2>
        </div>
      </div>

      {/* ─── Bono activo (si existe) ─── */}
      {activeBonus && (
        <SurfaceCard className="relative overflow-hidden rounded-[28px] p-7">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/15 via-coral/8 to-transparent" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-600">
                🎁 Bono exclusivo activo
              </p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-wide text-ink">
                50% DE DESCUENTO
              </h3>
              <p className="mt-1 text-sm text-ink/60">
                En tu próxima reserva. Válido hasta {formatDate(activeBonus.expires_at)}.
              </p>
            </div>
            <div className="shrink-0 rounded-2xl border-2 border-amber-400/40 bg-white px-6 py-4 text-center shadow-soft">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-600">
                Código
              </p>
              <p className="mt-1 text-xl font-extrabold tracking-wider text-ink">
                {activeBonus.code}
              </p>
            </div>
          </div>
        </SurfaceCard>
      )}

      {/* ─── Métricas + Fidelización ─── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SurfaceCard className="rounded-[24px] p-6">
          <p className="text-3xl font-extrabold text-teal">{loyaltyProfile.total_stars}</p>
          <p className="mt-1 text-sm font-semibold text-ink">Estrellas totales</p>
          <p className="mt-0.5 text-xs text-ink/45">Acumuladas en toda tu historia</p>
        </SurfaceCard>
        <SurfaceCard className="rounded-[24px] p-6">
          <p className="text-3xl font-extrabold text-coral">{reservations.length}</p>
          <p className="mt-1 text-sm font-semibold text-ink">Reservas totales</p>
          <p className="mt-0.5 text-xs text-ink/45">Histórico completo</p>
        </SurfaceCard>
        <SurfaceCard className="rounded-[24px] p-6">
          <p className="text-3xl font-extrabold text-ink">{loyaltyProfile.bonuses_redeemed}</p>
          <p className="mt-1 text-sm font-semibold text-ink">Bonos redimidos</p>
          <p className="mt-0.5 text-xs text-ink/45">Al 50% de descuento</p>
        </SurfaceCard>
        <SurfaceCard className="rounded-[24px] p-6">
          <p className="text-3xl font-extrabold text-amber-500">{pendingReservations.length}</p>
          <p className="mt-1 text-sm font-semibold text-ink">Reservas activas</p>
          <p className="mt-0.5 text-xs text-ink/45">Pendientes o confirmadas</p>
        </SurfaceCard>
      </div>

      {/* ─── Progreso del ciclo de fidelización ─── */}
      <SurfaceCard className="rounded-[28px] p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
              Programa de Fidelidad · Estrellas Doradas
            </p>
            <h3 className="mt-2 text-xl font-bold text-ink">Acumula 5 experiencias → 6ta al 50%</h3>
            <p className="mt-1 text-sm text-ink/60">
              Cada reserva oficial te otorga una estrella dorada. Al juntar 5, Portal Necoclí te regala 
              un bono del <strong>50% de descuento</strong> (subvencionado por nosotros y nuestros aliados premium) 
              para tu próximo viaje a Urabá.
            </p>
          </div>
          <div className="shrink-0 text-5xl">🌴</div>
        </div>

        <StarProgressBar current={loyaltyProfile.stars_in_cycle} total={LOYALTY_STARS_PER_CYCLE} />

        {/* Visualización de estrellas del ciclo */}
        <div className="mt-5 flex gap-2">
          {Array.from({ length: LOYALTY_STARS_PER_CYCLE }).map((_, i) => (
            <div
              key={i}
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-xl transition-all ${
                i < loyaltyProfile.stars_in_cycle
                  ? "border-amber-400 bg-amber-50 shadow-[0_0_12px_rgba(251,191,36,0.4)]"
                  : "border-ink/12 bg-ink/4 opacity-40"
              }`}
            >
              ⭐
            </div>
          ))}
        </div>
      </SurfaceCard>

      {/* ─── Historial de reservas ─── */}
      <div className="grid gap-6 xl:grid-cols-2">
        <SurfaceCard className="rounded-[28px] p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
            Mis reservas
          </p>
          <h3 className="mt-3 text-xl font-bold text-ink">Historial de experiencias</h3>

          {reservations.length > 0 ? (
            <div className="mt-5 space-y-3">
              {reservations.slice(0, 6).map((reservation) => (
                <div
                  key={reservation.id}
                  className="rounded-[18px] border border-ink/8 bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        {reservation.business_name}
                      </p>
                      <p className="mt-0.5 text-xs text-ink/50">
                        {formatDate(reservation.created_at)} · {reservation.reference_code}
                      </p>
                    </div>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${RESERVATION_STATUS_COLOR[reservation.status] ?? "text-ink/50"}`}
                    >
                      {RESERVATION_STATUS_LABEL[reservation.status] ?? reservation.status}
                    </span>
                    {reservation.escrow_transaction_id && (
                      <Link
                        href={`/tickets/${reservation.escrow_transaction_id}`}
                        className="text-[10px] font-bold uppercase tracking-wider text-teal hover:underline"
                      >
                        Ver Ticket Escrow →
                      </Link>
                    )}
                  </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-ink/8 bg-sand/40 px-6 py-8 text-center">
              <p className="text-4xl">🌊</p>
              <p className="mt-3 text-sm font-semibold text-ink">Aún no tienes reservas</p>
              <p className="mt-1 text-xs text-ink/50">
                Explora hoteles, tours y restaurantes en Necoclí
              </p>
              <Link
                className="mt-4 inline-block rounded-full bg-teal px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal/90"
                href="/negocios"
              >
                Explorar negocios →
              </Link>
            </div>
          )}
        </SurfaceCard>

        {/* ─── Estrellas recientes y bonos ─── */}
        <div className="space-y-6">
          {/* Estrellas recientes */}
          <SurfaceCard className="rounded-[28px] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
              Estrellas doradas recientes
            </p>
            {recentStars.length > 0 ? (
              <div className="mt-4 space-y-2">
                {recentStars.slice(0, 4).map((star) => (
                  <div
                    key={star.id}
                    className="flex items-center gap-3 rounded-xl border border-amber-200/60 bg-amber-50/60 px-4 py-3"
                  >
                    <span className="text-lg">⭐</span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-ink">
                        {star.business_name}
                      </p>
                      <p className="text-xs text-ink/50">{formatDate(star.earned_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-ink/50">
                Completa tu primera reserva para ganar estrellas.
              </p>
            )}
          </SurfaceCard>

          {/* Historial de bonos */}
          <SurfaceCard className="rounded-[28px] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-coral">
              Mis bonos
            </p>
            {bonuses.length > 0 ? (
              <div className="mt-4 space-y-2">
                {bonuses.map((bonus) => (
                  <div
                    key={bonus.id}
                    className="flex items-center justify-between rounded-xl border border-ink/8 bg-white px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-bold tracking-wider text-ink">{bonus.code}</p>
                      <p className="text-xs text-ink/50">
                        {bonus.status === "ACTIVE"
                          ? `Vence: ${formatDate(bonus.expires_at)}`
                          : bonus.status === "REDEEMED"
                            ? "Redimido"
                            : "Expirado"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${BONUS_STATUS_COLOR[bonus.status]}`}
                    >
                      {bonus.discount_percentage}% OFF
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-ink/50">
                Completa 5 reservas para obtener tu primer bono al 50%.
              </p>
            )}
          </SurfaceCard>
        </div>
      </div>

      {/* ─── CTA explorar ─── */}
      <Card className="rounded-[28px] border-ink/8 p-8 text-center">
        <p className="text-2xl">🏖️</p>
        <h3 className="mt-3 text-xl font-bold text-ink">El Golfo de Urabá te espera</h3>
        <p className="mt-2 text-sm text-ink/60">
          Descubre hoteles, tours de manglar, gastronomía local y más experiencias únicas en
          Necoclí.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            className="rounded-full bg-teal px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-teal/90"
            href="/negocios"
          >
            Explorar negocios
          </Link>
          <Link
            className="rounded-full border border-ink/12 px-6 py-3 text-sm font-semibold text-ink transition hover:border-teal/30 hover:text-teal"
            href="/tours"
          >
            Ver tours disponibles
          </Link>
        </div>
      </Card>
    </section>
  );
}
