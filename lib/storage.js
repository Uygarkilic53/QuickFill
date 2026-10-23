// lib/storage.js

const StorageUtil = {
  // Save an object to chrome.storage.local
  async set(key, value) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        resolve();
      });
    });
  },

  // Save several values to chrome.storage.local in one operation
  async setMany(items) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(items, () => {
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        resolve();
      });
    });
  },

  // Get a value by key from chrome.storage.local
  async get(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, (result) => {
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        resolve(result[key]);
      });
    });
  },

  // Save to chrome.storage.session (in-memory, lost on browser restart)
  async setSession(key, value) {
    return new Promise((resolve, reject) => {
      chrome.storage.session.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        resolve();
      });
    });
  },

  // Get from chrome.storage.session
  async getSession(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.session.get(key, (result) => {
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        resolve(result[key]);
      });
    });
  },

  // Remove a key from chrome.storage.local
  async remove(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove(key, () => {
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        resolve();
      });
    });
  },

  // Remove keys from chrome.storage.local
  async removeMany(keys) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove(keys, () => {
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        resolve();
      });
    });
  },

  // Remove from chrome.storage.session
  async removeSession(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.session.remove(key, () => {
        if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
        resolve();
      });
    });
  }
};
