import { existsSync } from 'node:fs';
import { pass, warn, walkHtml, skip, exitResults } from './helpers/lib.mjs';

const failures = [];
const pages = walkHtml();

if (!pages.length) {
  skip('placeholder guard', 'dist missing');
  process.exit(2);
}

let pendingCount = 0;
let tbdCount = 0;

for (const { path, html } of pages) {
  const rel = path.includes('/dist/') ? path.split('/dist/')[1] : path;
  const pending = (html.match(/\[CONTENT PENDING\]/g) || []).length;
  const tbd = (html.match(/\bTBD\b/g) || []).length;
  pendingCount += pending;
  tbdCount += tbd;
  if (pending || tbd) {
    warn('placeholders', `${rel} — CONTENT PENDING:${pending} TBD:${tbd}`);
  }
}

pass('placeholder scan', `CONTENT PENDING=${pendingCount}, TBD=${tbdCount} (warn-only)`);
exitResults(failures, { allowSkip: true });
