import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import { getFirestore } from "firebase-admin/firestore";

export interface DriverProfile {
  id: string;
  full_name: string;
  vehicle_type: string;
  vehicle_plate: string;
  wallet_balance: number;
  total_rides_completed: number;
  auth_uid?: string;
  [key: string]: any;
}

export async function getDriverProfile(uid: string): Promise<DriverProfile | null> {
  try {
    const db = getFirestore(getFirebaseAdminApp());
    // 1. Buscamos si el ID del documento es igual al auth UID
    const docRef = await db.collection("drivers").doc(uid).get();

    if (docRef.exists) {
      return { id: docRef.id, ...docRef.data() } as DriverProfile;
    }

    // 2. Si no, buscamos por el campo auth_uid
    const q = await db.collection("drivers").where("auth_uid", "==", uid).limit(1).get();
    if (!q.empty) {
      const doc = q.docs[0];
      return { id: doc.id, ...doc.data() } as DriverProfile;
    }

    return null;
  } catch (err) {
    console.error("Error fetching driver profile:", err);
    return null;
  }
}
