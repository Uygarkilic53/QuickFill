// background.js

importScripts('../lib/crypto.js', '../lib/storage.js');

chrome.runtime.onInstalled.addListener(() => {
  console.log("QuickFill Extension Installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "vault_unlocked") {
    // Session vault is unlocked, no auto-lock timer needed.
    sendResponse({ status: "unlocked" });
  } else if (message.action === "vault_locked") {
    chrome.storage.session.remove("vaultKey");
    sendResponse({ status: "locked" });
  } else if (message.action === "fill_credentials") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs || tabs.length === 0) {
        sendResponse({ success: false });
        return;
      }
      const tabId = tabs[0].id;
      
      try {
        // Inject content script into all frames
        await chrome.scripting.executeScript({
          target: { tabId: tabId, allFrames: true },
          files: ['content/content-script.js']
        });

        // Send message to the injected scripts
        chrome.tabs.sendMessage(tabId, {
          action: "do_fill",
          credentials: message.credentials
        }, (response) => {
          if (chrome.runtime.lastError) {
             console.error(chrome.runtime.lastError.message);
             sendResponse({ success: false });
          } else {
             sendResponse({ success: response?.success || false });
          }
        });
      } catch (e) {
        console.error("Script injection failed:", e);
        sendResponse({ success: false });
      }
    });
    return true; // async response
  } else if (message.action === "request_autofill") {
    (async () => {
      try {
        // Check if vault is unlocked
        const exportedKey = await StorageUtil.getSession('vaultKey');
        if (!exportedKey) {
          sendResponse({ success: false });
          return;
        }

        // Load vault
        const key = await CryptoUtil.importKey(exportedKey);
        const vaultData = await StorageUtil.get('vaultData');
        if (!vaultData || !vaultData.ciphertext) {
          sendResponse({ success: false });
          return;
        }

        const vault = await CryptoUtil.decrypt(vaultData.ciphertext, vaultData.iv, key);
        
        // Find match for domain that has autoFill enabled
        const domain = message.domain;
        const match = vault.find(site => {
          if (!site.autoFill) return false;
          try {
            const siteUrl = site.url.startsWith('http') ? site.url : `https://${site.url}`;
            return new URL(siteUrl).hostname.includes(domain) || domain.includes(new URL(siteUrl).hostname);
          } catch(e) {
            return false;
          }
        });

        if (match) {
          sendResponse({ success: true, credentials: { username: match.username, password: match.password } });
        } else {
          sendResponse({ success: false });
        }
      } catch (e) {
        console.error("Auto-fill request failed:", e);
        sendResponse({ success: false });
      }
    })();
    return true; // async response
  }
});
