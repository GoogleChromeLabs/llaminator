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
import { customElement } from 'lit/decorators.js';

@customElement('llama-select-fab')
export class LlamaSelectFab extends LitElement {
  // No internal behaviour is necessary for the header, so avoid creating an
  // open shadow root for this component and default to global styles instead.
  createRenderRoot() { return this; }

  handleInputChange(event: Event) {
    if (!(event.target instanceof HTMLInputElement)) { return; } // method called for an unexpected element

    if (!event.target.files || event.target.files.length < 1) { return; } // no files were selected

    this.dispatchEvent(new CustomEvent('fileselected', {
      detail: event.target.files[0],
    }));
  }

  render() {
    return html`
      <div class="mdc-touch-target-wrapper">
        <button class="mdc-fab mdc-fab--touch">
          <label aria-label="Select a file to store in Llaminator" for="select">
            <input type="file" accept="image/*" id="select" hidden
                   @change=${this.handleInputChange} />
            <div class="mdc-fab__ripple"></div>
            <span class="material-icons mdc-fab__icon">file_upload</span>
            <div class="mdc-fab__touch"></div>
          </label>
        </button>
      </div>`;
  }
}
