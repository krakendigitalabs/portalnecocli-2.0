import { NextResponse } from "next/server";
import { featuredBusinessesSeed } from "@/data/featured-businesses";
import { requireApiAccess } from "@/lib/auth/api";

type MerchantBusinessRouteContext = {
  params: Promise<{
    businessId: string;
  }>;
};

export async function GET(_request: Request, context: MerchantBusinessRouteContext) {
  const params = await context.params;
  const businessId = params.businessId.toLowerCase();
  const business = featuredBusinessesSeed.find((item) => item.id === businessId);

  if (!business) {
    return NextResponse.json({ error: "Not Found", status: 404 }, { status: 404 });
  }

  const authorization = await requireApiAccess({
    roles: ["business"],
    scope: {
      requireAssignedScope: true,
      tenantId: business.tenantId,
      businessId: business.id,
      serviceType: business.serviceType,
    },
  });

  if (authorization instanceof NextResponse) {
    return authorization;
  }

  return NextResponse.json({
    status: 200,
    data: business,
  });
}
