const CACHE_NAME = 'kartu-soal-v1.7.0';
const assets = [
  './',
  './index.html',
  './manifest.json'
];

// Install Service Worker
self.addEventListener('install', (e) => {
  self.skipWaiting(); // Force update
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assets);
    })
  );
});

// Activate Service Worker
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  return self.clients.claim(); // Claim clients immediately
});

// Fetch events
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cacheRes) => {
      return cacheRes || fetch(e.request);
    })
  );
});
