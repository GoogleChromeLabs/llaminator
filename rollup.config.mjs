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

import clear from 'rollup-plugin-clear';
import copy from 'rollup-plugin-copy';
import esbuild from 'rollup-plugin-esbuild';
import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import { replaceConfig } from './build_common.mjs';

const outDir = 'dist';
const entryFileNamesPattern = '[name].ts';
const replacePluginInstance = replace(replaceConfig(''));

export default [
  {
    input: 'src/index.ts',
    output: {
      dir: outDir,
      sourcemap: true,
      entryFileNames: entryFileNamesPattern,
    },
    plugins: [
      clear({ targets: [outDir] }),
      replacePluginInstance,
      esbuild({}),
      resolve(),
      copy({
        targets: [
          {
            src: ['src/**/*.*', '!src/**/*.ts'],
            dest: outDir,
          },
        ],
      }),
    ],
  },
  {
    input: 'src/sw.ts',
    output: {
      dir: outDir,
      sourcemap: true,
      entryFileNames: entryFileNamesPattern,
    },
    plugins: [
      replacePluginInstance,
      esbuild({}),
      resolve(),
    ],
  },
]
