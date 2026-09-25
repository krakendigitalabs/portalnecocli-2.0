"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calendar, CheckCircle2, Clock, Phone, UserCheck, X, XCircle } from "lucide-react";
import { useState } from "react";
import type { Reservation, ReservationStatus } from "@/types/reservation";

type Filter = "Hoy" | "Mañana" | "Semana" | "Histórico";

const STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING_PAYMENT: "Pendiente de pago",
  PAID: "Pagado ✓",
  CONFIRMED: "Confirmado",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
};

const STATUS_STYLES: Record<ReservationStatus, string> = {
  PENDING_PAYMENT: "bg-amber-50 text-amber-700 border-amber-200",
  PAID: "bg-teal/10 text-teal border-teal/20",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  COMPLETED: "bg-green-50 text-green-700 border-green-200",
  CANCELLED: "bg-red-50 text-red-600 border-red-200",
};

function formatCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
}

function filterByDate(reservations: Reservation[], filter: Filter): Reservation[] {
  const now = new Date();
  const today = now.toDateString();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toDateString();
  const weekMs = 7 * 24 * 60 * 60 * 1000;

  return reservations.filter((res) => {
    const created = new Date(res.created_at);
    if (filter === "Hoy") return created.toDateString() === today;
    if (filter === "Mañana") return created.toDateString() === tomorrowStr;
    if (filter === "Semana") return now.getTime() - created.getTime() <= weekMs;
    return true; // Histórico
  });
}

type OperationsPanelProps = {
  reservations: Reservation[];
};

export function OperationsPanel({ reservations }: OperationsPanelProps) {
  const [activeFilter, setActiveFilter] = useState<Filter>("Hoy");
  const filtered = filterByDate(reservations, activeFilter);

  const filters: Filter[] = ["Hoy", "Mañana", "Semana", "Histórico"];

  return (
    <div className="space-y-6">
      {/* ── Filtros rápidos ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-all min-h-[40px] ${
              activeFilter === f
                ? "bg-teal text-white shadow-sm"
                : "bg-white border border-ink/10 text-ink/55 hover:border-teal/40 hover:text-teal"
            }`}
          >
            {f}
          </button>
        ))}
        <span className="shrink-0 ml-auto flex items-center text-xs text-ink/40 font-medium">
          {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Lista de reservas ── */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <span className="text-5xl mb-4">🌴</span>
            <p className="text-lg font-semibold text-ink/60">Sin reservas para "{activeFilter}"</p>
            <p className="text-sm text-ink/40 mt-1">
              Cuando lleguen solicitudes de turistas, aparecerán aquí.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {filtered.map((res, i) => (
              <motion.div
                key={res.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-[22px] border border-ink/8 p-5 shadow-[0_2px_12px_rgba(24,32,42,0.05)]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  {/* Info del cliente */}
                  <div className="space-y-2 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <UserCheck className="h-4 w-4 text-teal shrink-0" />
                      <p className="font-bold text-ink text-base truncate">{res.lead.full_name}</p>
                      <span
                        className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[res.status]}`}
                      >
                        {STATUS_LABELS[res.status]}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/55">
                      {res.lead.email && (
                        <span className="flex items-center gap-1">
                          <span>✉</span> {res.lead.email}
                        </span>
                      )}
                      {res.lead.phone && (
                        <a
                          href={`tel:${res.lead.phone}`}
                          className="flex items-center gap-1 text-teal hover:underline"
                        >
                          <Phone className="h-3.5 w-3.5" /> {res.lead.phone}
                        </a>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink/55">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {res.lead.check_in_date ?? "Fecha por confirmar"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(res.created_at).toLocaleDateString("es-CO")}
                      </span>
                    </div>

                    {res.lead.notes && (
                      <p className="text-sm text-ink/50 italic bg-sand rounded-xl px-3 py-2">
                        "{res.lead.notes}"
                      </p>
                    )}
                  </div>

                  {/* Monto + acciones */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-start gap-3 shrink-0">
                    <p className="text-xl font-bold tabular-nums text-ink">
                      {formatCOP(res.total_amount)}
                    </p>

                    {/* Acciones solo para reservas confirmadas pendientes */}
                    {(res.status === "PAID" || res.status === "CONFIRMED") && (
                      <div className="flex gap-2">
                        <button
                          className="flex items-center gap-1.5 rounded-full bg-teal text-white px-4 py-2 text-xs font-bold min-h-[40px] transition hover:bg-teal/90 active:scale-95"
                          aria-label="Marcar como completado"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Completar
                        </button>
                        <button
                          className="flex items-center gap-1.5 rounded-full bg-red-50 text-red-600 border border-red-200 px-3 py-2 text-xs font-bold min-h-[40px] transition hover:bg-red-100 active:scale-95"
                          aria-label="Cancelar reserva"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}

                    {/* WhatsApp directo si hay teléfono */}
                    {res.lead.whatsapp && (
                      <a
                        href={`https://wa.me/${res.lead.whatsapp.replace(/\D/g, "")}?text=Hola%20${encodeURIComponent(res.lead.full_name)}%2C%20soy%20del%20equipo%20de%20Portal%20Necocl%C3%AD.`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-full bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 px-3 py-2 text-xs font-bold min-h-[40px] transition hover:bg-[#25D366]/20"
                      >
                        <X className="h-3 w-3 rotate-45 hidden" />
                        💬 WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
