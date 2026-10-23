// offscreen.js

let clearTimer = null;

async function writeClipboard(text) {
  await navigator.clipboard.writeText(text);
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.target !== 'offscreen' || message.action !== 'copy') return;

  (async () => {
    try {
      await writeClipboard(message.text);

      if (clearTimer) {
        clearTimeout(clearTimer);
        clearTimer = null;
      }

      if (message.clearSeconds > 0) {
        clearTimer = setTimeout(async () => {
          try {
            await writeClipboard('');
          } catch (e) {
            // Clipboard may be unavailable; nothing else to do.
          }
          clearTimer = null;
        }, message.clearSeconds * 1000);
      }

      sendResponse({ success: true });
    } catch (e) {
      sendResponse({ success: false });
    }
  })();

  return true;
});
