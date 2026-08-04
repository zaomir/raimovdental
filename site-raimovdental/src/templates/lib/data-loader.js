import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/** @param {string} siteRoot */
export function createDataLoader(siteRoot) {
  const dataDir = join(siteRoot, 'src/data');
  const contentDir = join(siteRoot, 'src/content');

  function readJson(rel) {
    const file = join(dataDir, rel);
    if (!existsSync(file)) return null;
    try {
      return JSON.parse(readFileSync(file, 'utf8'));
    } catch {
      return null;
    }
  }

  function loadI18n(locale) {
    const file = join(contentDir, 'i18n', `${locale}.json`);
    if (!existsSync(file)) return null;
    try {
      return JSON.parse(readFileSync(file, 'utf8'));
    } catch {
      return null;
    }
  }

  function loadBundle(locale) {
    const readPage = (key) => readJson(`${key}.${locale}.json`);
    return {
      routes: readJson('routes.json'),
      editorial: readJson(`editorial.${locale}.json`),
      extensions: readJson(`extensions.${locale}.json`),
      home: readJson(`home.${locale}.json`),
      services: readJson(`services.${locale}.json`),
      cases: readJson(`cases.${locale}.json`),
      doctor: readJson(`doctor.${locale}.json`),
      system: readJson(`system.${locale}.json`),
      faq: readJson(`faq.${locale}.json`),
      blog: readJson(`blog.${locale}.json`),
      team: readJson(`team.${locale}.json`),
      reviews: readJson(`reviews.${locale}.json`),
      about: readPage('about'),
      contact: readPage('contact'),
      cost: readPage('cost'),
      international: readPage('international'),
      academy: readPage('academy'),
      i18n: loadI18n(locale),
    };
  }

  return { readJson, loadI18n, loadBundle };
}
