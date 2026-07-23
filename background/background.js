// background.js

const LOCK_ALARM_NAME = "lock_vault_alarm";
const INACTIVITY_MINUTES = 15;

chrome.runtime.onInstalled.addListener(() => {
  console.log("QuickFill Extension Installed");
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "vault_unlocked") {
    // Start or restart the auto-lock timer
    chrome.alarms.create(LOCK_ALARM_NAME, { delayInMinutes: INACTIVITY_MINUTES });
    sendResponse({ status: "timer_started" });
  } else if (message.action === "vault_locked") {
    chrome.alarms.clear(LOCK_ALARM_NAME);
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
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === LOCK_ALARM_NAME) {
    console.log("Auto-locking vault due to inactivity.");
    chrome.storage.session.remove("vaultKey");
  }
});
