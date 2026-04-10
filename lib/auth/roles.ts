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

export function normalizeUserRoles(value: unknown): UserRole[] {
  if (Array.isArray(value)) {
    return value.filter(isUserRole);
  }

  if (isUserRole(value)) {
    return [value];
  }

  return [];
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
