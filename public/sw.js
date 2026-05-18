const CACHE = "saveflux-v1";
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.add("/")));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => self.clients.claim());
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then((r) => r)
      .catch(() =>
        caches.match(e.request).then((cached) => cached || caches.match('/')).then((r) => r || new Response('Offline', { status: 503 }))
      )
  );
});