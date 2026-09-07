import "server-only";
import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";

export type CustomerFavorite = {
  id: string;
  customer_id: string;
  business_id: string;
  created_at: string;
};

function getDb() {
  return getFirestore(getFirebaseAdminApp());
}

/**
 * Obtiene los favoritos de un turista.
 */
export async function getCustomerFavorites(customerId: string): Promise<CustomerFavorite[]> {
  try {
    const db = getDb();
    const snap = await db
      .collection("customer_favorites")
      .where("customer_id", "==", customerId)
      .get();

    return snap.docs.map((doc) => doc.data() as CustomerFavorite);
  } catch (error) {
    console.error("Error obteniendo favoritos:", error);
    return [];
  }
}

/**
 * Agrega un negocio a los favoritos de un turista.
 */
export async function addFavorite(customerId: string, businessId: string): Promise<CustomerFavorite | null> {
  try {
    const db = getDb();
    
    // Primero verificamos que no exista
    const snap = await db
      .collection("customer_favorites")
      .where("customer_id", "==", customerId)
      .where("business_id", "==", businessId)
      .get();
      
    if (!snap.empty) {
      return snap.docs[0].data() as CustomerFavorite;
    }
    
    const docRef = db.collection("customer_favorites").doc();
    const favorite: CustomerFavorite = {
      id: docRef.id,
      customer_id: customerId,
      business_id: businessId,
      created_at: new Date().toISOString(),
    };
    
    await docRef.set(favorite);
    return favorite;
  } catch (error) {
    console.error("Error agregando favorito:", error);
    return null;
  }
}

/**
 * Elimina un negocio de los favoritos de un turista.
 */
export async function removeFavorite(customerId: string, businessId: string): Promise<boolean> {
  try {
    const db = getDb();
    const snap = await db
      .collection("customer_favorites")
      .where("customer_id", "==", customerId)
      .where("business_id", "==", businessId)
      .get();
      
    if (snap.empty) {
      return true;
    }
    
    const batch = db.batch();
    snap.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error("Error eliminando favorito:", error);
    return false;
  }
}
