import { Briefcase } from "lucide-react";
import Link from "next/link";
import { SurfaceCard } from "@/components/ui/surface-card";
import { getReservationsByCustomer } from "@/data/reservationService";
import { requireRole } from "@/lib/auth/server";

const RESERVATION_STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: "Pendiente de pago",
  PAID: "Pagado ✓",
  CONFIRMED: "Confirmado ✓",
  COMPLETED: "Completado 🌴",
  CANCELLED: "Cancelado",
};

const RESERVATION_STATUS_COLOR: Record<string, string> = {
  PENDING_PAYMENT: "text-amber-600 bg-amber-50 border-amber-200",
  PAID: "text-teal bg-teal/8 border-teal/20",
  CONFIRMED: "text-teal bg-teal/8 border-teal/20",
  COMPLETED: "text-green-700 bg-green-50 border-green-200",
  CANCELLED: "text-ink/50 bg-ink/5 border-ink/10",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ReservasPage() {
  const session = await requireRole(["customer", "business", "admin", "super_admin"], {
    nextPath: "/customer/reservas",
  });

  const { user } = session;
  const reservations = await getReservationsByCustomer(user.uid);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold text-ink tracking-tight">Tus Reservas</h2>
        <p className="text-ink/60 mt-2">
          Historial completo de tus aventuras, experiencias y estadías en Necoclí.
        </p>
      </div>

      {reservations.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {reservations.map((reservation) => (
            <SurfaceCard
              key={reservation.id}
              className="p-6 rounded-[24px] flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${RESERVATION_STATUS_COLOR[reservation.status] ?? "text-ink/50"}`}
                  >
                    {RESERVATION_STATUS_LABEL[reservation.status] ?? reservation.status}
                  </span>
                  <p className="text-xs font-mono text-ink/40 font-semibold">
                    {reservation.reference_code}
                  </p>
                </div>
                <h3 className="text-xl font-bold text-ink">{reservation.business_name}</h3>
                <p className="text-ink/60 text-sm mt-1">
                  Reservado el {formatDate(reservation.created_at)}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 justify-between items-end border-t border-ink/5 pt-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-ink/40 font-semibold">
                    Total Pago
                  </p>
                  <p className="text-lg font-extrabold text-teal">
                    ${(reservation.total_amount / 100).toLocaleString("es-CO")}
                  </p>
                </div>

                <div className="flex gap-2">
                  {reservation.status === "PENDING_PAYMENT" && (
                    <Link
                      href={`/pago/${reservation.reference_code}`}
                      className="text-sm font-bold bg-white border border-ink/20 hover:bg-sand text-ink py-2 px-5 rounded-full shadow-soft transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
                    >
                      Pagar Reserva
                    </Link>
                  )}
                  {reservation.escrow_transaction_id ? (
                    <Link
                      href={`/tickets/${reservation.escrow_transaction_id}`}
                      className="text-xs font-bold bg-teal/10 hover:bg-teal/20 text-teal py-2.5 px-4 rounded-full transition-colors flex items-center justify-center whitespace-nowrap"
                    >
                      Ver Ticket Oficial
                    </Link>
                  ) : reservation.status !== "PENDING_PAYMENT" ? (
                    <button
                      disabled
                      className="text-xs font-semibold text-ink/30 bg-ink/5 py-2.5 px-4 rounded-full flex items-center justify-center whitespace-nowrap"
                    >
                      Ticket no disponible
                    </button>
                  ) : null}
                </div>
              </div>
            </SurfaceCard>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[28px] shadow-soft border border-ink/5 p-12 flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="bg-sand/60 p-6 rounded-full mb-6">
            <Briefcase className="w-10 h-10 text-coral" />
          </div>
          <h2 className="text-2xl font-bold text-ink mb-2">Aún no hay reservas</h2>
          <p className="text-ink/60 max-w-md mb-8">
            Cuando realices una reserva en hoteles, tours o experiencias, aparecerán aquí para tu
            control absoluto.
          </p>

          <Link
            href="/negocios"
            className="bg-coral hover:bg-coral/90 text-white font-bold py-3.5 px-8 rounded-full transition-colors shadow-soft"
          >
            Explorar Necoclí
          </Link>
        </div>
      )}
    </div>
  );
}
