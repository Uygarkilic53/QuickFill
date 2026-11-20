// popup.js

const SVG_OPEN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5"/></svg>';
const SVG_EYE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
const SVG_EYE_OFF = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 6.2A10.9 10.9 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3.1 3.8"/><path d="M6.6 6.6C3.7 8.4 2 12 2 12s3.5 6 10 6c1.3 0 2.4-.2 3.4-.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>';
const SVG_LINK = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
const SVG_CHEVRON_DOWN = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
const SVG_PLUS = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
const SVG_EDIT = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>';
const SVG_TRASH = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
const FALLBACK_FAVICON = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 fill=%22%23ccc%22/></svg>';

const GENERATOR_SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.?/'
};

document.addEventListener('DOMContentLoaded', async () => {
  const views = {
    setup: document.getElementById('view-setup'),
    unlock: document.getElementById('view-unlock'),
    list: document.getElementById('view-list'),
    edit: document.getElementById('view-edit'),
    settings: document.getElementById('view-settings')
  };

  const dom = {
    lockBtn: document.getElementById('lock-btn'),
    toast: document.getElementById('toast'),
    listEl: document.getElementById('site-list'),
    searchInput: document.getElementById('search-input'),
    navVault: document.getElementById('nav-vault-btn'),
    navSettings: document.getElementById('nav-settings-btn'),

    setupBtn: document.getElementById('setup-btn'),
    setupForm: document.getElementById('setup-form'),
    setupError: document.getElementById('setup-error'),
    setupPassword: document.getElementById('setup-password'),
    setupPasswordConfirm: document.getElementById('setup-password-confirm'),

    unlockBtn: document.getElementById('unlock-btn'),
    unlockBtnLabel: document.getElementById('unlock-btn-label'),
    unlockError: document.getElementById('unlock-error'),
    unlockPassword: document.getElementById('unlock-password'),

    showAddBtn: document.getElementById('show-add-btn'),
    generatorOpenBtn: document.getElementById('generator-open-btn'),

    editTitle: document.getElementById('edit-title'),
    editId: document.getElementById('edit-id'),
    editName: document.getElementById('edit-name'),
    editUrl: document.getElementById('edit-url'),
    editUsername: document.getElementById('edit-username'),
    editPassword: document.getElementById('edit-password'),
    editError: document.getElementById('edit-error'),
    editTogglePassword: document.getElementById('edit-toggle-password'),
    editGenerateBtn: document.getElementById('edit-generate-btn'),
    editStrengthBar: document.getElementById('edit-strength-bar'),
    editStrengthLabel: document.getElementById('edit-strength-label'),
    cancelEditBtn: document.getElementById('cancel-edit-btn'),
    saveSiteBtn: document.getElementById('save-site-btn'),

    settingsLockedNote: document.getElementById('settings-locked-note'),
    settingsUnlockBtn: document.getElementById('settings-unlock-btn'),
    settingAutolock: document.getElementById('setting-autolock'),
    settingClipboard: document.getElementById('setting-clipboard'),
    settingLockOnClose: document.getElementById('setting-lock-on-close'),
    settingRequirePassword: document.getElementById('setting-require-password'),
    changeMasterBtn: document.getElementById('change-master-btn'),
    settingAutofillEnabled: document.getElementById('setting-autofill-enabled'),
    settingMatchSubdomains: document.getElementById('setting-match-subdomains'),
    settingShowToast: document.getElementById('setting-show-toast'),
    settingsAutofillList: document.getElementById('settings-autofill-list'),
    statEntries: document.getElementById('stat-entries'),
    statLastExport: document.getElementById('stat-last-export'),
    exportBtn: document.getElementById('export-btn'),
    importBtn: document.getElementById('import-btn'),
    importFile: document.getElementById('import-file'),
    resetBtn: document.getElementById('reset-btn'),
    settingThemeToggle: document.getElementById('setting-theme-toggle'),
    settingLanguage: document.getElementById('setting-language'),
    aboutVersion: document.getElementById('about-version'),

    modalReauth: document.getElementById('modal-reauth'),
    reauthPassword: document.getElementById('reauth-password'),
    reauthError: document.getElementById('reauth-error'),
    reauthCancel: document.getElementById('reauth-cancel'),
    reauthConfirm: document.getElementById('reauth-confirm'),

    modalChangeMaster: document.getElementById('modal-change-master'),
    masterCurrent: document.getElementById('master-current'),
    masterNew: document.getElementById('master-new'),
    masterConfirm: document.getElementById('master-confirm'),
    masterError: document.getElementById('master-error'),
    masterCancel: document.getElementById('master-cancel'),
    masterSave: document.getElementById('master-save'),

    modalGenerator: document.getElementById('modal-generator'),
    generatorOutput: document.getElementById('generator-output'),
    generatorStrengthBar: document.getElementById('generator-strength-bar'),
    generatorStrengthLabel: document.getElementById('generator-strength-label'),
    generatorLength: document.getElementById('generator-length'),
    generatorLengthValue: document.getElementById('generator-length-value'),
    genUpper: document.getElementById('gen-upper'),
    genLower: document.getElementById('gen-lower'),
    genNumbers: document.getElementById('gen-numbers'),
    genSymbols: document.getElementById('gen-symbols'),
    generatorError: document.getElementById('generator-error'),
    generatorRegenerate: document.getElementById('generator-regenerate'),
    generatorCopy: document.getElementById('generator-copy'),
    generatorUse: document.getElementById('generator-use'),
    generatorClose: document.getElementById('generator-close'),

    modalReset: document.getElementById('modal-reset'),
    resetInput: document.getElementById('reset-confirm-input'),
    resetError: document.getElementById('reset-error'),
    resetCancel: document.getElementById('reset-cancel'),
    resetConfirm: document.getElementById('reset-confirm')
  };

  const state = {
    settings: null,
    currentKey: null,
    currentVault: [],
    pendingView: null,
    reauthResolver: null,
    generatorContext: 'standalone',
    port: null,
    expandedLinkSites: new Set(),
    activeLinkForm: null
  };

  let toastTimer = null;

  function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, (tag) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }

  function showToast(message, isError = false) {
    dom.toast.textContent = message;
    dom.toast.style.backgroundColor = isError ? 'rgb(var(--qf-error))' : 'rgb(var(--qf-secondary))';
    dom.toast.style.color = isError ? 'rgb(var(--qf-on-error))' : 'rgb(var(--qf-on-secondary))';
    dom.toast.classList.remove('hidden');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      dom.toast.classList.add('hidden');
    }, 3000);
  }

  function showView(viewName) {
    Object.values(views).forEach((view) => view.classList.add('hidden'));
    views[viewName].classList.remove('hidden');

    const unlocked = Boolean(state.currentKey);
    const showLock = unlocked && (viewName === 'list' || viewName === 'edit' || viewName === 'settings');
    dom.lockBtn.classList.toggle('hidden', !showLock);

    const vaultActive = viewName !== 'settings';
    dom.navVault.classList.toggle('bg-primary/20', vaultActive);
    dom.navVault.classList.toggle('text-primary', vaultActive);
    dom.navVault.classList.toggle('text-on-surface-variant', !vaultActive);
    dom.navSettings.classList.toggle('bg-primary/20', !vaultActive);
    dom.navSettings.classList.toggle('text-primary', !vaultActive);
    dom.navSettings.classList.toggle('text-on-surface-variant', vaultActive);

    if (viewName === 'settings') {
      renderSettings().catch(() => {});
    }
  }

  function resolveTheme(theme) {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }
    return theme === 'light' ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    const resolved = resolveTheme(theme);
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }

  function updateThemeToggle() {
    if (!state.settings) return;
    const isDark = resolveTheme(state.settings.theme) === 'dark';
    const stateLabel = isDark ? t('settings.themeDark') : t('settings.themeLight');
    const actionLabel = isDark ? t('settings.switchToLight') : t('settings.switchToDark');
    dom.settingThemeToggle.classList.toggle('is-dark', isDark);
    dom.settingThemeToggle.setAttribute('aria-pressed', String(isDark));
    dom.settingThemeToggle.setAttribute('aria-label', stateLabel);
    dom.settingThemeToggle.setAttribute('title', actionLabel);
  }

  function formatDate(iso) {
    if (!iso) return t('options.never');
    try {
      return new Date(iso).toLocaleString(getLanguage() === 'tr' ? 'tr-TR' : 'en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch (e) {
      return t('options.never');
    }
  }

  function normalizeSiteUrl(url) {
    const raw = String(url || '').trim();
    if (!raw) return null;
    const candidate = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
      const parsed = new URL(candidate);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
      return parsed.href;
    } catch (e) {
      return null;
    }
  }

  function generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  function sendMessage(message) {
    return new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage(message, (response) => {
          if (chrome.runtime.lastError) {
            resolve(undefined);
            return;
          }
          resolve(response);
        });
      } catch (e) {
        resolve(undefined);
      }
    });
  }

  function sendActivity() {
    sendMessage({ action: 'vault_activity' });
  }

  async function getCurrentTabInfo() {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs.length > 0 && tabs[0]) {
          const tab = tabs[0];
          let domain = '';
          try {
            if (tab.url) {
              domain = new URL(tab.url).hostname;
            }
          } catch (e) {
            domain = '';
          }
          resolve({
            domain: domain,
            title: tab.title ? String(tab.title).trim() : '',
            url: tab.url || ''
          });
        } else {
          resolve({ domain: '', title: '', url: '' });
        }
      });
    });
  }

  async function getCurrentDomain() {
    const info = await getCurrentTabInfo();
    return info.domain;
  }

  function normalizeRelatedLink(rawInput, parentUrl) {
    const raw = String(rawInput || '').trim();
    if (!raw) return null;
    const parentHost = siteHostname(parentUrl);
    const parentProtocol = String(parentUrl || '').startsWith('http://') ? 'http:' : 'https:';

    if (/^https?:\/\//i.test(raw)) {
      try {
        const parsed = new URL(raw);
        return parsed.href;
      } catch (e) {
        return null;
      }
    }

    if (raw.startsWith('//')) {
      try {
        const parsed = new URL(`https:${raw}`);
        return parsed.href;
      } catch (e) {
        return null;
      }
    }

    if (raw.startsWith('/')) {
      if (!parentHost) return null;
      return `${parentProtocol}//${parentHost}${raw}`;
    }

    if (parentHost && (raw === parentHost || raw.startsWith(`${parentHost}/`) || raw.endsWith(`.${parentHost}`) || raw.includes(`.${parentHost}/`))) {
      try {
        const parsed = new URL(`${parentProtocol}//${raw}`);
        return parsed.href;
      } catch (e) {
        return null;
      }
    }

    if (parentHost) {
      try {
        const parsed = new URL(`${parentProtocol}//${parentHost}/${raw}`);
        return parsed.href;
      } catch (e) {
        return null;
      }
    }

    try {
      const parsed = new URL(`https://${raw}`);
      return parsed.href;
    } catch (e) {
      return null;
    }
  }

  function displayLinkPath(linkUrl, parentUrl) {
    if (!linkUrl) return '';
    try {
      const parsed = new URL(linkUrl);
      const parentHost = siteHostname(parentUrl);
      if (parentHost && normalizeHost(parsed.hostname) === parentHost) {
        return parsed.pathname + parsed.search + parsed.hash || '/';
      }
      return parsed.hostname + (parsed.pathname === '/' ? '' : parsed.pathname) + parsed.search;
    } catch (e) {
      return linkUrl;
    }
  }

  async function loadVault() {
    const vaultData = await StorageUtil.get('vaultData');
    if (!vaultData || !vaultData.ciphertext || !state.currentKey) return [];
    const vault = await CryptoUtil.decrypt(vaultData.ciphertext, vaultData.iv, state.currentKey);
    return Array.isArray(vault) ? vault : [];
  }

  async function saveVault(vault) {
    if (!state.currentKey) throw new Error('Vault is locked');
    const encryptedVault = await CryptoUtil.encrypt(vault, state.currentKey);
    await StorageUtil.set('vaultData', encryptedVault);
  }

  function openModal(modal) {
    modal.classList.remove('hidden');
  }

  function closeModal(modal) {
    modal.classList.add('hidden');
  }

  // --- Password strength and generator ---

  function passwordEntropy(password) {
    if (!password) return 0;
    let pool = 0;
    if (/[a-z]/.test(password)) pool += 26;
    if (/[A-Z]/.test(password)) pool += 26;
    if (/[0-9]/.test(password)) pool += 10;
    if (/[^A-Za-z0-9]/.test(password)) pool += 33;
    if (!pool) return 0;
    return password.length * Math.log2(pool);
  }

  function strengthInfo(password) {
    const entropy = passwordEntropy(password);
    if (!password) return { entropy: 0, label: '', className: '' };
    if (entropy < 45) return { entropy: entropy, label: t('strength.weak'), className: 'bg-error' };
    if (entropy < 75) return { entropy: entropy, label: t('strength.medium'), className: 'bg-tertiary' };
    return { entropy: entropy, label: t('strength.strong'), className: 'bg-secondary' };
  }

  function paintStrength(bar, labelEl, password) {
    const info = strengthInfo(password);
    bar.classList.remove('bg-error', 'bg-tertiary', 'bg-secondary');
    if (info.className) bar.classList.add(info.className);
    bar.style.width = `${Math.min(100, Math.round(info.entropy))}%`;
    if (labelEl) labelEl.textContent = info.label;
  }

  function updateEditStrength() {
    paintStrength(dom.editStrengthBar, dom.editStrengthLabel, dom.editPassword.value);
  }

  function updateGeneratorStrength() {
    paintStrength(dom.generatorStrengthBar, dom.generatorStrengthLabel, dom.generatorOutput.value);
  }

  function randomInt(max) {
    const limit = Math.floor(0x100000000 / max) * max;
    const buffer = new Uint32Array(1);
    let value;
    do {
      crypto.getRandomValues(buffer);
      value = buffer[0];
    } while (value >= limit);
    return value % max;
  }

  function generatePassword() {
    const sets = [];
    if (dom.genUpper.checked) sets.push(GENERATOR_SETS.upper);
    if (dom.genLower.checked) sets.push(GENERATOR_SETS.lower);
    if (dom.genNumbers.checked) sets.push(GENERATOR_SETS.numbers);
    if (dom.genSymbols.checked) sets.push(GENERATOR_SETS.symbols);

    if (sets.length === 0) {
      dom.generatorOutput.value = '';
      dom.generatorError.classList.remove('hidden');
      updateGeneratorStrength();
      return;
    }

    dom.generatorError.classList.add('hidden');
    const length = Number(dom.generatorLength.value);
    const pool = sets.join('');
    const chars = [];

    sets.forEach((set) => chars.push(set[randomInt(set.length)]));
    while (chars.length < length) {
      chars.push(pool[randomInt(pool.length)]);
    }
    for (let i = chars.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      const tmp = chars[i];
      chars[i] = chars[j];
      chars[j] = tmp;
    }

    dom.generatorOutput.value = chars.slice(0, length).join('');
    updateGeneratorStrength();
  }

  function openGenerator(context) {
    state.generatorContext = context;
    dom.generatorUse.classList.toggle('hidden', context !== 'edit');
    dom.generatorError.classList.add('hidden');
    dom.generatorLength.value = '20';
    dom.generatorLengthValue.textContent = '20';
    openModal(dom.modalGenerator);
    generatePassword();
  }

  // --- Re-authentication ---

  function requestReauth() {
    return new Promise((resolve) => {
      state.reauthResolver = resolve;
      dom.reauthPassword.value = '';
      dom.reauthError.classList.add('hidden');
      openModal(dom.modalReauth);
      setTimeout(() => dom.reauthPassword.focus(), 50);
    });
  }

  function finishReauth(result) {
    closeModal(dom.modalReauth);
    const resolver = state.reauthResolver;
    state.reauthResolver = null;
    dom.reauthPassword.value = '';
    if (resolver) resolver(result);
  }

  async function confirmReauth() {
    const password = dom.reauthPassword.value;
    if (!password) return;

    try {
      const saltBase64 = await StorageUtil.get('vaultSalt');
      const sessionKey = await StorageUtil.getSession('vaultKey');
      if (!saltBase64 || !sessionKey) {
        finishReauth(false);
        return;
      }
      const salt = CryptoUtil.base642ab(saltBase64);
      const key = await CryptoUtil.deriveKey(password, salt);
      const exported = await CryptoUtil.exportKey(key);
      if (exported === sessionKey) {
        finishReauth(true);
      } else {
        dom.reauthError.classList.remove('hidden');
        dom.reauthPassword.select();
      }
    } catch (e) {
      dom.reauthError.classList.remove('hidden');
    }
  }

  // --- Clipboard ---

  async function copyText(text) {
    if (!text) return false;
    const response = await sendMessage({
      action: 'copy_credential',
      text: text,
      clearSeconds: state.settings.clipboardClearSeconds
    });
    if (response && response.success) {
      showToast(t('toast.copied'));
      sendActivity();
      return true;
    }
    try {
      await navigator.clipboard.writeText(text);
      showToast(t('toast.copied'));
      sendActivity();
      return true;
    } catch (e) {
      showToast(t('toast.copyFailed'), true);
      return false;
    }
  }

  async function copySiteField(site, field) {
    if (!state.currentKey) {
      showToast(t('toast.unlockFirst'), true);
      return;
    }
    if (state.settings.requirePasswordForReveal) {
      const ok = await requestReauth();
      if (!ok) return;
    }
    await copyText(site[field]);
  }

  function navigateToUrl(url, newTab = true) {
    if (!url) return;
    try {
      if (newTab) {
        chrome.tabs.create({ url: url, active: false });
      } else {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs && tabs.length > 0 && tabs[0] && tabs[0].id) {
            chrome.tabs.update(tabs[0].id, { url: url }, () => {
              if (chrome.runtime.lastError) {
                chrome.tabs.create({ url: url, active: false });
              }
            });
          } else {
            chrome.tabs.create({ url: url, active: false });
          }
        });
      }
    } catch (e) {
      chrome.tabs.create({ url: url, active: false });
    }
  }

  function openSite(site, newTab = true) {
    const url = normalizeSiteUrl(site.url);
    if (!url) {
      showToast(t('toast.invalidSite'), true);
      return;
    }
    navigateToUrl(url, newTab);
  }

  // --- Site list ---

  function updateLinksBadge(panelEl, count) {
    const cardEl = panelEl ? panelEl.closest('[data-site-card-id]') : null;
    if (cardEl) {
      const badgeEl = cardEl.querySelector('.links-count-badge');
      if (badgeEl) {
        badgeEl.textContent = count > 0 ? `${t('list.links')} (${count})` : t('list.links');
      }
    }
  }

  async function autoAddCurrentTabLink(site, panelEl) {
    const tabInfo = await getCurrentTabInfo();
    const siteDomain = siteHostname(site.url);

    const tabUrl = String(tabInfo.url || '').trim();
    const isValidHttp = /^https?:\/\//i.test(tabUrl);

    const tabDomain = siteHostname(tabUrl) || tabInfo.domain;
    const isMatchingSite = isValidHttp && siteDomain && (
      normalizeHost(tabDomain) === siteDomain ||
      domainMatches(tabDomain, site.url, true) ||
      tabUrl.toLowerCase().includes(siteDomain.toLowerCase())
    );

    if (isMatchingSite) {
      const alreadyExists = site.links.some((l) => l.url === tabUrl);
      if (alreadyExists) {
        showToast(t('list.linkAlreadyAdded'));
        return;
      }

      const path = displayLinkPath(tabUrl, site.url);
      const title = tabInfo.title || path || tabUrl;

      site.links.push({
        id: generateId(),
        title: title,
        url: tabUrl
      });

      await saveVault(state.currentVault);
      sendActivity();

      updateLinksBadge(panelEl, site.links.length);
      await renderLinksPanel(site, panelEl);
      showToast(t('list.linkSaved'));
    } else {
      state.activeLinkForm = { siteId: site.id, linkId: null };
      await renderLinksPanel(site, panelEl);
      showToast(t('list.tabNotMatching'));
    }
  }

  async function renderLinksPanel(site, panelEl) {
    if (!panelEl) return;
    site.links = Array.isArray(site.links) ? site.links : [];
    panelEl.innerHTML = '';

    const isFormActive = state.activeLinkForm && state.activeLinkForm.siteId === site.id;
    const editingLinkId = isFormActive ? state.activeLinkForm.linkId : null;
    const editingLink = editingLinkId ? site.links.find((l) => l.id === editingLinkId) : null;

    const headerEl = document.createElement('div');
    headerEl.className = 'flex items-center justify-between text-[11px] font-medium text-on-surface-variant mb-xs';
    headerEl.innerHTML = `
      <span class="uppercase tracking-wider font-label-caps text-[10px] text-primary">${escapeHTML(t('list.linksTitle'))}</span>
      <div class="flex items-center gap-xs">
        <button type="button" class="add-manual-link-btn flex items-center gap-1 px-xs py-[2px] rounded border border-outline-variant/30 hover:border-primary/40 text-on-surface-variant hover:text-primary transition-colors text-[10px] ${isFormActive && !editingLinkId ? 'hidden' : ''}" data-site-id="${escapeHTML(site.id)}" title="${escapeHTML(t('list.addManualLink'))}">
          <span>${escapeHTML(t('list.addManual'))}</span>
        </button>
        <button type="button" class="add-link-btn flex items-center gap-1 px-xs py-[2px] rounded bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-[11px] ${isFormActive && !editingLinkId ? 'hidden' : ''}" data-site-id="${escapeHTML(site.id)}" title="${escapeHTML(t('list.addLink'))}">
          ${SVG_PLUS}
          <span>${escapeHTML(t('list.addLink'))}</span>
        </button>
      </div>
    `;
    panelEl.appendChild(headerEl);

    const addBtn = headerEl.querySelector('.add-link-btn');
    if (addBtn) {
      addBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await autoAddCurrentTabLink(site, panelEl);
      });
    }

    const addManualBtn = headerEl.querySelector('.add-manual-link-btn');
    if (addManualBtn) {
      addManualBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.activeLinkForm = { siteId: site.id, linkId: null };
        renderLinksPanel(site, panelEl);
      });
    }

    if (isFormActive) {
      let initialTitle = '';
      let initialUrl = '';

      if (editingLink) {
        initialTitle = editingLink.title || '';
        initialUrl = editingLink.url || '';
      } else {
        const tabInfo = await getCurrentTabInfo();
        const siteDomain = siteHostname(site.url);
        if (siteDomain && (domainMatches(tabInfo.domain, site.url, true) || tabInfo.domain.includes(siteDomain))) {
          initialTitle = tabInfo.title || '';
          initialUrl = tabInfo.url || '';
        } else if (siteDomain) {
          initialTitle = '';
          initialUrl = `https://${siteDomain}/`;
        } else {
          initialTitle = '';
          initialUrl = '';
        }
      }

      const formEl = document.createElement('div');
      formEl.className = 'link-inline-form bg-surface-container/60 rounded-md p-xs flex flex-col gap-xs border border-outline-variant/30 my-xs';
      formEl.innerHTML = `
        <input type="text" class="link-title-input glass-input rounded px-xs py-[4px] text-xs text-on-surface placeholder:text-outline/60 w-full" placeholder="${escapeHTML(t('list.linkTitlePlaceholder'))}" value="${escapeHTML(initialTitle)}">
        <input type="text" class="link-url-input glass-input rounded px-xs py-[4px] text-xs text-on-surface placeholder:text-outline/60 font-mono w-full" placeholder="${escapeHTML(t('list.linkUrlPlaceholder'))}" value="${escapeHTML(initialUrl)}">
        <div class="link-form-error text-error text-[11px] hidden"></div>
        <div class="flex items-center justify-end gap-xs mt-1">
          <button type="button" class="cancel-link-form-btn text-xs px-sm py-[3px] rounded bg-surface-variant text-on-surface hover:bg-outline-variant transition-colors">${escapeHTML(t('common.cancel'))}</button>
          <button type="button" class="save-link-form-btn text-xs px-sm py-[3px] rounded bg-[#3B82F6] text-white hover:bg-blue-400 transition-colors font-medium">${escapeHTML(t('common.save'))}</button>
        </div>
      `;
      panelEl.appendChild(formEl);

      const titleInput = formEl.querySelector('.link-title-input');
      const urlInput = formEl.querySelector('.link-url-input');
      const errorEl = formEl.querySelector('.link-form-error');
      const cancelBtn = formEl.querySelector('.cancel-link-form-btn');
      const saveBtn = formEl.querySelector('.save-link-form-btn');

      cancelBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.activeLinkForm = null;
        renderLinksPanel(site, panelEl);
      });

      const handleSave = async (e) => {
        if (e) e.stopPropagation();
        const rawTitle = titleInput.value.trim();
        const rawUrl = urlInput.value.trim();
        const normalized = normalizeRelatedLink(rawUrl, site.url);

        if (!normalized) {
          errorEl.textContent = t('list.invalidLinkUrl');
          errorEl.classList.remove('hidden');
          return;
        }

        const path = displayLinkPath(normalized, site.url);
        const finalTitle = rawTitle || path || normalized;

        if (editingLinkId) {
          const link = site.links.find((l) => l.id === editingLinkId);
          if (link) {
            link.title = finalTitle;
            link.url = normalized;
          }
        } else {
          site.links.push({
            id: generateId(),
            title: finalTitle,
            url: normalized
          });
        }

        await saveVault(state.currentVault);
        sendActivity();
        state.activeLinkForm = null;

        updateLinksBadge(panelEl, site.links.length);
        await renderLinksPanel(site, panelEl);
        showToast(t('list.linkSaved'));
      };

      saveBtn.addEventListener('click', handleSave);

      titleInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSave();
        } else if (e.key === 'Escape') {
          cancelBtn.click();
        }
      });

      urlInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSave();
        } else if (e.key === 'Escape') {
          cancelBtn.click();
        }
      });

      setTimeout(() => {
        if (!initialTitle) titleInput.focus();
        else urlInput.focus();
      }, 50);
    }

    if (site.links.length === 0 && !isFormActive) {
      const emptyEl = document.createElement('div');
      emptyEl.className = 'text-[11px] text-on-surface-variant/60 italic py-xs text-center';
      emptyEl.textContent = t('list.noLinks');
      panelEl.appendChild(emptyEl);
      return;
    }

    const ul = document.createElement('ul');
    ul.className = 'flex flex-col gap-[2px] w-full';

    site.links.forEach((link) => {
      if (isFormActive && editingLinkId === link.id) return;
      const pathText = displayLinkPath(link.url, site.url);
      const titleText = link.title || pathText || link.url;

      const li = document.createElement('li');
      li.className = 'flex items-center justify-between gap-xs py-1 px-xs rounded hover:bg-surface-variant/30 group transition-colors';
      li.innerHTML = `
        <a href="${escapeHTML(link.url)}" class="site-sublink-item flex-1 min-w-0 flex items-center gap-xs cursor-pointer text-left no-underline" title="${escapeHTML(link.url)}">
          <span class="text-on-surface-variant group-hover:text-primary shrink-0">${SVG_LINK}</span>
          <div class="min-w-0 flex-1 truncate">
            <span class="text-xs text-on-surface font-medium group-hover:text-primary transition-colors truncate block">${escapeHTML(titleText)}</span>
            <span class="text-[10px] text-on-surface-variant/70 block truncate font-mono">${escapeHTML(pathText)}</span>
          </div>
          <span class="text-on-surface-variant/50 group-hover:text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">${SVG_OPEN}</span>
        </a>
        <div class="flex items-center gap-[2px] shrink-0">
          <button type="button" class="edit-link-btn icon-btn p-[2px] w-[22px] h-[22px] flex items-center justify-center text-on-surface-variant hover:text-primary rounded" data-site-id="${escapeHTML(site.id)}" data-link-id="${escapeHTML(link.id)}" title="${escapeHTML(t('list.editLink'))}">
            ${SVG_EDIT}
          </button>
          <button type="button" class="delete-link-btn icon-btn p-[2px] w-[22px] h-[22px] flex items-center justify-center text-on-surface-variant hover:text-error rounded" data-site-id="${escapeHTML(site.id)}" data-link-id="${escapeHTML(link.id)}" title="${escapeHTML(t('list.deleteLink'))}">
            ${SVG_TRASH}
          </button>
        </div>
      `;

      const linkEl = li.querySelector('.site-sublink-item');
      linkEl.addEventListener('click', (e) => {
        e.preventDefault();
        navigateToUrl(link.url, true);
        sendActivity();
      });
      linkEl.addEventListener('auxclick', (e) => {
        if (e.button === 1) {
          e.preventDefault();
          navigateToUrl(link.url, true);
          sendActivity();
        }
      });

      li.querySelector('.edit-link-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        state.activeLinkForm = { siteId: site.id, linkId: link.id };
        renderLinksPanel(site, panelEl);
      });

      li.querySelector('.delete-link-btn').addEventListener('click', async (e) => {
        e.stopPropagation();
        if (!confirm(t('list.confirmDeleteLink'))) return;
        site.links = site.links.filter((l) => l.id !== link.id);
        await saveVault(state.currentVault);
        sendActivity();

        if (state.activeLinkForm && state.activeLinkForm.linkId === link.id) {
          state.activeLinkForm = null;
        }

        updateLinksBadge(panelEl, site.links.length);
        await renderLinksPanel(site, panelEl);
        showToast(t('list.linkDeleted'));
      });

      ul.appendChild(li);
    });

    panelEl.appendChild(ul);
  }

  async function renderSiteList(filter = '') {
    if (!state.currentKey) return;
    state.currentVault = await loadVault();
    dom.listEl.innerHTML = '';

    const currentDomain = await getCurrentDomain();
    let displaySites = state.currentVault;

    if (filter) {
      const needle = filter.toLowerCase();
      displaySites = displaySites.filter((site) =>
        (site.name || '').toLowerCase().includes(needle) ||
        (site.url || '').toLowerCase().includes(needle) ||
        (site.username || '').toLowerCase().includes(needle) ||
        (Array.isArray(site.links) && site.links.some((l) =>
          (l.title || '').toLowerCase().includes(needle) ||
          (l.url || '').toLowerCase().includes(needle)
        ))
      );
    }

    displaySites.sort((a, b) => {
      const aMatch = currentDomain && domainMatches(currentDomain, a.url, true);
      const bMatch = currentDomain && domainMatches(currentDomain, b.url, true);
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return (a.name || '').localeCompare(b.name || '');
    });

    if (displaySites.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'text-center text-on-surface-variant text-body-small mt-md';
      empty.textContent = t('list.empty');
      dom.listEl.appendChild(empty);
      return;
    }

    displaySites.forEach((site) => {
      site.links = Array.isArray(site.links) ? site.links : [];
      const li = document.createElement('li');
      li.className = 'glass-card rounded-lg p-sm flex flex-col gap-xs overflow-hidden w-full';
      li.setAttribute('data-site-card-id', site.id);

      const domain = siteHostname(site.url) || 'example.com';
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`;
      const name = escapeHTML(site.name);
      const username = escapeHTML(site.username);
      const id = escapeHTML(site.id);
      const isOpen = state.expandedLinkSites.has(site.id);
      const linksCount = site.links.length;
      const linksBadgeText = linksCount > 0 ? `${t('list.links')} (${linksCount})` : t('list.links');

      li.innerHTML = `
        <div class="flex items-center gap-sm w-full">
          <div class="w-[32px] h-[32px] bg-white rounded flex items-center justify-center flex-shrink-0">
            <img class="w-[20px] h-[20px] object-contain" src="${faviconUrl}" alt="">
          </div>
          <div class="flex-1 min-w-0">
            <div class="font-headline-sm text-headline-sm text-on-surface truncate">${name}</div>
            <div class="font-body-small text-body-small text-on-surface-variant truncate">${username}</div>
          </div>
          <div class="flex items-center gap-xs shrink-0">
            <label class="switch" style="transform: scale(0.7); margin-bottom: 0;" title="${escapeHTML(t('list.autofillTitle'))}">
              <input type="checkbox" class="site-autofill-toggle" data-id="${id}" ${site.autoFill ? 'checked' : ''}>
              <span class="slider round"></span>
            </label>
            <button class="fill-btn icon-btn p-xs flex items-center justify-center w-[28px] h-[28px] text-primary" data-id="${id}" title="${escapeHTML(t('list.fillTitle'))}">
              <span class="material-symbols-outlined text-[18px]" data-weight="fill" style="font-variation-settings: 'FILL' 1;">login</span>
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between gap-xs w-full border-t border-outline-variant/20 pt-xs">
          <button type="button" class="links-toggle-btn icon-btn px-xs py-[2px] h-[26px] flex items-center gap-1 text-[11px] font-medium text-on-surface-variant hover:text-primary transition-colors rounded" data-id="${id}" title="${escapeHTML(t('list.linksTitle'))}">
            ${SVG_LINK}
            <span class="links-count-badge">${escapeHTML(linksBadgeText)}</span>
            <span class="chevron-icon inline-flex transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}">
              ${SVG_CHEVRON_DOWN}
            </span>
          </button>
          <div class="flex items-center gap-xs">
            <button class="copy-user-btn icon-btn p-xs flex items-center justify-center w-[26px] h-[26px]" data-id="${id}" title="${escapeHTML(t('list.copyUserTitle'))}">
              <span class="material-symbols-outlined text-[16px]">person</span>
            </button>
            <button class="copy-pass-btn icon-btn p-xs flex items-center justify-center w-[26px] h-[26px]" data-id="${id}" title="${escapeHTML(t('list.copyPassTitle'))}">
              <span class="material-symbols-outlined text-[16px]">key</span>
            </button>
            <button class="open-btn icon-btn p-xs flex items-center justify-center w-[26px] h-[26px]" data-id="${id}" title="${escapeHTML(t('list.openTitle'))}">
              ${SVG_OPEN}
            </button>
            <button class="edit-btn icon-btn p-xs flex items-center justify-center w-[26px] h-[26px]" data-id="${id}" title="${escapeHTML(t('list.editTitle'))}">
              <span class="material-symbols-outlined text-[16px]">edit</span>
            </button>
            <button class="delete-btn icon-btn p-xs flex items-center justify-center w-[26px] h-[26px] hover:text-error" data-id="${id}" title="${escapeHTML(t('list.deleteTitle'))}">
              <span class="material-symbols-outlined text-[16px]">delete</span>
            </button>
          </div>
        </div>
        <div class="site-links-panel flex flex-col gap-xs mt-xs pt-xs border-t border-outline-variant/15 ${isOpen ? '' : 'hidden'}" data-site-links-id="${id}"></div>
      `;
      const favicon = li.querySelector('img');
      if (favicon) {
        favicon.addEventListener('error', () => {
          favicon.src = FALLBACK_FAVICON;
        }, { once: true });
      }
      dom.listEl.appendChild(li);

      if (isOpen) {
        const panelEl = li.querySelector('.site-links-panel');
        renderLinksPanel(site, panelEl);
      }
    });

    dom.listEl.querySelectorAll('.links-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = e.currentTarget.getAttribute('data-id');
        const site = state.currentVault.find((s) => s.id === id);
        if (!site) return;

        const card = e.currentTarget.closest('[data-site-card-id]');
        const panel = card ? card.querySelector('.site-links-panel') : null;
        const chevron = e.currentTarget.querySelector('.chevron-icon');

        if (state.expandedLinkSites.has(id)) {
          state.expandedLinkSites.delete(id);
          if (panel) panel.classList.add('hidden');
          if (chevron) chevron.classList.remove('rotate-180');
        } else {
          state.expandedLinkSites.add(id);
          if (panel) {
            panel.classList.remove('hidden');
            await renderLinksPanel(site, panel);
          }
          if (chevron) chevron.classList.add('rotate-180');
        }
      });
    });

    dom.listEl.querySelectorAll('.site-autofill-toggle').forEach((toggle) => {
      toggle.addEventListener('change', async (e) => {
        const id = e.target.getAttribute('data-id');
        const isChecked = e.target.checked;
        const siteIndex = state.currentVault.findIndex((s) => s.id === id);
        if (siteIndex === -1) return;

        const site = state.currentVault[siteIndex];

        if (isChecked) {
          const domain = siteHostname(site.url);
          state.currentVault.forEach((other) => {
            if (other.id !== id && domain && siteHostname(other.url) === domain) {
              other.autoFill = false;
            }
          });
        }

        state.currentVault[siteIndex].autoFill = isChecked;
        await saveVault(state.currentVault);
        sendActivity();

        if (isChecked) {
          await renderSiteList(dom.searchInput.value);
        }
        showToast(isChecked ? t('list.autofillOn') : t('list.autofillOff'));
      });
    });

    dom.listEl.querySelectorAll('.fill-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => fillSite(e.currentTarget.getAttribute('data-id')));
    });
    dom.listEl.querySelectorAll('.copy-user-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const site = state.currentVault.find((s) => s.id === e.currentTarget.getAttribute('data-id'));
        if (site) copySiteField(site, 'username');
      });
    });
    dom.listEl.querySelectorAll('.copy-pass-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const site = state.currentVault.find((s) => s.id === e.currentTarget.getAttribute('data-id'));
        if (site) copySiteField(site, 'password');
      });
    });
    dom.listEl.querySelectorAll('.open-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const site = state.currentVault.find((s) => s.id === btn.getAttribute('data-id'));
        if (site) openSite(site, true);
      });
      btn.addEventListener('auxclick', (e) => {
        if (e.button === 1) {
          const site = state.currentVault.find((s) => s.id === btn.getAttribute('data-id'));
          if (site) openSite(site, true);
        }
      });
    });
    dom.listEl.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        editSite(e.currentTarget.getAttribute('data-id'));
      });
    });
    dom.listEl.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const id = e.currentTarget.getAttribute('data-id');
        if (!confirm(t('list.confirmDelete'))) return;
        state.currentVault = state.currentVault.filter((s) => s.id !== id);
        state.expandedLinkSites.delete(id);
        if (state.activeLinkForm && state.activeLinkForm.siteId === id) {
          state.activeLinkForm = null;
        }
        await saveVault(state.currentVault);
        await renderSiteList(dom.searchInput.value);
        showToast(t('list.deleted'));
      });
    });
  }

  async function fillSite(id) {
    const site = state.currentVault.find((s) => s.id === id);
    if (!site) return;

    const response = await sendMessage({
      action: 'fill_credentials',
      credentials: { username: site.username, password: site.password }
    });

    if (response && response.success) {
      showToast(t('list.filled'));
      sendActivity();
    } else {
      showToast(t('list.fillFailed'), true);
    }
  }

  function resetEditPasswordVisibility() {
    dom.editPassword.type = 'password';
    dom.editTogglePassword.innerHTML = SVG_EYE;
    dom.editTogglePassword.setAttribute('title', t('edit.showPassword'));
    dom.editTogglePassword.setAttribute('data-i18n-title', 'edit.showPassword');
  }

  function clearEditPassword() {
    dom.editPassword.value = '';
    resetEditPasswordVisibility();
    updateEditStrength();
  }

  function clearMasterFields() {
    dom.masterCurrent.value = '';
    dom.masterNew.value = '';
    dom.masterConfirm.value = '';
    dom.masterError.classList.add('hidden');
  }

  function editSite(id) {
    const site = state.currentVault.find((s) => s.id === id);
    if (!site) return;

    dom.editTitle.textContent = t('edit.editTitle');
    dom.editId.value = site.id;
    dom.editName.value = site.name;
    dom.editUrl.value = site.url;
    dom.editUsername.value = site.username;
    dom.editPassword.value = site.password;
    dom.editError.classList.add('hidden');
    resetEditPasswordVisibility();
    updateEditStrength();
    showView('edit');
  }

  async function showAddSite() {
    dom.editTitle.textContent = t('edit.addTitle');
    dom.editId.value = '';
    const tabInfo = await getCurrentTabInfo();
    dom.editName.value = tabInfo.title || '';
    dom.editUrl.value = tabInfo.domain || '';
    dom.editUsername.value = '';
    dom.editPassword.value = '';
    dom.editError.classList.add('hidden');
    resetEditPasswordVisibility();
    updateEditStrength();
    showView('edit');
  }

  // --- Settings ---

  function populateSettingsControls() {
    dom.settingAutolock.value = String(state.settings.autoLockMinutes);
    dom.settingClipboard.value = String(state.settings.clipboardClearSeconds);
    dom.settingLockOnClose.checked = state.settings.lockOnClose;
    dom.settingRequirePassword.checked = state.settings.requirePasswordForReveal;
    dom.settingAutofillEnabled.checked = state.settings.autoFillEnabled;
    dom.settingMatchSubdomains.checked = state.settings.matchSubdomains;
    dom.settingShowToast.checked = state.settings.showAutofillToast;
    dom.settingLanguage.value = state.settings.language;
    dom.aboutVersion.textContent = chrome.runtime.getManifest().version;
    updateThemeToggle();
  }

  async function saveSetting(patch) {
    try {
      state.settings = await SettingsUtil.set(patch);
    } catch (e) {
      showToast(t('settings.saveFailed'), true);
      return;
    }
    if (Object.prototype.hasOwnProperty.call(patch, 'theme')) {
      applyTheme(state.settings.theme);
      updateThemeToggle();
    }
    if (Object.prototype.hasOwnProperty.call(patch, 'language')) {
      setLanguage(state.settings.language);
      applyI18n();
      refreshDynamicText();
      if (state.currentKey) await renderSiteList(dom.searchInput.value);
      await renderSettings();
    }
    sendMessage({ action: 'settings_updated' });
    showToast(t('settings.saved'));
  }

  function refreshDynamicText() {
    if (!views.edit.classList.contains('hidden')) {
      dom.editTitle.textContent = dom.editId.value ? t('edit.editTitle') : t('edit.addTitle');
    }
    updateEditStrength();
    if (!dom.modalGenerator.classList.contains('hidden')) {
      updateGeneratorStrength();
    }
    if (!dom.modalReauth.classList.contains('hidden')) {
      dom.reauthError.textContent = t('reauth.error');
    }
    updateThemeToggle();
    dom.statLastExport.textContent = state.settings.lastExportAt ? formatDate(state.settings.lastExportAt) : t('options.never');
  }

  async function renderSettings() {
    if (!state.settings) return;
    const unlocked = Boolean(state.currentKey);
    dom.settingsLockedNote.classList.toggle('hidden', unlocked);
    dom.settingsLockedNote.classList.toggle('flex', !unlocked);
    dom.changeMasterBtn.disabled = !unlocked;

    if (unlocked) {
      try {
        state.currentVault = await loadVault();
        dom.statEntries.textContent = String(state.currentVault.length);
      } catch (e) {
        state.currentVault = [];
        dom.statEntries.textContent = '—';
      }
    } else {
      dom.statEntries.textContent = '—';
    }
    dom.statLastExport.textContent = state.settings.lastExportAt ? formatDate(state.settings.lastExportAt) : t('options.never');

    renderAutofillSites();
  }

  function renderAutofillSites() {
    dom.settingsAutofillList.innerHTML = '';
    if (!state.currentKey) return;

    const enabled = state.currentVault.filter((site) => site.autoFill);
    if (enabled.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'text-body-small text-on-surface-variant';
      empty.textContent = t('settings.noEnabledSites');
      dom.settingsAutofillList.appendChild(empty);
      return;
    }

    enabled.forEach((site) => {
      const li = document.createElement('li');
      li.className = 'flex items-center justify-between gap-sm rounded-lg bg-surface-container/40 px-sm py-xs';
      const domain = siteHostname(site.url);
      li.innerHTML = `
        <div class="min-w-0">
          <div class="font-body-small text-body-small text-on-surface truncate">${escapeHTML(site.name)}</div>
          <div class="text-[11px] leading-4 text-on-surface-variant truncate">${escapeHTML(domain)}</div>
        </div>
        <button type="button" class="shrink-0 text-[11px] px-xs py-[2px] rounded border border-outline-variant/40 text-on-surface-variant hover:text-error hover:border-error/40 transition-colors disable-autofill-btn" data-id="${escapeHTML(site.id)}">${escapeHTML(t('settings.disable'))}</button>
      `;
      dom.settingsAutofillList.appendChild(li);
    });

    dom.settingsAutofillList.querySelectorAll('.disable-autofill-btn').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const site = state.currentVault.find((s) => s.id === id);
        if (!site) return;
        site.autoFill = false;
        await saveVault(state.currentVault);
        await renderSiteList(dom.searchInput.value);
        await renderSettings();
        showToast(t('list.autofillOff'));
      });
    });
  }

  function isValidBackup(payload) {
    if (!payload || typeof payload !== 'object') return false;
    if (typeof payload.vaultSalt !== 'string' || !payload.vaultSalt || payload.vaultSalt.length > 512) return false;
    if (!/^[A-Za-z0-9+/=]+$/.test(payload.vaultSalt)) return false;
    if (!payload.vaultData || typeof payload.vaultData !== 'object') return false;
    const ciphertext = payload.vaultData.ciphertext;
    const iv = payload.vaultData.iv;
    if (typeof ciphertext !== 'string' || !ciphertext || ciphertext.length > 10000000) return false;
    if (!/^[A-Za-z0-9+/=]+$/.test(ciphertext)) return false;
    if (typeof iv !== 'string' || !iv || iv.length > 64) return false;
    if (!/^[A-Za-z0-9+/=]+$/.test(iv)) return false;
    return true;
  }

  async function exportBackup() {
    const vaultSalt = await StorageUtil.get('vaultSalt');
    const vaultData = await StorageUtil.get('vaultData');
    if (!vaultSalt || !vaultData || !vaultData.ciphertext) {
      showToast(t('toast.unlockFirst'), true);
      return;
    }

    const payload = {
      app: 'QuickFill',
      format: 'encrypted-vault',
      version: 1,
      exportedAt: new Date().toISOString(),
      vaultSalt: vaultSalt,
      vaultData: {
        ciphertext: vaultData.ciphertext,
        iv: vaultData.iv
      }
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `quickfill-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    state.settings = await SettingsUtil.set({ lastExportAt: payload.exportedAt });
    dom.statLastExport.textContent = formatDate(payload.exportedAt);
    showToast(t('settings.backupDownloaded'));
  }

  async function importBackup(file) {
    if (!file || file.size > 5 * 1024 * 1024) {
      showToast(t('settings.invalidBackup'), true);
      return;
    }

    let payload;
    try {
      payload = JSON.parse(await file.text());
    } catch (e) {
      showToast(t('settings.invalidBackup'), true);
      return;
    }

    if (!isValidBackup(payload)) {
      showToast(t('settings.invalidBackup'), true);
      return;
    }

    if (!confirm(t('settings.importConfirm'))) return;

    await StorageUtil.setMany({
      vaultSalt: payload.vaultSalt,
      vaultData: {
        ciphertext: payload.vaultData.ciphertext,
        iv: payload.vaultData.iv
      }
    });
    await StorageUtil.removeSession('vaultKey');
    state.currentKey = null;
    state.currentVault = [];
    clearEditPassword();
    sendMessage({ action: 'vault_locked' });
    showView('unlock');
    showToast(t('settings.imported'));
  }

  async function resetVault() {
    if (dom.resetInput.value !== 'DELETE') {
      dom.resetError.classList.remove('hidden');
      return;
    }

    await StorageUtil.removeMany(['vaultSalt', 'vaultData']);
    await StorageUtil.removeSession('vaultKey');
    state.currentKey = null;
    state.currentVault = [];
    clearEditPassword();
    state.settings = await SettingsUtil.set({ lastExportAt: null });
    sendMessage({ action: 'vault_locked' });
    closeModal(dom.modalReset);
    dom.resetInput.value = '';
    dom.resetError.classList.add('hidden');
    showView('setup');
    showToast(t('settings.resetDone'));
  }

  // --- Vault lifecycle ---

  async function lockNow() {
    state.currentKey = null;
    state.currentVault = [];
    clearEditPassword();
    await StorageUtil.removeSession('vaultKey');
    sendMessage({ action: 'vault_locked' });
    showView('unlock');
    showToast(t('toast.vaultLocked'));
  }

  async function initVault() {
    const saltBase64 = await StorageUtil.get('vaultSalt');
    const exportedKey = await StorageUtil.getSession('vaultKey');

    if (exportedKey) {
      try {
        state.currentKey = await CryptoUtil.importKey(exportedKey);
        state.currentVault = await loadVault();
        await renderSiteList();
        showView('list');
        sendActivity();
        return;
      } catch (e) {
        state.currentKey = null;
      }
    }

    showView(saltBase64 ? 'unlock' : 'setup');
  }

  // --- Event bindings ---

  dom.searchInput.addEventListener('input', (e) => {
    renderSiteList(e.target.value);
  });

  dom.lockBtn.addEventListener('click', lockNow);

  dom.navVault.addEventListener('click', async () => {
    state.pendingView = null;
    if (state.currentKey) {
      await renderSiteList(dom.searchInput.value);
      showView('list');
      return;
    }
    const saltBase64 = await StorageUtil.get('vaultSalt');
    showView(saltBase64 ? 'unlock' : 'setup');
  });

  dom.navSettings.addEventListener('click', () => {
    state.pendingView = null;
    showView('settings');
  });

  dom.settingsUnlockBtn.addEventListener('click', () => {
    state.pendingView = 'settings';
    showView('unlock');
  });

  dom.setupForm.addEventListener('submit', (e) => e.preventDefault());

  dom.setupBtn.addEventListener('click', async () => {
    const pw1 = dom.setupPassword.value;
    const pw2 = dom.setupPasswordConfirm.value;

    if (!pw1 || pw1.length < 4) {
      dom.setupError.textContent = t('setup.errorShort');
      dom.setupError.classList.remove('hidden');
      return;
    }
    if (pw1 !== pw2) {
      dom.setupError.textContent = t('setup.errorMismatch');
      dom.setupError.classList.remove('hidden');
      return;
    }

    dom.setupError.classList.add('hidden');
    dom.setupBtn.textContent = t('setup.creating');
    dom.setupBtn.disabled = true;

    try {
      const saltBuf = CryptoUtil.generateSalt();
      const saltBase64 = CryptoUtil.ab2base64(saltBuf);
      const key = await CryptoUtil.deriveKey(pw1, saltBuf);
      state.currentKey = key;

      const encryptedVault = await CryptoUtil.encrypt([], key);
      await StorageUtil.setMany({ vaultSalt: saltBase64, vaultData: encryptedVault });

      const exportedKey = await CryptoUtil.exportKey(key);
      await StorageUtil.setSession('vaultKey', exportedKey);
      sendMessage({ action: 'vault_unlocked' });

      state.currentVault = [];
      dom.setupPassword.value = '';
      dom.setupPasswordConfirm.value = '';
      showToast(t('setup.success'));
      await renderSiteList();
      showView('list');
    } catch (e) {
      dom.setupError.textContent = t('setup.error');
      dom.setupError.classList.remove('hidden');
    } finally {
      dom.setupBtn.textContent = t('setup.create');
      dom.setupBtn.disabled = false;
    }
  });

  dom.unlockBtn.addEventListener('click', async () => {
    const password = dom.unlockPassword.value;
    if (!password) return;

    dom.unlockError.classList.add('hidden');
    dom.unlockBtnLabel.textContent = t('unlock.working');
    dom.unlockBtn.disabled = true;

    try {
      const saltBase64 = await StorageUtil.get('vaultSalt');
      const saltBuf = CryptoUtil.base642ab(saltBase64);
      const key = await CryptoUtil.deriveKey(password, saltBuf);
      const vaultData = await StorageUtil.get('vaultData');
      await CryptoUtil.decrypt(vaultData.ciphertext, vaultData.iv, key);

      state.currentKey = key;
      const exportedKey = await CryptoUtil.exportKey(key);
      await StorageUtil.setSession('vaultKey', exportedKey);
      sendMessage({ action: 'vault_unlocked' });

      dom.unlockPassword.value = '';
      state.currentVault = await loadVault();

      if (state.pendingView === 'settings') {
        state.pendingView = null;
        showView('settings');
      } else {
        await renderSiteList();
        showView('list');
      }
    } catch (e) {
      dom.unlockError.textContent = t('unlock.error');
      dom.unlockError.classList.remove('hidden');
    } finally {
      dom.unlockBtnLabel.textContent = t('unlock.action');
      dom.unlockBtn.disabled = false;
    }
  });

  dom.unlockPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') dom.unlockBtn.click();
  });

  dom.showAddBtn.addEventListener('click', showAddSite);
  dom.generatorOpenBtn.addEventListener('click', () => openGenerator('standalone'));

  dom.cancelEditBtn.addEventListener('click', () => {
    clearEditPassword();
    showView('list');
  });

  dom.saveSiteBtn.addEventListener('click', async () => {
    const id = dom.editId.value;
    const name = dom.editName.value.trim();
    const url = dom.editUrl.value.trim();
    const username = dom.editUsername.value.trim();
    const password = dom.editPassword.value;

    if (!name || !username || !password) {
      dom.editError.textContent = t('edit.required');
      dom.editError.classList.remove('hidden');
      return;
    }

    const existing = id ? state.currentVault.find((s) => s.id === id) : null;
    const newSite = {
      id: id || generateId(),
      name: name,
      url: url,
      username: username,
      password: password,
      autoFill: existing ? Boolean(existing.autoFill) : false,
      links: existing && Array.isArray(existing.links) ? existing.links : []
    };

    if (id) {
      const index = state.currentVault.findIndex((s) => s.id === id);
      if (index !== -1) state.currentVault[index] = newSite;
    } else {
      state.currentVault.push(newSite);
    }

    await saveVault(state.currentVault);
    sendActivity();
    clearEditPassword();
    await renderSiteList(dom.searchInput.value);
    showView('list');
    showToast(t('list.saved'));
  });

  dom.editPassword.addEventListener('input', updateEditStrength);

  dom.editTogglePassword.addEventListener('click', async () => {
    const showing = dom.editPassword.type === 'text';
    if (!showing && state.settings.requirePasswordForReveal) {
      const ok = await requestReauth();
      if (!ok) return;
    }
    if (showing) {
      dom.editPassword.type = 'password';
      dom.editTogglePassword.innerHTML = SVG_EYE;
      dom.editTogglePassword.setAttribute('data-i18n-title', 'edit.showPassword');
      dom.editTogglePassword.setAttribute('title', t('edit.showPassword'));
    } else {
      dom.editPassword.type = 'text';
      dom.editTogglePassword.innerHTML = SVG_EYE_OFF;
      dom.editTogglePassword.setAttribute('data-i18n-title', 'edit.hidePassword');
      dom.editTogglePassword.setAttribute('title', t('edit.hidePassword'));
    }
  });

  dom.editGenerateBtn.addEventListener('click', () => openGenerator('edit'));

  dom.settingAutolock.addEventListener('change', () => {
    saveSetting({ autoLockMinutes: Number(dom.settingAutolock.value) });
  });
  dom.settingClipboard.addEventListener('change', () => {
    saveSetting({ clipboardClearSeconds: Number(dom.settingClipboard.value) });
  });
  dom.settingLockOnClose.addEventListener('change', () => {
    saveSetting({ lockOnClose: dom.settingLockOnClose.checked });
  });
  dom.settingRequirePassword.addEventListener('change', () => {
    saveSetting({ requirePasswordForReveal: dom.settingRequirePassword.checked });
  });
  dom.settingAutofillEnabled.addEventListener('change', () => {
    saveSetting({ autoFillEnabled: dom.settingAutofillEnabled.checked });
  });
  dom.settingMatchSubdomains.addEventListener('change', () => {
    saveSetting({ matchSubdomains: dom.settingMatchSubdomains.checked });
  });
  dom.settingShowToast.addEventListener('change', () => {
    saveSetting({ showAutofillToast: dom.settingShowToast.checked });
  });
  dom.settingThemeToggle.addEventListener('click', () => {
    const next = resolveTheme(state.settings.theme) === 'dark' ? 'light' : 'dark';
    saveSetting({ theme: next });
  });
  dom.settingLanguage.addEventListener('change', () => {
    saveSetting({ language: dom.settingLanguage.value });
  });

  dom.changeMasterBtn.addEventListener('click', () => {
    if (!state.currentKey) {
      showToast(t('toast.unlockFirst'), true);
      return;
    }
    clearMasterFields();
    openModal(dom.modalChangeMaster);
  });

  dom.masterCancel.addEventListener('click', () => {
    clearMasterFields();
    closeModal(dom.modalChangeMaster);
  });

  dom.masterSave.addEventListener('click', async () => {
    const currentPassword = dom.masterCurrent.value;
    const newPassword = dom.masterNew.value;
    const confirmPassword = dom.masterConfirm.value;

    if (newPassword.length < 4) {
      dom.masterError.textContent = t('master.errorShort');
      dom.masterError.classList.remove('hidden');
      return;
    }
    if (newPassword !== confirmPassword) {
      dom.masterError.textContent = t('master.errorMismatch');
      dom.masterError.classList.remove('hidden');
      return;
    }

    dom.masterError.classList.add('hidden');
    dom.masterSave.disabled = true;

    try {
      const saltBase64 = await StorageUtil.get('vaultSalt');
      const salt = CryptoUtil.base642ab(saltBase64);
      const currentKey = await CryptoUtil.deriveKey(currentPassword, salt);
      const vaultData = await StorageUtil.get('vaultData');

      let vault;
      try {
        vault = await CryptoUtil.decrypt(vaultData.ciphertext, vaultData.iv, currentKey);
      } catch (e) {
        dom.masterError.textContent = t('master.errorCurrent');
        dom.masterError.classList.remove('hidden');
        return;
      }

      const newSalt = CryptoUtil.generateSalt();
      const newKey = await CryptoUtil.deriveKey(newPassword, newSalt);
      const encryptedVault = await CryptoUtil.encrypt(vault, newKey);

      await StorageUtil.setMany({
        vaultSalt: CryptoUtil.ab2base64(newSalt),
        vaultData: encryptedVault
      });
      await StorageUtil.setSession('vaultKey', await CryptoUtil.exportKey(newKey));

      state.currentKey = newKey;
      sendMessage({ action: 'vault_unlocked' });
      clearMasterFields();
      closeModal(dom.modalChangeMaster);
      showToast(t('master.success'));
    } catch (e) {
      dom.masterError.textContent = t('master.error');
      dom.masterError.classList.remove('hidden');
    } finally {
      dom.masterSave.disabled = false;
    }
  });

  dom.reauthCancel.addEventListener('click', () => finishReauth(false));
  dom.reauthConfirm.addEventListener('click', confirmReauth);
  dom.reauthPassword.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') confirmReauth();
  });

  dom.generatorLength.addEventListener('input', () => {
    dom.generatorLengthValue.textContent = dom.generatorLength.value;
    generatePassword();
  });
  [dom.genUpper, dom.genLower, dom.genNumbers, dom.genSymbols].forEach((checkbox) => {
    checkbox.addEventListener('change', generatePassword);
  });
  dom.generatorRegenerate.addEventListener('click', generatePassword);
  dom.generatorCopy.addEventListener('click', () => copyText(dom.generatorOutput.value));
  dom.generatorClose.addEventListener('click', () => closeModal(dom.modalGenerator));
  dom.generatorUse.addEventListener('click', () => {
    dom.editPassword.value = dom.generatorOutput.value;
    updateEditStrength();
    closeModal(dom.modalGenerator);
  });

  dom.exportBtn.addEventListener('click', exportBackup);
  dom.importBtn.addEventListener('click', () => dom.importFile.click());
  dom.importFile.addEventListener('change', async (e) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (file) await importBackup(file);
  });

  dom.resetBtn.addEventListener('click', () => {
    dom.resetInput.value = '';
    dom.resetError.classList.add('hidden');
    openModal(dom.modalReset);
  });
  dom.resetCancel.addEventListener('click', () => closeModal(dom.modalReset));
  dom.resetConfirm.addEventListener('click', resetVault);
  dom.resetInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') resetVault();
  });

  document.querySelectorAll('[data-external]').forEach((button) => {
    button.addEventListener('click', () => {
      const url = button.getAttribute('data-external');
      if (url) chrome.tabs.create({ url: url });
    });
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'session' || !changes.vaultKey) return;
    if (changes.vaultKey.newValue) return;
    if (!state.currentKey) return;
    state.currentKey = null;
    state.currentVault = [];
    clearEditPassword();
    showView('unlock');
    showToast(t('toast.vaultLocked'));
  });

  window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', () => {
    if (state.settings && state.settings.theme === 'system') {
      applyTheme('system');
      updateThemeToggle();
    }
  });

  // --- Boot ---

  try {
    state.port = chrome.runtime.connect({ name: 'quickfill-popup' });
  } catch (e) {
    // Port is only used for the "lock on close" option.
  }

  state.settings = await SettingsUtil.get();
  setLanguage(state.settings.language);
  applyTheme(state.settings.theme);
  applyI18n();
  populateSettingsControls();
  refreshDynamicText();
  resetEditPasswordVisibility();

  await initVault();
});
