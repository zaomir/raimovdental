/** Public RAIMOV ecosystem route matrix. indexable = D3 patient launch (academy/ecosystem stay noindex). */
export const ROUTE_DEFINITIONS = [
  { id: 'home', ru: '/ru/', en: '/en/', type: 'home', indexable: true },
  { id: 'ecosystem', ru: '/ru/ekosistema/', en: '/en/ecosystem/', type: 'editorial', pageKey: 'ecosystem', indexable: false },
  { id: 'diagnostics', ru: '/ru/kompleksnaya-diagnostika/', en: '/en/comprehensive-diagnostics/', type: 'service', serviceKey: 'diagnostics', indexable: true },
  { id: 'veneers', ru: '/ru/viniry/', en: '/en/veneers/', type: 'service', serviceKey: 'veneers', indexable: true },
  { id: 'implants', ru: '/ru/implantaciya/', en: '/en/dental-implants/', type: 'service', serviceKey: 'implants', indexable: true },
  { id: 'full-mouth', ru: '/ru/polnoe-vosstanovlenie-zubov/', en: '/en/full-mouth-reconstruction/', type: 'service', serviceKey: 'fullMouth', indexable: true },
  { id: 'orthodontics', ru: '/ru/ortodontiya-dlya-vzroslyh/', en: '/en/adult-orthodontics/', type: 'service', serviceKey: 'orthodontics', indexable: true },
  { id: 'doctor', ru: '/ru/atabek-raimov/', en: '/en/atabek-raimov/', type: 'doctor', indexable: true },
  { id: 'system', ru: '/ru/raimov-system/', en: '/en/raimov-system/', type: 'system', indexable: true },
  { id: 'academy', ru: '/ru/academy/', en: '/en/academy/', type: 'editorial', pageKey: 'academy', indexable: false },
  { id: 'international', ru: '/ru/mezhdunarodnym-pacientam/', en: '/en/international-patients/', type: 'editorial', pageKey: 'international', indexable: true },
  { id: 'about', ru: '/ru/o-klinike/', en: '/en/about/', type: 'editorial', pageKey: 'about', indexable: true },
  { id: 'contact', ru: '/ru/kontakty/', en: '/en/contact/', type: 'contact', indexable: true },
];

export function hreflangPair(path, locale) {
  const def = ROUTE_DEFINITIONS.find((route) => route.ru === path || route.en === path);
  if (!def) return { self: path, alt: null, altLocale: null };
  return {
    self: locale === 'ru' ? def.ru : def.en,
    alt: locale === 'ru' ? def.en : def.ru,
    altLocale: locale === 'ru' ? 'en' : 'ru',
  };
}

export function routesForLocale(locale) {
  return ROUTE_DEFINITIONS.map((def) => ({
    ...def,
    path: locale === 'ru' ? def.ru : def.en,
    hreflang: locale === 'ru' ? def.en : def.ru,
  }));
}

export function routeMetaForPath(path) {
  const locale = path.startsWith('/en/') ? 'en' : 'ru';
  const def = ROUTE_DEFINITIONS.find((route) => route.ru === path || route.en === path);
  if (!def) return null;
  return { ...def, path, locale, hreflang: locale === 'ru' ? def.en : def.ru };
}
