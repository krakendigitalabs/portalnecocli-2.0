import "server-only";
import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import { Profile, ProfileSchema } from "@/lib/validations/schemas";

const COLLECTION_NAME = "profiles";

function getDb() {
  return getFirestore(getFirebaseAdminApp());
}

export const ProfileRepo = {
  /**
   * Crea o reemplaza un perfil. Valida con Zod antes de guardar.
   */
  async createProfile(uid: string, data: Omit<Profile, "uid" | "createdAt" | "updatedAt">): Promise<void> {
    const db = getDb();
    const profileData: Profile = {
      ...data,
      uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Validar con el esquema
    const validatedData = ProfileSchema.parse(profileData);
    
    await db.collection(COLLECTION_NAME).doc(uid).set(validatedData);
  },

  /**
   * Obtiene un perfil por UID.
   */
  async getProfile(uid: string): Promise<Profile | null> {
    const db = getDb();
    const docSnap = await db.collection(COLLECTION_NAME).doc(uid).get();
    
    if (docSnap.exists) {
      const data = docSnap.data();
      const parsedData = {
        ...data,
        createdAt: data?.createdAt?.toDate(),
        updatedAt: data?.updatedAt?.toDate(),
      };
      return ProfileSchema.parse(parsedData);
    }
    return null;
  },

  /**
   * Actualiza datos parciales de un perfil.
   */
  async updateProfile(uid: string, data: Partial<Omit<Profile, "uid" | "createdAt">>): Promise<void> {
    const db = getDb();
    const updateData = {
      ...data,
      updatedAt: new Date(),
    };
    await db.collection(COLLECTION_NAME).doc(uid).update(updateData);
  }
};
