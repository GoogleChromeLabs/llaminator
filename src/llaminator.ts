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

import { type LlamaSelectFab } from './components/llama-select-fab';
import { LlamaStorage } from './storage';

/**
 * HTML elements that have to exist in order for Llaminator to be functional. Passed in to the
 * app's constructor, immutable after that.
 */
interface LlaminatorElements {
  /**
   * Container in which the <llama-items> will be displayed.
   */
  container: HTMLElement;

  /**
   * The <llama-select-fab> element that can be used for storing new content in the app.
   */
  select: LlamaSelectFab;
}

/**
 * Main class of the Llaminator application, which encapsulates the main functionality of the app.
 * Is given a series of HTML elements (`LlaminatorElements`) in which the app is to be rendered.
 */
export class Llaminator {
  private readonly elements: LlaminatorElements;
  private readonly storage: Promise<LlamaStorage>;

  constructor(elements: LlaminatorElements) {
    this.elements = elements;
    this.storage = LlamaStorage.create();

    // Set up event listeners on the elements.
    this.elements.select.addEventListener(
        'fileselected', Llaminator.prototype.onFileSelected.bind(this));
  }

  /**
   * Clears the existing content from the container.
   */
  clearContainer() {
    const { container } = this.elements;

    while (container.firstChild) {
      container.firstChild.remove();
    }
  }

  /**
   * Populates all stored items in the container. Right now this works by removing all items from
   * the container, and then repopulating it with everything known in Llaminator. This will be
   * revisited when we decide on ranking, lazy updating, and item removal.
   */
  async populate() {
    const { container } = this.elements;

    const database = await this.storage;
    const items = [];

    for (const item of await database.list()) {
      const blob = await database.getFile(item.id);
      if (!blob) {
        // TODO: Display an error, or prune this item from the database.
        continue;
      }

      const url = URL.createObjectURL(blob);

      items.push(html`
          <llama-item .storage=${database} id=${item.id} src=${url}>
          </llama-item>`);
    }

    render(items, container);
  }

  /**
   * Called when a file has been selected in the <llama-select-fab> that is to be stored.
   *
   * @param {Event} event The event, which is a `CustomEvent` with its detail being a File instance.
   * @todo Can we provide stronger typing for our own custom events?
   */
  async onFileSelected(event: Event) {
    const database = await this.storage;

    const file = (event as CustomEvent).detail as File;
    const blob = new Blob([await file.arrayBuffer()], { type: file.type });

    // TODO: perhaps prompt before silently replacing old image, if one exists?
    const fileRecord = await database.add(blob, {
      filename: file.name,
      mimeType: file.type,
      // title: '',
    }); // TODO: or update()

    console.log(`stored image as id ${fileRecord.id}`);

    await this.populate();
  }
}
