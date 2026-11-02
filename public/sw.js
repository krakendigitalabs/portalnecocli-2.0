// sw.js - Service Worker Básico para Neco-Dispatch
self.addEventListener("install", (event) => {
  console.log("[Neco-Dispatch SW] Instalado");
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("[Neco-Dispatch SW] Activado");
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);
  const isHttpRequest = requestUrl.protocol === "http:" || requestUrl.protocol === "https:";

  if (event.request.method !== "GET" || !isHttpRequest) {
    return;
  }

  // PWA mínima: passthrough de red con fallback para evitar promesas rechazadas
  event.respondWith(
    fetch(event.request).catch(() => {
      if (event.request.mode === "navigate") {
        return new Response("Sin conexión temporal", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
      }

      return new Response(null, { status: 504, statusText: "Gateway Timeout" });
    }),
  );
});
