// Service Worker that uses stale while revalidate strategy

// import packageJson from '../package.json';
// global.appVersion = packageJson.version;

const OFFLINE_VERSION = 1;

const CURRENT_CACHES = {
    precache: 'static-cache-v' + OFFLINE_VERSION,
    runtime_cache: 'data-cache-v' + OFFLINE_VERSION,
};

const FILES_TO_CACHE = [
    '/index.html',
];

self.addEventListener('install', function (event) {

    console.log('Service Worker Install');
    
    self.skipWaiting();

    event.waitUntil(
        caches.open(CURRENT_CACHES.precache)
        .then(cache => cache.addAll(FILES_TO_CACHE)));
});

self.addEventListener('activate', function (event) {

    console.log('Service Worker Activated...');

    // Delete all caches that aren't named in CURRENT_CACHES.

    var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
        return CURRENT_CACHES[key];
    });

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (expectedCacheNames.indexOf(cacheName) === -1) {
                        // If this cache name isn't present in the array of expected cache names, then delete it.
                        console.log('Deleting out of date cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', function (event) {

    console.log('Service Worker Fetch...');

    if (event.request.url.includes('/launch/')) {
        console.log('Fetch URL ', event.request.url);

        event.respondWith(fetch(event.request).then(function (response) {
            return caches.open(CURRENT_CACHES.runtime_cache).then(function (cache) {
                return cache.put(event.request, response.clone()).then(function () {
                    console.log("Fetching from network for URL ", event.request.url);
                    console.log("Response - ", response);
                    return response;
                });
            });
        }).catch(function () {
            console.log("Serving file from cache from service worker for URL ", event.request.url);
            console.log("Response ", caches.match(event.request));
            return caches.match(event.request)
        })
        );
    } else if ((/fonts.(googleapis|gstatic).com/.test(event.request.url)) || (/static/.test(event.request.url))) {
        console.log('Caching Static Files with URL', event.request.url);

        event.respondWith(
            caches.open(CURRENT_CACHES.precache).then(function (cache) {
                return cache.match(event.request).then(function (response) {
                    return response || fetch(event.request).then(function (response) {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        cache.put(event.request, response.clone());
                        return response;
                    });
                });
            })
        );
    } else {
        console.log("URL without /launch/ found - ", event.request.url);
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    return response || fetch(event.request);
                })
        )
    }
});
