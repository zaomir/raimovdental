#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '../..');
const port = Number(process.env.RAIMOV_STAGE_A_PORT || 4173);
const routeUrl = `http://127.0.0.1:${port}/site-raimovdental/stage-a/`;
const artifactDir = resolve(
  repoRoot,
  process.env.RAIMOV_STAGE_A_ARTIFACT_DIR || 'artifacts/raimov-stage-a',
);
const htmlPath = join(repoRoot, 'site-raimovdental/stage-a/index.html');
const cssPath = join(repoRoot, 'site-raimovdental/stage-a/stage-a.css');
const portraitPath = join(
  repoRoot,
  'site-raimovdental/public/assets/img/doctor/atabek-portrait.jpg',
);

mkdirSync(artifactDir, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForServer(url, attempts = 60) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, { redirect: 'manual' });
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolvePromise) => setTimeout(resolvePromise, 250));
  }
  throw new Error(`Static server did not start: ${lastError?.message || 'unknown error'}`);
}

async function waitForVisualReady(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      [...document.images].map((image) => image.decode().catch(() => undefined)),
    );
  });
}

async function overflowSnapshot(page) {
  return page.evaluate(async () => {
    const viewportWidth = document.documentElement.clientWidth;
    const scrolling = document.scrollingElement;
    const originalScrollLeft = scrolling.scrollLeft;
    scrolling.scrollLeft = 9999;
    await new Promise((resolvePromise) => requestAnimationFrame(() => resolvePromise()));
    const reachableScrollLeft = scrolling.scrollLeft;
    scrolling.scrollLeft = originalScrollLeft;

    const offenders = [...document.querySelectorAll('body *')]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          tag: element.tagName.toLowerCase(),
          className: String(element.className || ''),
          left: Math.round(rect.left * 100) / 100,
          right: Math.round(rect.right * 100) / 100,
          width: Math.round(rect.width * 100) / 100,
          visibility: style.visibility,
          display: style.display,
        };
      })
      .filter(
        (item) =>
          item.width > 0 &&
          item.visibility !== 'hidden' &&
          item.display !== 'none' &&
          (item.left < -1 || item.right > viewportWidth + 1),
      )
      .slice(0, 20);

    return {
      clientWidth: viewportWidth,
      scrollWidth: document.documentElement.scrollWidth,
      bodyScrollWidth: document.body.scrollWidth,
      reachableScrollLeft,
      offenders,
    };
  });
}

function assertNoOverflow(snapshot, label) {
  assert(
    snapshot.reachableScrollLeft <= 1 && snapshot.offenders.length === 0,
    `${label} has reachable horizontal scroll or visible overflow: ${JSON.stringify(snapshot)}`,
  );
}

const server = spawn(
  'python3',
  ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', repoRoot],
  { stdio: ['ignore', 'pipe', 'pipe'] },
);

let browser;
const report = {
  route: '/stage-a/',
  checkedAt: new Date().toISOString(),
  assertions: [],
  measurements: {},
  axe: {},
  screenshots: {},
};

function pass(name, detail = null) {
  report.assertions.push({ name, status: 'pass', detail });
}

try {
  await waitForServer(routeUrl);
  browser = await chromium.launch({ headless: true });

  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
    reducedMotion: 'no-preference',
  });
  const page = await desktop.newPage();

  await page.addInitScript(() => {
    window.__stageACls = 0;
    try {
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__stageACls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch {
      window.__stageACls = 0;
    }
  });

  const response = await page.goto(routeUrl, { waitUntil: 'networkidle' });
  await waitForVisualReady(page);
  assert(response?.status() === 200, `Expected HTTP 200, got ${response?.status()}`);
  pass('route-smoke', 'HTTP 200');

  const title = await page.title();
  assert(title === 'RAIMOV DENTAL — стратегия экосистемы на пять лет', `Unexpected title: ${title}`);
  pass('unique-title');

  const robots = await page.locator('meta[name="robots"]').getAttribute('content');
  assert(
    robots?.includes('noindex') && robots.includes('nofollow') && robots.includes('noarchive'),
    `Invalid robots meta: ${robots}`,
  );
  pass('noindex-policy', robots);

  assert((await page.locator('main').count()) === 1, 'Expected exactly one main landmark');
  assert((await page.locator('h1').count()) === 1, 'Expected exactly one H1');
  assert((await page.locator('form').count()) === 0, 'Stage A must not include a form');
  pass('semantic-landmarks');
  pass('no-public-form');

  const heading = await page.locator('h1').innerText();
  assert(heading.includes('системе'), 'H1 does not communicate system transition');
  pass('strategic-h1', heading);

  const requiredTexts = [
    'Сегодня',
    'Формируется',
    'Следующая фаза',
    'Пятилетняя перспектива',
    'RAIM SMILE SYSTEM',
    'Raimov Academy',
    'Собственные клиники RAIMOV DENTAL',
    'Международный экспертный контур',
    'Автор и презентующий:',
  ];
  const bodyText = (await page.locator('body').textContent()) || '';
  for (const text of requiredTexts) {
    assert(bodyText.includes(text), `Missing required truth/status text: ${text}`);
  }
  pass('truth-status-language', requiredTexts);

  const externalLinks = await page.locator('a[href^="http://"], a[href^="https://"]').count();
  assert(externalLinks === 0, `Unexpected external links: ${externalLinks}`);
  pass('no-external-marketing-links');

  const portraitLoaded = await page.locator('.portrait-frame img').evaluate((image) => ({
    complete: image.complete,
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight,
  }));
  assert(
    portraitLoaded.complete && portraitLoaded.naturalWidth > 0 && portraitLoaded.naturalHeight > 0,
    'Portrait did not load',
  );
  pass('portrait-loaded', portraitLoaded);

  await page.keyboard.press('Tab');
  await page.waitForTimeout(220);
  const focused = await page.locator(':focus').evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      className: element.className,
      outlineWidth: getComputedStyle(element).outlineWidth,
      transform: getComputedStyle(element).transform,
      top: rect.top,
      left: rect.left,
    };
  });
  assert(String(focused.className).includes('skip-link'), 'First keyboard focus is not the skip link');
  assert(focused.outlineWidth !== '0px', 'Focused skip link has no visible outline');
  assert(focused.top >= 0 && focused.left >= 0, `Focused skip link is off-screen: ${JSON.stringify(focused)}`);
  pass('keyboard-skip-link', focused);

  const axeResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  const blockingAxe = axeResults.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact),
  );
  report.axe = {
    violations: axeResults.violations.map((violation) => ({
      id: violation.id,
      impact: violation.impact,
      nodes: violation.nodes.length,
      help: violation.help,
    })),
    blocking: blockingAxe.length,
  };
  assert(
    blockingAxe.length === 0,
    `Axe serious/critical violations: ${blockingAxe.map((item) => item.id).join(', ')}`,
  );
  pass('axe-wcag22-aa', { totalViolations: axeResults.violations.length, blocking: 0 });

  await page.waitForTimeout(300);
  const cls = await page.evaluate(() => window.__stageACls || 0);
  assert(cls <= 0.1, `CLS budget exceeded: ${cls}`);
  report.measurements.cls = cls;
  pass('cls-budget', cls);

  const resourceSummary = await page.evaluate(() => {
    const resources = performance.getEntriesByType('resource');
    return {
      totalTransferBytes: resources.reduce((sum, item) => sum + (item.transferSize || 0), 0),
      scripts: resources.filter((item) => item.initiatorType === 'script').map((item) => item.name),
      external: resources
        .filter((item) => new URL(item.name).origin !== location.origin)
        .map((item) => item.name),
    };
  });
  assert(resourceSummary.scripts.length === 0, `Unexpected JS resources: ${resourceSummary.scripts.join(', ')}`);
  assert(resourceSummary.external.length === 0, `Unexpected external requests: ${resourceSummary.external.join(', ')}`);
  pass('zero-client-js');
  pass('zero-third-party-requests');

  const cssBytes = statSync(cssPath).size;
  const portraitBytes = statSync(portraitPath).size;
  const htmlBytes = Buffer.byteLength(readFileSync(htmlPath));
  const sourceTotalBytes = cssBytes + portraitBytes + htmlBytes;
  assert(cssBytes <= 40 * 1024, `CSS source exceeds 40KB: ${cssBytes}`);
  assert(sourceTotalBytes <= 1024 * 1024, `HTML + CSS + portrait exceeds 1MB: ${sourceTotalBytes}`);
  report.measurements = {
    ...report.measurements,
    cssBytes,
    portraitBytes,
    htmlBytes,
    sourceTotalBytes,
    browserTransferBytes: resourceSummary.totalTransferBytes,
  };
  pass('css-budget', cssBytes);
  pass('source-transfer-budget', sourceTotalBytes);

  const desktopShot = join(artifactDir, 'stage-a-desktop.png');
  await page.screenshot({ path: desktopShot, fullPage: true });
  report.screenshots.desktop = desktopShot;
  pass('desktop-screenshot');
  await desktop.close();

  const viewports = [
    { name: '390px-reflow', width: 390, height: 844, screenshot: 'stage-a-mobile.png' },
    { name: '320px-reflow', width: 320, height: 720 },
    { name: '200-percent-zoom-equivalent', width: 360, height: 900 },
  ];

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    const viewportPage = await context.newPage();
    await viewportPage.goto(routeUrl, { waitUntil: 'networkidle' });
    await waitForVisualReady(viewportPage);
    const snapshot = await overflowSnapshot(viewportPage);
    assertNoOverflow(snapshot, viewport.name);
    pass(viewport.name, snapshot);
    if (viewport.screenshot) {
      const shot = join(artifactDir, viewport.screenshot);
      await viewportPage.screenshot({ path: shot, fullPage: true });
      report.screenshots.mobile = shot;
    }
    await context.close();
  }

  const reduced = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  const reducedPage = await reduced.newPage();
  await reducedPage.goto(routeUrl, { waitUntil: 'networkidle' });
  await waitForVisualReady(reducedPage);
  const reducedMotion = await reducedPage.evaluate(() => ({
    matches: matchMedia('(prefers-reduced-motion: reduce)').matches,
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    h1Visible: Boolean(document.querySelector('h1')?.getBoundingClientRect().height),
  }));
  assert(reducedMotion.matches, 'Reduced motion media query did not match');
  assert(reducedMotion.scrollBehavior === 'auto', `Expected auto scroll in reduced motion, got ${reducedMotion.scrollBehavior}`);
  assert(reducedMotion.h1Visible, 'Content disappeared in reduced motion mode');
  pass('reduced-motion', reducedMotion);
  await reduced.close();

  report.status = 'pass';
  writeFileSync(join(artifactDir, 'stage-a-qa-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
} catch (error) {
  report.status = 'fail';
  report.error = error instanceof Error ? error.stack : String(error);
  writeFileSync(join(artifactDir, 'stage-a-qa-report.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.error(report.error);
  process.exitCode = 1;
} finally {
  if (browser) await browser.close();
  server.kill('SIGTERM');
}
