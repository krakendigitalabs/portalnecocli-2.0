import "client-only";
import {
  GoogleAuthProvider,
  type User,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type Auth,
} from "firebase/auth";
import { clearServerSession, syncServerSession } from "@/lib/auth/session-client";
import { getFirebaseAuth } from "@/lib/firebase/client";

function requireFirebaseAuth() {
  const auth = getFirebaseAuth();

  if (!auth) {
    throw new Error("Firebase Auth is not configured.");
  }

  return auth;
}

async function persistServerSession(auth: Auth, user: User) {
  const idToken = await user.getIdToken();

  try {
    await syncServerSession(idToken);
  } catch (error) {
    await signOut(auth);
    throw error;
  }
}

export async function signInWithEmailPassword(
  email: string,
  password: string,
) {
  const auth = requireFirebaseAuth();
  const credentials = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );

  await persistServerSession(auth, credentials.user);

  return credentials;
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({
    prompt: "select_account",
  });

  const auth = requireFirebaseAuth();
  const credentials = await signInWithPopup(auth, provider);

  await persistServerSession(auth, credentials.user);

  return credentials;
}

export async function sendPasswordReset(email: string) {
  return sendPasswordResetEmail(requireFirebaseAuth(), email);
}

export async function signOutCurrentUser() {
  let sessionError: Error | null = null;

  try {
    await clearServerSession();
  } catch (error) {
    sessionError =
      error instanceof Error
        ? error
        : new Error("No fue posible cerrar la sesión del servidor.");
  }

  await signOut(requireFirebaseAuth());

  if (sessionError) {
    throw sessionError;
  }
}
