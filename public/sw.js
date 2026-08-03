const CACHE = "saveflux-v1";

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.add("/")));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => self.clients.claim());

self.addEventListener("fetch", (e) => {
  // Never intercept API or download requests — streaming responses
  // cannot be passed through e.respondWith() and will crash the SW.
  if (e.request.url.includes("/api/")) return;

  if (e.request.method !== "GET") return;

  e.respondWith(
    fetch(e.request)
      .then((r) => r)
      .catch(() =>
        caches.match(e.request)
          .then((cached) => cached || caches.match("/"))
          .then((r) => r || new Response("Offline", { status: 503 }))
      )
  );
});