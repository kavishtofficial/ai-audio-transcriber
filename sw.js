
const CACHE_NAME = 'ai-transcriber-pwa-cache-v1';
const APP_SHELL_URLS = [
  './',
  './index.html',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './services/geminiService.ts',
  './components/FileUpload.tsx',
  './components/Icon.tsx',
  './components/ProcessingIndicator.tsx',
  './components/TranscriptDisplay.tsx',
  './components/TranscriptionOptions.tsx'
];

// Install the service worker and cache the app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(APP_SHELL_URLS);
      })
  );
});

// Clean up old caches on activation
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Serve assets from cache, falling back to network
self.addEventListener('fetch', (event) => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request)
        .then((cachedResponse) => {
          // Fetch from network if not in cache
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            // Check if we received a valid response to cache
            if (networkResponse && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              cache.put(event.request, responseToCache);
            }
            return networkResponse;
          });

          // Return cached response if found, otherwise wait for network
          return cachedResponse || fetchPromise;
        });
    })
  );
});
