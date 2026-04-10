import "client-only";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";

function requireFirebaseAuth() {
  const auth = getFirebaseAuth();

  if (!auth) {
    throw new Error("Firebase Auth is not configured.");
  }

  return auth;
}

export async function signInWithEmailPassword(
  email: string,
  password: string,
) {
  return signInWithEmailAndPassword(requireFirebaseAuth(), email, password);
}

export async function sendPasswordReset(email: string) {
  return sendPasswordResetEmail(requireFirebaseAuth(), email);
}

export async function signOutCurrentUser() {
  return signOut(requireFirebaseAuth());
}
