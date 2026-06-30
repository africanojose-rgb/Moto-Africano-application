/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Motorcycle, MaintenanceLog, MileageEntry, LegalDocument } from '../types';

const DB_NAME = 'MotoAfricanoDB';
const DB_VERSION = 1;

export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Error opening IndexedDB:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = request.result;
      
      // Create stores if they do not exist
      if (!db.objectStoreNames.contains('motorcycles')) {
        db.createObjectStore('motorcycles', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('maintenanceLogs')) {
        db.createObjectStore('maintenanceLogs', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('mileageEntries')) {
        db.createObjectStore('mileageEntries', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('documents')) {
        db.createObjectStore('documents', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };
  });
}

/**
 * Get all records from a specific store
 */
export async function getAllFromStore<T>(storeName: string): Promise<T[]> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result as T[]);
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Put (insert or update) a record in a store
 */
export async function putInStore<T>(storeName: string, value: T): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(value);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Put multiple records into a store
 */
export async function putAllInStore<T>(storeName: string, values: T[]): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    
    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = () => {
      reject(transaction.error);
    };

    values.forEach(val => {
      store.put(val);
    });
  });
}

/**
 * Delete a record from a store by key
 */
export async function deleteFromStore(storeName: string, key: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(key);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Fetch a setting from the settings store
 */
export async function getSetting<T>(key: string): Promise<T | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('settings', 'readonly');
    const store = transaction.objectStore('settings');
    const request = store.get(key);

    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result.value as T);
      } else {
        resolve(null);
      }
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

/**
 * Save a setting in the settings store
 */
export async function setSetting<T>(key: string, value: T): Promise<void> {
  await putInStore('settings', { key, value });
}
