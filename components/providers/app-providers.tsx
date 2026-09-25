"use client";

import { FavoritesProvider } from "@/components/providers/favorites-provider";
import { FirebaseAuthProvider } from "@/components/providers/firebase-auth-provider";
import { ReactQueryProvider } from "@/lib/data/query-client";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReactQueryProvider>
      <FirebaseAuthProvider>
        <FavoritesProvider>{children}</FavoritesProvider>
      </FirebaseAuthProvider>
    </ReactQueryProvider>
  );
}
