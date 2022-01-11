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

// Note: There is a bug with puppeteer/jest-puppeteer that will cause tests to fail if run with
// puppeteer 13.
// See https://github.com/smooth-code/jest-puppeteer/issues/461.

module.exports = {
  server: {
    command: 'npx webpack serve --port 8888 --mode=production',
    port: 8888,
  },
};
