"use server";

import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getFirebaseAdminApp, hasFirebaseAdminConfig } from "@/lib/firebase/admin";
import type { Ride } from "@/types/ride";
import { calculateRidePricing, isNightRate } from "./ride-service";

export async function updateRideFareAction(rideId: string, newBasePrice: number) {
  if (!hasFirebaseAdminConfig()) throw new Error("Firebase Admin no configurado");
  const db = getFirestore(getFirebaseAdminApp());

  const nightRate = isNightRate();
  const pricing = calculateRidePricing(newBasePrice, nightRate);

  try {
    await db
      .collection("rides")
      .doc(rideId)
      .update({
        ...pricing,
        updated_at: new Date().toISOString(),
      });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function cancelRideAction(
  rideId: string,
  reason: string,
  cancelledBy: "driver" | "customer",
) {
  if (!hasFirebaseAdminConfig()) throw new Error("Firebase Admin no configurado");
  const db = getFirestore(getFirebaseAdminApp());
  const rideRef = db.collection("rides").doc(rideId);

  try {
    await db.runTransaction(async (t) => {
      const rideDoc = await t.get(rideRef);
      if (!rideDoc.exists) throw new Error("La carrera no existe");

      const ride = rideDoc.data() as Ride;
      if (ride.status === "COMPLETED" || ride.status === "CANCELLED") {
        throw new Error("La carrera ya fue finalizada o cancelada");
      }

      t.update(rideRef, {
        status: "CANCELLED",
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString(),
        cancelled_by: cancelledBy,
      });

      // Si tenía conductor asignado, liberarlo
      if (ride.driver_id) {
        const driverRef = db.collection("drivers").doc(ride.driver_id);
        t.update(driverRef, { availability: "online" });
      }
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
