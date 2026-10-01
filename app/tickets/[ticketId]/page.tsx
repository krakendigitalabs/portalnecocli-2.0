/**
 * Ticket Digital Oficial — Portal Necoclí 2.0
 * Comprobante de Recaudo Escrow con QR real, datos legales completos e impresión en 1 página.
 * Diseño Ultra-Premium Luxury.
 */

import { CheckCircle2, CreditCard, ShieldCheck, Ticket } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PrintTicketButton } from "@/components/checkout/print-ticket-button";
import {
  getReservationByEscrowId,
  getReservationById,
  getReservationByReferenceCode,
} from "@/data/reservationService";

type Props = {
  params: Promise<{
    ticketId: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { ticketId } = await params;
  return {
    title: `Ticket Escrow #${ticketId.slice(-8).toUpperCase()} | Portal Necoclí`,
    description:
      "Comprobante oficial de reserva y recaudo con modelo de garantía Escrow — Kraken Digital Labs.",
  };
}

export default async function EscrowTicketPage({ params }: Props) {
  const { ticketId } = await params;

  // 1. Try to find by direct reservation ID (from booking flow)
  let reservation = null;
  try {
    reservation = await getReservationById(ticketId);
  } catch {
    try {
      // 2. Try by reference_code (from email)
      reservation = await getReservationByReferenceCode(ticketId);
      if (!reservation) {
        // 3. Not found by referenceCode, try escrow ID
        reservation = await getReservationByEscrowId(ticketId);
      }
    } catch {
      reservation = null;
    }
  }

  if (!reservation) {
    notFound();
  }

  const {
    lead,
    business_name,
    total_amount,
    reference_code,
    created_at,
    id: reservId,
  } = reservation;

  // total_amount is stored directly in COP (not cents)
  const amountFormatted = total_amount.toLocaleString("es-CO");
  const dateFormatted = new Date(created_at).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Wompi link — amount in cents (with integrity signature for production)
  const wompiKey = process.env.NEXT_PUBLIC_WOMPI_KEY ?? "";
  const wompiRef = reference_code;
  const wompiAmountCents = total_amount * 100; // convert COP → centavos
  const wompiIntegritySecret = process.env.WOMPI_INTEGRITY_SECRET ?? "";

  // Generate integrity signature: SHA256(reference + amountCents + "COP" + secret)
  let wompiIntegrity = "";
  if (wompiIntegritySecret) {
    const { createHash } = await import("crypto");
    const dataToHash = `${wompiRef}${wompiAmountCents}COP${wompiIntegritySecret}`;
    wompiIntegrity = createHash("sha256").update(dataToHash).digest("hex");
  }

  const wompiLink = wompiKey
    ? `https://checkout.wompi.co/p/?public-key=${wompiKey}&currency=COP&amount-in-cents=${wompiAmountCents}&reference=${wompiRef}${wompiIntegrity ? `&signature:integrity=${wompiIntegrity}` : ""}`
    : null;

  // QR apuntando al dominio real del portal
  const publicTicketUrl = `https://tours.portalnecocli.com/tickets/${ticketId}`;

  // API pública gratuita para generar QR real (sin instalar dependencias)
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(publicTicketUrl)}&bgcolor=ffffff&color=0f2e21&margin=4&format=png`;

  return (
    <>
      {/* ─── CSS de impresión — 1 SOLA HOJA A4 ─── */}
      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          html, body { 
            background: white !important; 
            margin: 0 !important; 
            padding: 0 !important; 
            height: 100% !important;
            max-height: 100vh !important;
            overflow: hidden !important;
          }
          
          /* Oculta explícitamente el header y footer global del portal */
          header, footer, [data-app-shell-header], [data-app-shell-footer] { display: none !important; }
          
          /* Forzar al layout base a no ocupar espacio extra */
          body > div { min-height: 0 !important; height: auto !important; }
          main { padding: 0 !important; margin: 0 !important; min-height: 0 !important; background: white !important; }
          
          /* Escalar todo al 75% para que quepa en 1 hoja A4 */
          .ticket-wrapper {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 auto !important;
            zoom: 0.75;
          }
          .ticket-card {
            box-shadow: none !important;
            border-radius: 8px !important;
            border: 1px solid #e5e7eb !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .ticket-header { padding: 14px 20px !important; }
          .ticket-amount { padding: 8px 0 !important; }
          .ticket-body { padding: 14px 20px !important; }
          .ticket-holder { padding: 8px !important; }
          .ticket-footer { padding: 8px 20px !important; }
          .qr-img { width: 90px !important; height: 90px !important; }
          @page {
            size: A4 portrait;
            margin: 6mm;
          }
        }
      `}</style>

      {/* ─── Área principal con gradiente Premium ─── */}
      <main className="print:min-h-0 print:py-0 min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-slate-50 py-12 px-4 sm:px-6 relative overflow-hidden">
        {/* Adorno de fondo de lujo (partículas o blobs) */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-100/40 blur-3xl pointer-events-none mix-blend-multiply" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-100/40 blur-3xl pointer-events-none mix-blend-multiply" />

        <div className="ticket-wrapper max-w-[600px] mx-auto space-y-6 print:space-y-0 relative z-10">
          {/* Barra de acciones (impresión/descarga) */}
          <div className="print:hidden flex items-center justify-between mb-4 bg-white/60 backdrop-blur-md px-6 py-4 rounded-2xl border border-slate-200/60 shadow-sm">
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-teal-600" />
              <p className="text-xs font-mono font-medium text-slate-500 uppercase tracking-widest">
                ID: {ticketId.slice(-8).toUpperCase()}
              </p>
            </div>
            <PrintTicketButton />
          </div>

          {/* Botón Wompi — Pago en línea */}
          {wompiLink && (
            <div className="print:hidden mb-6 group">
              <a
                href={wompiLink}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center gap-3 w-full bg-[#3D25A8] hover:bg-[#321c8f] text-white font-bold text-lg py-5 px-6 rounded-[24px] shadow-2xl shadow-[#3D25A8]/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
                <CreditCard className="w-6 h-6" />
                Pagar vía Wompi — ${amountFormatted} COP
              </a>
              <p className="text-center text-[11px] font-medium text-slate-400 mt-3 uppercase tracking-wider">
                Procesamiento seguro · Tarjeta de Crédito, Nequi o PSE
              </p>
            </div>
          )}

          {/* ─────────────────────────────────────────
               TICKET CARD (ESTILO BOARDING PASS LUXURY)
          ───────────────────────────────────────── */}
          <div className="ticket-card relative bg-white rounded-[32px] overflow-hidden border border-slate-200/60 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">
            {/* ── Cabecera oscura del ticket ── */}
            <div className="ticket-header relative bg-slate-900 p-8 text-white overflow-hidden">
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

              <div className="relative z-10 flex justify-between items-start">
                {/* Datos empresa Matrix */}
                <div>
                  <h1 className="text-2xl font-display font-bold tracking-tight flex items-center gap-2 mb-1">
                    Portal Necoclí
                    <ShieldCheck className="w-6 h-6 text-teal-400" />
                  </h1>
                  <p className="text-slate-400 text-[11px] font-mono mb-2 uppercase tracking-widest">
                    By Kraken Digital Labs S.A.S
                  </p>
                  <div className="flex gap-4 text-slate-300 text-[10px] font-mono mt-4">
                    <span>NIT: 8128036-5</span>
                    <span>TEL: 321 751 1866</span>
                  </div>
                </div>

                {/* Sello de aprobado */}
                <div className="text-right flex flex-col items-end">
                  <div className="inline-flex items-center gap-1.5 bg-teal-500/10 text-teal-400 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-teal-500/20 shadow-[0_0_15px_rgba(45,212,191,0.2)]">
                    <CheckCircle2 className="w-4 h-4" />
                    Autenticado
                  </div>
                  <p className="text-slate-500 text-[10px] mt-2 font-mono uppercase tracking-widest">
                    REF: {reference_code.slice(-6)}
                  </p>
                </div>
              </div>

              {/* Monto */}
              <div className="ticket-amount text-center py-8 mt-6 border-t border-white/10 relative">
                <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-teal-400 mb-2">
                  Depósito en Garantía (Escrow)
                </p>
                <p className="text-5xl font-display font-semibold text-white tracking-tight">
                  <span className="text-teal-400 mr-1 opacity-80">$</span>
                  {amountFormatted}
                  <span className="text-xl font-normal text-slate-500 ml-2 uppercase">COP</span>
                </p>
              </div>
            </div>

            {/* Separador Perforado Estilo Ticket */}
            <div className="relative h-8 bg-white print:h-2">
              <div className="absolute top-1/2 left-0 w-full border-t-[2px] border-dashed border-slate-200" />
              <div className="absolute top-1/2 -left-4 w-8 h-8 bg-slate-50 rounded-full -translate-y-1/2 print:hidden" />
              <div className="absolute top-1/2 -right-4 w-8 h-8 bg-slate-50 rounded-full -translate-y-1/2 print:hidden" />
            </div>

            {/* ── Cuerpo blanco del ticket ── */}
            <div className="ticket-body bg-white p-8 grid grid-cols-2 gap-x-8 gap-y-8">
              {/* Comercio aliado */}
              <div className="col-span-2 text-center bg-slate-50 rounded-2xl py-4 border border-slate-100">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">
                  Prestador del Servicio
                </p>
                <p className="text-xl font-display font-semibold text-slate-900">{business_name}</p>
              </div>

              {/* ID Transacción */}
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">
                  Reserva ID
                </p>
                <p className="font-mono text-[13px] font-medium text-slate-900 break-all">
                  {ticketId}
                </p>
              </div>

              {/* Fecha de pago */}
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">
                  Fecha de Emisión
                </p>
                <p className="text-[13px] font-medium text-slate-900">{dateFormatted}</p>
              </div>

              {/* Fechas del servicio */}
              {(lead.check_in_date || lead.check_out_date) && (
                <div className="col-span-2">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">
                    Fechas Programadas
                  </p>
                  <p className="text-sm font-medium text-slate-900 bg-slate-50 inline-block px-3 py-1.5 rounded-lg border border-slate-100">
                    {lead.check_in_date
                      ? new Date(lead.check_in_date).toLocaleDateString("es-CO", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "No especificada"}
                    {lead.check_out_date && (
                      <span className="text-slate-400 mx-2">
                        {" → "}
                        <span className="text-slate-900 ml-2">
                          {new Date(lead.check_out_date).toLocaleDateString("es-CO", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Titular — fila completa */}
              <div className="col-span-2 border-t border-slate-100 pt-6">
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-3">
                  Información del Titular
                </p>
                <div className="ticket-holder bg-white border border-slate-200 rounded-[20px] p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
                  <div>
                    <p className="font-semibold text-slate-900 text-base">{lead.full_name}</p>
                    <p className="text-xs text-slate-500 mt-1">{lead.email}</p>
                  </div>
                  <div className="sm:text-right bg-slate-50 px-4 py-2 rounded-xl">
                    <p className="text-[10px] text-slate-400 uppercase font-semibold">Contacto</p>
                    <p className="font-mono font-medium text-slate-900 text-sm mt-0.5">
                      {lead.whatsapp ?? lead.phone ?? "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Real + Datos legales — misma fila */}
              <div className="col-span-2 border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center sm:items-start gap-8">
                {/* QR Real generado por api.qrserver.com */}
                <div className="flex flex-col items-center gap-3 shrink-0">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                    Escanear para verificar
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrUrl}
                    alt={`QR del ticket ${ticketId}`}
                    width={130}
                    height={130}
                    className="qr-img rounded-xl border-2 border-slate-100 p-2 bg-white shadow-sm"
                  />
                </div>

                {/* Datos legales de la empresa */}
                <div className="flex-1 w-full space-y-3">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                      Garantía Operativa
                    </p>
                    <p className="text-[13px] text-slate-600 leading-relaxed font-light">
                      Este comprobante es un activo digital protegido. Los fondos están respaldados
                      por el modelo Escrow de{" "}
                      <strong className="font-medium text-slate-900">
                        Kraken Digital Labs S.A.S
                      </strong>{" "}
                      hasta la prestación final del servicio turístico.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Footer legal del ticket ── */}
            <div className="ticket-footer bg-slate-900 px-8 py-5 text-center flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-800">
              <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
                Portal Necoclí 2.0 © 2026
              </p>
              <div className="flex gap-4">
                <a
                  href="tel:3217511866"
                  className="text-[11px] font-medium text-teal-500 hover:text-teal-400 transition-colors"
                >
                  📞 321 751 1866
                </a>
                <span className="text-slate-700">|</span>
                <a
                  href="mailto:soporte@portalnecocli.com"
                  className="text-[11px] font-medium text-slate-400 hover:text-white transition-colors"
                >
                  soporte@portalnecocli.com
                </a>
              </div>
            </div>
          </div>

          {/* ── CTA Turista: Reseña en Google ── */}
          <div className="print:hidden mx-auto mt-8 max-w-[500px] rounded-3xl bg-white border border-slate-200/60 p-6 text-center shadow-lg shadow-slate-200/40">
            <h4 className="text-base font-semibold text-slate-900 mb-2">⭐ Tu opinión es oro</h4>
            <p className="text-[13px] text-slate-500 leading-relaxed mb-5">
              Si tu experiencia con Portal Necoclí ha sido excepcional, nos ayudarías inmensamente
              dejando una breve reseña pública.
            </p>
            <a
              href="https://g.page/r/CRFcMAbI46COEAE/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md hover:bg-slate-800 hover:-translate-y-0.5 transition-all"
            >
              Calificar en Google
            </a>
          </div>

          {/* ─── Navegación inferior entre páginas ─── */}
          <nav className="print:hidden mt-8 text-center">
            <Link
              href="/customer/reservas"
              className="inline-flex items-center justify-center text-sm font-medium text-slate-500 hover:text-teal-600 transition-colors underline underline-offset-4"
            >
              ← Volver a Mis Reservas
            </Link>
          </nav>
        </div>
      </main>
    </>
  );
}
