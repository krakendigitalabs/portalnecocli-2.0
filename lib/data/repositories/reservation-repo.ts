import "server-only";
import { getFirestore } from "firebase-admin/firestore";
import { getFirebaseAdminApp } from "@/lib/firebase/admin";
import { Reservation, ReservationSchema } from "@/lib/validations/schemas";

const COLLECTION_NAME = "reservations";

function getDb() {
  return getFirestore(getFirebaseAdminApp());
}

export const ReservationRepo = {
  /**
   * Crea una nueva reserva (CASE_A o CASE_B)
   */
  async createReservation(data: Omit<Reservation, "id" | "createdAt" | "updatedAt">): Promise<string> {
    const db = getDb();
    const newDocRef = db.collection(COLLECTION_NAME).doc();
    
    const reservationData: Reservation = {
      ...data,
      id: newDocRef.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Validar esquema estructuralmente
    const validatedData = ReservationSchema.parse(reservationData);
    
    await newDocRef.set(validatedData);
    return newDocRef.id;
  },

  /**
   * Obtiene una reserva por ID
   */
  async getReservation(id: string): Promise<Reservation | null> {
    const db = getDb();
    const docSnap = await db.collection(COLLECTION_NAME).doc(id).get();
    if (!docSnap.exists) return null;
    
    const data = docSnap.data();
    return ReservationSchema.parse({
      ...data,
      reservationDate: data?.reservationDate?.toDate(),
      createdAt: data?.createdAt?.toDate(),
      updatedAt: data?.updatedAt?.toDate(),
    });
  },

  /**
   * Obtiene las reservas asociadas a un cliente (customer)
   */
  async getReservationsByCustomer(customerId: string): Promise<Reservation[]> {
    const db = getDb();
    const querySnapshot = await db.collection(COLLECTION_NAME).where("customerId", "==", customerId).get();
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return ReservationSchema.parse({
        ...data,
        reservationDate: data?.reservationDate?.toDate(),
        createdAt: data?.createdAt?.toDate(),
        updatedAt: data?.updatedAt?.toDate(),
      });
    });
  },

  /**
   * Obtiene las reservas de un negocio (CASE_B)
   */
  async getReservationsByBusiness(businessId: string): Promise<Reservation[]> {
    const db = getDb();
    const querySnapshot = await db.collection(COLLECTION_NAME).where("businessId", "==", businessId).get();
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return ReservationSchema.parse({
        ...data,
        reservationDate: data?.reservationDate?.toDate(),
        createdAt: data?.createdAt?.toDate(),
        updatedAt: data?.updatedAt?.toDate(),
      });
    });
  },

  /**
   * Actualiza el estado o datos de la reserva
   */
  async updateReservation(id: string, data: Partial<Omit<Reservation, "id" | "createdAt">>): Promise<void> {
    const db = getDb();
    await db.collection(COLLECTION_NAME).doc(id).update({
      ...data,
      updatedAt: new Date(),
    });
  }
};
