"use client";

import { useState, useEffect } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import type { Ride } from "@/types/ride";

/**
 * Hook para escuchar las carreras disponibles en tiempo real.
 * En producción, esto debería filtrar por conductor o mostrar solo OPEN.
 */
export function useAvailableRides(driverId: string) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getFirebaseDb();
    if (!db) return;
    const ridesRef = collection(db, "rides");

    // Escuchamos las carreras OPEN, o las que este conductor ya aceptó
    const q = query(
      ridesRef,
      // Idealmente ordenar por created_at desc, pero requiere índice compuesto si usamos 'in'
      orderBy("created_at", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveRides: Ride[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<Ride, "id">;
        const ride = { id: doc.id, ...data };

        // Filtrar en memoria para evitar requerir index compuesto inmediatamente
        if (
          ride.status === "OPEN" ||
          (ride.driver_id === driverId && ride.status !== "COMPLETED")
        ) {
          liveRides.push(ride);
        }
      });
      setRides(liveRides);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [driverId]);

  return { rides, loading };
}

/**
 * Hook para escuchar las carreras de un pasajero específico en tiempo real.
 */
export function useCustomerRides(clientUid: string | undefined) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!clientUid) {
      setRides([]);
      setLoading(false);
      return;
    }

    const db = getFirebaseDb();
    if (!db) return;

    const ridesRef = collection(db, "rides");
    const q = query(ridesRef, orderBy("created_at", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const customerRides: Ride[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data() as Omit<Ride, "id">;
        const ride = { id: doc.id, ...data };

        // Filtramos en memoria (o en query si hay índices)
        if (ride.client_uid === clientUid) {
          customerRides.push(ride);
        }
      });
      setRides(customerRides);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [clientUid]);

  return { rides, loading };
}
