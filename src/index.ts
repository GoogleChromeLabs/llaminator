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

import { html, render } from 'lit-html';

import './components/llama-header';
import './components/llama-item';
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
  const mainElement = document.querySelector('main') as HTMLElement;

  if (!window.indexedDB || !window.URL) { /* TODO: display error message */ }

  const dbPromise = LlamaStorage.create();
  dbPromise.then(async db => {
    const id = await db.getCurrentID();
    if (!id) return;

    const blob = await db.getFile(id);
    if (!blob) return;

    createOrReplaceVisibleItem(mainElement, dbPromise, id, URL.createObjectURL(blob));
  });

  fileInput.addEventListener('fileselected', e =>
      onFileInputChange(e as CustomEvent, mainElement, dbPromise));
});

function createOrReplaceVisibleItem(container: HTMLElement,
                                    dbPromise: Promise<LlamaStorage>,
                                    id: string,
                                    src: string): void {
  // TODO: Support displaying any number of stored items in Llaminator. For now,
  // remove all existing content from the |container| to ensure that only a
  // single item is displayed.
  while (container.children.length) {
    container.firstChild?.remove();
  }

  render(html`
    <llama-item .storage=${dbPromise} id=${id} src=${src}>
    </llama-item>`, container);
}

async function onFileInputChange(e: CustomEvent, container: HTMLElement, dbPromise: Promise<LlamaStorage>) {
  const db = await dbPromise;
  const file = e.detail as File;
  const blob = new Blob([await file.arrayBuffer()], { type: file.type });

  const fileRecord = await db.add(blob, {
    filename: file.name,
    mimeType: file.type,
    // title: '',
  }); // TODO: or update()

  console.log(`stored image as id ${fileRecord.id}`)

  // TODO: perhaps prompt before silently replacing old image, if one exists?
  createOrReplaceVisibleItem(container, dbPromise, fileRecord.id, URL.createObjectURL(blob));
}
