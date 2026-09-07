/**
 * Ticket Digital Oficial — Portal Necoclí
 * Comprobante de Recaudo Escrow con soporte de impresión @media print.
 */
import { getReservationByEscrowId } from "@/data/reservationService";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { SurfaceCard } from "@/components/ui/surface-card";
import { PrintTicketButton } from "@/components/checkout/print-ticket-button";

type Props = {
  params: Promise<{
    ticketId: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { ticketId } = await params;
  return {
    title: `Ticket Escrow #${ticketId.slice(-8).toUpperCase()} | Portal Necoclí`,
    description: "Comprobante oficial de reserva y recaudo con modelo de garantía Escrow.",
  };
}

export default async function EscrowTicketPage({ params }: Props) {
  const { ticketId } = await params;
  const reservation = await getReservationByEscrowId(ticketId);

  if (!reservation || !reservation.escrow_transaction_id) {
    notFound();
  }

  const { lead, business_name, total_amount, reference_code, created_at } = reservation;
  const amountFormatted = (total_amount / 100).toLocaleString("es-CO");
  const dateFormatted = new Date(created_at).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const ticketUrl = `https://portal-necocli.vercel.app/tickets/${ticketId}`;

  return (
    <>
      {/* CSS de impresión: oculta nav, muestra solo el ticket */}
      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .print-full { box-shadow: none !important; border-radius: 0 !important; }
        }
      `}</style>

      <main className="min-h-screen bg-sand/30 py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Navegación y Acciones (ocultas al imprimir) */}
          <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              href="/customer/reservas"
              className="inline-flex items-center text-sm font-semibold text-ink/60 hover:text-ink transition-colors w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Panel
            </Link>
            <div className="flex gap-2">
              <PrintTicketButton />
            </div>
          </div>

          {/* Ticket Físico (UI) */}
          <div className="relative print-full">
            {/* Muescas decorativas tipo ticket de vuelo */}
            <div className="no-print absolute -left-2 top-[38%] w-4 h-4 bg-sand/30 rounded-full border-r border-ink/5 z-10" />
            <div className="no-print absolute -right-2 top-[38%] w-4 h-4 bg-sand/30 rounded-full border-l border-ink/5 z-10" />

            <SurfaceCard className="rounded-[28px] overflow-hidden p-0 border-0 shadow-2xl shadow-ink/5 print-full">

              {/* Cabecera del Ticket */}
              <div className="bg-ink p-8 text-white relative">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                      Portal Necoclí
                      <ShieldCheck className="w-6 h-6 text-teal" />
                    </h1>
                    <p className="text-white/60 text-xs font-mono mt-1">
                      NIT: 901.XXX.XXX-X — Kraken Digital Labs S.A.S
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1.5 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-green-500/30">
                      <CheckCircle2 className="w-4 h-4" />
                      Aprobado
                    </div>
                    <p className="text-white/30 text-[10px] mt-2 font-mono">
                      {ticketId.slice(-12).toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="text-center py-6 border-y border-white/10">
                  <p className="text-xs uppercase tracking-[0.2em] font-bold text-teal mb-2">
                    Comprobante de Recaudo Escrow
                  </p>
                  <p className="text-4xl sm:text-5xl font-black text-white">
                    <span className="text-teal mr-2">$</span>{amountFormatted}
                    <span className="text-xl font-bold text-white/40 ml-1">COP</span>
                  </p>
                  <p className="text-white/50 text-xs mt-2">
                    Fondos retenidos en garantía · Comercio recibirá el pago tras el servicio
                  </p>
                </div>
              </div>

              {/* Cuerpo del Ticket */}
              <div className="bg-white p-8 relative">
                {/* Línea punteada de corte */}
                <div className="absolute top-0 left-0 w-full border-t-2 border-dashed border-ink/10" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6 mt-4">
                  <div>
                    <p className="text-xs text-ink/40 uppercase tracking-widest font-semibold mb-1">
                      ID Transacción Wompi
                    </p>
                    <p className="font-mono text-sm font-bold text-ink break-all">{ticketId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink/40 uppercase tracking-widest font-semibold mb-1">
                      Código de Reserva
                    </p>
                    <p className="font-mono text-sm font-bold text-ink">{reference_code}</p>
                  </div>

                  <div>
                    <p className="text-xs text-ink/40 uppercase tracking-widest font-semibold mb-1">
                      Fecha de Pago
                    </p>
                    <p className="text-sm font-bold text-ink">{dateFormatted}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink/40 uppercase tracking-widest font-semibold mb-1">
                      Comercio Aliado
                    </p>
                    <p className="text-sm font-black text-teal">{business_name}</p>
                  </div>

                  {/* Fechas del servicio */}
                  {(lead.check_in_date || lead.check_out_date) && (
                    <div className="sm:col-span-2">
                      <p className="text-xs text-ink/40 uppercase tracking-widest font-semibold mb-1">
                        Fechas del Servicio
                      </p>
                      <p className="text-sm font-bold text-ink">
                        {lead.check_in_date
                          ? new Date(lead.check_in_date).toLocaleDateString("es-CO", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "No especificada"}
                        {lead.check_out_date ? (
                          <span className="text-ink/50 font-normal">
                            {" "}
                            → {new Date(lead.check_out_date).toLocaleDateString("es-CO", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  )}

                  {/* Titular */}
                  <div className="sm:col-span-2 pt-6 border-t border-ink/5">
                    <p className="text-xs text-ink/40 uppercase tracking-widest font-semibold mb-3">
                      Detalles del Titular
                    </p>
                    <div className="bg-ink/5 rounded-2xl p-4 flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <p className="font-bold text-ink text-sm">{lead.full_name}</p>
                        <p className="text-xs text-ink/60 mt-0.5">{lead.email}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-ink/60">WhatsApp / Teléfono</p>
                        <p className="font-semibold text-ink text-sm">
                          {lead.whatsapp ?? lead.phone ?? "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* QR visual del ticket (SVG inline sin deps) */}
                  <div className="sm:col-span-2 pt-4 flex flex-col items-center gap-3">
                    <p className="text-xs text-ink/40 uppercase tracking-widest font-semibold">
                      Verificar autenticidad
                    </p>
                    <div className="flex flex-col items-center gap-2 rounded-2xl border border-ink/10 p-4 bg-white">
                      {/* QR placeholder: visual SVG de cuadrícula que representa el QR */}
                      <svg
                        width="80"
                        height="80"
                        viewBox="0 0 80 80"
                        className="opacity-70"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Esquinas del QR */}
                        <rect x="0" y="0" width="24" height="24" rx="4" fill="#0f2e21" />
                        <rect x="4" y="4" width="16" height="16" rx="2" fill="white" />
                        <rect x="8" y="8" width="8" height="8" rx="1" fill="#0f2e21" />

                        <rect x="56" y="0" width="24" height="24" rx="4" fill="#0f2e21" />
                        <rect x="60" y="4" width="16" height="16" rx="2" fill="white" />
                        <rect x="64" y="8" width="8" height="8" rx="1" fill="#0f2e21" />

                        <rect x="0" y="56" width="24" height="24" rx="4" fill="#0f2e21" />
                        <rect x="4" y="60" width="16" height="16" rx="2" fill="white" />
                        <rect x="8" y="64" width="8" height="8" rx="1" fill="#0f2e21" />

                        {/* Patrón central */}
                        <rect x="32" y="8" width="4" height="4" fill="#0f2e21" />
                        <rect x="40" y="8" width="8" height="4" fill="#0f2e21" />
                        <rect x="32" y="16" width="8" height="4" fill="#0f2e21" />
                        <rect x="8" y="32" width="4" height="4" fill="#0f2e21" />
                        <rect x="16" y="32" width="8" height="4" fill="#0f2e21" />
                        <rect x="32" y="32" width="16" height="4" fill="#0f2e21" />
                        <rect x="52" y="32" width="4" height="4" fill="#0f2e21" />
                        <rect x="60" y="32" width="8" height="4" fill="#0f2e21" />
                        <rect x="8" y="40" width="8" height="4" fill="#0f2e21" />
                        <rect x="24" y="40" width="4" height="4" fill="#0f2e21" />
                        <rect x="32" y="40" width="8" height="4" fill="#0f2e21" />
                        <rect x="52" y="40" width="12" height="4" fill="#0f2e21" />
                        <rect x="32" y="48" width="4" height="4" fill="#0f2e21" />
                        <rect x="40" y="56" width="8" height="4" fill="#0f2e21" />
                        <rect x="32" y="64" width="16" height="4" fill="#0f2e21" />
                        <rect x="52" y="64" width="4" height="4" fill="#0f2e21" />
                        <rect x="64" y="56" width="4" height="4" fill="#0f2e21" />
                        <rect x="64" y="64" width="8" height="8" fill="#0f2e21" />
                      </svg>
                      <p className="text-[10px] text-ink/50 font-mono break-all text-center max-w-[200px]">
                        {ticketUrl}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer del Ticket */}
              <div className="bg-sand/50 p-6 text-center border-t border-ink/5">
                <p className="text-[10px] text-ink/50 leading-relaxed max-w-lg mx-auto">
                  Este comprobante es generado por <strong>Portal Necoclí</strong>, operado bajo el
                  modelo de retención de garantía (Escrow) por <strong>Kraken Digital Labs S.A.S</strong>.
                  Los fondos serán transferidos al comercio aliado tras la confirmación del servicio
                  prestado, garantizando total seguridad para el turista.{" "}
                  <a href="mailto:soporte@portalnecocli.com" className="underline hover:text-ink/80">
                    soporte@portalnecocli.com
                  </a>
                </p>
              </div>
            </SurfaceCard>
          </div>
        </div>
      </main>
    </>
  );
}
