import type { UserRole } from "@/types/auth";

export const userRoles: UserRole[] = [
  "admin",
  "business",
  "operator",
  "customer",
];

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && userRoles.includes(value as UserRole);
}

function normalizeRoleToken(value: unknown): UserRole[] {
  if (typeof value === "string") {
    return value
      .split(/[,\s|]+/)
      .map((item) => item.trim().toLowerCase())
      .filter(isUserRole);
  }

  if (Array.isArray(value)) {
    return value.flatMap(normalizeRoleToken);
  }

  if (typeof value === "object" && value !== null) {
    return Object.entries(value).flatMap(([key, enabled]) => {
      if (enabled === true && isUserRole(key)) {
        return [key];
      }

      return [];
    });
  }

  return [];
}

export function normalizeUserRoles(value: unknown): UserRole[] {
  return Array.from(new Set(normalizeRoleToken(value)));
}

export function resolveUserRolesFromClaims(claims: Record<string, unknown>) {
  const claimCandidates = [
    { source: "roles", value: claims.roles },
    { source: "role", value: claims.role },
    { source: "app_roles", value: claims.app_roles },
    { source: "portal_roles", value: claims.portal_roles },
    {
      source: "portal.roles",
      value:
        typeof claims.portal === "object" && claims.portal !== null
          ? (claims.portal as Record<string, unknown>).roles
          : undefined,
    },
  ];

  for (const candidate of claimCandidates) {
    const roles = normalizeUserRoles(candidate.value);

    if (roles.length > 0) {
      return {
        roles,
        source: candidate.source,
      };
    }
  }

  return {
    roles: [] as UserRole[],
    source: null,
  };
}

export function getPrimaryRole(roles: UserRole[]): UserRole | null {
  return roles[0] ?? null;
}

export function hasRequiredRole(
  roles: UserRole[],
  requiredRoles: UserRole[],
): boolean {
  if (requiredRoles.length === 0) {
    return true;
  }

  return requiredRoles.some((requiredRole) => roles.includes(requiredRole));
}
