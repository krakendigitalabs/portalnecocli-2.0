"use client";

import { FirebaseAuthProvider } from "@/components/providers/firebase-auth-provider";

import { ReactQueryProvider } from "@/lib/data/query-client";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ReactQueryProvider>
      <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
    </ReactQueryProvider>
  );
}
