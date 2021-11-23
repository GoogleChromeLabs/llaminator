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

const mainDBName = 'appDB';
const objStoreName = 'imageStore';
const mainImageName = 'mainImage';

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
  ({url}) => url.pathname === '/share-target',
  async ({request}) => {
    const data = await request.formData();

    if (!indexedDB) { /* TODO: display error message */ }

    let dbOpenRequest = null;
    await new Promise((resolve, reject) => {
      // TODO: consider using https://github.com/jakearchibald/idb
      dbOpenRequest = indexedDB.open(mainDBName);
      dbOpenRequest.addEventListener('success', () => {
        console.log('Database initialized');
        resolve();
      });
      dbOpenRequest.addEventListener('error', (e) => {
        console.log('error loading db:', e);
        // TODO: display error
        reject();
      });
      dbOpenRequest.addEventListener('upgradeneeded', (e) => {
        console.log(`DB update request:`, e);
        e.target.result.createObjectStore(objStoreName);
      });
    });

    // TODO: handle invalid share
    storeFile(data.get('image'), dbOpenRequest);
    return Response.redirect('/index.html', 302);
  },
  'POST'
);

async function storeFile(f, dbOpenRequest) {
  const b = new Blob([await f.arrayBuffer()], { type: f.type });
  // TODO: perhaps prompt before silently replacing old image, if one exists?
  const t = dbOpenRequest.result.transaction(objStoreName, 'readwrite').objectStore(objStoreName).put(b, mainImageName);
  // TODO: display "saving..." message/spinner?
  t.addEventListener('success', (e) => {
    console.log('put success:', e)
  });
  t.addEventListener('error', (e) => {
    console.log('put error:', e)
    // TODO: display error
  });
  // TODO: add option to remove from storage
}

workbox.routing.registerRoute(
  ({url}) => true,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: cacheName
  })
);
