const workboxAddr = 'https://storage.googleapis.com/workbox-cdn/releases/6.2.0/workbox-sw.js'; // TODO: host this file in this project?
importScripts(workboxAddr);

const cacheName = 'app-cache';

self.addEventListener('install', function (event) {
  // precache all assets
  event.waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll([
        workboxAddr, // TODO: is this actually necessary?
        '/',
        '/index.html',
        '/index.js',
        '/manifest.json',
        '/sw.js',
      ]);
    }),
  );
});

workbox.routing.registerRoute(
  ({url}) => true,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: cacheName
  })
);
