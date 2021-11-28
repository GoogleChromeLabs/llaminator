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

import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

const cacheName = 'app-cache';

const mainDBName = 'appDB';
const objStoreName = 'imageStore';
const mainImageName = 'mainImage';

interface InstallEvent extends Event {
  waitUntil: (promise: Promise<any>) => void;
};

self.addEventListener('install', function (event: Event): void {
  // precache all assets
  (event as InstallEvent).waitUntil(
    caches.open(cacheName).then(function (cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/index.ts',
        '/manifest.json',
        '/sw.ts',
      ]);
    }),
  );
});

registerRoute(
  ({url}) => url.pathname === '/share-target',
  async ({request}) => {
    const data = await request.formData();

    if (!indexedDB) { /* TODO: display error message */ }

    let dbOpenRequest: IDBOpenDBRequest | null = null;
    await new Promise<void>((resolve, reject) => {
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
      dbOpenRequest.addEventListener('upgradeneeded', (e: IDBVersionChangeEvent) => {
        console.log(`DB update request:`, e);
        (e.target as IDBOpenDBRequest).result.createObjectStore(objStoreName);
      });
    });

    // TODO: handle invalid share
    storeFile(data.get('image') as File, dbOpenRequest!);
    return Response.redirect('/index.html', 302);
  },
  'POST'
);

async function storeFile(f: File, dbOpenRequest: IDBOpenDBRequest) {
  const b = new Blob([await f.arrayBuffer()], { type: f.type });
  // TODO: perhaps prompt before silently replacing old image, if one exists?
  const t = dbOpenRequest.result.transaction(objStoreName, 'readwrite').objectStore(objStoreName).put(b, mainImageName);
  // TODO: display "saving..." message/spinner?
  t.addEventListener('success', (e: Event) => {
    console.log('put success:', e)
  });
  t.addEventListener('error', (e: Event) => {
    console.log('put error:', e)
    // TODO: display error
  });
  // TODO: add option to remove from storage
}

registerRoute(
  ({url}) => true,
  new StaleWhileRevalidate({
    cacheName: cacheName
  })
);
