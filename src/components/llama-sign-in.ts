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
import { customElement } from 'lit/decorators.js';

import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

import { firebaseConfig } from '../firebase';

const uiConfig: firebaseui.auth.Config = {
  callbacks: {
    signInSuccessWithAuthResult: () => {
      window.close();
      return false;
    },
  },
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    // TODO: consider supporting other providers
  ],
  tosUrl: () => alert('TOS not written yet'), // TODO
  privacyPolicyUrl: () => alert('Privacy Policy not written yet'), // TODO
};

@customElement('llama-sign-in')
/**
 * LlamaSignIn is a Firebase AuthUI.
 */
export class LlamaSignIn extends LitElement {
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
    const auth = getAuth(app);

    (new firebaseui.auth.AuthUI(auth)).start('#auth-container', uiConfig);
  }

  /**
   * render() is a LitElement override that handles rendering the element. See
   * https://lit.dev/docs/v1/components/lifecycle/#render for details.
   *
   * @return {TemplateResult<1>} The html of the custom element.
   */
  render() {
    return html`<div id="auth-container"></div>`;
  }
}
