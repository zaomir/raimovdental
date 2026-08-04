/**
 * Stub site config — final build replaces via site.ts (TASK-756 Lane C).
 * Telegram deep link is the only client-side contact secret surface.
 */
(function (global) {
  const siteConfig = {
    canonicalHost: 'https://raimovdental.com',
    supabase: {
      url: 'https://lwyumrgygbuowndwcsvc.supabase.co',
      anonKey: '',
    },
    contacts: {
      telegramDeepLink: 'https://t.me/raimovdental_bot?start=raimovdental_home_ru',
      phoneE164: '+998000000000',
      whatsappE164: '+998000000000',
      mapsUrl: 'https://maps.google.com/?q=RAIMOV+DENTAL',
    },
    leadForm: {
      consentVersion: '2026-07-20',
      submitPath: '/functions/v1/submit-raimovdental-lead',
    },
    turnstileSiteKey: null,
  };

  global.siteConfig = siteConfig;
  global.__raimovSiteConfig = siteConfig;
})(typeof window !== 'undefined' ? window : globalThis);
