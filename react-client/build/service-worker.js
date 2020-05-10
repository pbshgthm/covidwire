/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

importScripts(
  "/precache-manifest.b7f78267cfcd6584985cd62fabf4e16e.js"
);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerNavigationRoute(workbox.precaching.getCacheKeyForURL("/index.html"), {
  
  blacklist: [/^\/_/,/\/[^/?]+\.[^/]+$/],
});
// Service Worker that uses stale while revalidate strategy

import packageJson from '../src/package.json';
global.appVersion = packageJson.version;

const STATIC_OFFLINE_VERSION = global.appVersion;
const RUNTIME_OFFILE_VERSION = global.appVersion;

const CURRENT_CACHES = {
    precache: 'static-cache-v' + STATIC_OFFLINE_VERSION,
    runtime_cache: 'data-cache-v' + RUNTIME_OFFILE_VERSION,
};

const FILES_TO_CACHE = [
    '/index.css',
    'logo.svg',
    '/App.js',
    '/index.js',
    '/pages/About.js',
    '/pages/Team.js',
    '/assets/back.png',
    '/assets/down.png',
    '/assets/global.png',
    '/assets/instagram.png',
    '/assets/logo-dark.png',
    '/assets/logo-icon.png',
    '/assets/logo.png',
    '/assets/mail.png',
    '/assets/menu.png',
    '/assets/national.png',
    '/assets/phone.png',
    '/assets/share.png',
    '/assets/state.png',
    '/assets/whatsapp.png',
];

self.addEventListener('install', function (event) {

    console.log('Service Worker Install');

    self.skipWaiting();

    event.waitUntil(
        caches.open(CURRENT_CACHES.precache).then(function (cache) {
            var cachePromises = FILES_TO_CACHE.map(function (urlToPrefetch) {

                var url = new URL(urlToPrefetch);

                url.search += (url.search ? '&' : '?') + 'cache-bust=' + Date.now();

                var request = new Request(url, { mode: 'no-cors' });
                return fetch(request).then(function (response) {
                    if (response.status >= 400) {
                        throw new Error('request for ' + urlToPrefetch +
                            ' failed with status ' + response.statusText);
                    }

                    // Use the original URL without the cache-busting parameter as the key for cache.put().
                    return cache.put(urlToPrefetch, response);
                }).catch(function (error) {
                    console.error('Not caching ' + urlToPrefetch + ' due to ' + error);
                });
            });

            return Promise.all(cachePromises).then(function () {
                console.log('Pre-fetching complete.');
            });
        }).catch(function (error) {
            console.error('Pre-fetching failed:', error);
        })
    );
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
            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;    
            }
            return caches.open(CURRENT_CACHES.runtime_cache).then(function (cache) {
                return cache.put(event.request, response.clone()).then(function () {
                    console.log("Fetching from network for URL ", event.request.url);
                    console.log("Response - ", response);
                    return response;
                });
            });
        }).catch(function () {
            console.log("Serving file from cache for URL ", event.request.url);
            return caches.match(event.request)
        })
        );
    } else if (/fonts.(googleapis|gstatic).com/.test(event.request.url)) {
        console.log('Caching Google fonts');

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
