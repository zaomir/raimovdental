#!/usr/bin/env node
/**
 * axe accessibility — skips gracefully when deps/browsers missing (exit 2).
 */
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { DIST } from './helpers/lib.mjs';
import { startStaticServer } from './helpers/static-server.mjs';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

if (!existsSync(DIST)) {
  console.error('SKIP  axe — dist missing (exit 2)');
  process.exit(2);
}

let AxeBuilder;
try {
  ({ AxeBuilder } = await import('@axe-core/playwright'));
} catch {
  console.error('SKIP  axe — @axe-core/playwright not installed (exit 2)');
  process.exit(2);
}

function resolvePlaywright() {
  for (const base of [join(root, 'node_modules/playwright')]) {
    try {
      require.resolve('playwright', { paths: [base] });
      return base;
    } catch {
      /* next */
    }
  }
  return null;
}

const pwRoot = resolvePlaywright();
if (!pwRoot) {
  console.error('SKIP  axe — playwright not installed (exit 2)');
  process.exit(2);
}

let chromium;
try {
  ({ chromium } = await import(join(pwRoot, 'index.mjs')));
  const probe = await chromium.launch({ headless: true });
  await probe.close();
} catch (e) {
  console.error('SKIP  axe — browsers missing (exit 2)');
  console.error(`       ${e.message?.split('\n')[0] ?? e}`);
  process.exit(2);
}

const { server, baseUrl } = await startStaticServer(DIST, 0);
const failures = [];

try {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${baseUrl}/ru/`, { waitUntil: 'domcontentloaded' });
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag22aa']).analyze();
  const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
  if (serious.length) {
    failures.push('axe');
    console.error(`FAIL  axe — ${serious.length} serious/critical on /ru/`);
    for (const v of serious.slice(0, 8)) {
      console.error(`  - ${v.id}: ${v.help}`);
    }
  } else {
    console.log('PASS  axe /ru/');
  }
  await context.close();
  await browser.close();
} finally {
  server.close();
}

process.exit(failures.length ? 1 : 0);
