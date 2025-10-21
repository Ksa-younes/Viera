// Import Workbox from a CDN
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  // Set a name for the caches
  workbox.core.setCacheNameDetails({
    prefix: 'viera-app',
    suffix: 'v1',
    precache: 'precache',
    runtime: 'runtime-cache'
  });

  // Let Workbox take control of the page as soon as the SW is activated.
  workbox.core.clientsClaim();
  workbox.core.skipWaiting();

  // Caching strategy for navigation requests (the HTML page)
  // NetworkFirst ensures users get the latest version if online,
  // but can still access the app from cache if offline.
  workbox.routing.registerRoute(
    ({ request }) => request.mode === 'navigate',
    new workbox.strategies.NetworkFirst({
      cacheName: 'viera-app-pages',
      plugins: [
        new workbox.cacheable_response.CacheableResponsePlugin({
          statuses: [200],
        }),
      ],
    })
  );

  // Caching strategy for JavaScript, CSS, and worker files.
  // StaleWhileRevalidate serves from cache first for speed, then updates in the background.
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'worker',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'viera-app-static-resources',
    })
  );

  // Caching strategy for images (from catbox.moe and other image hosts).
  // CacheFirst is ideal for images. We expire them after 30 days or 100 entries
  // to manage cache size.
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'viera-app-images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 150, // Cache up to 150 images
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
        new workbox.cacheable_response.CacheableResponsePlugin({
          statuses: [0, 200], // Cache opaque responses (for no-cors requests)
        }),
      ],
    })
  );

  // Caching strategy for Google Fonts.
  // The stylesheet is updated regularly, so we use StaleWhileRevalidate.
  workbox.routing.registerRoute(
    ({ url }) => url.hostname === 'fonts.googleapis.com',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'viera-app-google-fonts-stylesheets',
    })
  );

  // The font files themselves are versioned and rarely change.
  // CacheFirst is the best strategy here.
  workbox.routing.registerRoute(
    ({ url }) => url.hostname === 'fonts.gstatic.com',
    new workbox.strategies.CacheFirst({
      cacheName: 'viera-app-google-fonts-webfonts',
      plugins: [
        new workbox.cacheable_response.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 365, // Cache fonts for a year
          maxEntries: 30,
        }),
      ],
    })
  );
  
  // A smart strategy for Supabase API calls
  // NetworkFirst ensures data is fresh, but provides a fallback if offline
  // NOTE: This only caches GET requests. POST/PATCH/DELETE will always go to the network.
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://risbzaauijeynwfigssg.supabase.co',
    new workbox.strategies.NetworkFirst({
        cacheName: 'viera-app-api-data',
        networkTimeoutSeconds: 3, // Fallback to cache if network is slow
        plugins: [
            new workbox.expiration.ExpirationPlugin({
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5 minutes
            }),
            new workbox.cacheable_response.CacheableResponsePlugin({
                statuses: [200],
            }),
        ],
    })
  );


} else {
  console.log(`Boo! Workbox didn't load 😬`);
}