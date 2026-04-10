import { MerchantDashboard } from "@/components/dashboards/merchant-dashboard";
import { requireRole } from "@/lib/auth/server";
import { getMerchantDashboardData } from "@/lib/dashboards/data";

export default async function MerchantPage() {
  const session = await requireRole(["admin", "business", "operator"], {
    nextPath: "/merchant",
  });

  return <MerchantDashboard data={getMerchantDashboardData(session.user.scope)} />;
}
