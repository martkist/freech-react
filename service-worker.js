// Cache name and assets to cache
const cacheName = 'freech-cache-v1';
const assetsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-512x512.png',
  '/build/app-bundle.js',
  '/build/bootstrap.min.js',
  '/build/freech-lib.js',
  '/build/jquery.json-2.4.js',
  '/build/jquery.jsonrpcclient.js',
  '/build/jquery.min.js',
  '/build/JSXTransformer.js',
  '/build/react.js',
  '/build/require.js',
  '/css/bootstrap-theme.min.css',
  '/css/bootstrap.min.css',
  '/css/main.css',
  '/css/paper-theme.css',
  '/fonts/glyphicons-halflings-regular.woff',
  '/fonts/glyphicons-halflings-regular.woff2',
  '/img/bouncing_ball.gif',
  '/img/genericPerson.png',
  '/img/martkist_address.png'
  // Add other assets like CSS, JavaScript, images, etc.
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Fetch event
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.request);
//     })
//   );
// });
