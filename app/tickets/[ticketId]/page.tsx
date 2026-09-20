/**
 * Ticket Digital Oficial — Portal Necoclí 2.0
 * Comprobante de Recaudo Escrow con QR real, datos legales completos e impresión en 1 página.
 */
import { getReservationByEscrowId, getReservationById } from "@/data/reservationService";
import { notFound } from "next/navigation";
import { CheckCircle2, ShieldCheck, CreditCard } from "lucide-react";
import Link from "next/link";
import { PrintTicketButton } from "@/components/checkout/print-ticket-button";
import Image from "next/image";

type Props = {
  params: Promise<{
    ticketId: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { ticketId } = await params;
  return {
    title: `Ticket Escrow #${ticketId.slice(-8).toUpperCase()} | Portal Necoclí`,
    description: "Comprobante oficial de reserva y recaudo con modelo de garantía Escrow — Kraken Digital Labs.",
  };
}

export default async function EscrowTicketPage({ params }: Props) {
  const { ticketId } = await params;

  // 1. Try to find by direct reservation ID (from booking flow)
  let reservation = null;
  try {
    reservation = await getReservationById(ticketId);
  } catch {
    // Not found by reservationId, try escrow ID
    reservation = await getReservationByEscrowId(ticketId);
  }

  if (!reservation) {
    notFound();
  }

  const { lead, business_name, total_amount, reference_code, created_at, id: reservId } = reservation;
  
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
          main { padding: 0 !important; margin: 0 !important; min-height: 0 !important; }
          
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

      {/* ─── Área principal ─── */}
      <main className="print:min-h-0 print:py-0 min-h-screen bg-white py-8 px-4 sm:px-6">
        <div className="ticket-wrapper max-w-2xl mx-auto space-y-5 print:space-y-0">

          {/* Barra de acciones (impresión/descarga) */}
          <div className="print:hidden flex items-center justify-between mb-4">
            <p className="text-xs font-mono text-gray-400">
              Comprobante oficial · {ticketId}
            </p>
            <div className="flex gap-2">
              <PrintTicketButton />
            </div>
          </div>

          {/* Botón Wompi — Pago en línea */}
          {wompiLink && (
            <div className="print:hidden mb-4">
              <a
                href={wompiLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full bg-[#7B3FE4] hover:bg-[#6a35ca] text-white font-bold text-base py-4 px-6 rounded-2xl shadow-lg shadow-[#7B3FE4]/25 transition-all hover:-translate-y-0.5 active:scale-95"
              >
                <CreditCard className="w-5 h-5" />
                Pagar ahora con Wompi — ${amountFormatted} COP
              </a>
              <p className="text-center text-xs text-gray-400 mt-2">Pago seguro con tarjeta, Nequi o PSE</p>
            </div>
          )}

          {/* ─────────────────────────────────────────
               TICKET CARD
          ───────────────────────────────────────── */}
          <div className="ticket-card rounded-2xl overflow-hidden border border-gray-200 shadow-lg">

            {/* ── Cabecera oscura del ticket ── */}
            <div className="ticket-header bg-[#0f2e21] p-6 text-white">
              <div className="flex justify-between items-start">
                {/* Datos empresa Matrix */}
                <div>
                  <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
                    Portal Necoclí
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </h1>
                  <p className="text-white/60 text-[11px] font-mono mt-0.5">
                    Operado por <strong className="text-white/80">Kraken Digital Labs S.A.S</strong>
                  </p>
                  <p className="text-white/50 text-[10px] font-mono">
                    NIT: <strong className="text-white/70">8128036-5</strong>
                    {" · "}
                    <a
                      href="https://www.krakendigitalabs.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:underline"
                    >
                      www.krakendigitalabs.com
                    </a>
                  </p>
                  <p className="text-white/40 text-[10px] font-mono mt-0.5">
                    📞 Soporte: <strong className="text-white/60">3217511866</strong>
                    {" · "}soporte@portalnecocli.com
                  </p>
                </div>

                {/* Sello de aprobado */}
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Aprobado
                  </span>
                  <p className="text-white/30 text-[9px] mt-1.5 font-mono">
                    #{ticketId.slice(-10).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Monto */}
              <div className="ticket-amount text-center py-5 mt-4 border-t border-white/10">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-400 mb-1">
                  Comprobante de Recaudo Escrow
                </p>
                <p className="text-4xl font-black text-white">
                  <span className="text-emerald-400 mr-1">$</span>{amountFormatted}
                  <span className="text-lg font-semibold text-white/40 ml-1">COP</span>
                </p>
                <p className="text-white/40 text-[10px] mt-1">
                  Fondos retenidos en garantía · El comercio recibe el pago tras prestar el servicio
                </p>
              </div>
            </div>

            {/* ── Cuerpo blanco del ticket ── */}
            <div className="ticket-body bg-white p-6 grid grid-cols-2 gap-x-6 gap-y-5">

              {/* ID Transacción */}
              <div>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">
                  ID Transacción Wompi
                </p>
                <p className="font-mono text-xs font-bold text-gray-800 break-all">{ticketId}</p>
              </div>

              {/* Código Reserva */}
              <div>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">
                  Código de Reserva
                </p>
                <p className="font-mono text-xs font-bold text-gray-800">{reference_code}</p>
              </div>

              {/* Fecha de pago */}
              <div>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">
                  Fecha de Pago
                </p>
                <p className="text-xs font-bold text-gray-800">{dateFormatted}</p>
              </div>

              {/* Comercio aliado */}
              <div>
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">
                  Comercio Aliado
                </p>
                <p className="text-xs font-black text-teal-700">{business_name}</p>
              </div>

              {/* Fechas del servicio */}
              {(lead.check_in_date || lead.check_out_date) && (
                <div className="col-span-2">
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-0.5">
                    Fechas del Servicio
                  </p>
                  <p className="text-xs font-bold text-gray-800">
                    {lead.check_in_date
                      ? new Date(lead.check_in_date).toLocaleDateString("es-CO", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : "No especificada"}
                    {lead.check_out_date && (
                      <span className="text-gray-400 font-normal">
                        {" → "}
                        {new Date(lead.check_out_date).toLocaleDateString("es-CO", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Titular — fila completa */}
              <div className="col-span-2 border-t border-gray-100 pt-4">
                <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mb-2">
                  Datos del Titular
                </p>
                <div className="ticket-holder bg-gray-50 rounded-xl p-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{lead.full_name}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{lead.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-gray-400 uppercase font-bold">WhatsApp / Tel.</p>
                    <p className="font-bold text-gray-800 text-sm">
                      {lead.whatsapp ?? lead.phone ?? "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* QR Real + Datos legales — misma fila */}
              <div className="col-span-2 border-t border-gray-100 pt-4 flex items-start gap-6">
                
                {/* QR Real generado por api.qrserver.com */}
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">
                    Verificar autenticidad
                  </p>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrUrl}
                    alt={`QR del ticket ${ticketId}`}
                    width={120}
                    height={120}
                    className="qr-img rounded-lg border border-gray-100 p-1 bg-white"
                  />
                  <p className="text-[8px] text-gray-400 font-mono text-center max-w-[130px] break-all leading-tight">
                    {publicTicketUrl.replace("https://", "")}
                  </p>
                </div>

                {/* Datos legales de la empresa */}
                <div className="flex-1 space-y-3">
                  {/* Empresa operadora — Matrix */}
                  <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                    <p className="text-[9px] text-emerald-700 uppercase font-bold tracking-wider mb-1">
                      🔱 Empresa Operadora (Matrix)
                    </p>
                    <p className="text-sm font-black text-emerald-900">Kraken Digital Labs S.A.S</p>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      <strong>NIT:</strong> 8128036-5
                    </p>
                    <a
                      href="https://www.krakendigitalabs.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-emerald-600 hover:underline"
                    >
                      www.krakendigitalabs.com
                    </a>
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      📞 <strong>3044554311</strong>
                    </p>
                  </div>

                  {/* Portal Necoclí como producto */}
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-wider mb-1">
                      🛡️ Portal Administrador
                    </p>
                    <p className="text-sm font-black text-gray-800">Portal Necoclí</p>
                    <p className="text-[11px] text-gray-500">
                      Plataforma de turismo · Necoclí, Antioquia · Colombia
                    </p>
                    <p className="text-[11px] text-gray-500">
                      📞 <strong className="text-gray-700">3217511866</strong>
                    </p>
                    <p className="text-[11px] text-gray-500">
                      soporte@portalnecocli.com
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── CTA Turista: Reseña en Google ── */}
            <div className="mx-6 mb-6 mt-2 rounded-xl bg-gradient-to-r from-sky-50 to-emerald-50 border border-sky-100 p-5 text-center shadow-sm">
              <h4 className="text-sm font-bold text-sky-900 mb-2 flex items-center justify-center gap-2">
                ⭐ ¡Queremos saber de ti!
              </h4>
              <p className="text-xs text-sky-800 leading-relaxed max-w-md mx-auto mb-3">
                Para estar pendiente de tu experiencia de principio a fin, notifica a <strong>Portal Necoclí</strong> que ya estás próximo a embarcar y haz un comentario para que otras personas se vean motivadas a vivir esta maravillosa experiencia.
              </p>
              <a 
                href="https://g.page/r/CRFcMAbI46COEAE/review" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white border border-sky-200 text-sky-700 px-4 py-2 rounded-full text-xs font-bold shadow-sm hover:bg-sky-50 hover:text-sky-800 transition-colors"
              >
                Dejar comentario en Portal Necoclí
              </a>
            </div>

            {/* ── Footer legal del ticket ── */}
            <div className="ticket-footer bg-gray-50 px-6 py-4 border-t border-gray-100 text-center">
              <p className="text-[10px] text-gray-400 leading-relaxed max-w-lg mx-auto">
                Este comprobante es emitido por <strong className="text-gray-600">Portal Necoclí</strong>,
                plataforma operada bajo el modelo de depósito en garantía (Escrow) por{" "}
                <strong className="text-gray-600">Kraken Digital Labs S.A.S</strong> —
                NIT 8128036-5. Los fondos son transferidos al comercio aliado única y
                exclusivamente tras la confirmación del servicio prestado, garantizando
                total seguridad al turista. Consultas: {" "}
                <a href="tel:3217511866" className="text-emerald-600 font-bold hover:underline">
                  3217511866
                </a>
                {" · "}
                <a href="mailto:soporte@portalnecocli.com" className="underline hover:text-gray-600">
                  soporte@portalnecocli.com
                </a>
              </p>
            </div>
          </div>

          {/* ─── Navegación inferior entre páginas (solo en pantalla) ─── */}
          <nav className="print:hidden bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mt-6">
            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-3 text-center">
              Explorar Portal Necoclí
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { href: "/", label: "🏠 Inicio" },
                { href: "/negocios", label: "🗺️ Explorar" },
                { href: "/hoteles", label: "🏨 Hoteles" },
                { href: "/tours", label: "🌊 Tours" },
                { href: "/restaurantes", label: "🍽️ Restaurantes" },
                { href: "/transporte", label: "🚌 Transporte" },
                { href: "/customer/reservas", label: "📋 Mis Reservas" },
                { href: "/customer", label: "👤 Mi Panel" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center justify-center rounded-xl bg-gray-50 hover:bg-emerald-50 hover:text-emerald-800 px-3 py-2.5 text-xs font-semibold text-gray-600 transition-colors border border-gray-100 hover:border-emerald-100"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

        </div>
      </main>
    </>
  );
}
