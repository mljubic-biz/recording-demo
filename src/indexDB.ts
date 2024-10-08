export function arrayBufferToBlob(buffer: ArrayBuffer, type: string): Blob {
  return new Blob([buffer], { type: type });
}

export function blobToArrayBuffer(
  blob: Blob
): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      resolve(reader.result);
    });
    reader.addEventListener("error", reject);
    reader.readAsArrayBuffer(blob);
  });
}

export function waitForDOMRequest<T>(
  req: IDBRequest,
  onsuccess?: (result: any) => T
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    req.onsuccess = () => {
      if (onsuccess) {
        resolve(onsuccess(req.result));
      } else {
        resolve(req.result);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

export class IDBStorage {
  private name: string;
  private indexedDBName: string;
  private objectStorageName: string;
  private initializedDBPromise?: Promise<IDBDatabase>;
  private version: number;
  private keyPath: string;

  constructor(name: string, keyPath: string) {
    this.name = name;
    this.indexedDBName = `IDB-${this.name}`;
    this.objectStorageName = `IDBStorage-${this.name}`;
    this.initializedDBPromise = undefined;
    this.version = 1.0;
    this.keyPath = keyPath;
  }

  initializedDB() {
    if (this.initializedDBPromise) {
      return this.initializedDBPromise;
    }

    this.initializedDBPromise = (async () => {
      const dbReq = indexedDB.open(this.indexedDBName, this.version);

      dbReq.onupgradeneeded = () => {
        const db = dbReq.result;
        if (!db.objectStoreNames.contains(this.objectStorageName)) {
          db.createObjectStore(this.objectStorageName, {
            keyPath: this.keyPath,
          });
        }
      };

      return waitForDOMRequest<IDBDatabase>(dbReq);
    })();

    return this.initializedDBPromise;
  }

  getObjectStoreTransaction({
    idb,
    mode,
  }: {
    idb: IDBDatabase;
    mode: IDBTransactionMode;
  }) {
    const transaction = idb.transaction(this.objectStorageName, mode);
    return transaction.objectStore(this.objectStorageName);
  }

  async addData<T>(data: T): Promise<T> {
    const idb = await this.initializedDB();
    const objectStore = this.getObjectStoreTransaction({
      idb,
      mode: "readwrite",
    });
    objectStore.add(data);
    return data;
  }

  async getDataByKey<T>(key: string): Promise<T> {
    const idb = await this.initializedDB();
    const objectStore = this.getObjectStoreTransaction({
      idb,
      mode: "readonly",
    });
    return waitForDOMRequest<T>(objectStore.get(key));
  }

  async deleteData(key: string): Promise<boolean> {
    const idb = await this.initializedDB();
    const objectStore = this.getObjectStoreTransaction({
      idb,
      mode: "readwrite",
    });
    return waitForDOMRequest<boolean>(objectStore.delete(key));
  }
}

export const digStorage = new IDBStorage("DIG_RECORDINGS", "digId");
