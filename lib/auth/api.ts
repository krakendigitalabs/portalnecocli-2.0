import "server-only";
import { NextResponse } from "next/server";
import { authorizeServerAccess } from "@/lib/auth/server";
import type { ScopeRequirement } from "@/lib/auth/roles";
import type { UserRole } from "@/types/auth";

type ApiAuthorizationOptions = {
  roles?: UserRole[];
  scope?: ScopeRequirement;
};

export async function requireApiAccess(options: ApiAuthorizationOptions = {}) {
  const authorization = await authorizeServerAccess(options);

  if (authorization.ok) {
    return authorization.session;
  }

  return NextResponse.json(
    {
      error: authorization.status === 401 ? "Unauthorized" : "Forbidden",
      status: authorization.status,
    },
    { status: authorization.status },
  );
}
