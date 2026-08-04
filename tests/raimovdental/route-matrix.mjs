#!/usr/bin/env node
/** Route matrix — Stage B public routes only. */
import { existsSync } from 'node:fs';
import {
  DIST,
  FALLBACK_ROUTES,
  pass,
  fail,
  skip,
  exitResults,
} from './helpers/lib.mjs';
import { join } from 'node:path';

const failures = [];

if (!existsSync(DIST)) {
  skip('route matrix', 'dist missing — run build-smoke first');
  process.exit(2);
}

for (const route of FALLBACK_ROUTES) {
  const normalized = String(route).endsWith('/') ? String(route) : `${route}/`;
  const filePath = join(DIST, normalized.replace(/^\//, ''), 'index.html');
  if (existsSync(filePath)) {
    pass('route', normalized);
  } else {
    failures.push(normalized);
    fail('route matrix', `${normalized} — no HTML in dist`);
  }
}

if (existsSync(join(DIST, 'stage-a'))) {
  failures.push('stage-a');
  fail('route matrix', 'stage-a must not ship in public dist');
}
if (existsSync(join(DIST, 'en/index.html'))) {
  failures.push('en');
  fail('route matrix', 'EN catalog must not ship in Stage B dist');
}

exitResults(failures);
