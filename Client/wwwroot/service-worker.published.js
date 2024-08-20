const CACHE_NAME = 'dynamic-cache-v3';

// Install event - skip waiting and activate the new service worker immediately
self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    self.skipWaiting();  // Immediately activate the new service worker
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Clearing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache or fetch from network and cache dynamically
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((fetchResponse) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, fetchResponse.clone());  // Cache dynamically
                    return fetchResponse;
                });
            });
        }).catch(() => caches.match('/index.html'))  // Fallback to index.html for offline use
    );
});

// Listen for the 'message' event to skip waiting and reload the page on update
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Force the page to reload when there's an update
self.addEventListener('controllerchange', () => {
    window.location.reload();
});
