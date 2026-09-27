import { getServerAuthSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import dynamic from "next/dynamic";

// Map needs to be client-side only because it relies on window
const RideMapClient = dynamic(() => import("@/components/rides/ride-map-client"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] items-center justify-center rounded-3xl bg-ink/5 animate-pulse">
      <p className="text-ink/40 font-bold uppercase tracking-widest text-xs">
        Cargando Satélite...
      </p>
    </div>
  ),
});

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

        <RideMapClient
          userId={session.user.uid}
          userName={session.user.displayName || "Turista"}
          userPhone={"No registrado"}
        />
      </div>
    </main>
  );
}
