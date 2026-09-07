import { AdminDashboard } from "@/components/dashboards/admin-dashboard";
import { requireRole } from "@/lib/auth/server";
import { getAdminDashboardFullData } from "@/lib/dashboards/data";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  await requireRole(["admin", "super_admin"], {
    nextPath: "/admin",
  });

  const data = await getAdminDashboardFullData();

  return <AdminDashboard data={data} />;
}
