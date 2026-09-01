import "server-only";
import { type App, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { type Auth, getAuth } from "firebase-admin/auth";

type FirebaseAdminConfig = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

const firebaseAdminEnv = {
  projectId:
    process.env.FIREBASE_ADMIN_PROJECT_ID?.trim() ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ||
    "",
  clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim() || "",
  privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.trim() || "",
} as const;

function normalizePrivateKey(value: string): string {
  return value.replace(/\\n/g, "\n");
}

export function getFirebaseAdminProjectId(): string {
  return firebaseAdminEnv.projectId;
}

export function getFirebaseAdminConfig(): FirebaseAdminConfig {
  const privateKey = normalizePrivateKey(firebaseAdminEnv.privateKey);

  if (!firebaseAdminEnv.projectId || !firebaseAdminEnv.clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase Admin config: FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY",
    );
  }

  return {
    projectId: firebaseAdminEnv.projectId,
    clientEmail: firebaseAdminEnv.clientEmail,
    privateKey,
  };
}

export function hasFirebaseAdminConfig(): boolean {
  return (
    firebaseAdminEnv.projectId.length > 0 &&
    firebaseAdminEnv.clientEmail.length > 0 &&
    firebaseAdminEnv.privateKey.length > 0
  );
}

export function getFirebaseAdminDiagnostics() {
  return {
    hasConfig: hasFirebaseAdminConfig(),
    projectId: firebaseAdminEnv.projectId,
    hasClientEmail: firebaseAdminEnv.clientEmail.length > 0,
    hasPrivateKey: firebaseAdminEnv.privateKey.length > 0,
  };
}

export function getFirebaseAdminApp(): App {
  if (getApps().length > 0) {
    return getApp();
  }

  const config = getFirebaseAdminConfig();

  return initializeApp({
    credential: cert(config),
    projectId: config.projectId,
  });
}

export function getFirebaseAdminAuth(): Auth {
  return getAuth(getFirebaseAdminApp());
}
