// public/service-worker.js
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('v1').then((cache) => {
            return cache.addAll([
                '/',
                '/calendar',
                '/data/locations.json',
                '/data/activities.json',
                '/localisation/calendar.json',
                '/localisation/map.json',
                '/localisation/base.json'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            // Cache hit - return response
            if (response) {
                return response;
            }

            return fetch(event.request).then((response) => {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone the response
                const responseToCache = response.clone();

                caches.open('v1').then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            });
        })
    );
});