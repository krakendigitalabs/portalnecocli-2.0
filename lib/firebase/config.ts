export type FirebaseWebConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

const publicFirebaseEnv = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
} as const;

function normalizeEnvValue(value: string | undefined): string {
  return value?.trim() ?? "";
}

export const firebaseConfig: FirebaseWebConfig = {
  apiKey: normalizeEnvValue(publicFirebaseEnv.apiKey),
  authDomain: normalizeEnvValue(publicFirebaseEnv.authDomain),
  projectId: normalizeEnvValue(publicFirebaseEnv.projectId),
  storageBucket: normalizeEnvValue(publicFirebaseEnv.storageBucket),
  messagingSenderId: normalizeEnvValue(publicFirebaseEnv.messagingSenderId),
  appId: normalizeEnvValue(publicFirebaseEnv.appId),
};

export const firestoreCommercialHomePath =
  process.env.FIRESTORE_COMMERCIAL_HOME_PATH?.trim() || "portal/content/home";

export const firebasePublicEnvLabels = {
  apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  storageBucket: "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  messagingSenderId: "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
} as const;

type FirebaseConfigKey = keyof FirebaseWebConfig;

export function getMissingFirebasePublicConfig(): string[] {
  return (Object.keys(firebaseConfig) as FirebaseConfigKey[])
    .filter((key) => firebaseConfig[key].length === 0)
    .map((key) => firebasePublicEnvLabels[key]);
}

export function hasFirebasePublicConfig(): boolean {
  return getMissingFirebasePublicConfig().length === 0;
}

export function assertFirebasePublicConfig(): FirebaseWebConfig {
  const missingEnv = getMissingFirebasePublicConfig();

  if (missingEnv.length > 0) {
    throw new Error(
      `Missing Firebase public config: ${missingEnv.join(", ")}`,
    );
  }

  return firebaseConfig;
}
