import { existsSync } from 'node:fs';
import {
  BANNED_BRAND,
  pass,
  fail,
  walkHtml,
  skip,
  exitResults,
} from './helpers/lib.mjs';

const CYRILLIC = /[\u0400-\u04FF]/;
const LATIN_WORD = /[A-Za-z]{3,}/g;
const RU_ALLOW = new Set([
  'RAIMOV', 'DENTAL', 'System', 'Academy', 'Atabek', 'Raimov', 'Telegram', 'WhatsApp',
  'HTML', 'JSON', 'LD', 'FAQ', 'CTA', 'URL', 'OG', 'CEO', 'COO', 'Expert', 'Studio',
  'Organization', 'Person', 'Bishkek', 'Central', 'Asia', 'ROI', 'KYC',
]);

// The protected competitor matrix intentionally preserves official clinic and product names.
// This exemption is scoped to one data-heavy report route and does not weaken other RU pages.
const RU_PATH_ALLOW = new Map([
  ['ru/valeria/month-1/reports/first-two-weeks/details/competitors/index.html', new Set([
    'Dental', 'Metadent', 'Air', 'Flow', 'EMS', 'Vinci', 'MBANK', 'Rustom', 'clinic',
    'Smile', 'Emmar', 'Medistom', 'Life', 'stom', 'Azuu', 'Dent', 'Triovital',
    'Doctor', 'White', 'Olio', 'All',
  ])],
]);

const failures = [];
const pages = walkHtml();

if (!pages.length) {
  skip('language purity', 'dist missing');
  process.exit(2);
}

function visibleText(html) {
  const main = html.match(/<main[\s\S]*?<\/main>/i);
  const block = main ? main[0] : html.match(/<body[\s\S]*?<\/body>/i)?.[0] || html;
  return block
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function visibleTextEn(html) {
  const withoutLd = html.replace(/<script[^>]*type="application\/ld\+json"[\s\S]*?<\/script>/gi, ' ');
  return visibleText(withoutLd);
}

for (const { path, html } of pages) {
  const rel = path.includes('/dist/') ? path.split('/dist/')[1] : path;
  const text = visibleText(html);

  for (const pat of BANNED_BRAND) {
    if (pat.test(text)) {
      failures.push(`${rel}:banned`);
      fail('banned brand', `${rel} matched ${pat}`);
    }
  }

  // Allow patronymic Саидович for Atabek Raimov
  if (/\bСаидович\b/i.test(text) && !/\bСаидов\b/i.test(text.replace(/Саидович/gi, ''))) {
    pass('patronymic ok', rel);
  }

  if (rel.startsWith('ru/')) {
    const pathAllow = RU_PATH_ALLOW.get(rel) || new Set();
    const latinWords = [...new Set((text.match(LATIN_WORD) || []).filter((w) => !RU_ALLOW.has(w) && !pathAllow.has(w)))];
    if (latinWords.length > 12) {
      failures.push(`${rel}:latin`);
      fail('RU Cyrillic dominance', `${rel} — excessive Latin: ${latinWords.slice(0, 8).join(', ')}`);
    } else {
      pass('RU page', rel);
    }
  }

  if (rel.startsWith('en/')) {
    const enText = visibleTextEn(html);
    if (CYRILLIC.test(enText)) {
      const tokens = enText.match(/[\u0400-\u04FF]+/g) || [];
      const allowedName = new Set(['Раимов', 'Атабек', 'Саидович']);
      const unexpected = tokens.filter((t) => !allowedName.has(t));
      if (unexpected.length) {
        failures.push(`${rel}:cyrillic`);
        fail('EN Latin purity', `${rel} contains Cyrillic: ${unexpected.slice(0, 5).join(', ')}`);
      } else {
        console.warn(`WARN  EN doctor Cyrillic tokens on ${rel} — fix in Lane B copy`);
        pass('EN page (name tokens only)', rel);
      }
    } else {
      pass('EN page', rel);
    }
  }
}

exitResults(failures);
