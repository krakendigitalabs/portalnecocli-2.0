import "client-only";
import { getApp, getApps, initializeApp, type FirebaseApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  type Auth,
} from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";
import {
  firebaseConfig,
  getMissingFirebasePublicConfig,
  hasFirebasePublicConfig,
} from "@/lib/firebase/config";

let firebaseAppInstance: FirebaseApp | null = null;
let firebaseAuthInstance: Auth | null = null;
let firebaseFirestoreInstance: Firestore | null = null;
let firebaseStorageInstance: FirebaseStorage | null = null;
let persistenceConfigured = false;

function configureAuthPersistence(auth: Auth) {
  if (persistenceConfigured || typeof window === "undefined") {
    return;
  }

  persistenceConfigured = true;

  void setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Failed to set Firebase auth persistence.", { error });
  });
}

export function getFirebaseApp(): FirebaseApp | null {
  if (!hasFirebasePublicConfig()) {
    return null;
  }

  if (firebaseAppInstance) {
    return firebaseAppInstance;
  }

  firebaseAppInstance = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

  return firebaseAppInstance;
}

export function getFirebaseAuth(): Auth | null {
  const app = getFirebaseApp();

  if (!app) {
    return null;
  }

  if (!firebaseAuthInstance) {
    firebaseAuthInstance = getAuth(app);
    configureAuthPersistence(firebaseAuthInstance);
  }

  return firebaseAuthInstance;
}

export function getFirebaseDb(): Firestore | null {
  const app = getFirebaseApp();

  if (!app) {
    return null;
  }

  if (!firebaseFirestoreInstance) {
    firebaseFirestoreInstance = getFirestore(app);
  }

  return firebaseFirestoreInstance;
}

export function getFirebaseStorage(): FirebaseStorage | null {
  const app = getFirebaseApp();

  if (!app) {
    return null;
  }

  if (!firebaseStorageInstance) {
    firebaseStorageInstance = getStorage(app);
  }

  return firebaseStorageInstance;
}

export function getFirebaseDiagnostics() {
  return {
    hasConfig: hasFirebasePublicConfig(),
    missingConfig: getMissingFirebasePublicConfig(),
    appReady: getFirebaseApp() !== null,
    authReady: getFirebaseAuth() !== null,
    firestoreReady: getFirebaseDb() !== null,
    storageReady: getFirebaseStorage() !== null,
  };
}
