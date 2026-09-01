import crypto from "crypto";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TicketView } from "@/components/checkout/ticket-view";
import { Container } from "@/components/ui/container";
import { EscrowRepo } from "@/lib/data/repositories/escrow-repo";
import { ReservationRepo } from "@/lib/data/repositories/reservation-repo";

function generateWompiSignature(reference: string, amountInCents: number, currency: string) {
  // En desarrollo (pruebas) Wompi suele fallar si se envía una firma pero la cuenta test no la tiene habilitada,
  // o si el secreto de prueba no coincide. La desactivamos localmente para evitar que se quede pensando.
  const isDev = process.env.NODE_ENV !== "production";
  if (isDev) return undefined;

  const secret = process.env.WOMPI_INTEGRITY_SECRET;
  if (!secret) return undefined;

  const concatenated = `${reference}${amountInCents}${currency}${secret}`;
  return crypto.createHash("sha256").update(concatenated).digest("hex");
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TicketPage(props: Props) {
  const params = await props.params;

  // Aseguramos que id existe para evitar errores
  if (!params.id) return notFound();

  const escrow = await EscrowRepo.getTransaction(params.id);
  if (!escrow) return notFound();

  const reservation = await ReservationRepo.getReservation(escrow.reservationId);
  if (!reservation) return notFound();

  const amountInCents = Math.round(escrow.amountCollected * 100);
  const signature = generateWompiSignature(escrow.id!, amountInCents, "COP");

  return (
    <div className="min-h-screen bg-sand/30 py-12 md:py-24">
      <Container>
        <div className="mb-8 max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-bold tracking-widest uppercase text-ink/50 hover:text-green transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al portal
          </Link>
        </div>

        <TicketView escrow={escrow} reservation={reservation} signature={signature} />
      </Container>
    </div>
  );
}
