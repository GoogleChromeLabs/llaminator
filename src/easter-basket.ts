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

import { EasterEgg } from './easter-egg';

export const easterEggs: EasterEgg[] = [
  new EasterEgg({
    ciphertext: EasterEgg.ciphertextFileFetcherer('001'),
    derivedKeySalt: '5a:36:38:39:9e:45:91:35:df:0c:8d:52:ed:b8:e3:4f:b3:87:10:9e:89:da:7f:7e:4f:' +
      '22:ad:d4:6b:10',
    hash: '5a:45:a8:a1:c6:4d:17:6e:b9:48:28:5b:86:73:c2:c4:61:cd:3c:ec:b9:c3:b9:f1:83:2a:a9:f3:' +
      '4b:b6:db:0a:5e:a7:47:1b:70:f1:0c:69:bb:35:40:9a:b0:f0:01:ef:a8:1a:52:36:be:01:bc:26:fa:06:' +
      'f2:68:03:64:87:a1',
    iv: 'fa:e5:0c:7c:a2:a4:43:c3:73:87:3f:89:03:5a:ca:31',
    passwordSalt: '6b:31:ed:69:8d:b0:5a:ec:17:91:62:b4:2c:8f:4e:25:26:0a:7f:92:fc:4f:8c:17:a1:67:' +
      '25:c7:c5:c1',
  }),
];
