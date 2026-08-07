import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const REPO = join(dirname(fileURLToPath(import.meta.url)), '../../..');
export const SITE = join(REPO, 'site-raimovdental');
export const DIST = join(SITE, 'dist');

export function pass(name, detail = '') {
  console.log(`PASS  ${name}${detail ? ` — ${detail}` : ''}`);
}

export function fail(name, detail = '') {
  console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
}

export function warn(name, detail = '') {
  console.warn(`WARN  ${name}${detail ? ` — ${detail}` : ''}`);
}

export function skip(name, reason = '') {
  console.log(`SKIP  ${name}${reason ? ` — ${reason}` : ''}`);
}

export function walkHtml(dir = DIST) {
  const out = [];
  if (!existsSync(dir)) return out;
  function walk(d) {
    for (const name of readdirSync(d)) {
      const p = join(d, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name.endsWith('.html')) out.push({ path: p, html: readFileSync(p, 'utf8') });
    }
  }
  walk(dir);
  return out;
}

export function readRoutesJson() {
  const p = join(SITE, 'src/data/routes.json');
  if (!existsSync(p)) return null;
  return JSON.parse(readFileSync(p, 'utf8'));
}

export function expandRoutePaths(routesData) {
  if (!routesData?.routes?.length) return null;
  const paths = new Set();
  for (const route of routesData.routes) {
    if (typeof route === 'string') {
      paths.add(route);
      continue;
    }
    for (const lang of ['ru', 'en']) {
      if (route[lang]) paths.add(route[lang]);
    }
  }
  return [...paths];
}

export function exitResults(failures, { allowSkip = false } = {}) {
  if (failures.length) {
    console.error(`\n${failures.length} check(s) failed.`);
    process.exit(1);
  }
  if (allowSkip) {
    console.log('\nChecks completed (with skips).');
    process.exit(0);
  }
  console.log('\nAll checks passed.');
  process.exit(0);
}

export function skipExit(name, reason) {
  skip(name, reason);
  process.exit(2);
}

/** Private one-reader strategy atlas routes (DEC-775). */
export const FALLBACK_ROUTES = [
  '/ru/',
  '/ru/current-state/',
  '/ru/revenue-engine/',
  '/ru/access-continuity/',
  '/ru/raimov-system/',
  '/ru/personal-brand/',
  '/ru/academy/',
  '/ru/clinics/',
  '/ru/atabek-role/',
  '/ru/implementation/',
  '/ru/decisions/',
];

export const BANNED_BRAND = [
  /saidov/i,
  /Saidov Dental/i,
  /Saidov System/i,
  /Saidov Academy/i,
  /Atabek Saidov/i,
  /\bСаидов(?:ский|ская|ские|ского|ской|ским|ских)?\b/i,
];

export const REQUIRED_BRAND = [
  'RAIMOV DENTAL',
  'RAIM SMILE SYSTEM',
  'Raimov Academy',
  'Раимов',
];
