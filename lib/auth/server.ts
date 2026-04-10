import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getFirebaseAdminAuth,
  hasFirebaseAdminConfig,
} from "@/lib/firebase/admin";
import {
  getPrimaryRole,
  hasRequiredRole,
  hasRequiredScope,
  type ScopeRequirement,
  resolveAuthorizationFromClaims,
} from "@/lib/auth/roles";
import { SESSION_COOKIE_NAME } from "@/lib/auth/config";
import type { AuthUser, UserRole } from "@/types/auth";

export type ServerAuthSession = {
  user: AuthUser;
  claims: Record<string, unknown>;
};

type AuthorizationOptions = {
  roles?: UserRole[];
  scope?: ScopeRequirement;
};

type RedirectOptions = {
  nextPath?: string;
};

function buildLoginHref(nextPath?: string) {
  const query = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";

  return `/ingresar${query}`;
}

function buildUnauthorizedHref(nextPath?: string) {
  const query = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";

  return `/unauthorized${query}`;
}

function buildForbiddenHref(nextPath?: string) {
  const query = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";

  return `/forbidden${query}`;
}

function hasAssignedScope(user: AuthUser): boolean {
  return (
    user.scope.global ||
    user.scope.tenantId !== null ||
    user.scope.businessIds.length > 0 ||
    user.scope.serviceTypes.length > 0
  );
}

function mapServerUser(
  uid: string,
  claims: Record<string, unknown>,
  email?: string,
  displayName?: string,
  photoURL?: string,
  emailVerified?: boolean,
): AuthUser {
  const authorization = resolveAuthorizationFromClaims(claims);

  return {
    uid,
    email: email ?? null,
    displayName: displayName ?? null,
    photoURL: photoURL ?? null,
    emailVerified: emailVerified ?? false,
    roles: authorization.roles,
    primaryRole: getPrimaryRole(authorization.roles),
    claimsSource: authorization.source,
    tenantId: authorization.scope.tenantId,
    scope: authorization.scope,
  };
}

export async function getServerAuthSession(): Promise<ServerAuthSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!hasFirebaseAdminConfig()) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "Firebase Admin config is missing. Server auth session cannot be verified.",
      );
    }

    return null;
  }

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedToken = await getFirebaseAdminAuth().verifySessionCookie(
      sessionCookie,
      true,
    );
    const claims = decodedToken as unknown as Record<string, unknown>;

    return {
      user: mapServerUser(
        decodedToken.uid,
        claims,
        decodedToken.email,
        decodedToken.name,
        decodedToken.picture,
        decodedToken.email_verified,
      ),
      claims,
    };
  } catch {
    return null;
  }
}

export async function authorizeServerAccess(
  options: AuthorizationOptions = {},
): Promise<
  | { ok: true; session: ServerAuthSession }
  | { ok: false; status: 401 | 403 }
> {
  const session = await getServerAuthSession();

  if (!session) {
    return { ok: false, status: 401 };
  }

  if (options.roles && !hasRequiredRole(session.user.roles, options.roles)) {
    return { ok: false, status: 403 };
  }

  if (options.scope) {
    if (
      options.scope.requireAssignedScope &&
      !hasAssignedScope(session.user)
    ) {
      return { ok: false, status: 403 };
    }

    if (!hasRequiredScope(session.user.scope, options.scope)) {
      return { ok: false, status: 403 };
    }
  }

  return { ok: true, session };
}

export async function requireAuth(options: RedirectOptions = {}) {
  const authorization = await authorizeServerAccess();

  if (!authorization.ok) {
    redirect(buildLoginHref(options.nextPath));
  }

  return authorization.session;
}

export async function requireRole(
  roles: UserRole[],
  options: RedirectOptions = {},
) {
  const authorization = await authorizeServerAccess({ roles });

  if (!authorization.ok) {
    if (authorization.status === 401) {
      redirect(buildLoginHref(options.nextPath));
    }

    redirect(buildForbiddenHref(options.nextPath));
  }

  return authorization.session;
}

export async function requireScope(
  scope: ScopeRequirement,
  options: RedirectOptions = {},
) {
  const authorization = await authorizeServerAccess({ scope });

  if (!authorization.ok) {
    if (authorization.status === 401) {
      redirect(buildLoginHref(options.nextPath));
    }

    redirect(buildForbiddenHref(options.nextPath));
  }

  return authorization.session;
}
