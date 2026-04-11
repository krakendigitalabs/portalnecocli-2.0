import type {
  AuthScope,
  UserRole,
} from "@/types/auth";
import type { BusinessServiceType } from "@/types/featured-business";

export type ScopeRequirement = {
  requireAssignedScope?: boolean;
  tenantId?: string | null;
  businessId?: string;
  businessIds?: string[];
  serviceType?: BusinessServiceType;
  serviceTypes?: BusinessServiceType[];
};

const userRoles: UserRole[] = [
  "super_admin",
  "admin",
  "business",
  "operator",
  "customer",
];
const businessServiceTypes: BusinessServiceType[] = [
  "hotel",
  "restaurante",
  "comercio",
  "transporte",
  "turismo",
  "domicilios",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && userRoles.includes(value as UserRole);
}

function isBusinessServiceType(value: unknown): value is BusinessServiceType {
  return (
    typeof value === "string" &&
    businessServiceTypes.includes(value as BusinessServiceType)
  );
}

function normalizeStringList(value: unknown): string[] {
  if (typeof value === "string") {
    return value
      .split(/[,\s|]+/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (Array.isArray(value)) {
    return value.flatMap(normalizeStringList);
  }

  return [];
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

  if (isRecord(value)) {
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

function normalizeBusinessIds(value: unknown): string[] {
  return Array.from(
    new Set(
      normalizeStringList(value)
        .map((item) => item.toLowerCase())
        .filter(Boolean),
    ),
  );
}

function normalizeServiceTypes(value: unknown): BusinessServiceType[] {
  return Array.from(
    new Set(
      normalizeStringList(value)
        .map((item) => item.toLowerCase())
        .filter(isBusinessServiceType),
    ),
  );
}

function normalizeTenantId(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim().toLowerCase();

  return normalizedValue.length > 0 ? normalizedValue : null;
}

function normalizeBoolean(value: unknown): boolean {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    return value.trim().toLowerCase() === "true";
  }

  return false;
}

export function resolveScopeFromClaims(
  claims: Record<string, unknown>,
  roles: UserRole[],
): AuthScope {
  const portalClaims = isRecord(claims.portal) ? claims.portal : null;
  const scopeClaims = isRecord(claims.scope) ? claims.scope : null;
  const portalScopeClaims =
    portalClaims && isRecord(portalClaims.scope) ? portalClaims.scope : null;

  const tenantId =
    normalizeTenantId(claims.tenant_id) ??
    normalizeTenantId(claims.tenantId) ??
    normalizeTenantId(claims.portal_tenant_id) ??
    normalizeTenantId(portalClaims?.tenantId) ??
    normalizeTenantId(scopeClaims?.tenantId) ??
    normalizeTenantId(portalScopeClaims?.tenantId);

  const businessIds = Array.from(
    new Set([
      ...normalizeBusinessIds(claims.business_ids),
      ...normalizeBusinessIds(claims.businessIds),
      ...normalizeBusinessIds(scopeClaims?.businessIds),
      ...normalizeBusinessIds(portalScopeClaims?.businessIds),
      ...normalizeBusinessIds(portalClaims?.businessIds),
    ]),
  );

  const serviceTypes = Array.from(
    new Set([
      ...normalizeServiceTypes(claims.service_types),
      ...normalizeServiceTypes(claims.serviceTypes),
      ...normalizeServiceTypes(scopeClaims?.serviceTypes),
      ...normalizeServiceTypes(portalScopeClaims?.serviceTypes),
      ...normalizeServiceTypes(portalClaims?.serviceTypes),
    ]),
  );

  const global =
    roles.includes("super_admin") ||
    roles.includes("admin") ||
    normalizeBoolean(claims.global_access) ||
    normalizeBoolean(claims.globalAccess) ||
    normalizeBoolean(scopeClaims?.global) ||
    normalizeBoolean(portalScopeClaims?.global) ||
    normalizeBoolean(portalClaims?.globalAccess);

  return {
    global,
    tenantId,
    businessIds,
    serviceTypes,
  };
}

export function resolveAuthorizationFromClaims(
  claims: Record<string, unknown>,
) {
  const claimCandidates = [
    { source: "roles", value: claims.roles },
    { source: "role", value: claims.role },
    { source: "app_roles", value: claims.app_roles },
    { source: "portal_roles", value: claims.portal_roles },
    {
      source: "portal.roles",
      value:
        isRecord(claims.portal) && claims.portal !== null
          ? claims.portal.roles
          : undefined,
    },
  ];

  for (const candidate of claimCandidates) {
    const roles = normalizeUserRoles(candidate.value);

    if (roles.length > 0) {
      return {
        roles,
        scope: resolveScopeFromClaims(claims, roles),
        source: candidate.source,
      };
    }
  }

  return {
    roles: [] as UserRole[],
    scope: resolveScopeFromClaims(claims, []),
    source: null,
  };
}

export function resolveUserRolesFromClaims(claims: Record<string, unknown>) {
  const resolution = resolveAuthorizationFromClaims(claims);

  return {
    roles: resolution.roles,
    source: resolution.source,
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

export function hasRequiredScope(
  scope: AuthScope,
  requirement?: ScopeRequirement,
): boolean {
  if (!requirement) {
    return true;
  }

  if (scope.global) {
    return true;
  }

  if (scope.tenantId && requirement.tenantId && scope.tenantId !== requirement.tenantId) {
    return false;
  }

  if (
    scope.businessIds.length > 0 &&
    requirement.businessId &&
    !scope.businessIds.includes(requirement.businessId)
  ) {
    return false;
  }

  if (
    scope.businessIds.length > 0 &&
    requirement.businessIds?.length &&
    !requirement.businessIds.some((businessId) =>
      scope.businessIds.includes(businessId),
    )
  ) {
    return false;
  }

  if (
    scope.serviceTypes.length > 0 &&
    requirement.serviceType &&
    !scope.serviceTypes.includes(requirement.serviceType)
  ) {
    return false;
  }

  if (
    scope.serviceTypes.length > 0 &&
    requirement.serviceTypes?.length &&
    !requirement.serviceTypes.some((serviceType) =>
      scope.serviceTypes.includes(serviceType),
    )
  ) {
    return false;
  }

  return true;
}
