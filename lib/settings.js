// lib/settings.js

const SETTINGS_KEY = 'settings';

const DEFAULT_SETTINGS = Object.freeze({
  autoLockMinutes: 15,
  lockOnClose: false,
  clipboardClearSeconds: 30,
  requirePasswordForReveal: false,
  autoFillEnabled: true,
  matchSubdomains: false,
  showAutofillToast: true,
  theme: 'system',
  language: 'en',
  lastExportAt: null
});

function normalizeNumberOption(value, options, fallback) {
  const num = typeof value === 'number'
    ? value
    : (typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN);
  return options.includes(num) ? num : fallback;
}

function normalizeSettings(raw) {
  const input = raw && typeof raw === 'object' ? raw : {};
  const settings = Object.assign({}, DEFAULT_SETTINGS, input);

  const autoLockOptions = [0, 1, 5, 15, 30];
  settings.autoLockMinutes = normalizeNumberOption(
    settings.autoLockMinutes,
    autoLockOptions,
    DEFAULT_SETTINGS.autoLockMinutes
  );

  const clipboardOptions = [0, 5, 10, 30];
  settings.clipboardClearSeconds = normalizeNumberOption(
    settings.clipboardClearSeconds,
    clipboardOptions,
    DEFAULT_SETTINGS.clipboardClearSeconds
  );

  settings.lockOnClose = Boolean(settings.lockOnClose);
  settings.requirePasswordForReveal = Boolean(settings.requirePasswordForReveal);
  settings.autoFillEnabled = Boolean(settings.autoFillEnabled);
  settings.matchSubdomains = Boolean(settings.matchSubdomains);
  settings.showAutofillToast = Boolean(settings.showAutofillToast);

  settings.theme = ['system', 'dark', 'light'].includes(settings.theme)
    ? settings.theme
    : DEFAULT_SETTINGS.theme;
  settings.language = ['en', 'tr'].includes(settings.language)
    ? settings.language
    : DEFAULT_SETTINGS.language;
  settings.lastExportAt = typeof settings.lastExportAt === 'string' &&
    Number.isFinite(Date.parse(settings.lastExportAt))
    ? settings.lastExportAt
    : null;

  return settings;
}

const SettingsUtil = {
  async get() {
    return normalizeSettings(await StorageUtil.get(SETTINGS_KEY));
  },

  async set(patch) {
    const current = await this.get();
    const next = normalizeSettings(Object.assign({}, current, patch));
    await StorageUtil.set(SETTINGS_KEY, next);
    return next;
  }
};

function normalizeHost(host) {
  return String(host || '').trim().toLowerCase().replace(/^www\./, '');
}

function siteHostname(siteUrl) {
  const raw = String(siteUrl || '').trim();
  if (!raw) return '';
  try {
    const parsed = new URL(raw.startsWith('http') ? raw : `https://${raw}`);
    return normalizeHost(parsed.hostname);
  } catch (e) {
    return '';
  }
}

// Credential-delivery boundary: exact host by default, or a bounded subdomain
// of the saved host when the user opts in. Never substring matching.
function domainMatches(pageHost, siteUrl, allowSubdomains) {
  const page = normalizeHost(pageHost);
  const saved = siteHostname(siteUrl);
  if (!page || !saved) return false;
  if (page === saved) return true;
  if (!allowSubdomains) return false;
  return page.endsWith('.' + saved);
}
