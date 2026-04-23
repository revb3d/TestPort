const DB_NAME = "portfolio-studio-db";
const STORE_NAME = "portfolio";
export const STORAGE_KEY = "portfolio-studio-config-v1";

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadStoredPortfolio() {
  try {
    const db = await openDb();
    const value = await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(STORAGE_KEY);
      request.onsuccess = () => resolve(request.result ?? null);
      request.onerror = () => reject(request.error);
    });
    db.close();

    if (value) {
      return value;
    }
  } catch {
    // Fall through to localStorage migration path.
  }

  try {
    const legacy = globalThis.localStorage?.getItem(STORAGE_KEY);
    return legacy ? JSON.parse(legacy) : null;
  } catch {
    return null;
  }
}

export async function saveStoredPortfolio(value) {
  const db = await openDb();
  try {
    await new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(value, STORAGE_KEY);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    globalThis.localStorage?.removeItem(STORAGE_KEY);
  } finally {
    db.close();
  }
}

export async function clearStoredPortfolio() {
  try {
    const db = await openDb();
    try {
      await new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(STORAGE_KEY);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    } finally {
      db.close();
    }
  } catch {
    // Ignore IndexedDB cleanup failure.
  }

  try {
    globalThis.localStorage?.removeItem(STORAGE_KEY);
  } catch {
    // Ignore legacy storage cleanup failure.
  }
}
