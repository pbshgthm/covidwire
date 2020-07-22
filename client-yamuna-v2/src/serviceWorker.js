// Service Worker that uses stale while revalidate strategy

// const STATIC_OFFLINE_VERSION = 1;
// const RUNTIME_OFFILE_VERSION = 1;

// const CURRENT_CACHES = {
//   precache: 'static-cache-v' + STATIC_OFFLINE_VERSION,
//   runtime_cache: 'data-cache-v' + RUNTIME_OFFILE_VERSION,
// };

// const FILES_TO_CACHE = [
//   '/index.css',
//   'logo.svg',
//   '/App.js',
//   '/index.js',
//   '/pages/About.js',
//   '/pages/Team.js',
//   '/assets/back.png',
//   '/assets/down.png',
//   '/assets/global.png',
//   '/assets/instagram.png',
//   '/assets/logo-dark.png',
//   '/assets/logo-icon.png',
//   '/assets/logo.png',
//   '/assets/mail.png',
//   '/assets/menu.png',
//   '/assets/national.png',
//   '/assets/phone.png',
//   '/assets/share.png',
//   '/assets/state.png',
//   '/assets/whatsapp.png',
// ];

// // self.addEventListener('install', function (event) {

// //   console.log('Service Worker Install');

// //   event.waitUntil(
// //     caches.open(CURRENT_CACHES.precache).then(function (cache) {
// //       var cachePromises = FILES_TO_CACHE.map(function (urlToPrefetch) {

// //         var url = new URL(urlToPrefetch);

// //         url.search += (url.search ? '&' : '?') + 'cache-bust=' + Date.now();

// //         var request = new Request(url, { mode: 'no-cors' });
// //         return fetch(request).then(function (response) {
// //           if (response.status >= 400) {
// //             throw new Error('request for ' + urlToPrefetch +
// //               ' failed with status ' + response.statusText);
// //           }

// //           // Use the original URL without the cache-busting parameter as the key for cache.put().
// //           return cache.put(urlToPrefetch, response);
// //         }).catch(function (error) {
// //           console.error('Not caching ' + urlToPrefetch + ' due to ' + error);
// //         });
// //       });

// //       return Promise.all(cachePromises).then(function () {
// //         console.log('Pre-fetching complete.');
// //       });
// //     }).catch(function (error) {
// //       console.error('Pre-fetching failed:', error);
// //     })
// //   );
// // });

// // self.addEventListener('activate', function (event) {

// //   console.log('Service Worker Activated...');

// //   // Delete all caches that aren't named in CURRENT_CACHES.

// //   var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
// //     return CURRENT_CACHES[key];
// //   });

// //   event.waitUntil(
// //     caches.keys().then(function (cacheNames) {
// //       return Promise.all(
// //         cacheNames.map(function (cacheName) {
// //           if (expectedCacheNames.indexOf(cacheName) === -1) {
// //             // If this cache name isn't present in the array of expected cache names, then delete it.
// //             console.log('Deleting out of date cache:', cacheName);
// //             return caches.delete(cacheName);
// //           }
// //         })
// //       );
// //     })
// //   );
// // });

// // self.addEventListener('fetch', function (event) {

// //   console.log('Service Worker Fetch...');

// //   if (event.request.url.includes('/launch/')) {
// //     console.log('Fetch URL ', event.request.url);

// //     event.respondWith(fetch(event.request).then(function (response) {
// //       return caches.open(CURRENT_CACHES.runtime_cache).then(function (cache) {
// //         return cache.put(event.request, response.clone()).then(function () {
// //           return response;
// //         });
// //       });
// //     }).catch(function () {
// //       return caches.match(event.request)
// //     })
// //     );
// //   } else {
// //     event.respondWith(
// //       caches.match(event.request)
// //         .then((response) => {
// //           return response || fetch(event.request);
// //         })
// //     )
// //   }
// // });

// export function register() {

//   window.addEventListener('install', function (event) {

//     console.log('Service Worker Install');

//     event.waitUntil(
//       caches.open(CURRENT_CACHES.precache).then(function (cache) {
//         var cachePromises = FILES_TO_CACHE.map(function (urlToPrefetch) {

//           var url = new URL(urlToPrefetch);

//           url.search += (url.search ? '&' : '?') + 'cache-bust=' + Date.now();

//           var request = new Request(url, { mode: 'no-cors' });
//           return fetch(request).then(function (response) {
//             if (response.status >= 400) {
//               throw new Error('request for ' + urlToPrefetch +
//                 ' failed with status ' + response.statusText);
//             }

//             // Use the original URL without the cache-busting parameter as the key for cache.put().
//             return cache.put(urlToPrefetch, response);
//           }).catch(function (error) {
//             console.error('Not caching ' + urlToPrefetch + ' due to ' + error);
//           });
//         });

//         return Promise.all(cachePromises).then(function () {
//           console.log('Pre-fetching complete.');
//         });
//       }).catch(function (error) {
//         console.error('Pre-fetching failed:', error);
//       })
//     );
//   });

//   window.addEventListener('activate', function (event) {

//     console.log('Service Worker Activated...');

//     // Delete all caches that aren't named in CURRENT_CACHES.

//     var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
//       return CURRENT_CACHES[key];
//     });

//     event.waitUntil(
//       caches.keys().then(function (cacheNames) {
//         return Promise.all(
//           cacheNames.map(function (cacheName) {
//             if (expectedCacheNames.indexOf(cacheName) === -1) {
//               // If this cache name isn't present in the array of expected cache names, then delete it.
//               console.log('Deleting out of date cache:', cacheName);
//               return caches.delete(cacheName);
//             }
//           })
//         );
//       })
//     );
//   });

//   window.addEventListener('fetch', function (event) {

//     console.log('Service Worker Fetch...');

//     if (event.request.url.includes('/launch/')) {
//       console.log('Fetch URL ', event.request.url);

//       event.respondWith(fetch(event.request).then(function (response) {
//         return caches.open(CURRENT_CACHES.runtime_cache).then(function (cache) {
//           return cache.put(event.request, response.clone()).then(function () {
//             return response;
//           });
//         });
//       }).catch(function () {
//         return caches.match(event.request)
//       })
//       );
//     } else {
//       event.respondWith(
//         caches.match(event.request)
//           .then((response) => {
//             return response || fetch(event.request);
//           })
//       )
//     }
//   }); 
// }









// This optional code is used to register a service worker.
// register() is not called by default.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on subsequent visits to a page, after all the
// existing tabs open on the page have been closed, since previously cached
// resources are updated in the background.

// To learn more about the benefits of this model and instructions on how to
// opt-in, read https://bit.ly/CRA-PWA

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
      /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
              'worker. To learn more, visit https://bit.ly/CRA-PWA'
          );
        });
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
      }
    });

    // window.addEventListener('install', function (event) {

    //   console.log('Service Worker Install');

    //   event.waitUntil(
    //     caches.open(CURRENT_CACHES.precache).then(function (cache) {
    //       var cachePromises = FILES_TO_CACHE.map(function (urlToPrefetch) {

    //         var url = new URL(urlToPrefetch);

    //         url.search += (url.search ? '&' : '?') + 'cache-bust=' + Date.now();

    //         var request = new Request(url, { mode: 'no-cors' });
    //         return fetch(request).then(function (response) {
    //           if (response.status >= 400) {
    //             throw new Error('request for ' + urlToPrefetch +
    //               ' failed with status ' + response.statusText);
    //           }

    //           // Use the original URL without the cache-busting parameter as the key for cache.put().
    //           return cache.put(urlToPrefetch, response);
    //         }).catch(function (error) {
    //           console.error('Not caching ' + urlToPrefetch + ' due to ' + error);
    //         });
    //       });

    //       return Promise.all(cachePromises).then(function () {
    //         console.log('Pre-fetching complete.');
    //       });
    //     }).catch(function (error) {
    //       console.error('Pre-fetching failed:', error);
    //     })
    //   );
    // });

    // window.addEventListener('activate', function (event) {

    //   console.log('Service Worker Activated...');

    //   // Delete all caches that aren't named in CURRENT_CACHES.

    //   var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function (key) {
    //     return CURRENT_CACHES[key];
    //   });

    //   event.waitUntil(
    //     caches.keys().then(function (cacheNames) {
    //       return Promise.all(
    //         cacheNames.map(function (cacheName) {
    //           if (expectedCacheNames.indexOf(cacheName) === -1) {
    //             // If this cache name isn't present in the array of expected cache names, then delete it.
    //             console.log('Deleting out of date cache:', cacheName);
    //             return caches.delete(cacheName);
    //           }
    //         })
    //       );
    //     })
    //   );
    // });

    // window.addEventListener('fetch', function (event) {

    //   console.log('Service Worker Fetch...');

    //   if (event.request.url.includes('/launch/')) {
    //     console.log('Fetch URL ', event.request.url);

    //     event.respondWith(fetch(event.request).then(function (response) {
    //       return caches.open(CURRENT_CACHES.runtime_cache).then(function (cache) {
    //         return cache.put(event.request, response.clone()).then(function () {
    //           return response;
    //         });
    //       });
    //     }).catch(function () {
    //       return caches.match(event.request)
    //     })
    //     );
    //   } else {
    //     event.respondWith(
    //       caches.match(event.request)
    //         .then((response) => {
    //           return response || fetch(event.request);
    //         })
    //     )
    //   }
    // }); 
}
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                'New content is available and will be used when all ' +
                  'tabs for this page are closed. See https://bit.ly/CRA-PWA.'
              );

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.');

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}
