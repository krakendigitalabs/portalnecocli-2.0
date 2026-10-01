"use client";

import { useState, useEffect, useRef } from "react";
import { collection, query, onSnapshot, orderBy, where } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import type { Ride } from "@/types/ride";

/**
 * Hook para escuchar las carreras disponibles en tiempo real.
 * En producción, esto debería filtrar por conductor o mostrar solo OPEN.
 */
export function useAvailableRides(driverId: string) {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const prevCountRef = useRef(0);

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

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const liveRides: Ride[] = [];
        let openCount = 0;

        snapshot.forEach((doc) => {
          const data = doc.data() as Omit<Ride, "id">;
          const ride = { id: doc.id, ...data };

          // Filtrar en memoria para evitar requerir index compuesto inmediatamente
          if (
            ride.status === "OPEN" ||
            (ride.driver_id === driverId && ride.status !== "COMPLETED")
          ) {
            liveRides.push(ride);
            if (ride.status === "OPEN") openCount++;
          }
        });

        setRides(liveRides);
        setLoading(false);

        // Si hay más carreras OPEN que antes, reproducimos sonido y vibración
        if (openCount > prevCountRef.current) {
          try {
            // 1. Vibración más intensa: corto, pausa, largo
            if (typeof window !== "undefined" && navigator.vibrate) {
              navigator.vibrate([200, 100, 400]);
            }

            // 2. Doble Ping (Estilo Uber)
            if (typeof window !== "undefined") {
              const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
              if (AudioContext) {
                const ctx = (window as any).globalAudioContext || new AudioContext();
                if (ctx.state === "suspended") ctx.resume();

                const playPing = (startTime: number) => {
                  const osc = ctx.createOscillator();
                  const gain = ctx.createGain();
                  osc.connect(gain);
                  gain.connect(ctx.destination);

                  osc.type = "sine";
                  // Frecuencia alta y brillante
                  osc.frequency.setValueAtTime(1046.5, startTime); // C6
                  osc.frequency.exponentialRampToValueAtTime(1318.51, startTime + 0.1); // E6

                  // Envolvente de volumen (ataque rápido, decaimiento suave)
                  gain.gain.setValueAtTime(0, startTime);
                  gain.gain.linearRampToValueAtTime(1, startTime + 0.05);
                  gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

                  osc.start(startTime);
                  osc.stop(startTime + 0.35);
                };

                // Tocar dos veces con 0.3s de diferencia
                playPing(ctx.currentTime);
                playPing(ctx.currentTime + 0.3);
              }
            }
          } catch (e) {
            console.log("Audio/Vibration API blocked or unavailable", e);
          }
        }
        prevCountRef.current = openCount;
      },
      (error) => {
        // Silenciamos el error en consola para evitar el overlay rojo de Next.js en desarrollo.
        // Firebase devolverá 'Missing or insufficient permissions' si el conductor no está activo.
        setLoading(false);
      },
    );

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

    let unsubscribeSnapshot: (() => void) | undefined;

    import("firebase/auth").then(({ getAuth, onAuthStateChanged }) => {
      const auth = getAuth();
      const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
        if (user) {
          const ridesRef = collection(db, "rides");
          const q = query(ridesRef, where("client_uid", "==", clientUid));

          unsubscribeSnapshot = onSnapshot(
            q,
            (snapshot) => {
              const customerRides: Ride[] = [];
              snapshot.forEach((doc) => {
                const data = doc.data() as Omit<Ride, "id">;
                customerRides.push({ id: doc.id, ...data });
              });
              customerRides.sort(
                (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
              );
              setRides(customerRides);
              setLoading(false);
            },
            (error) => {
              setLoading(false);
            },
          );
        }
      });

      return () => {
        unsubscribeAuth();
        if (unsubscribeSnapshot) unsubscribeSnapshot();
      };
    });
  }, [clientUid]);

  return { rides, loading };
}
