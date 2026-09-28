/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { build, files, version } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;
const CACHE = `sky-${version}`;
// The app itself (scripts, styles, fonts, star data, icons) works offline; pages are cached as visited.
const ASSETS = [...build, ...files.filter((f) => !f.endsWith('og.png'))];

sw.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => sw.skipWaiting()));
});

sw.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => sw.clients.claim()),
  );
});

sw.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      if (ASSETS.includes(url.pathname)) {
        const hit = await cache.match(url.pathname);
        if (hit) return hit;
      }
      // Pages: network first, so new versions show up; fall back to the cached copy offline.
      try {
        const res = await fetch(req);
        if (res.ok && req.mode === 'navigate') cache.put(req, res.clone());
        return res;
      } catch {
        return (await cache.match(req)) ?? Response.error();
      }
    })(),
  );
});
