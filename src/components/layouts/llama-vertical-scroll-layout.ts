/*
 * Copyright 2022 Google Inc. All Rights Reserved.
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

import { LitElement, TemplateResult, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import { LlamaLayout } from '../../llama-layout';
import { LlamaStorage } from '../../storage';

@customElement('llama-vertical-scroll-layout')
/**
 * Default Llaminator layout - renders all items at once, vertically in a single column, and lets
 * the browser handle scrolling in the normal way.
 */
export class LlamaVerticalScrollLayout extends LitElement implements LlamaLayout {
  /**
   * html templates of LlamaItems.
   */
  items: TemplateResult[] = [];

  /**
   * This component needs an open shadow root because LlamaItem depends on it.
   *
   * @return {LlamaVerticalScrollLayout} The current instance.
   */
  createRenderRoot() { return this; }

  /**
   * Refreshes (ie, renders) the layout's contents from the database.
   *
   * @param {LlamaStorage} database The database of items to render.
   */
  async refresh(database: LlamaStorage) {
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

    this.items = items;
    this.requestUpdate();
  }

  /**
   * Called by lit when it's time to render the lit-element component. Calling this function does
   * _not_ actually trigger anything to be rendered.
   *
   * @return {TemplateResult} The html template for lit to render.
   */
  render() {
    return this.items;
  }
}
