import { requireAuth } from "@/lib/auth/server";
import { DriverNavigation } from "@/components/driver/driver-navigation";
export default async function DriverLayout({ children }: { children: React.ReactNode }) {
  // Para pruebas ágiles del MVP por parte del fundador, he desactivado el logueo temporalmente.
  // Cualquier persona que entre a /driver verá el dashboard directamente.
  // En producción usaremos: await requireRole(["driver"], { nextPath: "/driver" });

  return (
    <div className="min-h-screen bg-[#1A1D23] pb-20">
      {children}
      <DriverNavigation />
    </div>
  );
}
