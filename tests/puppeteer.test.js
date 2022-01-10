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

// Building the website and starting the server takes ~7 seconds on a MacBook Pro.
jest.setTimeout(15000);

describe('Homepage', () => {
  beforeAll(async () => {
    // The port here must match that in //jest-puppeteer.config.js.
    await page.goto('http://localhost:8888', { 'waitUntil': 'domcontentloaded' });
  });

  it('says Llaminator', async () => {
    // Note: There is a bug with puppeteer/jest-puppeteer that will cause this test to
    // fail if run with puppeteer 13.
    // See https://github.com/smooth-code/jest-puppeteer/issues/461.
    await expect(page).toMatch('Llaminator');
  });
});
