#!/usr/bin/env node
/** Playwright browser gate for the one-reader visual strategy atlas. */
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, mkdirSync } from 'node:fs';
import { DIST, FALLBACK_ROUTES } from './helpers/lib.mjs';
import { startStaticServer } from './helpers/static-server.mjs';

const require = createRequire(import.meta.url);
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
function resolvePlaywright() {
  for (const base of [join(root, 'node_modules/playwright'), join(root, 'tests/node_modules/playwright')]) {
    try { require.resolve('playwright', { paths: [base] }); return base; } catch { /* next */ }
  }
  return null;
}
if (!existsSync(DIST)) process.exit(2);
const pwRoot = resolvePlaywright();
if (!pwRoot) process.exit(2);
let chromium;
try {
  ({ chromium } = await import(join(pwRoot, 'index.mjs')));
  const probe = await chromium.launch({ headless: true });
  await probe.close();
} catch { process.exit(2); }

const { server, baseUrl } = await startStaticServer(DIST, 0);
const failures = [];
const artifactDir = join(root, 'artifacts/raimov-strategy-atlas');
mkdirSync(artifactDir, { recursive: true });

try {
  const browser = await chromium.launch({ headless: true });
  for (const route of FALLBACK_ROUTES) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on('console', (msg) => { if (msg.type() === 'error') errors.push(msg.text()); });
    const res = await page.goto(`${baseUrl}${route}`, { waitUntil: 'networkidle', timeout: 30000 });
    const h1 = await page.locator('h1').count();
    const scripts = await page.locator('script').count();
    if (!res || res.status() >= 400 || h1 !== 1 || scripts !== 0 || errors.length) {
      failures.push(route);
      console.error(`FAIL  ${route} status=${res?.status()} h1=${h1} scripts=${scripts} consoleErrors=${errors.length}`);
    } else console.log(`PASS  playwright ${route}`);
    await page.close();
  }

  for (const viewport of [{ width: 390, height: 844, name: 'mobile-390' }, { width: 320, height: 780, name: 'mobile-320' }, { width: 1440, height: 1000, name: 'desktop' }]) {
    const page = await browser.newPage({ viewport });
    await page.goto(`${baseUrl}/ru/`, { waitUntil: 'networkidle' });
    const metrics = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyWidth: document.body.scrollWidth,
      cards: document.querySelectorAll('.module-card').length,
    }));
    if (metrics.scrollWidth > metrics.clientWidth + 1 || metrics.bodyWidth > metrics.clientWidth + 1 || metrics.cards !== 10) {
      failures.push(viewport.name);
      console.error(`FAIL  ${viewport.name} ${JSON.stringify(metrics)}`);
    } else console.log(`PASS  ${viewport.name} reflow`);
    await page.screenshot({ path: join(artifactDir, `${viewport.name}.png`), fullPage: true });
    await page.close();
  }

  const detail = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await detail.goto(`${baseUrl}/ru/raimov-system/`, { waitUntil: 'networkidle' });
  const summaryTop = await detail.locator('.summary-panel').boundingBox();
  const firstDetail = await detail.locator('.detail-section').first().boundingBox();
  if (!summaryTop || !firstDetail || summaryTop.y >= firstDetail.y) failures.push('summary-order');
  await detail.keyboard.press('Tab');
  const focused = await detail.evaluate(() => document.activeElement?.className || '');
  if (!String(focused).includes('skip-link')) failures.push('keyboard-skip-link');
  await detail.screenshot({ path: join(artifactDir, 'raimov-system-mobile.png'), fullPage: true });
  await detail.close();

  await browser.close();
} finally {
  server.close();
}

if (failures.length) {
  console.error(`FAIL  playwright atlas: ${failures.join(', ')}`);
  process.exit(1);
}
console.log('PASS  playwright one-reader atlas');
