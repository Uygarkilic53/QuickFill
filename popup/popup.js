// popup.js

document.addEventListener('DOMContentLoaded', async () => {
  // --- DOM Elements ---
  const views = {
    setup: document.getElementById('view-setup'),
    unlock: document.getElementById('view-unlock'),
    list: document.getElementById('view-list'),
    edit: document.getElementById('view-edit')
  };

  const lockBtn = document.getElementById('lock-btn');
  const toast = document.getElementById('toast');
  const listEl = document.getElementById('site-list');
  const searchInput = document.getElementById('search-input');

  let currentKey = null; // Hold the CryptoKey in memory while popup is open
  let currentVault = [];

  // Navigation functions
  function showView(viewName) {
    Object.values(views).forEach(v => v.classList.add('hidden'));
    views[viewName].classList.remove('hidden');
    
    if (viewName === 'list' || viewName === 'edit') {
      lockBtn.classList.remove('hidden');
    } else {
      lockBtn.classList.add('hidden');
    }
  }

  function showToast(message, isError = false) {
    toast.textContent = message;
    toast.style.backgroundColor = isError ? 'var(--error-color)' : 'var(--success-color)';
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000);
  }

  // --- Initialization ---
  async function init() {
    const saltBase64 = await StorageUtil.get('vaultSalt');
    if (!saltBase64) {
      showView('setup');
      return;
    }

    const exportedKey = await StorageUtil.getSession('vaultKey');
    if (exportedKey) {
      try {
        currentKey = await CryptoUtil.importKey(exportedKey);
        await renderSiteList();
        showView('list');
      } catch (e) {
        showView('unlock');
      }
    } else {
      showView('unlock');
    }
  }

  // --- Vault Helpers ---
  async function loadVault() {
    const vaultData = await StorageUtil.get('vaultData');
    if (!vaultData || !vaultData.ciphertext) return [];
    return await CryptoUtil.decrypt(vaultData.ciphertext, vaultData.iv, currentKey);
  }

  async function saveVault(vault) {
    const encryptedVault = await CryptoUtil.encrypt(vault, currentKey);
    await StorageUtil.set('vaultData', encryptedVault);
  }

  async function getCurrentDomain() {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].url) {
          try {
            const url = new URL(tabs[0].url);
            resolve(url.hostname);
          } catch (e) {
            resolve('');
          }
        } else {
          resolve('');
        }
      });
    });
  }

  function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
      tag => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag] || tag)
    );
  }

  // --- Render Site List ---
  async function renderSiteList(filter = '') {
    currentVault = await loadVault();
    listEl.innerHTML = '';
    
    const currentDomain = await getCurrentDomain();
    
    let displaySites = currentVault;
    if (filter) {
      displaySites = currentVault.filter(s => 
        s.name.toLowerCase().includes(filter.toLowerCase()) || 
        s.url.toLowerCase().includes(filter.toLowerCase()) ||
        s.username.toLowerCase().includes(filter.toLowerCase())
      );
    }
    
    // Sort: current domain match first, then alphabetical by name
    displaySites.sort((a, b) => {
      const aMatch = currentDomain && a.url.includes(currentDomain);
      const bMatch = currentDomain && b.url.includes(currentDomain);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return a.name.localeCompare(b.name);
    });

    if (displaySites.length === 0) {
      listEl.innerHTML = '<p style="text-align: center; color: white; font-size: 0.9rem; margin-top: 20px;">No sites saved yet.</p>';
      return;
    }

    displaySites.forEach(site => {
      const li = document.createElement('li');
      li.className = 'site-item';
      
      let domain = 'example.com';
      try { domain = new URL(site.url.startsWith('http') ? site.url : `https://${site.url}`).hostname; } catch(e){}
      
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

      li.innerHTML = `
        <img class="site-icon" src="${faviconUrl}" alt="" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23ccc%22/></svg>'">
        <div class="site-info">
          <span class="site-name">${escapeHTML(site.name)}</span>
          <span class="site-domain">${escapeHTML(site.username)}</span>
        </div>
        <div class="site-actions">
          <button class="fill-btn" data-id="${site.id}" title="Fill credentials">Fill</button>
          <button class="edit-btn" data-id="${site.id}" title="Edit">Edit</button>
          <button class="delete-btn" data-id="${site.id}" title="Delete">Del</button>
        </div>
      `;
      listEl.appendChild(li);
    });

    // Attach events
    document.querySelectorAll('.fill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => fillSite(e.target.getAttribute('data-id')));
    });
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        editSite(e.target.getAttribute('data-id'));
      });
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = e.target.getAttribute('data-id');
        if (confirm("Delete this credential?")) {
          currentVault = currentVault.filter(s => s.id !== id);
          await saveVault(currentVault);
          await renderSiteList(searchInput.value);
          showToast("Deleted");
        }
      });
    });
  }

  async function fillSite(id) {
    const site = currentVault.find(s => s.id === id);
    if (!site) return;

    chrome.runtime.sendMessage({
      action: "fill_credentials",
      credentials: {
        username: site.username,
        password: site.password
      }
    }, (response) => {
      if (response && response.success) {
        showToast("Filled successfully!");
      } else {
        showToast("Failed to fill (no fields found)", true);
      }
    });
  }

  function editSite(id) {
    const site = currentVault.find(s => s.id === id);
    if (!site) return;

    document.getElementById('edit-title').textContent = "Edit Site";
    document.getElementById('edit-id').value = site.id;
    document.getElementById('edit-name').value = site.name;
    document.getElementById('edit-url').value = site.url;
    document.getElementById('edit-username').value = site.username;
    document.getElementById('edit-password').value = site.password;
    document.getElementById('edit-error').classList.add('hidden');
    showView('edit');
  }

  // --- Search ---
  searchInput.addEventListener('input', (e) => {
    renderSiteList(e.target.value);
  });

  // --- View: Setup ---
  const setupBtn = document.getElementById('setup-btn');
  const setupError = document.getElementById('setup-error');

  setupBtn.addEventListener('click', async () => {
    const pw1 = document.getElementById('setup-password').value;
    const pw2 = document.getElementById('setup-password-confirm').value;

    if (!pw1 || pw1.length < 4) {
      setupError.textContent = "Password must be at least 4 characters.";
      setupError.classList.remove('hidden');
      return;
    }
    if (pw1 !== pw2) {
      setupError.textContent = "Passwords do not match.";
      setupError.classList.remove('hidden');
      return;
    }

    setupError.classList.add('hidden');
    setupBtn.textContent = "Creating...";
    setupBtn.disabled = true;

    try {
      const saltBuf = CryptoUtil.generateSalt();
      const saltBase64 = CryptoUtil.ab2base64(saltBuf);
      
      const key = await CryptoUtil.deriveKey(pw1, saltBuf);
      currentKey = key;

      const encryptedVault = await CryptoUtil.encrypt([], key);

      await StorageUtil.set('vaultSalt', saltBase64);
      await StorageUtil.set('vaultData', encryptedVault);

      const exportedKey = await CryptoUtil.exportKey(key);
      await StorageUtil.setSession('vaultKey', exportedKey);

      chrome.runtime.sendMessage({ action: "vault_unlocked" });

      showToast("Vault created!");
      await renderSiteList();
      showView('list');
    } catch (e) {
      setupError.textContent = "Error creating vault.";
      setupError.classList.remove('hidden');
    } finally {
      setupBtn.textContent = "Create Vault";
      setupBtn.disabled = false;
    }
  });

  // --- View: Unlock ---
  const unlockBtn = document.getElementById('unlock-btn');
  const unlockError = document.getElementById('unlock-error');
  const unlockPasswordInput = document.getElementById('unlock-password');

  unlockBtn.addEventListener('click', async () => {
    const pw = unlockPasswordInput.value;
    if (!pw) return;

    unlockError.classList.add('hidden');
    unlockBtn.textContent = "Unlocking...";
    unlockBtn.disabled = true;

    try {
      const saltBase64 = await StorageUtil.get('vaultSalt');
      const saltBuf = CryptoUtil.base642ab(saltBase64);

      const key = await CryptoUtil.deriveKey(pw, saltBuf);
      
      const vaultData = await StorageUtil.get('vaultData');
      await CryptoUtil.decrypt(vaultData.ciphertext, vaultData.iv, key);

      currentKey = key;
      const exportedKey = await CryptoUtil.exportKey(key);
      await StorageUtil.setSession('vaultKey', exportedKey);

      chrome.runtime.sendMessage({ action: "vault_unlocked" });
      
      unlockPasswordInput.value = '';
      await renderSiteList();
      showView('list');
    } catch (e) {
      unlockError.textContent = "Incorrect password.";
      unlockError.classList.remove('hidden');
    } finally {
      unlockBtn.textContent = "Unlock";
      unlockBtn.disabled = false;
    }
  });

  unlockPasswordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') unlockBtn.click();
  });

  // --- View: Edit / Add ---
  const showAddBtn = document.getElementById('show-add-btn');
  showAddBtn.addEventListener('click', async () => {
    document.getElementById('edit-title').textContent = "Add Site";
    document.getElementById('edit-id').value = '';
    document.getElementById('edit-name').value = '';
    
    const currentDomain = await getCurrentDomain();
    document.getElementById('edit-url').value = currentDomain;
    
    document.getElementById('edit-username').value = '';
    document.getElementById('edit-password').value = '';
    document.getElementById('edit-error').classList.add('hidden');
    showView('edit');
  });

  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const saveSiteBtn = document.getElementById('save-site-btn');
  
  cancelEditBtn.addEventListener('click', () => { 
    showView('list'); 
  });

  saveSiteBtn.addEventListener('click', async () => {
    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-name').value.trim();
    const url = document.getElementById('edit-url').value.trim();
    const username = document.getElementById('edit-username').value.trim();
    const password = document.getElementById('edit-password').value;

    if (!name || !username || !password) {
      const err = document.getElementById('edit-error');
      err.textContent = "Name, username, and password are required.";
      err.classList.remove('hidden');
      return;
    }

    const newSite = {
      id: id || generateId(),
      name,
      url,
      username,
      password
    };

    if (id) {
      const idx = currentVault.findIndex(s => s.id === id);
      if (idx !== -1) currentVault[idx] = newSite;
    } else {
      currentVault.push(newSite);
    }

    await saveVault(currentVault);
    await renderSiteList(searchInput.value);
    showView('list');
    showToast('Site saved!');
  });

  // --- Global Actions ---
  lockBtn.addEventListener('click', async () => {
    currentKey = null;
    currentVault = [];
    await StorageUtil.removeSession('vaultKey');
    chrome.runtime.sendMessage({ action: "vault_locked" });
    showView('unlock');
    showToast("Vault locked");
  });

  // Start the initialization flow
  init();
});
