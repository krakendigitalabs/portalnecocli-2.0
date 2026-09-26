// sw.js - Service Worker Básico para Neco-Dispatch
self.addEventListener('install', (event) => {
  console.log('[Neco-Dispatch SW] Instalado');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[Neco-Dispatch SW] Activado');
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // PWA mínima: solo deja pasar las peticiones de red normales
  // No cacheamos agresivamente para que el dashboard real-time de Firestore funcione perfecto
  event.respondWith(fetch(event.request));
});
