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

import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { LlamaStorage } from '../storage';

// Whether the Web Share API has been exposed on the browser's Navigator object.
const kWebShareExposed = 'share' in navigator && 'canShare' in navigator;

@customElement('llama-item')
export class LlamaItem extends LitElement {
  @property({ type: String }) id: string = '';
  @property({ type: Object }) storage?: Promise<LlamaStorage>;
  @property({ type: String }) src: string = '';

  // No internal behaviour is necessary for the header, so avoid creating an
  // open shadow root for this component and default to global styles instead.
  createRenderRoot() { return this; }

  async shareItem() {
    if (!this.storage) {
      console.warn('Unable to share this item: @storage property not set.');
      return;
    }

    const db = await this.storage;
    const record = await db.get(this.id);
    const blob = await db.getFile(this.id);

    if (!record || !blob) {
      // TODO: Display an error message as the sharing operation got aborted.
      return;
    }

    const file = new File([blob], record.metadata.filename, {
      type: record.metadata.mimeType,
    });

    if (navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file] });
    }
  }

  render() {
    return html`
      <div class="mdc-card">
        <div class="mdc-card__primary-action">
          <div class="mdc-card__media mdc-card__media--16-9 llama-card-media" style="background-image: url(${this.src})">
          </div>
          <!-- TODO: Display filename/date/time information? -->
          <!-- TODO: Add a ripple effect -->
          <!-- TODO: Expand / go fullscreen on activation -->
        </div>
        <div class="mdc-card__actions">
          <div class="mdc-card__action-icons">
            ${kWebShareExposed && html`
              <button class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon"
                      title="Share this item"
                      @click=${this.shareItem}>
                share
              </button>`}
            <!-- TODO: Add the option to remove this item -->
          </div>
        </div>
      </div>`;
  }
}
