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

import { render } from 'lit-html';

import { type LlamaLayout } from './llama-layout';
import { type LlamaSelectFab } from './components/llama-select-fab';
import { LlamaStorage } from './storage';
import { LlamaThumbnailGridLayout } from './components/layouts/llama-thumbnail-grid-layout';
import { LlamaVerticalScrollLayout } from './components/layouts/llama-vertical-scroll-layout';

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
  private readonly layout: LlamaLayout;

  /**
   * Constructs a Llaminator instance.
   *
   * @param {LlaminatorElements} elements Key DOM elements needed by Llaminator.
   * @param {string} layout String describing the layout to render. Defaults to
   *     LlamaVerticalScrollLayout if the string is empty or otherwise doesn't make sense.
   */
  constructor(elements: LlaminatorElements, layout: string) {
    this.elements = elements;
    this.storage = LlamaStorage.create();

    // Set up event listeners on the elements.
    this.elements.select.addEventListener(
        'fileselected', Llaminator.prototype.onFileSelected.bind(this));
    this.elements.container.addEventListener(
        'itemdeleted', Llaminator.prototype.onItemDeleted.bind(this));

    switch (layout) {
      case 'thumbnail-grid':
        this.layout = new LlamaThumbnailGridLayout();
        break;

      default:
        this.layout = new LlamaVerticalScrollLayout();
        break;
    }
  }

  /**
   * Clears the existing content from the container, then renders |this.layout| in it.
   */
  async resetContainer() {
    const { container } = this.elements;

    while (container.firstChild) {
      container.firstChild.remove();
    }

    this.layout.refresh(await this.storage);
    render(this.layout, this.elements.container);
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

    await this.layout.refresh(database);
  }

  /**
   * Called when a file has been deleted from storage.
   *
   * @param {Event} event The `CustomEvent` instance, with its detail being the id of the deleted
   *     item.
   */
  async onItemDeleted(event: Event) {
    await this.layout.refresh(await this.storage);
  }
}
