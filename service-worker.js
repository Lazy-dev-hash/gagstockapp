const CACHE_NAME = "gagstock-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "https://cdn.jsdelivr.net/npm/chart.js",
  "https://cdn.lordicon.com/lordicon.js",
  "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js",
  "https://cdn.jsdelivr.net/npm/tsparticles@2/tsparticles.bundle.min.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
