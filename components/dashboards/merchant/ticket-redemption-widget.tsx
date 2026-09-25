"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, Search, Unlock } from "lucide-react";
import { useState } from "react";

type LookupState = "idle" | "loading" | "found" | "not_found" | "redeemed" | "error";

type TicketInfo = {
  referenceCode: string;
  customerName: string;
  service: string;
  amount: number;
  status: string;
};

function formatCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
}

export function TicketRedemptionWidget() {
  const [code, setCode] = useState("");
  const [state, setState] = useState<LookupState>("idle");
  const [ticket, setTicket] = useState<TicketInfo | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSearch() {
    if (!code.trim()) return;
    setState("loading");
    setTicket(null);

    try {
      const res = await fetch(`/api/tickets/lookup?code=${encodeURIComponent(code.trim())}`);
      if (!res.ok) {
        setState("not_found");
        return;
      }
      const data = await res.json();
      setTicket(data);
      setState("found");
    } catch {
      setState("error");
      setErrorMsg("Error de conexión. Inténtalo de nuevo.");
    }
  }

  async function handleRedeem() {
    if (!ticket) return;
    setState("loading");

    try {
      const res = await fetch("/api/tickets/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referenceCode: ticket.referenceCode }),
      });

      if (res.ok) {
        setState("redeemed");
      } else {
        const err = await res.json();
        setState("error");
        setErrorMsg(err.message ?? "No se pudo redimir el ticket.");
      }
    } catch {
      setState("error");
      setErrorMsg("Error de conexión al redimir.");
    }
  }

  function handleReset() {
    setCode("");
    setTicket(null);
    setState("idle");
    setErrorMsg("");
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* ── Input de código ── */}
      <div className="bg-white rounded-[28px] border border-ink/8 p-6 shadow-[0_4px_24px_rgba(24,32,42,0.06)] space-y-4">
        <p className="text-sm font-semibold text-ink/60">
          Código del ticket (ej: NEC-20260925-3KUR)
        </p>

        <div className="flex gap-3">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="NEC-XXXXXX"
            className="flex-1 rounded-2xl border border-ink/15 bg-sand px-4 py-3 text-lg font-mono font-bold tracking-widest text-ink placeholder:text-ink/25 focus:outline-none focus:ring-2 focus:ring-teal/40 min-h-[56px] uppercase"
            aria-label="Código del ticket de reserva"
            disabled={state === "loading" || state === "redeemed"}
          />
          <button
            onClick={handleSearch}
            disabled={state === "loading" || !code.trim() || state === "redeemed"}
            className="flex items-center gap-2 rounded-2xl bg-teal text-white px-5 py-3 font-bold min-h-[56px] transition hover:bg-teal/90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Buscar ticket"
          >
            {state === "loading" ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Search className="h-5 w-5" />
            )}
          </button>
        </div>

        <p className="text-xs text-ink/40">
          El cliente puede mostrarte el código desde su correo de confirmación o desde su ticket digital.
        </p>
      </div>

      {/* ── Estados de resultado ── */}
      <AnimatePresence mode="wait">
        {/* Ticket encontrado */}
        {state === "found" && ticket && (
          <motion.div
            key="found"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-white rounded-[28px] border border-teal/20 p-6 space-y-5 shadow-[0_4px_24px_rgba(24,32,42,0.06)]"
          >
            <div className="flex items-center gap-2 text-teal">
              <CheckCircle2 className="h-5 w-5" />
              <p className="font-bold text-sm">Ticket válido encontrado</p>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-ink/6">
                <span className="text-ink/50">Cliente</span>
                <span className="font-bold text-ink">{ticket.customerName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-ink/6">
                <span className="text-ink/50">Servicio</span>
                <span className="font-semibold text-ink">{ticket.service}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-ink/6">
                <span className="text-ink/50">Monto</span>
                <span className="font-bold text-teal text-base tabular-nums">
                  {formatCOP(ticket.amount)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-ink/50">Estado</span>
                <span className="rounded-full bg-teal/10 text-teal px-2.5 py-0.5 text-xs font-semibold">
                  {ticket.status}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleRedeem}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-teal text-white px-5 py-3.5 font-bold text-sm min-h-[52px] transition hover:bg-teal/90 active:scale-95"
              >
                <Unlock className="h-4 w-4" />
                Confirmar Servicio y Liberar Fondos
              </button>
              <button
                onClick={handleReset}
                className="rounded-2xl border border-ink/10 px-4 py-3.5 text-sm font-semibold text-ink/50 min-h-[52px] transition hover:bg-ink/5"
              >
                Cancelar
              </button>
            </div>
          </motion.div>
        )}

        {/* Ticket no encontrado */}
        {state === "not_found" && (
          <motion.div
            key="not_found"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-amber-50 rounded-[28px] border border-amber-200 p-6 text-center space-y-3"
          >
            <AlertCircle className="h-8 w-8 text-amber-500 mx-auto" />
            <p className="font-bold text-amber-800">Ticket no encontrado</p>
            <p className="text-sm text-amber-700">
              El código <strong>{code}</strong> no existe o ya fue redimido. Verifica con el cliente.
            </p>
            <button onClick={handleReset} className="text-sm font-semibold text-amber-700 underline">
              Buscar otro código
            </button>
          </motion.div>
        )}

        {/* Fondos liberados exitosamente */}
        {state === "redeemed" && (
          <motion.div
            key="redeemed"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-teal/8 rounded-[28px] border border-teal/20 p-8 text-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, delay: 0.1 }}
            >
              <CheckCircle2 className="h-14 w-14 text-teal mx-auto" />
            </motion.div>
            <p className="text-xl font-bold text-teal">¡Fondos Liberados!</p>
            <p className="text-sm text-ink/60">
              El servicio fue confirmado. El dinero retenido en Escrow ya está disponible en tu saldo.
            </p>
            <button
              onClick={handleReset}
              className="rounded-full bg-teal text-white px-6 py-3 font-bold text-sm transition hover:bg-teal/90"
            >
              Redimir otro ticket
            </button>
          </motion.div>
        )}

        {/* Error */}
        {state === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 rounded-[28px] border border-red-200 p-6 text-center space-y-3"
          >
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto" />
            <p className="font-bold text-red-700">{errorMsg}</p>
            <button onClick={handleReset} className="text-sm font-semibold text-red-600 underline">
              Intentar de nuevo
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nota de QR (futuro) ── */}
      <div className="flex items-start gap-3 rounded-2xl border border-ink/8 bg-sand p-4 text-sm text-ink/50">
        <span className="text-lg shrink-0">📷</span>
        <p>
          <strong className="text-ink/70">Escaneo QR próximamente:</strong> La cámara integrada
          para leer QR estará disponible en la próxima actualización del dashboard.
        </p>
      </div>
    </div>
  );
}
