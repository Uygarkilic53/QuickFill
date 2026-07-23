// lib/crypto.js

const CryptoUtil = {
  // Constants for PBKDF2
  ITERATIONS: 100000,
  HASH: 'SHA-256',
  KEY_LEN: 256,
  SALT_LEN: 16,
  IV_LEN: 12,

  // Utility to convert strings to ArrayBuffer
  str2ab(str) {
    return new TextEncoder().encode(str);
  },

  // Utility to convert ArrayBuffer to string
  ab2str(buf) {
    return new TextDecoder().decode(buf);
  },

  // Utility to convert ArrayBuffer to base64
  ab2base64(buf) {
    let binary = '';
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  },

  // Utility to convert base64 to ArrayBuffer
  base642ab(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  },

  generateSalt() {
    return crypto.getRandomValues(new Uint8Array(this.SALT_LEN));
  },

  generateIV() {
    return crypto.getRandomValues(new Uint8Array(this.IV_LEN));
  },

  async deriveKey(password, saltBuf) {
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      this.str2ab(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    return await crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: saltBuf,
        iterations: this.ITERATIONS,
        hash: this.HASH
      },
      keyMaterial,
      { name: "AES-GCM", length: this.KEY_LEN },
      true, // must be extractable to save to session storage
      ["encrypt", "decrypt"]
    );
  },

  async exportKey(key) {
    const exported = await crypto.subtle.exportKey("raw", key);
    return this.ab2base64(exported);
  },

  async importKey(keyBase64) {
    const keyBuf = this.base642ab(keyBase64);
    return await crypto.subtle.importKey(
      "raw",
      keyBuf,
      { name: "AES-GCM", length: this.KEY_LEN },
      true,
      ["encrypt", "decrypt"]
    );
  },

  async encrypt(dataObj, key) {
    const iv = this.generateIV();
    const dataStr = JSON.stringify(dataObj);
    const dataBuf = this.str2ab(dataStr);

    const ciphertextBuf = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv
      },
      key,
      dataBuf
    );

    return {
      ciphertext: this.ab2base64(ciphertextBuf),
      iv: this.ab2base64(iv)
    };
  },

  async decrypt(ciphertextB64, ivB64, key) {
    const ciphertextBuf = this.base642ab(ciphertextB64);
    const ivBuf = this.base642ab(ivB64);

    try {
      const decryptedBuf = await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: ivBuf
        },
        key,
        ciphertextBuf
      );

      const decryptedStr = this.ab2str(decryptedBuf);
      return JSON.parse(decryptedStr);
    } catch (e) {
      throw new Error("Decryption failed. Incorrect password or corrupted data.");
    }
  }
};
