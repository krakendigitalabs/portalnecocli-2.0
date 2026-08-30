import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig, hasFirebasePublicConfig } from "./config";

// Inicializar la app de Firebase Web (compatible tanto con SSR como en Cliente)
// Evitamos inicializar múltiples veces con getApps().length
const app = getApps().length === 0 && hasFirebasePublicConfig()
  ? initializeApp(firebaseConfig)
  : getApp();

// Exportamos la instancia de db para que sea consumida por la capa de datos
export const db = getFirestore(app);
