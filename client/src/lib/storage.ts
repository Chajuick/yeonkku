import { AppState, Contact, PrefixSuffixItem } from "@/../../shared/types";

const DB_NAME = "yeonkku_db";
const DB_VERSION = 1;
const STORE_NAME = "app_state";

/**
 * Initialize IndexedDB
 */
function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

/**
 * Save app state to IndexedDB
 */
export async function saveAppState(state: AppState): Promise<void> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.put(state, "app_state");
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.error(
      "Failed to save to IndexedDB, falling back to localStorage",
      error
    );
    // Fallback to localStorage
    try {
      localStorage.setItem("yeonkku_state", JSON.stringify(state));
    } catch (e) {
      console.error("localStorage also failed:", e);
    }
  }
}

/**
 * Load app state from IndexedDB or localStorage
 */
export async function loadAppState(): Promise<AppState | null> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get("app_state");
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  } catch (error) {
    console.error("Failed to load from IndexedDB, trying localStorage", error);
    // Fallback to localStorage
    try {
      const stored = localStorage.getItem("yeonkku_state");
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      console.error("localStorage also failed:", e);
      return null;
    }
  }
}

/**
 * Clear all stored data
 */
export async function clearAppState(): Promise<void> {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.error("Failed to clear IndexedDB, clearing localStorage", error);
    localStorage.removeItem("yeonkku_state");
  }
}

/**
 * Get default app state
 */
export function getDefaultAppState(): AppState {
  return {
    contacts: [],
    prefixList: [],
    suffixList: [],
    orgPrefixList: [],
    orgSuffixList: [],
    settings: {
      preventDuplicates: true,
      prefixSeparator: " ",
      suffixSeparator: " ",
      applyToNField: true,
    },
  };
}
