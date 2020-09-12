importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const { registerRoute } = workbox.routing;
const { CacheFirst, StaleWhileRevalidate } = workbox.strategies;
const { CacheableResponse } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;
const { precacheAndRoute } = workbox.precaching;
const { setCacheNameDetails } = workbox.core;

const version = "ns21";
const versionTest = "Test";

precacheAndRoute([
  { url: '/index.html', revision: version },
  { url: '/img/offline.png', revision: version }
]);

registerRoute(
  // Cache style resources, i.e. CSS files.
  ({ request }) => request.destination === 'style',
  // Use cache but update in the background.
  new CacheFirst({
    // Use a custom cache name.
    cacheName: 'css-cache-' + versionTest,
  })
);

registerRoute(
  // Cache style resources, i.e. CSS files.
  ({ request }) => request.destination === 'script',
  // Use cache but update in the background.
  new CacheFirst({
    // Use a custom cache name.
    cacheName: 'js-cache-' + version,
  })
);


registerRoute(
  // Cache image files.
  ({ request }) => request.destination === 'image',
  // Use the cache if it's available.
  new CacheFirst({
    // Use a custom cache name.
    cacheName: 'image-cache-' + versionTest,
    plugins: [
      new ExpirationPlugin({
        // Cache only 20 images.
        maxEntries: 20,
        // Cache for a maximum of a week.
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ],
  })
);

//clear invalid caches
//clear invalid caches
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => keys.filter((key) => !key.endsWith(versionTest)))
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
  );
});