import { getServerAuthSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { RideMapWrapper } from "@/components/rides/ride-map-wrapper";

export default async function PedirVehiculoPage() {
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/ingresar");
  }

  return (
    <main className="min-h-screen bg-sand px-4 py-8 md:p-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-3xl font-black text-ink tracking-tight">Solicitar Transporte</h1>
          <p className="mt-2 text-ink/60">
            Neco-Dispatch te ubicará por GPS. Marca tu destino y calcula la tarifa automáticamente.
          </p>
        </div>

        <RideMapWrapper
          userId={session.user.uid}
          userName={session.user.displayName || "Turista"}
          userPhone={"No registrado"}
        />
      </div>
    </main>
  );
}
