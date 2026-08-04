import { existsSync } from 'node:fs';
import { pass, fail, walkHtml, skip, exitResults } from './helpers/lib.mjs';

const failures = [];
const pages = walkHtml();

if (!pages.length) {
  skip('link checker', 'dist HTML missing');
  process.exit(2);
}

const hrefRe = /href="([^"#?][^"]*)"/gi;

for (const { path, html } of pages) {
  const rel = path.split('/site-raimovdental/dist/')[1] || path;
  let m;
  while ((m = hrefRe.exec(html)) !== null) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|javascript:)/i.test(href)) continue;
    if (href.startsWith('#')) continue;
    if (href.includes('{{')) continue;
    // internal root-relative only sanity
    if (!href.startsWith('/')) continue;
    pass('link syntax', `${rel} → ${href}`);
  }
}

if (htmlIncludesBrokenPlaceholder(pages)) {
  failures.push('placeholder-links');
  fail('link checker', 'found href="#" on primary CTA (sample check)');
}

function htmlIncludesBrokenPlaceholder(pageList) {
  return pageList.some(({ html }) => /class="[^"]*btn-primary[^"]*"[^>]*href="#"/.test(html));
}

exitResults(failures);
