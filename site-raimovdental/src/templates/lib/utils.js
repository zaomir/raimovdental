/** @param {unknown} value */
export function escapeHtml(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** @param {string} path */
export function pathToFile(path) {
  if (path === '/') return 'index.html';
  const trimmed = path.replace(/\/$/, '');
  return `${trimmed.slice(1)}/index.html`;
}

export const CANONICAL_HOST = 'https://raimovdental.com';

export const BRAND = {
  clinic: 'RAIMOV DENTAL',
  system: 'RAIM SMILE SYSTEM',
  academy: 'Raimov Academy',
  doctorFullRu: 'Раимов Атабек Саидович',
  doctorPublicRu: 'Атабек Раимов',
  doctorEn: 'Atabek Raimov',
};

/** @param {string} path */
export function localeFromPath(path) {
  if (path.startsWith('/en/') || path === '/en/') return 'en';
  if (path.startsWith('/ru/') || path === '/ru/') return 'ru';
  return 'ru';
}

/** @param {string} html */
export function canonicalFromHtml(html) {
  const match = html.match(/<link rel="canonical" href="https:\/\/raimovdental\.com([^"]+)"/);
  return match ? match[1] : null;
}
