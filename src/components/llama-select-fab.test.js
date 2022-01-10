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

const path = require('path');

// Building the website and starting the server takes ~7 seconds on a MacBook Pro.
jest.setTimeout(15000);

describe('LlamaSelectFab', () => {
  it('fires an event when a file has been selected', async () => {
    await page.goto('http://localhost:8888', { 'waitUntil': 'domcontentloaded' });

    const selectHandle = await page.$('llama-select-fab');
    const inputHandle = await selectHandle?.$('input[type="file"]');
    expect(inputHandle).not.toBeNull();

    let selectedFilename;

    await page.exposeFunction('setSelectedFilenameForTesting', (file) => {
      selectedFilename = file;
    });

    await selectHandle?.evaluate((selectElement) => {
      selectElement.addEventListener('fileselected', (event) => {
        window.setSelectedFilenameForTesting(event.detail.name);
      });
    });

    // While browsers will honour the @accept attribute of uploaded files, Llaminator contains no
    // logic to do filtering of its own. This shortcut avoids relying on an external dependency.
    const currentFile = __filename;

    await inputHandle?.uploadFile(currentFile);
    await inputHandle?.evaluate((inputElement) =>
      inputElement.dispatchEvent(new Event('change', { bubbles: true })));

    expect(selectedFilename).not.toBeUndefined();
    expect(selectedFilename).toEqual(path.basename(currentFile));
  });
});
