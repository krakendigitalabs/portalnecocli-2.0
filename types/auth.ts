export type UserRole = "admin" | "business" | "operator" | "customer";

export type AuthStatus =
  | "loading"
  | "authenticated"
  | "unauthenticated"
  | "unconfigured";

export type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  roles: UserRole[];
};

export type AuthSession = {
  status: AuthStatus;
  user: AuthUser | null;
  hasFirebaseConfig: boolean;
};
