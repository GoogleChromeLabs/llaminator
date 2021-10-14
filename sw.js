/*
 * Copyright 2021 Google Inc. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

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
