// Import Workbox from CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  console.log('Yay! Workbox is loaded 🎉');

  // Set a name for the caches
  workbox.core.setCacheNameDetails({
    prefix: 'viera-app',
    suffix: 'v1',
    precache: 'precache',
    runtime: 'runtime-cache'
  });

  // Let Workbox take control of the page as soon as the SW is activated
  workbox.core.clientsClaim();
  workbox.core.skipWaiting();

  // Caching strategy for navigation requests (HTML)
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'viera-app-pages',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [200],
        }),
      ],
    })
  );

  // Caching strategy for JS, CSS, Worker
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'worker',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'viera-app-static-resources',
    })
  );

  // Caching strategy for images
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'viera-app-images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 150,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200], // for opaque/no-cors
        }),
      ],
    })
  );

  // Caching strategy for Google Fonts stylesheet
  workbox.routing.registerRoute(
    ({ url }) => url.hostname === 'fonts.googleapis.com',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'viera-app-google-fonts-stylesheets',
    })
  );

  // Caching strategy for Google Fonts font files
  workbox.routing.registerRoute(
    ({ url }) => url.hostname === 'fonts.gstatic.com',
    new workbox.strategies.CacheFirst({
      cacheName: 'viera-app-google-fonts-webfonts',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
          maxEntries: 30,
        }),
      ],
    })
  );

  // Caching strategy for Supabase API calls
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://risbzaauijeynwfigssg.supabase.co',
    new workbox.strategies.NetworkFirst({
      cacheName: 'viera-app-api-data',
      networkTimeoutSeconds: 3,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [200],
        }),
      ],
    })
  );

} else {
  console.log("Boo! Workbox didn't load 😬");
}
