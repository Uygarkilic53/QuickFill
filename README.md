# QuickFill

QuickFill is a fast, lightweight, and highly secure password manager and form autofill Chrome extension built using 100% Vanilla HTML, CSS, and JavaScript.

## Features

- **Secure Local Storage:** Your credentials are encrypted using military-grade encryption (AES-GCM) and stored securely in your browser's local storage.
- **Master Password:** Access to your vault is secured by a master password, stretched into a strong 256-bit encryption key via PBKDF2 (Web Crypto API).
- **Auto-Lock:** To keep your data safe, your session automatically locks after 15 minutes of inactivity or by manually locking it.
- **Smart Autofill:** QuickFill seamlessly injects your saved credentials into the login forms of the websites you visit, mimicking real human input to be compatible with modern frameworks like React or Vue.
- **Auto-Detect Domain & Favicon:** Instantly detects the domain you are visiting when adding a new entry and fetches the site's logo for a beautiful user interface.
- **Zero Third-Party Dependencies:** Built without any heavy frameworks (no React, Vue, or Tailwind) to ensure maximum performance, security, and a tiny footprint.

## Installation

Since this is a Chrome Extension, you can load it directly into your browser:

1. Clone or download this repository.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top right corner.
4. Click on **Load unpacked** and select the directory containing this extension (the folder with the `manifest.json` file).

## How it works

For a deep dive into the architecture, security, and implementation details of QuickFill, please read our [HOW_IT_WORKS.md](HOW_IT_WORKS.md).

## Development and Testing

The extension uses `playwright` purely as a development dependency for automated testing to ensure the autofill behavior works accurately across different scenarios.
