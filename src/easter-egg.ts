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

/**
 * A string that contains hex with ':' separating each byte. For example, the value 'hello' would be
 * represented as '68:65:6c:6c:6f'.
 */
export type HexString = string

/**
 * Function to call to retrieve the ciphertext. EasterEgg.ciphertextFileFetcherer() provides a
 * convenient implementation to fetch the ciphertext from a file.
 */
export type CiphertextFetcher = () => Promise<ArrayBuffer>;

/**
 * A ciphertext along with all information needed to decrypt it, except for the password.
 */
export type EasterEggParams = {
  /**
   * Either the HexString-formatted ciphertext, or a function which retrieves the ciphertext and
   * returns it in a promise to an ArrayBuffer.
   */
  ciphertext: HexString | CiphertextFetcher;

  /**
   * The salted SHA-512 hash of the encryption password. Used to quickly determine whether or not
   * the password was correct, and therefore whether or not we need to go through the entire
   * decryption process.
   *
   * NOTE: Security-wise, this is a very bad idea. You want it to take a while to be able to
   * determine whether or not the password was correct, because this helps mitigate brute-force
   * attacks. We do it here because this is just for fun and we aren't encrypting any actual
   * sensitive information.
   */
  hash: HexString;

  /**
   * The initial value for the AES-GCM algorithm.
   */
  iv: HexString;

  /**
   * Salt used to generate a derived key from a password.
   */
  derivedKeySalt: HexString;

  /**
   * Salt used to generate |hash|.
   */
  passwordSalt: HexString;
};

/**
 * Whether a derived key should be used for encryption or decryption.
 */
type KeyType = 'encrypt' | 'decrypt';

/**
 * Function to call upon successful decryption. Returns a (prmoise to a) boolean indicating success.
 */
export type Callback = (plaintext: ArrayBuffer) => Promise<boolean>;

/**
 * Function that determines whether or not the caller should continue with whatever it was doing,
 * depending on the result of the Callback.
 */
export type ContinueAfterCallbackFxn = (callbackResult: boolean) => Promise<boolean>;

/**
 * An EasterEgg represents a hidden surprise or feature that can be unlocked with a secret or
 * 'password'.
 *
 * DO NOT attempt to use this to secure any actual sensitive information, as it does not use best
 * security practices.
 */
export class EasterEgg {
  private static readonly textEncoder: TextEncoder = new TextEncoder();
  private static readonly textDecoder: TextDecoder = new TextDecoder();
  private static readonly digestAlgo: string = 'SHA-512';
  private static readonly encryptionAlgo: string = 'AES-GCM';
  private static readonly keyDrivationAlgo: string = 'PBKDF2';

  private readonly getCiphertext: CiphertextFetcher;
  private readonly hash: HexString;
  private readonly iv: ArrayBuffer;
  private readonly derivedKeySalt: ArrayBuffer;
  private readonly passwordSalt: ArrayBuffer;
  private readonly callback: Callback;
  private readonly continueAfterCallback: ContinueAfterCallbackFxn;

  /**
   * Constructs an EasterEgg instance.
   *
   * @param {EasterEggParams} params The EasterEgg's encrypted state.
   * @param {Callback} [callback] Optional function to call upon successful decryption. If not
   *     provided, the default action is to assume that the plaintext is HTML, and overwrite the
   *     current page with it.
   * @param {ContinueAfterCallbackFxn} [continueAfterCallback] Whether or not the caller should
   *     continue whatever action it was in the middle of after a decryption and callback. If
   *     unspecified, the default function unconditionally returns false.
   */
  constructor(params: EasterEggParams, callback?: Callback,
      continueAfterCallback?: ContinueAfterCallbackFxn) {
    this.hash = params.hash;
    this.iv = EasterEgg.hexStrToArrayBuffer(params.iv);
    this.derivedKeySalt = EasterEgg.hexStrToArrayBuffer(params.derivedKeySalt);
    this.passwordSalt = EasterEgg.hexStrToArrayBuffer(params.passwordSalt);
    this.continueAfterCallback = continueAfterCallback ? continueAfterCallback : async () => false;

    if (typeof params.ciphertext === 'function') {
      this.getCiphertext = params.ciphertext;
    } else {
      this.getCiphertext = async (): Promise<ArrayBuffer> =>
        EasterEgg.hexStrToArrayBuffer(params.ciphertext as HexString);
    }

    if (!callback) {
      callback = async (plaintext: ArrayBuffer): Promise<boolean> => {
        document.body.innerHTML = EasterEgg.textDecoder.decode(plaintext);
        return true;
      };
    }
    this.callback = callback;
  }

  /**
   * Determines if |blob| is the correct password. If so, then decrypts the ciphertext and hands
   * over the plaintext to the callback.
   *
   * @param {Blob} blob The attempted password.
   * @return {Promise<boolean | undefined>} If undefined, this indicates that the blob's hash did
   *     not match. Otherwise, the boolean return value indicates whether or not the caller should
   *     continue with its previous action.
   */
  async hunt(blob: Blob): Promise<boolean | undefined> {
    const blobBuffer: ArrayBuffer = await blob.arrayBuffer();
    const hash = await EasterEgg.hashWithSalt(blobBuffer, this.passwordSalt);
    if (hash !== this.hash) {
      return undefined;
    }

    const decryptionKey: CryptoKey = await EasterEgg.keyFromPassword(blobBuffer, 'decrypt',
        this.derivedKeySalt);
    const plaintext: ArrayBuffer = await window.crypto.subtle.decrypt({
      name: EasterEgg.encryptionAlgo,
      iv: this.iv,
    }, decryptionKey, await this.getCiphertext());

    const callbackSuccess = await this.callback(plaintext);
    return await this.continueAfterCallback(callbackSuccess);
  }

  /**
   * Concatenates a password with a salt, and hashes the result.
   *
   * @param {ArrayBuffer} password The password to salt and hash.
   * @param {ArrayBuffer} salt The salt to password and hash.
   * @return {Promise<HexString>} Promise to the salted hash of the password.
   */
  private static async hashWithSalt(password: ArrayBuffer, salt: ArrayBuffer): Promise<HexString> {
    const saltedPW: ArrayBuffer = (new Uint8Array([...new Uint8Array(password)]
        .concat([...new Uint8Array(salt)]))).buffer;
    return EasterEgg.arrayBufferToHexStr(
        await window.crypto.subtle.digest(EasterEgg.digestAlgo, saltedPW));
  }

  /**
   * Converts an ArrayBuffer to a HexString.
   *
   * @param {ArrayBuffer} b The ArrayBuffer to convert.
   * @return {HexString} The HexString representation of |b|.
   */
  private static arrayBufferToHexStr(b: ArrayBuffer): HexString {
    return [...new Uint8Array(b)].map((byte: number): string =>
      byte.toString(16).padStart(2, '0')).join(':');
  }

  /**
   * Converts a HexString to an ArrayBuffer.
   *
   * @param {HexString} s The HexString to convert.
   * @return {ArrayBuffer} The ArrayBuffer representation of |s|.
   */
  private static hexStrToArrayBuffer(s: HexString): ArrayBuffer {
    return (new Uint8Array(s.split(':').map((byte: string): number =>
      Number.parseInt(byte, 16)))).buffer;
  }

  /**
   * Generates a derived key from a password.
   *
   * @param {ArrayBuffer} passwordBuffer The password to derive a key from.
   * @param {KeyType} keyType The type of key to generate (encryption or decryption).
   * @param {ArrayBuffer} salt A random salt to use during key derivation.
   * @return {Promise<CryptoKey>} A promise to the new derived key.
   */
  private static async keyFromPassword(passwordBuffer: ArrayBuffer, keyType: KeyType,
      salt: ArrayBuffer): Promise<CryptoKey> {
    const passwordKey = await window.crypto.subtle.importKey('raw', passwordBuffer,
        EasterEgg.keyDrivationAlgo, false /* extractable */, ['deriveKey']);
    return await window.crypto.subtle.deriveKey({
      name: EasterEgg.keyDrivationAlgo,
      hash: EasterEgg.digestAlgo,
      salt: salt,
      iterations: 50000, // NOTE: this may be too weak for real security purposes.
    }, passwordKey, {
      name: EasterEgg.encryptionAlgo,
      length: 256,
    }, false /* extractable */, [keyType]);
  }

  /**
   * Generates everything needed for an encrypted EasterEgg. Not called by any other code, it's
   * just used for manually creating a new hidden secret.
   *
   * @param {string} plaintext The secret to make into a hidden EasterEgg.
   * @param {string} password The password to encrypt and decrypt the secret.
   * @return {Promise<EasterEggParams>} A promise to the encrypted secret along with the other
   *     newly-generated information that will be needed (along with the password) to decrypt the
   *     EasterEgg.
   */
  static async hide(plaintext: string, password: string): Promise<EasterEggParams> {
    const passwordSalt: ArrayBuffer = EasterEgg.randomArrayBuffer(30);
    const iv: ArrayBuffer = EasterEgg.randomArrayBuffer(16);
    const derivedKeySalt: ArrayBuffer = EasterEgg.randomArrayBuffer(30);

    const passwordBuffer: ArrayBuffer = EasterEgg.textEncoder.encode(password);
    const hash: HexString = await EasterEgg.hashWithSalt(passwordBuffer, passwordSalt);

    const encryptionKey: CryptoKey = await EasterEgg.keyFromPassword(passwordBuffer, 'encrypt',
        derivedKeySalt);
    const ciphertext: ArrayBuffer = await window.crypto.subtle.encrypt({
      name: EasterEgg.encryptionAlgo,
      iv: iv,
    }, encryptionKey, EasterEgg.textEncoder.encode(plaintext));

    return {
      ciphertext: EasterEgg.arrayBufferToHexStr(ciphertext),
      hash: hash,
      iv: EasterEgg.arrayBufferToHexStr(iv),
      derivedKeySalt: EasterEgg.arrayBufferToHexStr(derivedKeySalt),
      passwordSalt: EasterEgg.arrayBufferToHexStr(passwordSalt),
    };
  }

  /**
   * Generates an ArrayBuffer full of cryptographically random data.
   *
   * @param {number} length How many random bytes to generate.
   * @return {ArrayBuffer} The random data.
   */
  private static randomArrayBuffer(length: number): ArrayBuffer {
    return window.crypto.getRandomValues(new Uint8Array(length)).buffer;
  }

  /**
   * Returns a function that fetches ciphertext in HexString format from the given filename,
   * assumed to be in '/easter-eggs/'. Note that this doesn't do any trimming, so watch out
   * for trailing newlines in your file.
   *
   * @param{string} name Filename.
   * @return{CiphertextFetcher} A function that can be used in EasterEggParams to fetch ciphertext.
   */
  static ciphertextFileFetcherer(name: string): CiphertextFetcher {
    return async (): Promise<ArrayBuffer> => {
      const hexStr: HexString = await (await fetch(`/easter-eggs/${name}`)).text();
      return EasterEgg.hexStrToArrayBuffer(hexStr);
    };
  }
}
