// background.js

importScripts('../lib/crypto.js', '../lib/storage.js', '../lib/settings.js');

const AUTO_LOCK_ALARM = 'quickfill-auto-lock';
const OFFSCREEN_PATH = 'offscreen/offscreen.html';
const popupPorts = new Set();
let creatingOffscreen = null;

chrome.runtime.onInstalled.addListener(() => {
  console.log("QuickFill Extension Installed");
});

async function lockVault() {
  await StorageUtil.removeSession('vaultKey');
  await chrome.alarms.clear(AUTO_LOCK_ALARM);
}

async function scheduleAutoLock() {
  await chrome.alarms.clear(AUTO_LOCK_ALARM);
  const settings = await SettingsUtil.get();
  if (!settings.autoLockMinutes) return;
  const sessionKey = await StorageUtil.getSession('vaultKey');
  if (!sessionKey) return;
  chrome.alarms.create(AUTO_LOCK_ALARM, { delayInMinutes: settings.autoLockMinutes });
}

async function getUnlockedVault() {
  const exportedKey = await StorageUtil.getSession('vaultKey');
  if (!exportedKey) return null;
  const vaultData = await StorageUtil.get('vaultData');
  if (!vaultData || !vaultData.ciphertext) return null;
  const key = await CryptoUtil.importKey(exportedKey);
  const vault = await CryptoUtil.decrypt(vaultData.ciphertext, vaultData.iv, key);
  return { vault, key };
}

function findCredential(vault, pageHost, allowSubdomains, requireAutoFill) {
  let subdomainMatch = null;
  for (const site of vault) {
    if (requireAutoFill && !site.autoFill) continue;
    if (!domainMatches(pageHost, site.url, allowSubdomains)) continue;
    if (normalizeHost(pageHost) === siteHostname(site.url)) return site;
    if (!subdomainMatch) subdomainMatch = site;
  }
  return subdomainMatch;
}

async function fillTab(tabId, credentials, ui) {
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tabId, allFrames: true },
      files: ['content/content-script.js']
    });
  } catch (e) {
    // The statically registered content script may already be present, so
    // still try to deliver the message instead of failing immediately.
    console.error("Script injection failed:", e);
  }

  return new Promise((resolve) => {
    chrome.tabs.sendMessage(tabId, {
      action: "do_fill",
      credentials: credentials,
      ui: ui
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
        resolve(false);
        return;
      }
      resolve(Boolean(response && response.success));
    });
  });
}

async function hasOffscreenDocument() {
  try {
    if (chrome.offscreen && typeof chrome.offscreen.hasDocument === 'function') {
      return await chrome.offscreen.hasDocument();
    }
  } catch (e) {
    // fall through and try to create the document
  }
  return false;
}

async function ensureOffscreenDocument() {
  if (await hasOffscreenDocument()) return;
  if (creatingOffscreen) {
    await creatingOffscreen;
    return;
  }

  creatingOffscreen = chrome.offscreen.createDocument({
    url: OFFSCREEN_PATH,
    reasons: ['CLIPBOARD'],
    justification: 'Copy credentials to the clipboard and clear them after a timeout.'
  }).catch((error) => {
    if (!String(error).includes('single offscreen document')) throw error;
  }).finally(() => {
    creatingOffscreen = null;
  });

  await creatingOffscreen;
}

async function copyToClipboard(text, clearSeconds) {
  try {
    await ensureOffscreenDocument();

    for (let attempt = 0; attempt < 3; attempt++) {
      const response = await new Promise((resolve) => {
        chrome.runtime.sendMessage({
          target: 'offscreen',
          action: 'copy',
          text: text,
          clearSeconds: clearSeconds
        }, (reply) => {
          if (chrome.runtime.lastError) {
            resolve(null);
            return;
          }
          resolve(reply);
        });
      });

      if (response && response.success) return true;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    return false;
  } catch (e) {
    console.error("Clipboard copy failed:", e);
    return false;
  }
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === AUTO_LOCK_ALARM) {
    lockVault();
  }
});

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'quickfill-popup') return;
  popupPorts.add(port);

  port.onDisconnect.addListener(async () => {
    popupPorts.delete(port);
    if (popupPorts.size > 0) return;
    try {
      const settings = await SettingsUtil.get();
      if (settings.lockOnClose) await lockVault();
    } catch (e) {
      // Extension context may be invalidated during reload; nothing to lock.
    }
  });
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'fill_active') return;
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const tab = tabs && tabs[0];
    if (!tab || !tab.id || !tab.url) return;

    let pageHost = '';
    try {
      pageHost = new URL(tab.url).hostname;
    } catch (e) {
      return;
    }

    const settings = await SettingsUtil.get();
    const unlocked = await getUnlockedVault();
    if (!unlocked) return;

    const match = findCredential(unlocked.vault, pageHost, settings.matchSubdomains, false);
    if (!match) return;

    await fillTab(tab.id, {
      username: match.username,
      password: match.password
    }, {
      showToast: settings.showAutofillToast,
      lang: settings.language
    });
    await scheduleAutoLock();
  } catch (e) {
    console.error("QuickFill fill command failed:", e);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.target === 'offscreen') return;

  if (message.action === "vault_unlocked") {
    scheduleAutoLock();
    sendResponse({ status: "unlocked" });
  } else if (message.action === "vault_activity") {
    scheduleAutoLock();
    sendResponse({ status: "ok" });
  } else if (message.action === "vault_locked") {
    lockVault();
    sendResponse({ status: "locked" });
  } else if (message.action === "settings_updated") {
    scheduleAutoLock();
    sendResponse({ status: "ok" });
  } else if (message.action === "copy_credential") {
    if (typeof message.text !== 'string' || message.text.length > 4096) {
      sendResponse({ success: false });
      return;
    }
    const clearSeconds = [0, 5, 10, 30].includes(Number(message.clearSeconds))
      ? Number(message.clearSeconds)
      : 0;
    copyToClipboard(message.text, clearSeconds).then((success) => {
      sendResponse({ success: success });
    });
    return true;
  } else if (message.action === "fill_credentials") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs || tabs.length === 0 || !tabs[0].id) {
        sendResponse({ success: false });
        return;
      }
      try {
        const settings = await SettingsUtil.get();
        const success = await fillTab(tabs[0].id, message.credentials, {
          showToast: settings.showAutofillToast,
          lang: settings.language
        });
        if (success) scheduleAutoLock();
        sendResponse({ success: success });
      } catch (e) {
        console.error("Fill request failed:", e);
        sendResponse({ success: false });
      }
    });
    return true;
  } else if (message.action === "request_autofill") {
    (async () => {
      try {
        const settings = await SettingsUtil.get();
        if (!settings.autoFillEnabled) {
          sendResponse({ success: false });
          return;
        }

        const unlocked = await getUnlockedVault();
        if (!unlocked) {
          sendResponse({ success: false });
          return;
        }

        const match = findCredential(unlocked.vault, message.domain, settings.matchSubdomains, true);
        if (!match) {
          sendResponse({ success: false });
          return;
        }

        await scheduleAutoLock();
        sendResponse({
          success: true,
          credentials: { username: match.username, password: match.password },
          ui: { showToast: settings.showAutofillToast, lang: settings.language }
        });
      } catch (e) {
        console.error("Auto-fill request failed:", e);
        sendResponse({ success: false });
      }
    })();
    return true;
  }
});
