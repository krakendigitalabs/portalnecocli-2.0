import { AdminDashboard } from "@/components/dashboards/admin-dashboard";
import { getAdminDashboardData } from "@/lib/dashboards/data";

export default function AdminPage() {
  return <AdminDashboard data={getAdminDashboardData()} />;
}
