import { ArrowLeft, CheckCircle2, CreditCard, Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PaymentButton } from "@/components/checkout/payment-button";
import { DirectReservationButton } from "@/components/checkout/direct-reservation-button";
import { SurfaceCard } from "@/components/ui/surface-card";
import { getLoyaltyBonuses } from "@/data/loyaltyService";
import { getReservationByReferenceCode } from "@/data/reservationService";
import { BonusSelector } from "./bonus-selector";

type Props = {
  params: Promise<{
    referenceCode: string;
  }>;
};

export default async function PagoCheckoutPage({ params }: Props) {
  const { referenceCode } = await params;
  const reservation = await getReservationByReferenceCode(referenceCode);

  if (!reservation) {
    notFound();
  }

  // Si ya está pagada o completada, no debería estar en esta pasarela
  if (reservation.status !== "PENDING_PAYMENT") {
    redirect(`/tickets/${reservation.escrow_transaction_id || ""}`);
  }

  const { lead, business_name, total_amount, reference_code, customer_id, applied_bonus_id } =
    reservation;

  // Calculamos el valor en formato moneda
  const amountFormatted = (total_amount / 100).toLocaleString("es-CO");
  // Extraemos bonos del cliente
  const bonuses = customer_id ? await getLoyaltyBonuses(customer_id) : [];
  return (
    <main className="min-h-screen bg-sand/30 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Cabecera / Branding de Seguridad */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/customer/reservas"
            className="inline-flex items-center text-sm font-semibold text-ink/60 hover:text-ink transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a mis reservas
          </Link>
          <div className="flex items-center gap-2 text-teal font-bold text-sm bg-teal/10 px-4 py-2 rounded-full w-fit">
            <ShieldCheck className="w-4 h-4" />
            <span>Pago 100% Seguro (Modelo Escrow)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detalles de la Reserva (Columna Izquierda) */}
          <div className="lg:col-span-2 space-y-6">
            <SurfaceCard className="rounded-[28px] overflow-hidden p-0 border border-ink/5">
              <div className="bg-ink p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Lock className="w-48 h-48" />
                </div>
                <div className="relative z-10">
                  <p className="text-xs uppercase tracking-[0.2em] font-bold text-teal mb-2">
                    Liquidación de Reserva
                  </p>
                  <h1 className="text-3xl font-extrabold mb-1">{business_name}</h1>
                  <p className="text-white/60 font-mono text-sm">Cód. {reference_code}</p>
                </div>
              </div>

              <div className="p-8 space-y-6 bg-white">
                <h3 className="text-lg font-bold text-ink border-b border-ink/5 pb-4">
                  Detalles del Titular
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-ink/50 uppercase tracking-wider font-semibold mb-1">
                      Nombre Completo
                    </p>
                    <p className="font-semibold text-ink">{lead.full_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink/50 uppercase tracking-wider font-semibold mb-1">
                      Correo Electrónico
                    </p>
                    <p className="font-semibold text-ink">{lead.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-ink/50 uppercase tracking-wider font-semibold mb-1">
                      Teléfono / WhatsApp
                    </p>
                    <p className="font-semibold text-ink">
                      {lead.phone} / {lead.whatsapp}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-ink/50 uppercase tracking-wider font-semibold mb-1">
                      Fechas (Llegada - Salida)
                    </p>
                    <p className="font-semibold text-ink">
                      {lead.check_in_date
                        ? new Date(lead.check_in_date).toLocaleDateString("es-CO")
                        : "No especificada"}
                      {" - "}
                      {lead.check_out_date
                        ? new Date(lead.check_out_date).toLocaleDateString("es-CO")
                        : "No especificada"}
                    </p>
                  </div>
                </div>
              </div>
            </SurfaceCard>

            {/* Aviso de Confianza (Escrow) */}
            <div className="bg-amber-50 border border-amber-200 rounded-[24px] p-6 flex gap-4 items-start">
              <div className="bg-amber-100 p-2 rounded-full shrink-0">
                <ShieldCheck className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-amber-800 text-sm">Depósito en Garantía Protegido</h4>
                <p className="text-amber-700/80 text-sm mt-1 leading-relaxed">
                  El dinero de esta reserva será retenido de forma segura en las cuentas fiduciarias
                  de Portal Necoclí. El comercio <strong>{business_name}</strong> solo recibirá los
                  fondos una vez hayas disfrutado de tu servicio. Si hay algún inconveniente, tu
                  dinero está respaldado.
                </p>
              </div>
            </div>
          </div>

          {/* Checkout (Columna Derecha) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <SurfaceCard className="rounded-[28px] p-8 border border-ink/5 shadow-xl shadow-ink/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-teal/5 to-transparent pointer-events-none" />

                <div className="relative z-10 text-center mb-8 pb-8 border-b border-ink/5">
                  <p className="text-xs uppercase tracking-widest text-ink/50 font-bold mb-3">
                    Total a Pagar
                  </p>
                  <p className="text-4xl font-black text-ink mb-2">
                    <span className="text-2xl text-teal mr-1">$</span>
                    {amountFormatted}
                    <span className="text-lg font-bold text-ink/40 ml-1">COP</span>
                  </p>
                  <p className="text-xs text-ink/50 font-medium">
                    Incluye impuestos y tarifas de la plataforma
                  </p>
                </div>

                <div className="space-y-4 relative z-10">
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-sm text-ink/70">
                      <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />
                      <span>Reserva instantánea confirmada</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-ink/70">
                      <CheckCircle2 className="w-4 h-4 text-teal shrink-0" />
                      <span>Pago validado por Wompi Bancolombia</span>
                    </li>
                  </ul>

                  <BonusSelector
                    bonuses={bonuses}
                    reservationId={reservation.id}
                    appliedBonusId={applied_bonus_id}
                  />

                  {/* BOTÓN WOMPI (Conectado al Server Action) */}
                  <div className="pt-4">
                    <PaymentButton reservationId={reservation.id} />
                  </div>

                  <DirectReservationButton reservationId={reservation.id} />
                </div>
              </SurfaceCard>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
