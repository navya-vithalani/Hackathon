const CACHE_NAME = 'hivai-shell-v2';
const APP_SHELL = [
  '/',
  '/offline.html',
];
const PRIVATE_PATHS = ['/app', '/auth', '/login', '/signup', '/verify-email', '/forgot-password', '/reset-password'];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await Promise.all(APP_SHELL.map(async (url) => {
      try {
        const response = await fetch(url, { cache: 'reload' });
        if (response.ok) await cache.put(url, response);
      } catch {}
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => (key.startsWith('hivai-') || key.startsWith('evently-')) && key !== CACHE_NAME)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    const isPrivatePage = PRIVATE_PATHS.some((path) => url.pathname === path || url.pathname.startsWith(`${path}/`));
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok && !isPrivatePage) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        }
        return response;
      } catch {
        if (isPrivatePage) return await caches.match('/offline.html');
        return await caches.match(request) || await caches.match('/offline.html');
      }
    })());
    return;
  }

  if (url.pathname.startsWith('/_next/static/') || url.pathname === '/icon.svg' || url.pathname === '/manifest.webmanifest') {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      const response = await fetch(request);
      if (response.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    })());
  }
});