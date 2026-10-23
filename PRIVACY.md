# QuickFill Privacy Policy

QuickFill is a local-first Chrome extension. It does not have a server, an account system, analytics, or telemetry.

## What QuickFill stores

All data is stored in your browser using the Chrome extension storage APIs:

- `vaultSalt` and encrypted `vaultData` (ciphertext and IV) in `chrome.storage.local`
- The derived vault key in `chrome.storage.session`, which Chrome clears when the browser restarts
- Non-sensitive preferences (theme, language, auto-lock, clipboard, autofill, and re-authentication settings) in `chrome.storage.local`

Your master password, decrypted vault, and derived key are never written to local storage, logged, or sent to a server.

## Network requests

QuickFill does not send your vault or credentials to any server. It makes these network requests:

- **Favicons:** when the popup renders your saved sites, it loads site icons from Google's favicon service (`google.com/s2/favicons`). This reveals the domains you have saved to Google.
- **Site navigation:** when you click the "open site" action, Chrome opens the saved URL in a new tab.

No other network requests are made by the extension.

## Clipboard

When you copy a username or password, QuickFill writes it to your clipboard through an extension offscreen document. If you enable the clipboard timeout, QuickFill clears the clipboard after the selected delay. Clearing writes an empty string and may also clear unrelated clipboard content.

## Permissions

| Permission | Why it is needed |
| --- | --- |
| `storage` | Store the encrypted vault, salt, session key, and settings. |
| `activeTab` | Identify the current tab when adding a site or filling a form. |
| `scripting` | Inject the content script into the active tab for manual fill and keyboard shortcuts. |
| `alarms` | Implement the auto-lock timer. |
| `offscreen` | Copy credentials to the clipboard and clear it after a timeout. |
| `clipboardWrite` | Write credentials to the clipboard. |

The content script is registered for `<all_urls>` so QuickFill can detect login forms on any site you visit. It only reads form fields on the current page and only writes credentials when you trigger a fill or when auto-fill is enabled for a matching entry.

## Data deletion

- **Reset vault** in Settings deletes the stored salt, encrypted vault, and session key.
- Uninstalling QuickFill removes its local extension storage.
- Exported backups are files you control; delete them from your filesystem when no longer needed.

## Contact

For privacy questions, open an issue at <https://github.com/Uygarkilic53/signinautomation/issues>.

## Changes

If this policy changes, the updated version will be published in this repository.
