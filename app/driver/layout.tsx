import { DriverNavigation } from "@/components/driver/driver-navigation";
import { requireRole } from "@/lib/auth/server";
export default async function DriverLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["driver", "admin", "super_admin"], { nextPath: "/driver" });

  return (
    <div className="min-h-screen bg-[#1A1D23] pb-20">
      {children}
      <DriverNavigation />
    </div>
  );
}
