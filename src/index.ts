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

if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js');
  });
} else {
  // TODO display error message and fail gracefully
}

const mainDBName = 'appDB';
const objStoreName = 'imageStore';
const mainImageName = 'mainImage';

window.addEventListener('load', () => {
  const fileInput = document.querySelector('#input') as HTMLInputElement;
  const imgElement = document.querySelector('img') as HTMLImageElement;
  const shareBtn = document.querySelector('#share') as HTMLButtonElement;

  if (!window.indexedDB || !window.URL) { /* TODO: display error message */ }

  const dbOpenRequest = window.indexedDB.open(mainDBName);
  dbOpenRequest.addEventListener('success', (e) => onDBOpenSuccess(e, imgElement, shareBtn));
  dbOpenRequest.addEventListener('error', (e) => {
    console.log('error loading db:', e);
    // TODO: display error
  });
  dbOpenRequest.addEventListener('upgradeneeded', (e) => {
    console.log(`DB update request:`, e);
    (e.target as IDBRequest).result.createObjectStore(objStoreName);
  });

  fileInput.addEventListener('change', (e) => onFileInputChange(e, dbOpenRequest, imgElement, shareBtn));

  shareBtn.addEventListener('click', async () => {
    const blob = await fetch(imgElement.src).then(r => r.blob());
    const f = fileFromBlob(blob);
    navigator.share({files: [f]});
  });
});

function onDBOpenSuccess(e: Event, imgElement: HTMLImageElement, shareBtn: HTMLButtonElement) {
  console.log('Database initialized');

  const db = (e.target as IDBRequest).result;
  const t = db.transaction(objStoreName, 'readonly').objectStore(objStoreName).get(mainImageName);
  t.addEventListener('success', (e: Event) => {
    console.log('get success:', e)
    const b = (e.target as IDBRequest).result;
    if (!b) return;
    imgElement.src = window.URL.createObjectURL(b);
    displayIfShareEnabled(shareBtn, b);
  });
  t.addEventListener('error', (e: Event) => {
    console.log('get error:', e)
  });
}

async function onFileInputChange(e: Event, dbOpenRequest: IDBOpenDBRequest, imgElement: HTMLImageElement, shareBtn: HTMLButtonElement) {
  const inputElement = e.target as HTMLInputElement;

  console.log(inputElement.value);
  if (!inputElement.files || !inputElement.files.length) return;
  const f = inputElement.files[0]; // TODO: null-check
  const b = new Blob([await f.arrayBuffer()], { type: f.type });
  // TODO: perhaps prompt before silently replacing old image, if one exists?
  imgElement.src = window.URL.createObjectURL(b);
  displayIfShareEnabled(shareBtn, b);
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

function displayIfShareEnabled(target: HTMLElement, blob: Blob): void {
  const f = fileFromBlob(blob);
  if ('share' in navigator && 'canShare' in navigator &&
      navigator.canShare({files: [f]})) {
    target.style.display = 'block';
  }
}

function fileFromBlob(blob: Blob): File {
  return new File([blob], "name.png" /* TODO - name? Maybe we should be storing a File instead of a Blob? */,
    {type: "image/png"});
}
