"use client";

import { createContext, useEffect, useMemo, useState } from "react";
import type { IdTokenResult, User } from "firebase/auth";
import { onIdTokenChanged } from "firebase/auth";
import { normalizeUserRoles } from "@/lib/auth/roles";
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
  const roleClaim = tokenResult.claims.roles ?? tokenResult.claims.role;

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified,
    roles: normalizeUserRoles(roleClaim),
  };
}

export function FirebaseAuthProvider({
  children,
}: FirebaseAuthProviderProps) {
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

    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setSession({
          status: "unauthenticated",
          user: null,
          hasFirebaseConfig: true,
        });

        return;
      }

      const tokenResult = await firebaseUser.getIdTokenResult();

      setSession({
        status: "authenticated",
        user: mapAuthUser(tokenResult, firebaseUser),
        hasFirebaseConfig: true,
      });
    });

    return unsubscribe;
  }, []);

  const contextValue = useMemo(() => session, [session]);

  return (
    <FirebaseAuthContext.Provider value={contextValue}>
      {children}
    </FirebaseAuthContext.Provider>
  );
}
