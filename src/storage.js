const DB_NAME = "portfolio-studio-db";
const STORE_NAME = "portfolio";
const SESSION_UNLOCK_KEY = "portfolio-studio-admin-unlocked";
const CLIENT_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD?.trim() ?? "";
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

async function fetchJson(url, options = {}) {
  try {
    const response = await fetch(url, {
      credentials: "same-origin",
      cache: "no-store",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
      },
    });

    let data = null;

    try {
      data = await response.json();
    } catch {
      data = null;
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      data: null,
    };
  }
}

async function loadLocalPortfolio() {
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

async function saveLocalPortfolio(value) {
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

function getLocalAdminSessionState() {
  if (!CLIENT_ADMIN_PASSWORD) {
    return {
      source: "none",
      enabled: false,
      authenticated: true,
    };
  }

  try {
    return {
      source: "local",
      enabled: true,
      authenticated: globalThis.sessionStorage?.getItem(SESSION_UNLOCK_KEY) === "true",
    };
  } catch {
    return {
      source: "local",
      enabled: true,
      authenticated: false,
    };
  }
}

export async function getAdminSessionState() {
  const remote = await fetchJson("/api/admin/session", {
    method: "GET",
  });

  if (remote.ok && remote.data) {
    return {
      source: "server",
      enabled: Boolean(remote.data.enabled),
      authenticated: Boolean(remote.data.authenticated),
      storageConfigured: Boolean(remote.data.storageConfigured),
    };
  }

  return {
    ...getLocalAdminSessionState(),
    storageConfigured: false,
  };
}

export async function unlockAdminSession(password) {
  const remote = await fetchJson("/api/admin/login", {
    method: "POST",
    body: JSON.stringify({ password }),
  });

  if (remote.ok && remote.data) {
    return {
      source: "server",
      enabled: Boolean(remote.data.enabled),
      authenticated: Boolean(remote.data.authenticated),
      storageConfigured: Boolean(remote.data.storageConfigured),
    };
  }

  if (remote.status === 401) {
    const error = new Error(remote.data?.error || "Incorrect password");
    error.code = "INVALID_PASSWORD";
    throw error;
  }

  if (!CLIENT_ADMIN_PASSWORD) {
    return {
      source: "none",
      enabled: false,
      authenticated: true,
      storageConfigured: false,
    };
  }

  if (password !== CLIENT_ADMIN_PASSWORD) {
    const error = new Error("Incorrect password");
    error.code = "INVALID_PASSWORD";
    throw error;
  }

  try {
    globalThis.sessionStorage?.setItem(SESSION_UNLOCK_KEY, "true");
  } catch {
    // Ignore local session failures.
  }

  return {
    source: "local",
    enabled: true,
    authenticated: true,
    storageConfigured: false,
  };
}

export async function lockAdminSession() {
  await fetchJson("/api/admin/logout", {
    method: "POST",
  });

  try {
    globalThis.sessionStorage?.removeItem(SESSION_UNLOCK_KEY);
  } catch {
    // Ignore local session failures.
  }
}

export async function loadStoredPortfolio() {
  const remote = await fetchJson("/api/portfolio-config", {
    method: "GET",
  });

  if (remote.ok && remote.data?.config) {
    return {
      value: remote.data.config,
      storage: "remote",
    };
  }

  const local = await loadLocalPortfolio();

  return {
    value: local,
    storage: local ? "local" : remote.status === 200 ? "remote-unconfigured" : "local",
  };
}

export async function saveStoredPortfolio(value) {
  const remote = await fetchJson("/api/portfolio-config", {
    method: "PUT",
    body: JSON.stringify({ config: value }),
  });

  if (remote.ok) {
    try {
      await saveLocalPortfolio(value);
    } catch {
      // Ignore local cache failures after a successful backend save.
    }
    return {
      storage: "remote",
    };
  }

  if (remote.status === 401 || remote.status === 403) {
    const error = new Error(remote.data?.error || "Admin session expired. Unlock the admin again.");
    error.code = "AUTH_REQUIRED";
    throw error;
  }

  if (remote.status === 413) {
    const error = new Error(remote.data?.error || "This portfolio is too large to save to the backend.");
    error.code = "PAYLOAD_TOO_LARGE";
    throw error;
  }

  await saveLocalPortfolio(value);
  return {
    storage: "local",
  };
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
