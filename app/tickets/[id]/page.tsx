import { EscrowRepo } from "@/lib/data/repositories/escrow-repo";
import { ReservationRepo } from "@/lib/data/repositories/reservation-repo";
import { TicketView } from "@/components/checkout/ticket-view";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import crypto from "crypto";

function generateWompiSignature(reference: string, amountInCents: number, currency: string) {
  // Autoselección de secreto según el entorno
  const isDev = process.env.NODE_ENV !== "production";
  const secret = isDev ? process.env.WOMPI_TEST_INTEGRITY_SECRET : process.env.WOMPI_INTEGRITY_SECRET;
  
  if (!secret) return undefined;

  const concatenated = `${reference}${amountInCents}${currency}${secret}`;
  return crypto.createHash('sha256').update(concatenated).digest('hex');
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
  
  const amountInCents = escrow.amountCollected * 100;
  const signature = generateWompiSignature(escrow.id!, amountInCents, "COP");

  return (
    <div className="min-h-screen bg-sand/30 py-12 md:py-24">
      <Container>
        <div className="mb-8 max-w-2xl mx-auto">
          <Link href="/" className="inline-flex items-center text-sm font-bold tracking-widest uppercase text-ink/50 hover:text-green transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver al portal
          </Link>
        </div>
        
        <TicketView escrow={escrow} reservation={reservation} signature={signature} />
      </Container>
    </div>
  );
}
