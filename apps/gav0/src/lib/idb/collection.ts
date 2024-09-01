import {openDB} from 'idb';

import type { IDBPDatabase } from 'idb';

export class DBNotReadyError extends Error {
  constructor(message: string = 'Database not created or busy creating') {
    super(message);
    this.name = 'DBNotReadyError';
    Object.setPrototypeOf(this, DBNotReadyError.prototype);
  }
}

export class StoreNotAttachedError extends Error {
  constructor(message: string = 'The store is not attached to a database') {
    super(message);
    this.name = 'StoreNotAttachedError';
    Object.setPrototypeOf(this, StoreNotAttachedError.prototype);
  }
}

/**
 * Options for configuring a management interface for an IndexDB database.
 */
export class StoreCollectionOpts {
  /**
   * The name of the indexdb database
   * @type {string}
   */
  name: string;

  /**
   * The version of the index db database.
   * @type {number}
   */
  version: number;
}

export class CreateIndexOpts {
  unique?: boolean;
  multiEntry?: boolean;
  locale?: string;
}

export class IndexOpts {
  name: string;
  keyPath: string;
  options: CreateIndexOpts;
}

export class StoreSchema {
  keyPath: string;
  indices: {[key: string]:IndexOpts};
  autoIncrement?: boolean;
  get name(): string {
    return this.constructor.name;
  }
  constructor(keyPath: string, indices: IndexOpts[], autoIncrement?: boolean) {
    this.keyPath = keyPath;
    this.autoIncrement = autoIncrement;
    this.indices = {};
    indices.forEach((index) => {
      this.indices[index.name] = index;
    });
  }
}

interface IStoreSchema {
  name: string;
  keyPath: string;
  indices: {[key: string]:IndexOpts};
  autoIncrement?: boolean;
}

export class Store<T extends IStoreSchema> {
  schema: T;
  collection?: StoreCollection | undefined;
  constructor(schema: T) {
    this.schema = schema;
  }

  attach(collection: StoreCollection) {
    this.collection = collection;
  }
  async iput(index: string, key: string, value): Promise<IDBValidKey> {
    if (!this.collection) throw new StoreNotAttachedError();
    return await this.collection.iput(this.schema.name, index, key, value);
  }
}

export class StoreCollection {

  opts: StoreCollectionOpts;
  schema: {[key:string]: StoreSchema};
  creating: boolean;
  closing: boolean;
  db?: IDBPDatabase;

  constructor(opts: StoreCollectionOpts, schema: StoreSchema[]) {
    this.opts = opts;

    schema.forEach((s) => {
      this.schema[s.name] = s;
    });

    this.creating = false;
    this.closing = false;
  }

  async create() {
    if (typeof this.db !== 'undefined' || this.creating) return;
    this.creating = true;

    const collection = this; // so the current "this" is available in the call back lexical scope

    this.db = await openDB(this.opts.name, this.opts.version, {
      upgrade(db, oldVersion, newVersion, transaction) {
        Object.values(collection.schema).forEach((storeSchema) => {
          let store;
          try {
            store = transaction.objectStore(storeSchema.name);
          } catch (ex) {
            const err = ex as Error;
            if (err.name !== 'NotFoundError') throw err;
            store = db.createObjectStore(
              storeSchema.name,
              { keyPath: storeSchema.keyPath, autoIncrement: storeSchema.autoIncrement ?? true });
          }
          Object.values(storeSchema.indices).forEach((index) => {
            try {
              store.index(index.name);
            } catch (ex) {
              const err = ex as Error;
              if (err.name !== 'NotFoundError') throw err;
              store.createIndex(index.name, index.keyPath, index.options);
            }
          });
        });
      }
    });
    if (this.closing && this.db) {
      this.db.close();
      this.db = undefined;
    }
  }
  close() {
    if (!this.db) return
    if (this.creating) {
      this.closing = true;
      return;
    }
    this.db.close();
    this.db = undefined;
  }

  /**
   * Count of all records in the store, use indexeCount if you have an index and a value to match
   * @param storeName name of the store
   * @returns 
   */
  async count(storeName: string): Promise<number> {
    if (!this.db) throw new DBNotReadyError();
    return await this.db.transaction(storeName, "readonly").store.count(storeName);
  }

  /**
   * Count all records in the store matching the value using the index 
   * @param storeName name of the store
   * @param index the index to use for the count
   * @param value  the value to match
   * @returns 
   */
  async icount(storeName: string, index: string, value): Promise<number> {
    if (!this.db) throw new DBNotReadyError();
    return await this.db.transaction(storeName, "readonly")
      .store.index(index)
      .count(IDBKeyRange.only(value))
  }

  /**
   * Obtain the primary key for a uniquely indexed value
   * Ie, for an autoincrement store with an additional unique index, get the
   * auto increment key that was created for the record on insertion
   */
  async ipk(storeName: string, index: string, value): Promise<any> {
    if (!this.db) throw new DBNotReadyError();
    return await this.db.transaction(storeName, 'readonly')
      .store
      .index(index)
      .openCursor(IDBKeyRange.only(value))
        .then((c) => c?.primaryKey)
  }

  /**
   * Delete the single item found by the index for the given value
   */
  async idel(storeName: string, index: string, value): Promise<void> {
    if (!this.db) throw new DBNotReadyError();
    const key = await this.ipk(storeName, index, value);
    return await this.db.transaction(storeName, 'readwrite')
      .store.delete(key)
  }
 
  /**
   * Put the single item found by the index for the given value
   */
  async iput(storeName: string, index: string, key: string, value): Promise<IDBValidKey> {
    if (!this.db) throw new DBNotReadyError();
    const primaryKey = await this.ipk(storeName, index, key);
    return await this.db.transaction(storeName, 'readwrite')
      .store.put(value, primaryKey)
  }

  async iall(storeName: string, index: string): Promise<any[]> {
    if (!this.db) throw new DBNotReadyError();
    return await this.db.transaction(storeName, "readonly")
      .store.index(index)
      .getAll();
  }

  /**
   * Add a value to the named store
   */
  async add(storeName: string, value): Promise<IDBValidKey> {
    if (!this.db) throw new DBNotReadyError();
    return await this.db.transaction(storeName, 'readwrite')
      .store.add(value);
  }

  /**
   * Delete an entry from the store by the primary key
   */
  async delete(storeName: string, key: string) {
    if (!this.db) throw new DBNotReadyError();
    return await this.db.transaction(storeName, 'readwrite').store.delete(key);
  }

  /**
   * Get the last item from the store, provided the store was creatd using the
   * default autoincrement primary key
   */
  async last(storeName: string) {
    if (!this.db) throw new DBNotReadyError();

    return await this.db.transaction(storeName, 'readonly')
      .store.openCursor(null, 'prev')
      .then((c)=>{
        return c?.value
      })
  }

  /**
   * Get the last primary key from the store, note that after deletions this is not the same as the count
   */
  async lastid(storeName: string): Promise<
    string | number | Date | ArrayBufferView | ArrayBuffer | IDBValidKey[] | undefined> {
    if (!this.db) throw new DBNotReadyError();

    return await this.db.transaction(storeName, 'readonly')
      .store.openCursor(null, 'prev')
      .then((c)=>{
        return c?.primaryKey
      });
    }
}