#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../..');
const dist = resolve(repoRoot, 'site-raimovdental/dist');
const artifactDir = resolve(repoRoot, 'artifacts/raimov-access-continuity');
const port = Number(process.env.RAIMOV_ACCESS_PORT || 4186);
const routeUrl = `http://127.0.0.1:${port}/ru/access-continuity/`;

mkdirSync(artifactDir, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForServer(url, attempts = 60) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
  }
  throw new Error(`Static server did not start: ${lastError?.message || 'unknown error'}`);
}

async function waitForReady(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map((image) => image.decode().catch(() => undefined)));
  });
}

async function overflowSnapshot(page) {
  return page.evaluate(async () => {
    const scrolling = document.scrollingElement;
    const original = scrolling.scrollLeft;
    scrolling.scrollLeft = 9999;
    await new Promise((resolvePromise) => requestAnimationFrame(resolvePromise));
    const reachableScrollLeft = scrolling.scrollLeft;
    scrolling.scrollLeft = original;
    const width = document.documentElement.clientWidth;
    const offenders = [...document.querySelectorAll('body *')]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          tag: element.tagName.toLowerCase(),
          className: String(element.className || ''),
          left: rect.left,
          right: rect.right,
          width: rect.width,
          display: style.display,
          visibility: style.visibility,
        };
      })
      .filter((item) => item.width > 0 && item.display !== 'none' && item.visibility !== 'hidden' && (item.left < -1 || item.right > width + 1))
      .slice(0, 20);
    return {
      clientWidth: width,
      scrollWidth: document.documentElement.scrollWidth,
      reachableScrollLeft,
      offenders,
    };
  });
}

const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], {
  cwd: dist,
  stdio: ['ignore', 'pipe', 'pipe'],
});

let browser;
try {
  await waitForServer(routeUrl);
  browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();

  const thirdParty = [];
  const failedRequests = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (!['127.0.0.1', 'localhost'].includes(url.hostname)) thirdParty.push(request.url());
  });
  page.on('requestfailed', (request) => failedRequests.push(`${request.url()} ${request.failure()?.errorText || ''}`));

  const response = await page.goto(routeUrl, { waitUntil: 'networkidle' });
  assert(response?.status() === 200, `Route returned ${response?.status()}`);
  await waitForReady(page);

  assert(await page.getByRole('heading', { level: 1, name: /Срочное обращение не должно заканчиваться/ }).isVisible(), 'H1 is missing');
  assert(await page.getByText('Паспорт здоровья зубов V0', { exact: true }).isVisible(), 'Passport V0 is missing');
  assert(await page.getByText('Чек-ап записан до ухода', { exact: true }).isVisible(), 'Pre-booked check-up is missing');
  assert(await page.getByText(/не отдельная клиника/i).isVisible(), 'Separate-clinic disclaimer is missing');
  assert(await page.getByText(/не обещание бесплатного лечения/i).isVisible(), 'Free-treatment disclaimer is missing');
  assert(await page.getByText(/не круглосуточный очный приём/i).isVisible(), '24/7 disclaimer is missing');
  assert((await page.locator('script').count()) === 0, 'Dedicated route must have zero client scripts');
  assert(thirdParty.length === 0, `Third-party requests: ${thirdParty.join(', ')}`);
  assert(failedRequests.length === 0, `Failed requests: ${failedRequests.join(', ')}`);

  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  assert(canonical === 'https://raimovdental.com/ru/access-continuity/', `Unexpected canonical ${canonical}`);
  const robots = await page.locator('meta[name="robots"]').getAttribute('content');
  assert(robots === 'index,follow', `Unexpected robots ${robots}`);

  const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
  const serious = axe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact || ''));
  assert(serious.length === 0, `Axe serious/critical violations: ${serious.map((item) => item.id).join(', ')}`);

  await page.keyboard.press('Tab');
  const focusedText = await page.evaluate(() => document.activeElement?.textContent?.trim() || '');
  assert(/Перейти к содержанию/.test(focusedText), `First keyboard target is ${focusedText}`);

  const responsive = {};
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.reload({ waitUntil: 'networkidle' });
    await waitForReady(page);
    const snapshot = await overflowSnapshot(page);
    responsive[width] = snapshot;
    assert(snapshot.reachableScrollLeft === 0, `${width}px has reachable horizontal scroll`);
    assert(snapshot.offenders.length === 0, `${width}px overflow offenders: ${JSON.stringify(snapshot.offenders)}`);
    assert(await page.getByRole('heading', { level: 1 }).isVisible(), `${width}px H1 is not visible`);
  }

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.reload({ waitUntil: 'networkidle' });
  await waitForReady(page);
  await page.screenshot({ path: resolve(artifactDir, 'access-continuity-desktop.png'), fullPage: true });

  writeFileSync(
    resolve(artifactDir, 'access-continuity-qa.json'),
    JSON.stringify(
      {
        route: routeUrl,
        axe_violations: axe.violations.length,
        axe_serious_critical: serious.length,
        third_party_requests: thirdParty,
        failed_requests: failedRequests,
        responsive,
        client_scripts: 0,
      },
      null,
      2,
    ),
  );

  console.log('RAIMOV_ACCESS_CONTINUITY_BROWSER_PASS');
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
