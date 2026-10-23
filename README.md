# QuickFill

QuickFill is a lightweight password manager and login autofill extension for Google Chrome. It is built entirely with vanilla HTML, CSS, and JavaScript on Manifest V3, and stores your vault encrypted in the browser using the Web Crypto API.

<p align="center">
  <img src="images/app1.png" alt="QuickFill unlock screen" width="320">
  <img src="images/app2.png" alt="QuickFill vault list screen" width="320">
</p>

## What it does

- **Encrypted local vault** — credentials are encrypted with AES-GCM (256-bit) before being written to `chrome.storage.local`.
- **Master password** — the vault key is derived from your master password with PBKDF2 (SHA-256, 100,000 iterations, random 16-byte salt).
- **Session-only key** — the derived key is kept in `chrome.storage.session`, so it is cleared when the browser restarts. A manual lock button clears it immediately.
- **Credential management** — add, edit, search, and delete entries from the popup. Each entry stores a name, domain, username, and password.
- **Manual fill** — click the fill button on an entry to insert the username and password into the current tab's login form, including forms inside iframes.
- **Optional auto-fill** — enable the per-site toggle and QuickFill will fill visible, empty password fields when a matching login form appears, including forms injected later by single-page apps or modals.
- **Domain detection and favicons** — the current tab's hostname is pre-filled when adding an entry, and site icons are loaded for the list.
- **No auto-submit** — QuickFill fills fields but never submits a form.

## Security notes

- The vault (`vaultData`, containing ciphertext and IV) and salt (`vaultSalt`) live in local storage; plaintext credentials are never persisted.
- The master password and derived key are never logged or sent anywhere.
- QuickFill does not implement an inactivity auto-lock. The vault stays unlocked until you press the lock button or the browser restarts.
- Auto-fill only runs for entries with the toggle enabled whose saved domain matches the current page. Treat the domain field carefully — it is the boundary for credential delivery.
- Favicons are fetched from Google's favicon service, which reveals the domains you have saved to that service.

## Installation

QuickFill is not published to the Chrome Web Store; load it as an unpacked extension:

1. Clone or download this repository.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked** and select this folder (the one containing `manifest.json`).
5. Pin the QuickFill icon to the toolbar.

## Usage

1. **Create the vault** — open the popup and choose a master password (at least 4 characters). It cannot be recovered if lost.
2. **Add an entry** — click `+`, then fill in the site name, domain, username, and password. The domain of the active tab is suggested automatically.
3. **Fill a login form** — open a site's login page and either:
   - click the fill (login) icon on the matching entry in the popup, or
   - enable the auto-fill toggle for that entry and reload/open the login page.
4. **Manage entries** — use the search box to filter by name, URL, or username, the edit icon to change an entry, and the delete icon to remove it.
5. **Lock the vault** — click the lock icon in the popup header. You will need the master password to unlock it again.

Only one entry per domain can have auto-fill enabled at a time.

## Project structure

| Path | Purpose |
| --- | --- |
| `manifest.json` | MV3 manifest: permissions, service worker, popup, content script. |
| `popup/` | Vault UI: setup, unlock, entry list, add/edit forms, manual fill. |
| `background/background.js` | Service worker: message routing, script injection, auto-fill credential lookup. |
| `content/content-script.js` | Detects login forms on pages and writes credentials into them. |
| `lib/crypto.js` | PBKDF2 key derivation and AES-GCM encrypt/decrypt helpers. |
| `lib/storage.js` | Promise wrappers around `chrome.storage.local` and `chrome.storage.session`. |
| `images/` | Extension icon and screenshots. |

## Permissions

QuickFill requests `storage`, `activeTab`, `scripting`, and `alarms`, and registers its content script on `<all_urls>` so it can detect login forms on any site you visit. It makes no network requests of its own except for favicon images.

## Development

The extension runs directly from source — there is no build step required to load it. Tailwind CSS is used only at development time to generate `popup/popup.css`; runtime code is plain JavaScript with no framework or bundler.

To rebuild the popup stylesheet after changing `popup/input.css` or `tailwind.config.js`:

```bash
npm install
npx tailwindcss -i popup/input.css -o popup/popup.css
```

There is no automated test suite yet (`npm test` is a placeholder). Validate changes by reloading the unpacked extension in `chrome://extensions/` and testing with fake credentials.
