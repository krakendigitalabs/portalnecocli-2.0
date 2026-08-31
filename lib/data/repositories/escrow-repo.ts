import "server-only";
import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import { EscrowTransaction, EscrowTransactionSchema } from "@/lib/validations/schemas";

const COLLECTION_NAME = "escrow_transactions";

function getDb() {
  return getFirestore(getFirebaseAdminApp());
}

export const EscrowRepo = {
  /**
   * Registra una nueva transacción Escrow (recaudo retenido).
   */
  async createTransaction(data: Omit<EscrowTransaction, "id" | "createdAt">): Promise<string> {
    const db = getDb();
    const newDocRef = db.collection(COLLECTION_NAME).doc();
    
    const transactionData: EscrowTransaction = {
      ...data,
      id: newDocRef.id,
      createdAt: new Date(),
    };
    
    // Validar esquema estructuralmente
    const validatedData = EscrowTransactionSchema.parse(transactionData);
    
    await newDocRef.set(validatedData);
    return newDocRef.id;
  },

  /**
   * Obtiene una transacción por su ID.
   */
  async getTransaction(id: string): Promise<EscrowTransaction | null> {
    const db = getDb();
    const docSnap = await db.collection(COLLECTION_NAME).doc(id).get();
    if (!docSnap.exists) return null;
    
    const data = docSnap.data();
    return EscrowTransactionSchema.parse({
      ...data,
      createdAt: data?.createdAt?.toDate(),
      releasedAt: data?.releasedAt?.toDate(),
    });
  },

  /**
   * Obtiene todas las transacciones retenidas o liberadas de un negocio en particular.
   */
  async getTransactionsByBusiness(businessId: string): Promise<EscrowTransaction[]> {
    const db = getDb();
    const querySnapshot = await db.collection(COLLECTION_NAME).where("businessId", "==", businessId).get();
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return EscrowTransactionSchema.parse({
        ...data,
        createdAt: data?.createdAt?.toDate(),
        releasedAt: data?.releasedAt?.toDate(),
      });
    });
  },

  /**
   * Actualiza el estado de la transacción (ej. de "held" a "released").
   */
  async updateTransactionStatus(
    id: string, 
    status: EscrowTransaction["status"], 
    officialTicketUrl?: string
  ): Promise<void> {
    const db = getDb();
    const updateData: any = { status };
    
    if (status === "released") {
      updateData.releasedAt = new Date();
    }
    
    if (officialTicketUrl) {
      updateData.officialTicketUrl = officialTicketUrl;
    }
    
    await db.collection(COLLECTION_NAME).doc(id).update(updateData);
  }
};
