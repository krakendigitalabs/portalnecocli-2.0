import { getReservationByEscrowId } from "@/data/reservationService";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2, ShieldCheck, Download, Printer } from "lucide-react";
import Link from "next/link";
import { SurfaceCard } from "@/components/ui/surface-card";

type Props = {
  params: Promise<{
    ticketId: string;
  }>;
};

export default async function EscrowTicketPage({ params }: Props) {
  const { ticketId } = await params;
  const reservation = await getReservationByEscrowId(ticketId);

  if (!reservation || !reservation.escrow_transaction_id) {
    notFound();
  }

  const { lead, business_name, total_amount, reference_code, created_at, status } = reservation;
  const amountFormatted = (total_amount / 100).toLocaleString("es-CO");
  const dateFormatted = new Date(created_at).toLocaleDateString("es-CO", {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <main className="min-h-screen bg-sand/30 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Navegación y Acciones */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link href="/customer/reservas" className="inline-flex items-center text-sm font-semibold text-ink/60 hover:text-ink transition-colors w-fit">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Panel
          </Link>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 text-ink font-bold text-sm bg-white border border-ink/10 shadow-sm hover:shadow-md px-4 py-2 rounded-full w-fit transition-all">
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
            <button className="flex items-center gap-2 text-teal font-bold text-sm bg-teal/10 hover:bg-teal/20 px-4 py-2 rounded-full w-fit transition-all">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Descargar PDF</span>
            </button>
          </div>
        </div>

        {/* Ticket Físico (UI) */}
        <div className="relative">
          {/* Bordes dentados del ticket (Efecto visual opcional) */}
          <div className="absolute -left-2 top-1/3 w-4 h-4 bg-sand/30 rounded-full border-r border-ink/5 z-10" />
          <div className="absolute -right-2 top-1/3 w-4 h-4 bg-sand/30 rounded-full border-l border-ink/5 z-10" />

          <SurfaceCard className="rounded-[28px] overflow-hidden p-0 border-0 shadow-2xl shadow-ink/5">
            {/* Cabecera del Ticket */}
            <div className="bg-ink p-8 text-white relative">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                    Portal Necoclí
                    <ShieldCheck className="w-6 h-6 text-teal" />
                  </h1>
                  <p className="text-white/60 text-xs font-mono mt-1">NIT: 901.XXX.XXX-X (Kraken Digital Labs)</p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-green-500/30">
                    <CheckCircle2 className="w-4 h-4" />
                    Aprobado
                  </div>
                </div>
              </div>

              <div className="text-center py-6 border-y border-white/10">
                <p className="text-xs uppercase tracking-[0.2em] font-bold text-teal mb-2">Comprobante de Recaudo Escrow</p>
                <p className="text-4xl sm:text-5xl font-black text-white">
                  <span className="text-teal mr-2">$</span>{amountFormatted}
                </p>
                <p className="text-white/50 text-xs mt-2">Pagado a través de Pasarela Autorizada</p>
              </div>
            </div>

            {/* Cuerpo del Ticket */}
            <div className="bg-white p-8 relative">
              {/* Línea punteada de corte */}
              <div className="absolute top-0 left-0 w-full border-t-2 border-dashed border-ink/10" />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-6 mt-4">
                <div>
                  <p className="text-xs text-ink/40 uppercase tracking-widest font-semibold mb-1">ID Transacción</p>
                  <p className="font-mono text-sm font-bold text-ink">{ticketId}</p>
                </div>
                <div>
                  <p className="text-xs text-ink/40 uppercase tracking-widest font-semibold mb-1">Cód. Reserva</p>
                  <p className="font-mono text-sm font-bold text-ink">{reference_code}</p>
                </div>
                
                <div>
                  <p className="text-xs text-ink/40 uppercase tracking-widest font-semibold mb-1">Fecha de Pago</p>
                  <p className="text-sm font-bold text-ink">{dateFormatted}</p>
                </div>
                <div>
                  <p className="text-xs text-ink/40 uppercase tracking-widest font-semibold mb-1">Comercio Aliado</p>
                  <p className="text-sm font-black text-teal">{business_name}</p>
                </div>

                <div className="sm:col-span-2 pt-6 border-t border-ink/5">
                  <p className="text-xs text-ink/40 uppercase tracking-widest font-semibold mb-3">Detalles del Titular</p>
                  <div className="bg-ink/5 rounded-2xl p-4 flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <p className="font-bold text-ink text-sm">{lead.full_name}</p>
                      <p className="text-xs text-ink/60 mt-0.5">{lead.email}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-ink/60">WhatsApp</p>
                      <p className="font-semibold text-ink text-sm">{lead.whatsapp}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del Ticket */}
            <div className="bg-sand/50 p-6 text-center border-t border-ink/5">
              <p className="text-[10px] text-ink/50 leading-relaxed max-w-lg mx-auto">
                Este comprobante es generado por Portal Necoclí operando bajo el modelo de retención de garantía (Escrow).
                Los fondos serán transferidos al comercio aliado tras la confirmación del servicio prestado, garantizando
                total seguridad para el turista. Para dudas o reclamos, contacte a soporte@portalnecocli.com.
              </p>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </main>
  );
}
