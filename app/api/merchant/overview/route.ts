import { NextResponse } from "next/server";
import { requireApiAccess } from "@/lib/auth/api";
import { getMerchantDashboardData } from "@/lib/dashboards/data";

export async function GET() {
  const authorization = await requireApiAccess({
    roles: ["business"],
    scope: {
      requireAssignedScope: true,
    },
  });

  if (authorization instanceof NextResponse) {
    return authorization;
  }

  return NextResponse.json({
    status: 200,
    data: getMerchantDashboardData(authorization.user.scope),
  });
}
