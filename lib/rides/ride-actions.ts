"use server";

import { getFirebaseAdminApp, hasFirebaseAdminConfig } from "@/lib/firebase/admin";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import {
  validateDriverCanAccept,
  validateDriverCanComplete,
  buildCommissionTransaction,
} from "./ride-service";
import type { Ride } from "@/types/ride";
import type { DriverProfile } from "@/types/driver";

/**
 * Server Action: Un conductor acepta una carrera en estado OPEN.
 * Usa una transacción atómica para asegurar que no haya race conditions.
 */
export async function acceptRideAction(rideId: string, driverId: string) {
  if (!hasFirebaseAdminConfig()) throw new Error("Firebase Admin no configurado");
  const db = getFirestore(getFirebaseAdminApp());

  const rideRef = db.collection("rides").doc(rideId);
  const driverRef = db.collection("drivers").doc(driverId);

  try {
    await db.runTransaction(async (t) => {
      const rideDoc = await t.get(rideRef);
      const driverDoc = await t.get(driverRef);

      if (!rideDoc.exists) throw new Error("La carrera no existe");
      if (!driverDoc.exists) throw new Error("El conductor no existe");

      const ride = { id: rideDoc.id, ...rideDoc.data() } as Ride;
      const driver = { id: driverDoc.id, ...driverDoc.data() } as DriverProfile;

      // 1. Validar reglas de negocio puras
      const validationError = validateDriverCanAccept(driver, ride);
      if (validationError) throw new Error(validationError);

      // 2. Modificar el estado de la carrera
      t.update(rideRef, {
        status: "ACCEPTED",
        driver_id: driver.id,
        driver_name: driver.full_name,
        driver_vehicle: `${driver.vehicle_type} - ${driver.vehicle_plate}`,
        driver_phone: driver.phone,
        accepted_at: new Date().toISOString(),
      });

      // 3. Modificar estado del conductor
      t.update(driverRef, {
        availability: "on_ride",
      });
    });

    return { success: true };
  } catch (error: any) {
    console.error(`[NECO-DISPATCH] Error al aceptar carrera ${rideId}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Server Action: El conductor recoge al pasajero e inicia el viaje.
 * Cambia el estado a IN_PROGRESS.
 */
export async function startRideAction(rideId: string, driverId: string) {
  if (!hasFirebaseAdminConfig()) throw new Error("Firebase Admin no configurado");
  const db = getFirestore(getFirebaseAdminApp());

  const rideRef = db.collection("rides").doc(rideId);

  try {
    await db.runTransaction(async (t) => {
      const rideDoc = await t.get(rideRef);
      if (!rideDoc.exists) throw new Error("La carrera no existe");

      const ride = rideDoc.data() as Ride;
      if (ride.driver_id !== driverId) throw new Error("No eres el conductor de esta carrera");
      if (ride.status !== "ACCEPTED")
        throw new Error("Solo las carreras aceptadas se pueden iniciar");

      t.update(rideRef, {
        status: "IN_PROGRESS",
        started_at: new Date().toISOString(),
      });
    });

    return { success: true };
  } catch (error: any) {
    console.error(`[NECO-DISPATCH] Error al iniciar carrera ${rideId}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Server Action: Un conductor completa una carrera en curso.
 * Ejecuta el cobro de la comisión (10%) de forma atómica.
 */
export async function completeRideAction(rideId: string, driverId: string) {
  if (!hasFirebaseAdminConfig()) throw new Error("Firebase Admin no configurado");
  const db = getFirestore(getFirebaseAdminApp());

  const rideRef = db.collection("rides").doc(rideId);
  const driverRef = db.collection("drivers").doc(driverId);
  const walletTxRef = db.collection("wallet_transactions").doc(); // Genera nuevo ID

  try {
    await db.runTransaction(async (t) => {
      const rideDoc = await t.get(rideRef);
      const driverDoc = await t.get(driverRef);

      if (!rideDoc.exists) throw new Error("La carrera no existe");
      if (!driverDoc.exists) throw new Error("El conductor no existe");

      const ride = { id: rideDoc.id, ...rideDoc.data() } as Ride;
      const driver = { id: driverDoc.id, ...driverDoc.data() } as DriverProfile;

      // 1. Validar reglas puras
      const validationError = validateDriverCanComplete(driver, ride);
      if (validationError) throw new Error(validationError);

      // 2. Cobro de comisión y validación final de saldo (10% fijo)
      const commission = ride.portal_commission; // Ya está calculada al crear la carrera (10%)
      if (driver.wallet_balance < commission) {
        throw new Error("No tienes saldo suficiente para pagar la comisión de esta carrera.");
      }

      const balanceAfter = driver.wallet_balance - commission;

      // 3. Crear transacción de billetera
      const tx = buildCommissionTransaction(driver.id, ride, balanceAfter);
      t.set(walletTxRef, tx);

      // 4. Actualizar carrera a COMPLETED
      t.update(rideRef, {
        status: "COMPLETED",
        completed_at: new Date().toISOString(),
      });

      // 5. Descontar saldo y liberar al conductor
      t.update(driverRef, {
        wallet_balance: FieldValue.increment(-commission),
        availability: "online",
        total_rides_completed: FieldValue.increment(1),
      });
    });

    return { success: true };
  } catch (error: any) {
    console.error(`[NECO-DISPATCH] Error al completar carrera ${rideId}:`, error);
    return { success: false, error: error.message };
  }
}

/**
 * Server Action: El AI (o un admin) crea una nueva carrera.
 */
import { generateRideReference, calculateRidePricing, isNightRate } from "./ride-service";
import { lookupMotocarroTariff } from "./tariff-lookup";
import type { RideStatus, RideSource } from "@/types/ride";

export async function createRideAction(data: {
  origin: string;
  destination: string;
  vehicleType: string;
  clientName: string;
  clientPhone: string;
  clientUid?: string;
  passengerCount: number;
  notes?: string;
  source: string;
  estimatedFare?: number;
}) {
  if (!hasFirebaseAdminConfig()) throw new Error("Firebase Admin no configurado");
  const db = getFirestore(getFirebaseAdminApp());

  // 1. Buscar tarifa oficial base o usar la estimada por el mapa GPS
  const tariff = lookupMotocarroTariff(data.destination);
  const basePrice = data.estimatedFare ? data.estimatedFare : tariff ? tariff.price : 6600;
  const routeKey = tariff ? tariff.route : "urbano";

  // 2. Calcular pricing con regla diurna/nocturna
  const nightRate = isNightRate();
  const pricing = calculateRidePricing(basePrice, nightRate);

  // 3. Ensamblar objeto
  const ride: Omit<Ride, "id"> = {
    origin: data.origin,
    destination: data.destination,
    route_key: routeKey,
    ...pricing,
    client_name: data.clientName,
    client_phone: data.clientPhone,
    client_uid: data.clientUid || undefined,
    status: "OPEN" as RideStatus,
    source: data.source as RideSource,
    created_at: new Date().toISOString(),
    passenger_count: data.passengerCount,
    vehicle_type_requested: data.vehicleType as any,
    notes: data.notes || "",
  };

  try {
    const docRef = db.collection("rides").doc();
    await docRef.set(ride);
    return { success: true, id: docRef.id, ride: { id: docRef.id, ...ride } as Ride };
  } catch (error: any) {
    console.error(`[NECO-DISPATCH] Error al crear carrera:`, error);
    return { success: false, error: error.message };
  }
}
