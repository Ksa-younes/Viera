
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

if (workbox) {
  console.log('ksa.younes');

  
  workbox.core.setCacheNameDetails({
    prefix: 'viera-app',
    suffix: 'v1',
    precache: 'precache',
    runtime: 'runtime-cache'
  });

  
  workbox.core.clientsClaim();
  workbox.core.skipWaiting();

  
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

  
  workbox.routing.registerRoute(
    ({ request }) =>
      request.destination === 'script' ||
      request.destination === 'style' ||
      request.destination === 'worker',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'viera-app-static-resources',
    })
  );

  
  workbox.routing.registerRoute(
    ({ request }) => request.destination === 'image',
    new workbox.strategies.CacheFirst({
      cacheName: 'viera-app-images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 150,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200], 
        }),
      ],
    })
  );

  
  workbox.routing.registerRoute(
    ({ url }) => url.hostname === 'fonts.googleapis.com',
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'viera-app-google-fonts-stylesheets',
    })
  );

  
  workbox.routing.registerRoute(
    ({ url }) => url.hostname === 'fonts.gstatic.com',
    new workbox.strategies.CacheFirst({
      cacheName: 'viera-app-google-fonts-webfonts',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxAgeSeconds: 60 * 60 * 24 * 365, 
          maxEntries: 30,
        }),
      ],
    })
  );

 
  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://risbzaauijeynwfigssg.supabase.co',
    new workbox.strategies.NetworkFirst({
      cacheName: 'viera-app-api-data',
      networkTimeoutSeconds: 3,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 5 * 60,
        }),
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [200],
        }),
      ],
    })
  );

} else {
  console.log("ksa.younes");
}
