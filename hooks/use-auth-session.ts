"use client";

import { useContext } from "react";
import { FirebaseAuthContext } from "@/components/providers/firebase-auth-provider";

export function useAuthSession() {
  return useContext(FirebaseAuthContext);
}
