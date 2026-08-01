// content-script.js

// To prevent adding multiple listeners if injected multiple times
if (!window.quickFillInjected) {
  window.quickFillInjected = true;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "do_fill") {
      const result = fillFields(message.credentials);
      sendResponse({ success: result });
    }
    return true;
  });

  function fillFields(credentials) {
    let filledPassword = false;

    // Helper to securely set value and dispatch events for frameworks
    function setNativeValue(element, value) {
      const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
      const prototypeSetter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(element), "value")?.set;
      
      if (valueSetter && valueSetter !== prototypeSetter) {
        prototypeSetter.call(element, value);
      } else if (valueSetter) {
        valueSetter.call(element, value);
      } else {
        element.value = value;
      }
      element.dispatchEvent(new Event('input', { bubbles: true }));
      element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    // Find elements
    const allInputs = Array.from(document.querySelectorAll('input'));
    
    // Find password first
    let passwordField = null;
    for (const input of allInputs) {
      if (input.type === 'password' && isVisible(input)) {
        passwordField = input;
        break;
      }
    }

    if (passwordField) {
      setNativeValue(passwordField, credentials.password);
      filledPassword = true;

      // Try to find the username field near the password field
      let usernameField = null;
      const form = passwordField.form;
      
      if (form) {
        const inputs = Array.from(form.querySelectorAll('input:not([type="hidden"])'));
        const pwIndex = inputs.indexOf(passwordField);
        if (pwIndex > 0) {
          usernameField = inputs[pwIndex - 1];
        }
      }

      if (!usernameField) {
        // Fallback to searching all document
        const emailSelectors = [
          'input[type="email"]',
          'input[name*="email" i]',
          'input[name*="user" i]',
          'input[id*="email" i]',
          'input[id*="user" i]',
          'input[autocomplete="username"]',
          'input[autocomplete="email"]',
          'input[type="text"]'
        ];
        for (const selector of emailSelectors) {
          const field = document.querySelector(selector);
          if (field && isVisible(field)) {
            usernameField = field;
            break;
          }
        }
      }

      if (usernameField) {
        setNativeValue(usernameField, credentials.username);
      }
    }

    return filledPassword;
  }

  function isVisible(elem) {
    return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
  }

  // Auto-fill observer logic
  let lastAttemptedUrl = window.location.href;
  let hasAttemptedOnCurrentUrl = false;

  function checkForLoginForms() {
    if (window.location.href !== lastAttemptedUrl) {
      lastAttemptedUrl = window.location.href;
      hasAttemptedOnCurrentUrl = false;
    }

    if (hasAttemptedOnCurrentUrl) return;
    
    const allInputs = Array.from(document.querySelectorAll('input'));
    const passwordField = allInputs.find(input => input.type === 'password' && isVisible(input));
    
    if (passwordField && !passwordField.value) {
      hasAttemptedOnCurrentUrl = true;
      
      chrome.runtime.sendMessage({ action: "request_autofill", domain: window.location.hostname }, (response) => {
        if (response && response.success && response.credentials) {
          fillFields(response.credentials);
        }
      });
    }
  }

  // Initial check on load
  setTimeout(checkForLoginForms, 500);

  // Watch for dynamic forms (SPAs)
  const observer = new MutationObserver((mutations) => {
    // Only run if we haven't attempted or if URL changed
    if (!hasAttemptedOnCurrentUrl || window.location.href !== lastAttemptedUrl) {
      // Debounce slightly to avoid checking on every tiny DOM mutation
      clearTimeout(window.quickFillTimeout);
      window.quickFillTimeout = setTimeout(checkForLoginForms, 300);
    }
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
}
