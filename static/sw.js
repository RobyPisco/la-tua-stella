// Retires the service worker of the first version of the site (vite-plugin-pwa, /sw.js).
// Browsers that still run it fetch this file when checking for updates: it clears the old
// caches, unregisters itself and reloads open pages, which then get the current site.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      for (const key of await caches.keys()) await caches.delete(key);
      await self.registration.unregister();
      for (const client of await self.clients.matchAll({ type: 'window' })) client.navigate(client.url);
    })(),
  );
});
