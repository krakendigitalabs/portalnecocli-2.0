"use client";

import { useCallback, useState } from "react";
import {
  LOCAL_SHOPS,
  PORTAL_COMMISSION_RATE,
  TARIFF_CATEGORIES,
  type TariffService,
} from "@/data/tariffData";

/* ─── Tipos ─────────────────────────────────────────────────── */

interface SelectedItem {
  serviceId: string;
  categoryId: string;
  service: TariffService;
  quantity: number;
  unitPrice: number; // precio elegido (puede ser el del rango)
  nights?: number; // solo para hospedaje
}

interface TariffCalculatorProps {
  /** Si viene pre-cargado desde una tarjeta de negocio */
  initialBusinessName?: string;
  /** Callback cuando el usuario quiere reservar (sin pago) */
  onReserve?: (total: number, items: SelectedItem[]) => void;
  /** Callback cuando el usuario quiere reservar y pagar */
  onReserveAndPay?: (total: number, items: SelectedItem[]) => void;
}

/* ─── Helpers ────────────────────────────────────────────────── */

function formatCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getDefaultPrice(service: TariffService): number {
  if (service.priceFixed !== undefined) return service.priceFixed;
  return service.priceMin ?? 0;
}

/* ─── Sub-componente: Stepper ───────────────────────────────── */

function Stepper({
  value,
  min = 1,
  max = 99,
  onChange,
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/20 text-sm text-ink transition hover:bg-ink/5 disabled:opacity-40"
      >
        −
      </button>
      <span className="w-5 text-center text-sm font-semibold text-ink">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-7 w-7 items-center justify-center rounded-full border border-ink/20 text-sm text-ink transition hover:bg-ink/5 disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}

/* ─── Sub-componente: Fila de servicio ──────────────────────── */

function ServiceRow({
  service,
  categoryId,
  selected,
  onToggle,
  onQuantityChange,
  onPriceChange,
  onNightsChange,
}: {
  service: TariffService;
  categoryId: string;
  selected?: SelectedItem;
  onToggle: (service: TariffService, categoryId: string) => void;
  onQuantityChange: (serviceId: string, quantity: number) => void;
  onPriceChange: (serviceId: string, price: number) => void;
  onNightsChange: (serviceId: string, nights: number) => void;
}) {
  const isSelected = !!selected;
  const hasRange = service.priceMax !== undefined && service.priceMax !== service.priceMin;
  const isPriceToAgree = service.priceFixed === 0;
  const isHospedaje = categoryId === "hospedaje";

  return (
    <div
      className={`rounded-xl border p-4 transition-all duration-200 ${
        isSelected
          ? "border-teal/40 bg-teal/5 shadow-sm"
          : "border-ink/10 bg-white hover:border-ink/20"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-2xl shrink-0 mt-0.5">{service.icon}</span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">{service.name}</p>
            <p className="text-xs text-ink/55 leading-snug mt-0.5">{service.description}</p>
            {isPriceToAgree && (
              <p className="text-[11px] font-medium text-coral mt-1">Sujeto a cotización final</p>
            )}
            {service.note && <p className="text-[11px] text-ink/40 mt-1 italic">{service.note}</p>}
          </div>
        </div>

        {/* Toggle */}
        {!isPriceToAgree && (
          <button
            type="button"
            onClick={() => onToggle(service, categoryId)}
            className={`shrink-0 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all ${
              isSelected ? "border-teal bg-teal text-white" : "border-ink/25 hover:border-teal/50"
            }`}
          >
            {isSelected && (
              <svg viewBox="0 0 12 12" className="h-3 w-3" fill="currentColor">
                <path
                  d="M10 3L5 8.5 2 5.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Controles expandidos cuando está seleccionado */}
      {isSelected && selected && (
        <div className="mt-4 space-y-3 border-t border-ink/8 pt-4">
          {/* Oculto el slider de precio por solicitud de no mostrar precios individuales */}

          {/* Noches (solo hospedaje) */}
          {isHospedaje && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink/60">Noches de estadía</span>
              <Stepper
                value={selected.nights ?? 1}
                min={1}
                max={30}
                onChange={(v) => onNightsChange(service.id, v)}
              />
            </div>
          )}

          {/* Cantidad (para no-hospedaje) */}
          {!isHospedaje && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-ink/60">
                {service.unit === "persona"
                  ? "Personas"
                  : service.unit === "hora"
                    ? "Horas"
                    : service.unit === "carrera"
                      ? "Carreras"
                      : "Cantidad"}
              </span>
              <Stepper
                value={selected.quantity}
                min={1}
                onChange={(v) => onQuantityChange(service.id, v)}
              />
            </div>
          )}

          {/* Subtotal de este ítem */}
          <div className="flex items-center justify-between rounded-lg bg-teal/8 px-3 py-2">
            <span className="text-xs font-medium text-teal">Subtotal</span>
            <span className="text-sm font-bold text-teal">
              {isHospedaje
                ? formatCOP(selected.unitPrice * (selected.nights ?? 1))
                : formatCOP(selected.unitPrice * selected.quantity)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Componente Principal ───────────────────────────────────── */

export function TariffCalculator({
  initialBusinessName,
  onReserve,
  onReserveAndPay,
}: TariffCalculatorProps) {
  const [selectedItems, setSelectedItems] = useState<Record<string, SelectedItem>>({});

  /* ─ Handlers ─ */

  const toggleService = useCallback((service: TariffService, categoryId: string) => {
    setSelectedItems((prev) => {
      if (prev[service.id]) {
        const next = { ...prev };
        delete next[service.id];
        return next;
      }
      return {
        ...prev,
        [service.id]: {
          serviceId: service.id,
          categoryId,
          service,
          quantity: 1,
          unitPrice: getDefaultPrice(service),
          nights: categoryId === "hospedaje" ? 1 : undefined,
        },
      };
    });
  }, []);

  const updateQuantity = useCallback((serviceId: string, quantity: number) => {
    setSelectedItems((prev) =>
      prev[serviceId] ? { ...prev, [serviceId]: { ...prev[serviceId], quantity } } : prev,
    );
  }, []);

  const updatePrice = useCallback((serviceId: string, unitPrice: number) => {
    setSelectedItems((prev) =>
      prev[serviceId] ? { ...prev, [serviceId]: { ...prev[serviceId], unitPrice } } : prev,
    );
  }, []);

  const updateNights = useCallback((serviceId: string, nights: number) => {
    setSelectedItems((prev) =>
      prev[serviceId] ? { ...prev, [serviceId]: { ...prev[serviceId], nights } } : prev,
    );
  }, []);

  /* ─ Cálculos ─ */

  const items = Object.values(selectedItems);

  const total = items.reduce((acc, item) => {
    if (item.categoryId === "hospedaje") {
      return acc + item.unitPrice * (item.nights ?? 1);
    }
    return acc + item.unitPrice * item.quantity;
  }, 0);

  const portalCommission = Math.round(total * PORTAL_COMMISSION_RATE);
  const escrowAmount = total - portalCommission;

  /* ─ Imprimir ─ */

  const handlePrint = () => {
    window.print();
  };

  /* ─ Render ─ */

  return (
    <div className="min-h-screen bg-sand/30">
      {/* Print Styles (solo visibles al imprimir) */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white; }
          .print-container { max-width: 100%; padding: 0; }
        }
        @media screen {
          .print-only { display: none; }
        }
      `}</style>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 print-container">
        {/* ── Print Header (oculto en pantalla) ── */}
        <div className="print-only mb-8 border-b border-ink/10 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-ink">Portal Necoclí 🌴</h1>
              <p className="text-sm text-ink/60">Cotización de Servicios Turísticos</p>
              <p className="text-xs text-ink/40 mt-1">
                Kraken Digital Labs · NIT: _____ ·{" "}
                {new Date().toLocaleDateString("es-CO", { dateStyle: "long" })}
              </p>
            </div>
            {initialBusinessName && (
              <div className="text-right">
                <p className="text-sm font-semibold text-ink">{initialBusinessName}</p>
                <p className="text-xs text-ink/50">Establecimiento seleccionado</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Header pantalla ── */}
        <div className="no-print mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-ink sm:text-3xl">Cotiza tu Estadía 🌴</h1>
              <p className="mt-1 text-sm text-ink/60">
                {initialBusinessName
                  ? `Armando tu plan para ${initialBusinessName}`
                  : "Selecciona los servicios que necesitas y te calculamos el total"}
              </p>
            </div>
            {/* Badge escrow */}
            <div className="flex items-center gap-2 rounded-full border border-teal/20 bg-teal/8 px-4 py-2">
              <span className="text-sm">🔒</span>
              <span className="text-xs font-semibold text-teal">Pago seguro Escrow</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* ── Columna izquierda: Categorías ── */}
          <div className="space-y-6">
            {TARIFF_CATEGORIES.map((category) => (
              <section key={category.id}>
                <h2 className="mb-3 flex items-center gap-2 text-base font-bold text-ink">
                  <span>{category.icon}</span>
                  {category.name}
                </h2>
                <div className="space-y-3">
                  {category.services.map((service) => (
                    <ServiceRow
                      key={service.id}
                      service={service}
                      categoryId={category.id}
                      selected={selectedItems[service.id]}
                      onToggle={toggleService}
                      onQuantityChange={updateQuantity}
                      onPriceChange={updatePrice}
                      onNightsChange={updateNights}
                    />
                  ))}
                </div>
              </section>
            ))}

            {/* ── Tiendas locales recomendadas ── */}
            <section className="rounded-2xl border border-dashed border-ink/15 p-5">
              <h2 className="mb-3 text-sm font-bold text-ink/70">
                🛍️ Dónde hacer tus compras en Necoclí
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {LOCAL_SHOPS.map((shop) => (
                  <div
                    key={shop.name}
                    className="flex items-start gap-3 rounded-xl bg-white p-3 border border-ink/8"
                  >
                    <span className="text-2xl">{shop.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{shop.name}</p>
                      <p className="text-xs text-ink/50">{shop.type}</p>
                      <p className="text-xs text-ink/45 mt-0.5">{shop.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ── Columna derecha: Resumen ── */}
          <aside className="lg:sticky lg:top-6 h-fit">
            <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-soft">
              <h3 className="mb-4 text-base font-bold text-ink">Resumen de tu Plan</h3>

              {items.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-3xl mb-2">🧳</p>
                  <p className="text-sm text-ink/50">
                    Agrega servicios para ver tu cotización aquí
                  </p>
                </div>
              ) : (
                <>
                  {/* Lista de ítems seleccionados */}
                  <ul className="space-y-3 mb-4">
                    {items.map((item) => {
                      const subtotal =
                        item.categoryId === "hospedaje"
                          ? item.unitPrice * (item.nights ?? 1)
                          : item.unitPrice * item.quantity;
                      return (
                        <li
                          key={item.serviceId}
                          className="flex items-start justify-between gap-2 text-sm"
                        >
                          <div className="flex items-start gap-2 min-w-0">
                            <span className="shrink-0">{item.service.icon}</span>
                            <div className="min-w-0">
                              <p className="font-medium text-ink leading-snug">
                                {item.service.name}
                              </p>
                              <p className="text-xs text-ink/45">
                                {item.categoryId === "hospedaje"
                                  ? `${item.nights} noche(s) × ${formatCOP(item.unitPrice)}`
                                  : `${item.quantity} × ${formatCOP(item.unitPrice)}`}
                              </p>
                            </div>
                          </div>
                          <span className="shrink-0 font-semibold text-ink">
                            {formatCOP(subtotal)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Divisor */}
                  <div className="border-t border-ink/8 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-ink/60">Subtotal</span>
                      <span className="font-semibold text-ink">{formatCOP(total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-ink/60">Comisión Portal (10%)</span>
                      <span className="font-semibold text-coral">
                        {formatCOP(portalCommission)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-ink/60">Escrow al comercio</span>
                      <span className="font-semibold text-teal">{formatCOP(escrowAmount)}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="mt-4 rounded-xl bg-ink px-4 py-3 text-center">
                    <p className="text-xs text-white/60 mb-1">TOTAL A PAGAR</p>
                    <p className="text-2xl font-extrabold text-white">{formatCOP(total)}</p>
                    <p className="text-[11px] text-white/40 mt-1">
                      Protegido por Escrow · {PORTAL_COMMISSION_RATE * 100}% comisión portal
                    </p>
                  </div>

                  {/* Nota Escrow */}
                  <div className="mt-3 rounded-lg bg-teal/5 border border-teal/15 px-3 py-2">
                    <p className="text-[11px] text-teal/80 leading-relaxed">
                      🔒 <strong>Pago seguro:</strong> El Portal retiene el{" "}
                      {formatCOP(escrowAmount)} y lo libera al comercio cuando tu estadía sea
                      efectiva.
                    </p>
                  </div>
                </>
              )}

              {/* ── Botones de acción ── */}
              <div className="mt-5 space-y-2 no-print">
                <button
                  type="button"
                  disabled={items.length === 0}
                  onClick={handlePrint}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-ink/20 bg-white px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-ink/5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  🖨️ Imprimir cotización
                </button>
                <button
                  type="button"
                  disabled={items.length === 0}
                  onClick={() => onReserve?.(total, items)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-teal bg-white px-4 py-2.5 text-sm font-semibold text-teal transition hover:bg-teal/5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  📲 Reservar sin pagar
                </button>
                <button
                  type="button"
                  disabled={items.length === 0 || total === 0}
                  onClick={() => onReserveAndPay?.(total, items)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal px-4 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-teal/90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  💳 Reservar y Pagar (Escrow)
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* ── Print: Tabla de ítems ── */}
        {items.length > 0 && (
          <div className="print-only mt-8">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-ink/20">
                  <th className="text-left py-2 font-semibold text-ink">Servicio</th>
                  <th className="text-right py-2 font-semibold text-ink">Precio unit.</th>
                  <th className="text-right py-2 font-semibold text-ink">Cant.</th>
                  <th className="text-right py-2 font-semibold text-ink">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => {
                  const subtotal =
                    item.categoryId === "hospedaje"
                      ? item.unitPrice * (item.nights ?? 1)
                      : item.unitPrice * item.quantity;
                  return (
                    <tr key={item.serviceId} className="border-b border-ink/8">
                      <td className="py-2 text-ink">{item.service.name}</td>
                      <td className="py-2 text-right text-ink">{formatCOP(item.unitPrice)}</td>
                      <td className="py-2 text-right text-ink">
                        {item.categoryId === "hospedaje"
                          ? `${item.nights} noche(s)`
                          : item.quantity}
                      </td>
                      <td className="py-2 text-right font-semibold text-ink">
                        {formatCOP(subtotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={3} className="pt-4 text-right font-semibold text-ink">
                    Comisión Portal (10%)
                  </td>
                  <td className="pt-4 text-right font-semibold text-coral">
                    {formatCOP(portalCommission)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-right font-bold text-lg text-ink">
                    TOTAL
                  </td>
                  <td className="text-right font-bold text-lg text-ink">{formatCOP(total)}</td>
                </tr>
              </tfoot>
            </table>
            <p className="mt-6 text-xs text-ink/40 text-center">
              Portal Necoclí · portalnecocli.com · reservas@portalnecocli.com · Necoclí, Antioquia,
              Colombia
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
