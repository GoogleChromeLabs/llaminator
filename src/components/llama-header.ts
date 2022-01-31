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

import './llama-header.scss';

@customElement('llama-header')
export class LlamaHeader extends LitElement {
  @property({ type: String }) title: string = 'Untitled';

  // No internal behaviour is necessary for the header, so avoid creating an
  // open shadow root for this component and default to global styles instead.
  createRenderRoot() { return this; }

  render() {
    return html`
      <header class="mdc-top-app-bar mdc-top-app-bar--fixed">
        <div class="mdc-top-app-bar__row">
          <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
            <span class="mdc-top-app-bar__title">${this.title}</span>
          </section>
        </div>
      </header>`;
  }
}
