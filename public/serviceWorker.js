/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'dr-mechanic-dash-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/models/model.json',
  '/models/metadata.json',
  '/models/weights.bin',
  '/static/js/main.bundle.js',
  '/static/css/main.css',
  // Add other assets that need to be cached
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Always try network first for model files
        if (event.request.url.includes('/models/')) {
          return fetch(event.request)
            .catch(() => response);
        }
        // For other files, return from cache if available
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
}); 