import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import { notFound } from "next/navigation";
import { CheckCircle2, QrCode, Ticket, User, Anchor } from "lucide-react";
import { confirmTicketOfflinePayment } from "@/app/actions/ticket-actions";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function OperatorCheckinPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = await params;
  const db = getFirestore(getFirebaseAdminApp());
  
  // Try to find the ticket
  let ref = db.collection("reservations").doc(ticketId);
  let snap = await ref.get();
  
  if (!snap.exists) {
    const query = await db.collection("reservations").where("escrow_transaction_id", "==", ticketId).limit(1).get();
    if (query.empty) {
      notFound();
    }
    ref = query.docs[0].ref;
    snap = query.docs[0];
  }

  const reservation = snap.data();
  const isPaid = reservation?.status === "COMPLETED";

  // Server action to confirm from operator side
  async function handleOperatorConfirm() {
    "use server";
    await confirmTicketOfflinePayment(ticketId);
    revalidatePath(`/operator/checkin/${ticketId}`);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#03045e] p-6 text-center text-white relative overflow-hidden">
          <Anchor className="absolute -bottom-4 -right-4 w-24 h-24 text-white/10" />
          <h1 className="text-2xl font-black mb-1">Check-in Naviera</h1>
          <p className="text-sky-200 text-sm font-medium opacity-90">Escaner Operativo Oficial</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <QrCode className="w-8 h-8 text-sky-600" />
            <h2 className="text-xl font-bold text-slate-800 break-all">{ticketId}</h2>
          </div>

          <div className="space-y-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
              <User className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Pasajero Titular</p>
                <p className="font-bold text-slate-800">{reservation?.lead?.full_name}</p>
                <p className="text-sm text-slate-500">{reservation?.lead?.phone}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
              <Ticket className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Resumen de Viaje</p>
                <p className="font-bold text-slate-800">{reservation?.business_name}</p>
                <p className="text-sm text-slate-500">Destino: {reservation?.metadata?.destination}</p>
                <p className="text-sm font-semibold text-emerald-600 mt-1">
                  Monto a Cobrar: ${(reservation?.total_amount || 0).toLocaleString("es-CO")} COP
                </p>
              </div>
            </div>
          </div>

          {isPaid ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-emerald-800 mb-1">¡Pago Validado!</h3>
              <p className="text-sm text-emerald-700">El turista ya ha realizado el pago y tiene autorización de abordaje.</p>
            </div>
          ) : (
            <form action={handleOperatorConfirm}>
              <button 
                type="submit"
                className="w-full bg-[#0077b6] hover:bg-[#023e8a] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#0077b6]/30 transition-all flex items-center justify-center gap-2 text-lg"
              >
                <CheckCircle2 className="w-6 h-6" />
                Confirmar Pago y Abordaje
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-sky-600 font-medium hover:underline">
              Volver al inicio
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
