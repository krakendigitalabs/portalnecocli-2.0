import { NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/auth/api";
import { getAdminDashboardData } from "@/lib/dashboards/data";

export async function GET() {
  const authorization = await requireApiAccess({
    roles: ["super_admin", "admin"],
  });

  if (authorization instanceof NextResponse) {
    return authorization;
  }

  return NextResponse.json({
    status: 200,
    data: getAdminDashboardData(),
  });
}
