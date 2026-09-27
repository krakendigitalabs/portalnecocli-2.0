import { getServerAuthSession } from "@/lib/auth/server";
import { redirect } from "next/navigation";
import { RideTrackingClient } from "@/components/rides/ride-tracking-client";

export default async function RideTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await getServerAuthSession();
  if (!session) {
    redirect("/ingresar");
  }

  // En un caso real, validaríamos que este viaje le pertenece a este userId
  // Por simplicidad, solo renderizamos el cliente de tracking.

  return (
    <main className="min-h-screen bg-sand px-4 py-8 md:p-12">
      <div className="mx-auto max-w-3xl">
        <RideTrackingClient rideId={resolvedParams.id} userId={session.user.uid} />
      </div>
    </main>
  );
}
