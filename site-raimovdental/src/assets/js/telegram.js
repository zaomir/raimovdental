/**
 * Telegram deep links — only siteConfig.contacts.telegramDeepLink (Lane B).
 */
(function (global) {
  function config() {
    return global.siteConfig || global.__raimovSiteConfig || {};
  }

  function allowedSources() {
    const fromConfig = config().contacts?.telegramAllowedSources;
    if (Array.isArray(fromConfig) && fromConfig.length) {
      return new Set(fromConfig.map((item) => String(item)));
    }
    return new Set(['raimovdental_home_ru']);
  }

  function resolveTelegramUrl(source) {
    const contacts = config().contacts || {};
    const base = String(contacts.telegramDeepLink || '').trim();
    if (!base) return null;

    const allowed = allowedSources();
    const safeSource = allowed.has(source) ? source : 'raimovdental_home_ru';

    try {
      const url = new URL(base);
      url.searchParams.set('start', safeSource);
      return url.toString();
    } catch {
      return null;
    }
  }

  function openTelegram(source) {
    const href = resolveTelegramUrl(source);
    if (!href) return false;
    const allowed = allowedSources();
    if (typeof global.__raimovTrack === 'function') {
      global.__raimovTrack('telegram_click', { source: allowed.has(source) ? source : 'raimovdental_home_ru' });
    }
    global.open(href, '_blank', 'noopener,noreferrer');
    return true;
  }

  function wireTelegramLinks() {
    document.querySelectorAll('[data-telegram-source]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        const source = el.getAttribute('data-telegram-source') || '';
        const href = resolveTelegramUrl(source);
        if (!href) return;
        e.preventDefault();
        openTelegram(source);
      });
    });
  }

  global.__raimovTelegram = {
    allowedSources,
    resolveTelegramUrl,
    openTelegram,
  };

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', wireTelegramLinks);
  }
})(typeof window !== 'undefined' ? window : globalThis);
