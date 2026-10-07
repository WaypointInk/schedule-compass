// Schedule Compass offline support.
// The app itself is cached on install so it opens with no internet.
// Fonts and the photo-reading engine are cached the first time they load.
const VERSION = 'sc-1.0.6';
const APP = ['./', './index.html', './manifest.webmanifest', './privacy.html', './support.html',
  './icon-192.png', './icon-512.png'];
const RUNTIME_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdn.jsdelivr.net', 'tessdata.projectnaptha.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(APP)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== 'sc-runtime').map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // app files: cache first, refresh in the background
    e.respondWith(caches.match(req, {ignoreSearch: true}).then(hit => {
      const net = fetch(req).then(res => { if (res.ok) caches.open(VERSION).then(c => c.put(req, res.clone())); return res; }).catch(() => hit);
      return hit || net;
    }));
  } else if (RUNTIME_HOSTS.includes(url.hostname)) {
    e.respondWith(caches.open('sc-runtime').then(c => c.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok || res.type === 'opaque') c.put(req, res.clone());
      return res;
    }))));
  }
});
