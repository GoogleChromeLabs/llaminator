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

import './components/llama-header';
import './components/llama-select-fab';
import './llaminator.scss';
import { LlamaStorage, FileUniqueID } from './storage';

if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'development') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js');
  });
} else {
  // TODO display error message and fail gracefully
}

window.addEventListener('load', () => {
  const fileInput = document.querySelector('#input') as HTMLElement;
  const imgElement = document.querySelector('img') as HTMLImageElement;
  const shareBtn = document.querySelector('#share') as HTMLButtonElement;

  if (!window.indexedDB || !window.URL) { /* TODO: display error message */ }

  const dbPromise = LlamaStorage.create();
  dbPromise.then((db) => {
    shareBtn.addEventListener('click', async () => {
      const id = await db.getCurrentID();
      if (!id) return; // TODO: show error message
      const file = await fileFromID(await dbPromise, id);
      if (!file) return; // TODO: show error message
      navigator.share({files: [file]});
    });
    onDBOpenSuccess(db, imgElement, shareBtn);
  });

  fileInput.addEventListener('fileselected', (e) => onFileInputChange(e as CustomEvent, dbPromise, imgElement, shareBtn));
});

async function onDBOpenSuccess(db: LlamaStorage, imgElement: HTMLImageElement, shareBtn: HTMLButtonElement) {
  const id = await db.getCurrentID();
  if (!id) return;
  const blob = await db.getFile(id);
  if (!blob) return;
  imgElement.src = window.URL.createObjectURL(blob);
  displayIfShareEnabled(shareBtn, db);
}

async function onFileInputChange(e: CustomEvent, dbPromise: Promise<LlamaStorage>, imgElement: HTMLImageElement, shareBtn: HTMLButtonElement) {
  const db = await dbPromise;
  const file = e.detail as File;
  const blob = new Blob([await file.arrayBuffer()], { type: file.type });
  // TODO: perhaps prompt before silently replacing old image, if one exists?
  imgElement.src = window.URL.createObjectURL(blob);
  const fileRecord = await db.add(blob, {
    filename: file.name,
    mimeType: file.type,
    // title: '',
  }); // TODO: or update()
  console.log(`stored image as id ${fileRecord.id}`)
  displayIfShareEnabled(shareBtn, db);
  // TODO: add option to remove from storage
}

async function displayIfShareEnabled(target: HTMLElement, db: LlamaStorage): Promise<void> {
  const id = await db.getCurrentID();
  if (!id) return;
  const file = await fileFromID(db, id);
  if (!file) return;
  if ('share' in navigator && 'canShare' in navigator &&
      navigator.canShare({files: [file]})) {
    target.style.display = 'block';
  }
}

async function fileFromID(db: LlamaStorage, id: FileUniqueID): Promise<File | undefined> {
  const record = await db.get(id);
  const blob = await db.getFile(id);
  if (!record || !blob) return undefined;
  return new File([blob], record.metadata.filename,
    {type: record.metadata.mimeType});
}
