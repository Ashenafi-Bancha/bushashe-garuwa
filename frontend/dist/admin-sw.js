/**
 * The staff app's service worker (only for /admin; the public website has none).
 *
 * It makes the staff area installable and quick to open: the page shell and its
 * files are kept, so the app starts even on a weak connection, and if there is
 * no connection at all it says so instead of showing an error. Requests, bookings
 * and messages (everything under /api) are never kept: staff always see the
 * live data.
 */
const SHELL = 'bg-staff-shell-v1';
const FILES = 'bg-staff-files-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) => cache.addAll(['/admin', '/staff/icon-192.png']))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('bg-staff-') && key !== SHELL && key !== FILES).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

const OFFLINE = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Offline | Bushaashe Garuwa Staff</title></head>
<body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#F4EFE4;font-family:system-ui,sans-serif;color:#1E3A29;text-align:center;padding:24px">
<div><img src="/staff/icon-192.png" width="72" height="72" alt="" style="border-radius:20px"><h1 style="font-size:22px;margin:18px 0 8px">You are offline</h1>
<p style="margin:0 0 20px;color:#4B5C50">The staff area needs the internet to show requests and bookings.</p>
<button onclick="location.reload()" style="border:0;border-radius:999px;background:#3F7D20;color:#fff;font-weight:700;font-size:15px;padding:14px 26px">Try again</button></div></body></html>`;

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  // the staff pages: the newest copy when online, the kept one when not
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) caches.open(SHELL).then((cache) => cache.put('/admin', response.clone()));
          return response;
        })
        .catch(() => caches.match('/admin').then((kept) => kept || new Response(OFFLINE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } }))),
    );
    return;
  }

  // the site's files carry a fingerprint in their name, so a kept copy is always right
  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/staff/')) {
    event.respondWith(
      caches.match(request).then(
        (kept) =>
          kept ||
          fetch(request).then((response) => {
            if (response.ok) caches.open(FILES).then((cache) => cache.put(request, response.clone()));
            return response;
          }),
      ),
    );
  }
});
