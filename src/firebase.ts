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

// TODO: I wonder if there are any side-effects of importing these
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Replace |firebaseConfig| with your instance's config, but DO NOT commit it.
// TODO: the config should probably be in a separate JSON file.
export const firebaseConfig = null;

let app: FirebaseApp | null = null;
export let firebaseStorage: FirebaseStorage | null = null;

/**
 * Initializes the Firebase app and storage bucket if the above |firebaseConfig| is non-null.
 *
 * @return {boolean} Whether initialization was successful.
 */
export function firebaseInit(): boolean {
  app = firebaseConfig ? initializeApp(firebaseConfig) : null;
  firebaseStorage = app ? getStorage(app) : null;
  return !!firebaseStorage;
}
