"use client";

import { useEffect } from "react";

/**
 * Componente cliente para registrar el Service Worker de la PWA.
 * Debe incluirse en el RootLayout o en el Layout del Dashboard.
 */
export function PwaRegistry() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[PWA] Service Worker registrado exitosamente:", registration.scope);
        })
        .catch((error) => {
          console.error("[PWA] Error al registrar el Service Worker:", error);
        });
    }
  }, []);

  return null;
}
