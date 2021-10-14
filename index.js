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

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
} else {
  // TODO display error message and fail gracefully
}

const mainDBName = 'appDB';
const objStoreName = 'imageStore';
const mainImageName = 'mainImage';

window.addEventListener('load', () => {
  const fileInput = document.querySelector('#input');
  const imgElement = document.querySelector('img');

  if (!window.indexedDB || !window.URL) { /* TODO: display error message */ }

  const dbOpenRequest = window.indexedDB.open(mainDBName);
  dbOpenRequest.addEventListener('success', (e) => onDBOpenSuccess(e, imgElement));
  dbOpenRequest.addEventListener('error', (e) => {
    console.log('error loading db:', e);
    // TODO: display error
  });
  dbOpenRequest.addEventListener('upgradeneeded', (e) => {
    console.log(`DB update request:`, e);
    e.target.result.createObjectStore(objStoreName);
  });

  fileInput.addEventListener('change', (e) => onFileInputChange(e, dbOpenRequest, imgElement));
});

function onDBOpenSuccess(e, imgElement) {
  console.log('Database initialized');

  const db = e.target.result;
  const t = db.transaction(objStoreName, 'readonly').objectStore(objStoreName).get(mainImageName);
  t.addEventListener('success', (e) => {
    console.log('get success:', e)
    const b = e.target.result;
    if (!b) return;
    imgElement.src = window.URL.createObjectURL(b);
  });
  t.addEventListener('error', (e) => {
    console.log('get error:', e)
  });
}

async function onFileInputChange(e, dbOpenRequest, imgElement) {
  console.log(e.target.value);
  if (e.target.files.length === 0) return;
  const f = e.target.files[0]; // TODO: null-check
  const b = new Blob([await f.arrayBuffer()]);
  // TODO: perhaps prompt before silently replacing old image, if one exists?
  imgElement.src = window.URL.createObjectURL(b);
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
