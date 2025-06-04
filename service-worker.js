self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('gagstock-cache-v1').then((cache) => {
      return cache.addAll(['/', '/index.html', '/favicon.svg']);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});