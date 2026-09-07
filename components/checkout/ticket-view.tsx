import { Building, Calendar, CheckCircle2, ShieldCheck, Ticket, Users } from "lucide-react";
import { EscrowTransaction, Reservation } from "@/lib/validations/schemas";
import { WompiButton } from "./wompi-button";

export function TicketView({
  escrow,
  reservation,
  signature,
}: {
  escrow: EscrowTransaction;
  reservation: Reservation;
  signature?: string;
}) {
  const isPaid = escrow.status === "released" || escrow.status === "refunded";

  // Wompi exige montos en centavos (ej: 40000 COP -> 4000000)
  const amountInCents = escrow.amountCollected * 100;

  // URL de redirección dinámica según el entorno
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://tours.portalnecocli.com"
      : "http://localhost:3000";
  const redirectUrl = `${baseUrl}/tickets/${escrow.id!}`;

  return (
    <div className="bg-white rounded-[32px] shadow-2xl p-6 md:p-10 border-t-[12px] border-t-gold max-w-2xl mx-auto relative overflow-hidden">
      {/* Background logo watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
        <Ticket className="w-96 h-96" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8 pb-8 border-b border-dashed border-ink/20">
          <p className="text-gold font-bold tracking-widest uppercase text-xs mb-2">
            Portal Necoclí - Escrow
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-ink font-tropical tracking-wide mb-2">
            Ticket de Reserva
          </h1>
          <p className="text-ink/60 text-sm">Ref: {escrow.id}</p>
        </div>

        {/* Detalles del Cliente y Reserva */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-ink/50 tracking-widest">Titular</p>
              <p className="font-semibold text-ink text-lg">{reservation.customerName}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-ink/50 tracking-widest">
                Contacto
              </p>
              <p className="font-medium text-ink/80">{reservation.customerPhone}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building className="w-5 h-5 text-teal mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] uppercase font-bold text-ink/50 tracking-widest">
                  Servicio
                </p>
                <p className="font-semibold text-ink leading-tight">{reservation.serviceName}</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-teal mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-ink/50 tracking-widest">
                    Fecha
                  </p>
                  <p className="font-semibold text-ink">
                    {reservation.reservationDate.toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-teal mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-ink/50 tracking-widest">
                    Cupos
                  </p>
                  <p className="font-semibold text-ink">{reservation.guests}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen de Cobro */}
        <div className="bg-sand p-6 rounded-2xl mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-ink/60 uppercase tracking-widest mb-1">
              Total a Pagar
            </p>
            <p className="text-3xl font-bold text-teal">
              ${escrow.amountCollected.toLocaleString("es-CO")}
            </p>
          </div>
          <div className="text-right flex flex-col items-end">
            <ShieldCheck className="w-8 h-8 text-gold mb-1" />
            <p className="text-[10px] uppercase font-bold text-ink/50 tracking-widest">
              Pago Protegido
            </p>
          </div>
        </div>

        {/* Acciones de Pago */}
        <div className="flex justify-center mt-8">
          {isPaid ? (
            <div className="flex flex-col items-center justify-center p-6 bg-green/10 text-green rounded-2xl w-full">
              <CheckCircle2 className="w-12 h-12 mb-2" />
              <p className="font-bold text-lg">¡Pago Confirmado!</p>
              <p className="text-sm opacity-80 text-center mt-1">
                Tu transacción ha sido procesada con éxito y los fondos están asegurados.
              </p>
            </div>
          ) : (
            <div className="w-full">
              <p className="text-center text-sm text-ink/60 mb-4">
                Selecciona tu método de pago seguro:
              </p>
              <WompiButton
                reference={escrow.id!}
                amountInCents={amountInCents}
                redirectUrl={redirectUrl}
                signature={signature}
              />
              <p className="text-center text-xs text-ink/40 mt-4">
                Transacción procesada bajo el modelo Escrow de Portal Necoclí.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
