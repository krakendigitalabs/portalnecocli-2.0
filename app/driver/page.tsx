import type { Metadata } from "next";
import { DriverDashboardClient } from "./driver-dashboard-client";

export const metadata: Metadata = {
  title: "Tablero del Conductor | Neco-Dispatch",
  description: "Panel de control para conductores aliados de Portal Necoclí. Acepta carreras y gestiona tu billetera.",
};

export default function DriverDashboardPage() {
  return <DriverDashboardClient />;
}
