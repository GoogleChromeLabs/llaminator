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

import { openDB, DBSchema, IDBPDatabase } from 'idb';

const kMainDBName = 'appDB';
export const kMainImageName = 'mainImage';

export type FileUniqueID = string;  // generated by the storage layer

// TimestampUnixMillis is the number of milliseconds since Unix Epoch (midnight
// Jan 1, 1970 UTC), as generated by Date.now()
// (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now).
export type TimestampUnixMillis = number;

export type FileMetadata = {
  filename: string;
  mimeType: string;
  title?: string;
}

export type FileRecord = {
  id: FileUniqueID;
  metadata: FileMetadata;
  added: TimestampUnixMillis;
  blobModified: TimestampUnixMillis;
  metadataModified: TimestampUnixMillis;
};

interface LlamaDB extends DBSchema {
  blob: {
    key: string;
    value: Blob;
  };
  metadata: {
    key: string;
    value: FileRecord;
  };
}

export class LlamaStorage {
  private db: IDBPDatabase<LlamaDB>;

  private constructor(db: IDBPDatabase<LlamaDB>) {
    console.log('Database initialized');
    this.db = db;
  }

  static async create() {
    return new LlamaStorage(await openDB(kMainDBName, undefined /* version */, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log(`DB update request`);
        db.createObjectStore('blob');
        db.createObjectStore('metadata');
      },
      // blocked()
      // blocking()
      // terminated()
    }));
  }

  async add(file: Blob, metadata: FileMetadata): Promise<FileRecord> {
    const id: FileUniqueID = kMainImageName /* TODO: generate unique IDs */;
    const now = Date.now();
    const record: FileRecord = {
      id: id,
      metadata: metadata,
      added: now,
      blobModified: now,
      metadataModified: now,
    };

    // TODO: it would be nice if the caller could access the FileRecord
    // immediately, but then still indicate when the data finished
    // being stored.
    await Promise.allSettled([
      this.db.put('blob', file, id),
      this.db.put('metadata', record, id),
    ]);
    console.log(`successfully added '${id}'`);
    return record;
  }

  async list(): Promise<FileRecord[]> {
    return this.db.getAll('metadata');
  }

  async getFile(id: FileUniqueID): Promise<Blob | undefined> {
    const blob = await this.db.get('blob', id);
    if (!blob) {
      console.log(`no blob found for id '${id}'`);
      return undefined
    }
    console.log(`successfully retrieved blob for '${id}'`);
    return blob;
  }

  async get(id: FileUniqueID): Promise<FileRecord | undefined> {
    const record = await this.db.get('metadata', id);
    if (!record) {
      console.log(`no record found for id '${id}'`);
      return undefined;
    }
    console.log(`successfully retrieved metadata for '${id}'`);
    return record;
  }

  // At least one of |file| and |metadata| must be provided.
  async update(id: FileUniqueID, file?: Blob, metadata?: FileMetadata): Promise<FileRecord> {
    if (!file && !metadata) throw 'neither |file| nor |metadata| was provided';

    const now = Date.now();
    const record = await this.db.get('metadata', id);
    if (!record) throw `no record found for id '${id}'`;
    if (metadata) {
      record.metadata = metadata;
      record.metadataModified = now;
    }

    if (file) {
      record.blobModified = now;
      await this.db.put('blob', file, id);
    }

    await this.db.put('metadata', record, id);
    console.log(`successfully updated '${id}'`);

    return record;
  }
}
