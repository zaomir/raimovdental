#!/usr/bin/env node
/** SEO / structured data for Stage B RU-only public pages. */
import { existsSync } from 'node:fs';
import { pass, fail, walkHtml, skip, exitResults } from './helpers/lib.mjs';

const failures = [];
const pages = walkHtml();

if (!pages.length) {
  skip('seo structured data', 'dist missing');
  process.exit(2);
}

for (const { path, html } of pages) {
  const rel = path.includes('/dist/') ? path.split('/dist/')[1] : path;
  if (rel === '404.html' || rel === 'index.html') continue;
  if (rel.startsWith('assets/img/admin/')) continue;
  if (/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(html)) {
    pass('private-noindex', rel);
    continue;
  }

  const canonical = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i);
  if (canonical) pass('canonical', `${rel} → ${canonical[1]}`);
  else {
    failures.push(`${rel}:canonical`);
    fail('seo', `${rel} missing canonical`);
  }

  if (rel === 'ru/index.html') {
    if (/application\/ld\+json/i.test(html)) pass('json-ld', rel);
    else {
      failures.push(`${rel}:json-ld`);
      fail('seo', `${rel} missing json-ld`);
    }
    if (/content="index,follow"/.test(html)) pass('robots-index', rel);
    else {
      failures.push(`${rel}:robots`);
      fail('seo', `${rel} must be index,follow`);
    }
    if (!/hreflang="/i.test(html)) pass('no-hreflang-ru-only', rel);
  }
}

exitResults(failures);
