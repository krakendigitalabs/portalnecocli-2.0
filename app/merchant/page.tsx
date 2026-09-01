import { MerchantDashboard } from "@/components/dashboards/merchant-dashboard";
import { requireRole } from "@/lib/auth/server";
import { getMerchantDashboardData } from "@/lib/dashboards/data";

export default async function MerchantPage() {
  const session = await requireRole(["business"], {
    nextPath: "/merchant",
  });

  const data = await getMerchantDashboardData(session.user.scope);

  return <MerchantDashboard data={data} />;
}
