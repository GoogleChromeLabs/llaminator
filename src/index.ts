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

import { type LlamaSelectFab } from './components/llama-select-fab';
import { Llaminator } from './llaminator';

import './components/layouts/llama-thumbnail-grid-layout';
import './components/layouts/llama-vertical-scroll-layout';
import './components/llama-header';
import './components/llama-item';
import './components/llama-select-fab';
import './components/llama-sign-in-out-button';
import './llaminator.scss';
import { firebaseApp, firebaseInit } from './firebase';
import { getAuth } from 'firebase/auth';

if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js');
  });
} else {
  // TODO display error message and fail gracefully
}

window.addEventListener('load', () => {
  if (!window.indexedDB || !window.URL) { /* TODO: display error message */ }

  const urlSearchParams = new URLSearchParams(window.location.search);
  const layoutParam = urlSearchParams.get('layout');
  const layout = layoutParam ? layoutParam : 'vertical-scroll';

  const firebaseSyncParam = urlSearchParams.get('firebase-sync');
  const firebaseSync = firebaseSyncParam === 'true' ? firebaseInit() : false;
  if (firebaseSync) {
    (document.querySelector('#firebase-stuff') as HTMLElement).style.display = 'block';
  }

  const llaminator = new Llaminator({
    container: document.querySelector('main') as HTMLElement,
    select: document.querySelector('#input') as LlamaSelectFab,
  }, layout);

  llaminator.resetContainer(true /* clear */);

  if (firebaseSyncParam === 'true' && firebaseApp) {
    // Once the user logs in (or firebase realizes that the user is already logged in), we need to
    // refresh the layout to load images from their remote storage bucket directory.
    getAuth(firebaseApp).onAuthStateChanged(() => {
      llaminator.resetContainer(false /* clear */);
    });
  }
});
