// Service Worker for PWA offline support
const CACHE_NAME = 'quiz-app-v2';
const ASSETS = [
  'index.html',
  'manifest.json',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS).catch(err => {
        console.log('Cache addAll partial failure (some assets may be offline):', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch - network first, fallback to cache
self.addEventListener('fetch', event => {
  // Skip non-GET requests and external CDN scripts
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('cdn.sheetjs.com') || event.request.url.includes('cdn.jsdelivr.net')) {
    // For CDN scripts, use cache first since they rarely change
    event.respondWith(
      caches.match(event.request).then(cached => cached || fetch(event.request))
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const cloned = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
