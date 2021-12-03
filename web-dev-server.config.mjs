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

import { esbuildPlugin } from '@web/dev-server-esbuild';
import { existsSync } from 'fs';
import { fromRollup } from '@web/dev-server-rollup';
import { replaceConfig } from './build_common.mjs';
import * as path from 'path';
import rollupReplace from '@rollup/plugin-replace';

const replace = fromRollup(rollupReplace);

export default {
  plugins: [
    replace(replaceConfig('/src')),
    esbuildPlugin({ ts: true }),
  ],
  middleware: [
    jsToTs,
  ],
};

// rewrites local URLs from ending in '.js' to ending in '.ts' if the latter
// exists but the former does not.
function jsToTs(context, next) {
  if (!context.url.startsWith('/src/')) {
    // not in our local code, don't try to rewrite
    return next();
  }

  // unfortunately, it's necessary to split and recombine the path (using
  // fs.join()) for this to work properly on Windows.
  const split_url = context.url.split('/'); // maybe not a great idea for URLs in general?
  const filename = split_url[split_url.length - 1];
  if (!filename.endsWith('.js')) {
    // not .js, no need to rewrite
    return next();
  }

  // split_url ends in '.js', new_split_path will end in '.ts'
  let new_split_path = [...split_url];
  new_split_path[new_split_path.length - 1] = replaceExt(filename);

  if (!splitPathExists(split_url) && splitPathExists(new_split_path)) {
    context.url = new_split_path.join('/');
  }

  return next();
}

// replace last 3 characters (assumed to be '.js') with '.ts'
function replaceExt(str) {
  return str.substr(0, str.length - 3) + '.ts';
}

// check if the file exists on the local filesystem (after removing the
// first entry of the array, which is assumed to be '')
function splitPathExists(split_path) {
  return existsSync(path.join(...split_path.slice(1)))
}
