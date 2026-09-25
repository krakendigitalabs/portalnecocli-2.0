"use client";

import { useState, useTransition } from "react";
import { type OrderStatus, updateOrderStatus } from "@/lib/actions/orders";
import type { ConciergeRequest } from "@/types/order";
import { COMMISSION_RATES } from "@/types/order";

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(amount);
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Nuevo Pedido", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
  accepted: { label: "En Preparación", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  in_progress: {
    label: "En Camino",
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
  },
  completed: { label: "Completado ✓", color: "text-teal-700", bg: "bg-teal-50 border-teal-200" },
  cancelled: { label: "Cancelado", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

const CATEGORY_LABELS: Record<string, string> = {
  hotel: "🏨 Hotel",
  restaurant: "🍽️ Restaurante",
  tour: "🏝️ Tour",
  mototaxi: "🛵 Mototaxi",
  motocarro: "🛺 Motocarro",
  taxi: "🚕 Taxi",
  delivery: "📦 Domicilio",
  general: "📋 General",
};

// ─── Modal de Detalle ──────────────────────────────────────────────────────────
function OrderModal({ order, onClose }: { order: ConciergeRequest; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);

  const price = order.estimatedPrice ?? 0;
  const rate = order.category ? (COMMISSION_RATES[order.category] ?? 0.06) : 0.06;
  const commission = order.commission ?? Math.round(price * rate);
  const neto = price - commission;
  const status = order.status ?? "pending";
  const statusCfg = STATUS_CONFIG[status];

  function handleStatusChange(newStatus: OrderStatus) {
    if (!order.id) return;
    startTransition(async () => {
      const result = await updateOrderStatus(order.id!, newStatus);
      setFeedback(
        result.success
          ? "Estado actualizado correctamente."
          : (result.error ?? "Error al actualizar."),
      );
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-t-[32px] bg-white p-6 shadow-2xl sm:rounded-[32px] sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              {order.referenceCode ?? "Sin referencia"}
            </p>
            <h2 className="mt-1 text-xl font-bold text-slate-900">{order.name}</h2>
            <span
              className={`mt-2 inline-block rounded-full border px-3 py-0.5 text-xs font-semibold ${statusCfg.bg} ${statusCfg.color}`}
            >
              {statusCfg.label}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Datos del cliente */}
        <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
            Datos del turista
          </p>
          <p className="text-sm text-slate-700">📧 {order.email || "Sin correo"}</p>
          <p className="text-sm text-slate-700">📱 {order.phone || "Sin teléfono"}</p>
          {order.phone && (
            <a
              href={`https://wa.me/57${order.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-500 px-4 py-1.5 text-xs font-bold text-white transition hover:bg-green-600"
            >
              💬 Contactar por WhatsApp
            </a>
          )}
        </div>

        {/* Solicitud extraída por Alejandro */}
        <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">
            {order.category ? CATEGORY_LABELS[order.category] : "📋 Solicitud"} · Lo que pide el
            turista
          </p>
          <p className="text-sm leading-relaxed text-slate-700">{order.request}</p>
          {order.advice && <p className="mt-2 text-xs italic text-slate-400">💡 {order.advice}</p>}
        </div>

        {/* Desglose Escrow */}
        {price > 0 && (
          <div className="mt-4 rounded-2xl border border-teal-100 bg-teal-50 p-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-1">
              💰 Desglose Escrow
            </p>
            <div className="flex justify-between text-sm text-slate-600">
              <span>Pagado por turista (Wompi)</span>
              <span className="font-semibold">{formatCOP(price)}</span>
            </div>
            <div className="flex justify-between text-sm text-rose-600">
              <span>Comisión Portal Necoclí ({Math.round(rate * 100)}%)</span>
              <span className="font-semibold">−{formatCOP(commission)}</span>
            </div>
            <div className="flex justify-between border-t border-teal-200 pt-2 text-base font-bold text-teal-700">
              <span>Neto para tu negocio</span>
              <span>{formatCOP(neto)}</span>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          {status === "pending" && (
            <>
              <button
                disabled={isPending}
                onClick={() => handleStatusChange("cancelled")}
                className="rounded-full border border-red-200 bg-red-50 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
              >
                ✗ Rechazar
              </button>
              <button
                disabled={isPending}
                onClick={() => handleStatusChange("accepted")}
                className="rounded-full bg-blue-600 py-2.5 text-sm font-bold text-white shadow transition hover:bg-blue-700 disabled:opacity-50"
              >
                ✓ Aceptar
              </button>
            </>
          )}
          {status === "accepted" && (
            <button
              disabled={isPending}
              onClick={() => handleStatusChange("in_progress")}
              className="col-span-2 rounded-full bg-purple-600 py-2.5 text-sm font-bold text-white shadow transition hover:bg-purple-700 disabled:opacity-50"
            >
              🚀 Marcar En Camino
            </button>
          )}
          {status === "in_progress" && (
            <button
              disabled={isPending}
              onClick={() => handleStatusChange("completed")}
              className="col-span-2 rounded-full bg-teal-600 py-2.5 text-sm font-bold text-white shadow transition hover:bg-teal-700 disabled:opacity-50"
            >
              ✓ Marcar Completado
            </button>
          )}
        </div>

        {feedback && (
          <p className="mt-4 text-center text-xs font-medium text-teal-600">{feedback}</p>
        )}
      </div>
    </div>
  );
}

// ─── Tarjeta de Orden ──────────────────────────────────────────────────────────
function OrderCard({ order, onClick }: { order: ConciergeRequest; onClick: () => void }) {
  const status = order.status ?? "pending";
  const statusCfg = STATUS_CONFIG[status];
  const isPending = status === "pending";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-[22px] border p-5 text-left transition hover:shadow-md focus:outline-none focus:ring-2 focus:ring-teal-400 ${statusCfg.bg} ${isPending ? "animate-pulse-slow" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-slate-900">{order.name}</p>
          <p className="mt-0.5 truncate text-sm text-slate-500">
            {order.category ? CATEGORY_LABELS[order.category] : "Solicitud"}
            {order.businessName ? ` · ${order.businessName}` : ""}
          </p>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">{order.request}</p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusCfg.bg} ${statusCfg.color}`}
        >
          {statusCfg.label}
        </span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          {order.createdAt ? new Date(order.createdAt).toLocaleString("es-CO") : ""}
        </p>
        {order.estimatedPrice && order.estimatedPrice > 0 && (
          <p className="text-sm font-bold text-teal-700">{formatCOP(order.estimatedPrice)}</p>
        )}
      </div>
    </button>
  );
}

// ─── Panel Principal (Exportable) ─────────────────────────────────────────────
export function OrdersPanel({ orders }: { orders: ConciergeRequest[] }) {
  const [selected, setSelected] = useState<ConciergeRequest | null>(null);

  const counts = {
    pending: orders.filter((o) => o.status === "pending").length,
    accepted: orders.filter((o) => o.status === "accepted").length,
    in_progress: orders.filter((o) => o.status === "in_progress").length,
    completed: orders.filter((o) => o.status === "completed").length,
  };

  return (
    <section className="space-y-6">
      {/* KPIs rápidos */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(
          [
            { key: "pending", label: "Nuevos", color: "text-amber-700", bg: "bg-amber-50" },
            { key: "accepted", label: "Aceptados", color: "text-blue-700", bg: "bg-blue-50" },
            {
              key: "in_progress",
              label: "En Camino",
              color: "text-purple-700",
              bg: "bg-purple-50",
            },
            { key: "completed", label: "Completados", color: "text-teal-700", bg: "bg-teal-50" },
          ] as const
        ).map((item) => (
          <div key={item.key} className={`rounded-2xl border px-4 py-4 ${item.bg}`}>
            <p className={`text-3xl font-bold ${item.color}`}>{counts[item.key]}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-500">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Lista de pedidos */}
      {orders.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
          <p className="text-4xl">🌊</p>
          <p className="mt-3 text-base font-semibold text-slate-600">
            Aún no hay pedidos registrados
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Cuando un turista haga una solicitud, aparecerá aquí.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} onClick={() => setSelected(order)} />
          ))}
        </div>
      )}

      {/* Modal de detalle */}
      {selected && <OrderModal order={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
