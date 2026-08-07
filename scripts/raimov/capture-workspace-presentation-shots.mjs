#!/usr/bin/env node
/**
 * Capture live Expert Dental workspace screenshots for Atabek presentation.
 *
 * Usage (Playwright not a repo dependency):
 *   mkdir -p /tmp/pw-ed && cd /tmp/pw-ed && npm i playwright@1.62.1
 *   node /var/www/grainee-v2/scripts/raimov/capture-workspace-presentation-shots.mjs
 *
 * Output: site-raimovdental/public/assets/img/workspace/presentation/shots/
 */
import { createRequire } from 'node:module';
import { mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, '..', '..', 'site-raimovdental', 'public', 'assets', 'img', 'workspace', 'presentation', 'shots');
const base = process.env.ED_SHOT_BASE || 'https://raimovdental.com';

async function loadPlaywright() {
  const candidates = [
    join(process.cwd(), 'node_modules', 'playwright'),
    '/tmp/pw-ed/node_modules/playwright',
  ];
  for (const dir of candidates) {
    if (existsSync(join(dir, 'package.json'))) {
      return import(pathToFileURL(join(dir, 'index.js')).href);
    }
  }
  const require = createRequire(join(process.cwd(), 'package.json'));
  try {
    return require('playwright');
  } catch {
    throw new Error('Install playwright first: mkdir -p /tmp/pw-ed && cd /tmp/pw-ed && npm i playwright@1.62.1');
  }
}

mkdirSync(outDir, { recursive: true });
const { chromium } = await loadPlaywright();

const shots = [
  { name: '01-hub', url: `${base}/assets/img/workspace/`, wait: 800 },
  {
    name: '02-admin-today',
    url: `${base}/assets/img/workspace/admin/`,
    wait: 900,
    prepare: async (page) => {
      await page.evaluate(() => {
        localStorage.setItem('ed-workspace-admin', JSON.stringify({
          updateRead: false, testPassed: false, shiftStarted: false,
          handoffAccepted: false, shiftClosed: false, score: 0,
        }));
      });
      await page.reload({ waitUntil: 'networkidle' });
    },
  },
  {
    name: '03-admin-learn',
    url: `${base}/assets/img/workspace/admin/`,
    wait: 700,
    prepare: async (page) => {
      await page.evaluate(() => {
        localStorage.setItem('ed-workspace-admin', JSON.stringify({
          updateRead: false, testPassed: false, shiftStarted: false,
          handoffAccepted: false, shiftClosed: false, score: 0,
        }));
      });
      await page.reload({ waitUntil: 'networkidle' });
      await page.click('[data-view="learn"]');
    },
  },
  {
    name: '04-admin-shift',
    url: `${base}/assets/img/workspace/admin/`,
    wait: 700,
    prepare: async (page) => {
      await page.evaluate(() => {
        localStorage.setItem('ed-workspace-admin', JSON.stringify({
          updateRead: true, testPassed: true, shiftStarted: false,
          handoffAccepted: false, shiftClosed: false, score: 100,
        }));
      });
      await page.reload({ waitUntil: 'networkidle' });
      await page.click('[data-view="shift"]');
    },
  },
  {
    name: '05-admin-work',
    url: `${base}/assets/img/workspace/admin/`,
    wait: 700,
    prepare: async (page) => {
      await page.evaluate(() => {
        localStorage.setItem('ed-workspace-admin', JSON.stringify({
          updateRead: true, testPassed: true, shiftStarted: true,
          handoffAccepted: true, shiftClosed: false, score: 100,
        }));
      });
      await page.reload({ waitUntil: 'networkidle' });
      await page.click('[data-view="work"]');
    },
  },
  { name: '06-render-call', url: `${base}/render/`, wait: 1200 },
  {
    name: '07-doctor-work',
    url: `${base}/assets/img/workspace/doctor/`,
    wait: 700,
    prepare: async (page) => {
      await page.evaluate(() => {
        localStorage.setItem('ed-workspace-doctor', JSON.stringify({
          updateRead: true, testPassed: true, shiftStarted: true,
          handoffAccepted: true, shiftClosed: false, score: 100,
        }));
      });
      await page.reload({ waitUntil: 'networkidle' });
      await page.click('[data-view="work"]');
    },
  },
  {
    name: '08-manager-team',
    url: `${base}/assets/img/workspace/manager/`,
    wait: 700,
    prepare: async (page) => {
      await page.evaluate(() => {
        localStorage.setItem('ed-workspace-manager', JSON.stringify({
          updateRead: true, testPassed: true, shiftStarted: true,
          handoffAccepted: true, shiftClosed: false, score: 100,
        }));
      });
      await page.reload({ waitUntil: 'networkidle' });
      await page.click('[data-view="work"]');
    },
  },
  {
    name: '09-owner-summary',
    url: `${base}/assets/img/workspace/owner/`,
    wait: 700,
    prepare: async (page) => {
      await page.evaluate(() => {
        localStorage.setItem('ed-workspace-owner', JSON.stringify({
          updateRead: true, testPassed: true, shiftStarted: true,
          handoffAccepted: true, shiftClosed: false, score: 100,
        }));
      });
      await page.reload({ waitUntil: 'networkidle' });
      await page.click('[data-view="work"]');
    },
  },
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1.25,
  locale: 'ru-RU',
});

for (const shot of shots) {
  const page = await context.newPage();
  await page.goto(shot.url, { waitUntil: 'networkidle', timeout: 60000 });
  if (shot.prepare) await shot.prepare(page);
  await page.waitForTimeout(shot.wait || 600);
  const file = join(outDir, `${shot.name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log('shot', shot.name, '→', file);
  await page.close();
}

await browser.close();
console.log('capture-workspace-presentation-shots: PASS', outDir);
