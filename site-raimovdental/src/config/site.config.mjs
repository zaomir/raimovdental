/**
 * RAIMOV DENTAL public site configuration.
 * Keep in sync with site-raimovdental/src/config/site.ts.
 */
export const siteConfig = {
  brand: {
    clinic: 'RAIMOV DENTAL',
    system: 'RAIM SMILE SYSTEM',
    academy: 'Raimov Academy',
    doctorFullRu: 'Раимов Атабек Саидович',
    doctorPublicRu: 'Атабек Раимов',
    doctorEn: 'Atabek Raimov',
  },
  canonicalHost: 'https://raimovdental.com',
  supabase: {
    url: 'https://lwyumrgygbuowndwcsvc.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3eXVtcmd5Z2J1b3duZHdjc3ZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MzEzMTAsImV4cCI6MjA4NTAwNzMxMH0.LGMpfC3Tp6K2sb5R3rYy3uOHX6qcD7apx2pGxQb_ETQ',
  },
  contacts: {
    phoneE164: '+996555255455',
    phoneDisplay: '+996 555 255 455',
    whatsappE164: '+996555255455',
    whatsappHref: 'https://wa.me/996555255455',
    telegramDeepLink: 'https://t.me/doctor_raimov',
    telegramAllowedSources: [
      'raimovdental_home_ru',
      'raimovdental_implants_ru',
      'raimovdental_international_en',
      'raimovdental_form_ru',
      'raimovdental_form_en',
    ],
    email: '',
    mapsUrl: 'https://yandex.com/maps/10309/bishkek/house/Y00YcAdnTEQHQFpofXR2dX9qZA%3D%3D/',
    addressLineRu: 'г. Бишкек, ул. Киевская, 88',
    addressLineEn: '88 Kyiv Street, Bishkek',
    city: 'Бишкек',
    country: 'Кыргызстан',
    hoursRu: 'По предварительной записи',
    hoursEn: 'By appointment',
  },
  leadForm: {
    mode: 'strategic',
    consentVersion: '2026-07-31',
    whatsappE164: '+996555255455',
    submitPath: '/functions/v1/submit-raimovdental-lead',
  },
  turnstileSiteKey: null,
  futureAiRoutes: ['/ru/text', '/en/text'],
  forbiddenRoutes: ['/franchise', '/elite-dental', '/partners'],
};

export default siteConfig;
