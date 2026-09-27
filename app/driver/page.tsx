import type { Metadata } from "next";
import { DriverDashboardClient } from "./driver-dashboard-client";
import { requireAuth } from "@/lib/auth/server";
import { getDriverProfile } from "@/data/driverService";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Tablero del Conductor | Neco-Dispatch",
  description:
    "Panel de control para conductores aliados de Portal Necoclí. Acepta carreras y gestiona tu billetera.",
};

export default async function DriverDashboardPage() {
  const session = await requireAuth({ nextPath: "/driver" });

  const driverProfile = await getDriverProfile(session.user.uid);

  if (!driverProfile) {
    redirect("/conductores");
  }

  return (
    <DriverDashboardClient
      driverId={driverProfile.id}
      initialDriverName={driverProfile.full_name}
      initialWalletBalance={driverProfile.wallet_balance || 0}
      initialRidesCompleted={driverProfile.total_rides_completed || 0}
      initialDriverStatus={driverProfile.status}
    />
  );
}
