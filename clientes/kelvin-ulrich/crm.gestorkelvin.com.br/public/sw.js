// Service Worker mínimo — só existe pra critérios de instalabilidade do PWA.
// Sem push, sem cache offline.

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(self.clients.claim());
});
