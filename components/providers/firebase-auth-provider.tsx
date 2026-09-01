"use client";

import type { IdTokenResult, User } from "firebase/auth";
import { onIdTokenChanged, signOut } from "firebase/auth";
import { createContext, useEffect, useMemo, useState } from "react";
import { getPrimaryRole, resolveAuthorizationFromClaims } from "@/lib/auth/roles";
import { clearServerSession, syncServerSession } from "@/lib/auth/session-client";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { hasFirebasePublicConfig } from "@/lib/firebase/config";
import type { AuthSession, AuthUser } from "@/types/auth";

type FirebaseAuthContextValue = AuthSession;

export const FirebaseAuthContext = createContext<FirebaseAuthContextValue>({
  status: "loading",
  user: null,
  hasFirebaseConfig: false,
});

type FirebaseAuthProviderProps = {
  children: React.ReactNode;
};

function mapAuthUser(tokenResult: IdTokenResult, firebaseUser: User): AuthUser {
  const claims = tokenResult.claims as Record<string, unknown>;
  const authorization = resolveAuthorizationFromClaims(claims);

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified,
    roles: authorization.roles,
    primaryRole: getPrimaryRole(authorization.roles),
    claimsSource: authorization.source,
    tenantId: authorization.scope.tenantId,
    scope: authorization.scope,
  };
}

export function FirebaseAuthProvider({ children }: FirebaseAuthProviderProps) {
  const [session, setSession] = useState<AuthSession>(() => {
    const hasConfig = hasFirebasePublicConfig();

    return {
      status: hasConfig ? "loading" : "unconfigured",
      user: null,
      hasFirebaseConfig: hasConfig,
    };
  });

  useEffect(() => {
    if (!hasFirebasePublicConfig()) {
      setSession({
        status: "unconfigured",
        user: null,
        hasFirebaseConfig: false,
      });

      return undefined;
    }

    const auth = getFirebaseAuth();

    if (!auth) {
      setSession({
        status: "unconfigured",
        user: null,
        hasFirebaseConfig: false,
      });

      return undefined;
    }

    const unsubscribe = onIdTokenChanged(auth, (firebaseUser) => {
      void (async () => {
        if (!firebaseUser) {
          try {
            await clearServerSession();
          } catch (error) {
            console.error("Failed to clear server session.", { error });
          }

          setSession({
            status: "unauthenticated",
            user: null,
            hasFirebaseConfig: true,
          });

          return;
        }

        try {
          const tokenResult = await firebaseUser.getIdTokenResult();

          await syncServerSession(tokenResult.token);

          setSession({
            status: "authenticated",
            user: mapAuthUser(tokenResult, firebaseUser),
            hasFirebaseConfig: true,
          });
        } catch (error) {
          console.error("Failed to refresh authenticated server session.", {
            error,
          });

          await signOut(auth);
        }
      })();
    });

    return unsubscribe;
  }, []);

  const contextValue = useMemo(() => session, [session]);

  return (
    <FirebaseAuthContext.Provider value={contextValue}>{children}</FirebaseAuthContext.Provider>
  );
}
