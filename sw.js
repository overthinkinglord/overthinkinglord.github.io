// Simple service worker to pre-cache key assets and serve them from cache
const CACHE_NAME = 'overthinkinglord-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/img/avatar.jpeg',
  '/albums/phosphorus.jpg',
  '/albums/lithium.jpg',
  '/albums/cementary.jpg',
  '/fonts/Montserrat-400.woff2',
  '/fonts/Montserrat-700.woff2',
  '/fonts/Merriweather-400.woff2',
  '/fonts/Merriweather-700.woff2',
  // External icons (cached if CORS allows)
  'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/spotify.svg',
  'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/applemusic.svg',
  'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/soundcloud.svg',
  'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/youtube.svg',
  'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg',
  'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/beatstars.svg',
  'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg',
  'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/genius.svg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
    .then(() => self.clients.claim())
  );
});

// Cache-first strategy with network update
self.addEventListener('fetch', event => {
  const req = event.request;
  // Only handle GET requests
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then(cached => {
      const networkFetch = fetch(req).then(resp => {
        // Put a copy in cache for future visits
        if (resp && resp.status === 200 && req.url.startsWith(self.location.origin)) {
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
        }
        return resp;
      }).catch(() => cached);

      // Serve cached if present, otherwise wait for network
      return cached || networkFetch;
    })
  );
});
