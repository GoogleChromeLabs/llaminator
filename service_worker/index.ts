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

import { NetworkOnly, StaleWhileRevalidate } from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { LlamaStorage } from '../src/storage'; // TODO: move this to a more common place?

const cacheName = 'app-cache';

declare let self: ServiceWorkerGlobalScope;

precacheAndRoute(self.__WB_MANIFEST);

// Don't waste the user's local storage on Easter Eggs.
registerRoute(
    ({ url }) => url.pathname.includes('/easter-eggs/'),
    new NetworkOnly(),
);

registerRoute(
    ({ url }) => url.pathname.endsWith('/share-target'),
    async ({ request }) => {
      const data = await request.formData();

      if (!indexedDB) { /* TODO: display error message */ }

      // TODO: handle invalid share
      storeFile(data.get('image') as File, await LlamaStorage.create());
      return Response.redirect('/', 302);
    },
    'POST',
);

async function storeFile(file: File, db: LlamaStorage) {
  const blob = new Blob([await file.arrayBuffer()], { type: file.type });
  // TODO: perhaps prompt before silently replacing old image, if one exists?
  const fileRecord = await db.add(blob, {
    filename: file.name,
    mimeType: file.type,
    // title: '',
  }); // TODO: or update()
  // TODO: display "saving..." message/spinner?
  console.log(`stored image as id ${fileRecord.id}`);
}

registerRoute(
    ({ url }) => true,
    new StaleWhileRevalidate({
      cacheName: cacheName,
    }),
);
