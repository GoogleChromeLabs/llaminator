/*
 * Copyright 2023 Google Inc. All Rights Reserved.
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

import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import 'firebaseui/dist/firebaseui.css';

import { firebaseConfig } from '../firebase';

@customElement('llama-sign-in-out-button')
/**
 * LlamaSignInOutButton is a button that either read "Sign In" or "Sign Out" as appropriate. When
 * clicked, it will sign the user in or out. It also displays the signed-in user's email address
 * when applicable.
 */
export class LlamaSignInOutButton extends LitElement {
  @property({ type: Object }) auth?: Auth;
  @property({ type: String }) stateStr: string = 'In';
  @property({ type: String }) class: string = '';
  @property({ type: String }) user: string = '';

  /**
   * No internal behaviour is necessary, so avoid creating an open shadow root for this component
   * and default to global styles instead.
   *
   * @return {LlamaSignInOutButton} this
   */
  createRenderRoot() { return this; }

  /**
   * connectedCallback is an overridden LitElement lifecycle callback that gets called when the
   * custom element is connected to the document.
   */
  connectedCallback() {
    super.connectedCallback();

    if (!firebaseConfig) {
      return;
    }

    const app = initializeApp(firebaseConfig);
    this.auth = getAuth(app);

    this.auth.onAuthStateChanged((user) => {
      this.stateStr = user ? 'Out' : 'In';
      this.user = user?.email || '';
    });
  }

  /**
   * onClick signs the user in or out after the button is clicked.
   */
  onClick() {
    if (this.auth!.currentUser) {
      this.auth!.signOut();
    } else {
      window.open('sign-in.html', 'Sign In', 'width=985,height=735');
    }
  }

  /**
   * render() is a LitElement override that handles rendering the element. See
   * https://lit.dev/docs/v1/components/lifecycle/#render for details.
   *
   * @return {TemplateResult<1>} The html of the custom element.
   */
  render() {
    return html`<button id="sign-in-out-button"
                    class="${this.class}"
                    @click=${this.onClick}>
                  Sign ${this.stateStr}
                </button> ${this.user}`;
  }
}
