const CACHE = 'ufr-studio-v43';
const ASSETS = [
  './', './index.html', './profile.html', './admin.html', './editor.html', './check.html',
  './ANATOMY-SOURCES.txt',
  './pelvis-atlas.webp', './pelvis-atlas-750.webp',
  './uterus-atlas.webp', './uterus-atlas-750.webp',
  './external-atlas.webp', './external-atlas-750.webp'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith('ufr-studio-') && key !== CACHE).map(key => caches.delete(key))
  )).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const {request} = event;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try {
      const response = await fetch(request);
      if (response.ok) {
        try {
          await cache.put(request, response.clone());
        } catch (error) {
          console.warn('Could not cache', request.url, error);
        }
      }
      return response;
    } catch {
      return await cache.match(request)
        || (request.mode === 'navigate' ? await cache.match(request, {ignoreSearch: true}) : undefined)
        || Response.error();
    }
  })());
});
