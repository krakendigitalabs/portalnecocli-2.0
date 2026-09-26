import type { BusinessServiceType } from "@/types/featured-business";

export type UserRole = "super_admin" | "admin" | "business" | "operator" | "driver" | "customer";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "unconfigured";

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  roles: UserRole[];
  primaryRole: UserRole | null;
  claimsSource: string | null;
  tenantId: string | null;
  scope: AuthScope;
};

export type AuthSession = {
  status: AuthStatus;
  user: AuthUser | null;
  hasFirebaseConfig: boolean;
};

export type AuthScope = {
  global: boolean;
  tenantId: string | null;
  businessIds: string[];
  serviceTypes: BusinessServiceType[];
};
