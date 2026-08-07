#!/usr/bin/env node --experimental-websocket
/**
 * Renders full-page screenshots of the patient site and reports layout defects that
 * only appear in a real browser: horizontal overflow, clipped text, images that fail
 * to load, and text whose contrast falls below WCAG AA.
 *
 *   node scripts/raimov/shoot-patient-site.mjs [--base https://clinic.raimovdental.com]
 *
 * Drives Chrome over the DevTools Protocol directly — no puppeteer dependency, since
 * the browser is already on the box and the protocol surface needed here is small.
 * Needs `node --experimental-websocket` on Node 20; the global is unflagged from 22.
 */

import { spawn } from 'node:child_process';
import { mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { createConnection } from 'node:net';
import { join } from 'node:path';

const argv = process.argv.slice(2);
const arg = (n, d) => (argv.indexOf(`--${n}`) > -1 ? argv[argv.indexOf(`--${n}`) + 1] : d);
const BASE = arg('base', 'https://clinic.raimovdental.com');
const OUT = arg('out', '/tmp/ed-shots');
const PORT = Number(arg('port', String(9300 + (process.pid % 500))));

const CHROME = (() => {
  const root = '/root/.cache/puppeteer/chrome';
  const build = readdirSync(root).sort().pop();
  return join(root, build, 'chrome-linux64', 'chrome');
})();

const VIEWPORTS = [
  { id: 'desktop', width: 1440, height: 900, mobile: false },
  { id: 'mobile', width: 390, height: 844, mobile: true },
  // 360 is the floor the home page specification names (§5.1): blocks 1, 3 and 4 must be
  // reachable there with no horizontal scroll.
  { id: 'mobile360', width: 360, height: 800, mobile: true },
];

const SAMPLE = [
  ['home', '/'],
  ['chief', '/doctors/raimov-atabek/'],
  ['article', '/blog/viniry-komu-podhodyat/'],
  ['service', '/services/gnathology/'],
  ['smile-preview', '/services/smile-preview/'],
  ['named-checkup', '/services/named-checkup/'],
  ['care-12', '/services/care-12/'],
  ['services', '/services/'],
  ['doctors', '/doctors/'],
  ['blog', '/blog/'],
  ['contacts', '/contacts/'],
];

/**
 * --all audits every built route rather than the eight representative ones. Screenshots
 * are skipped there: the point is to prove no page anywhere drops below AA, and writing
 * 39 full-page JPEGs to prove it is just slower.
 */
const ALL = argv.includes('--all');
const SHOTS = !ALL;
const PAGES = ALL
  ? readdirSync(arg('dist', '/var/www/grainee-v2/site-raimovdental/dist/patient-staging'), {
      recursive: true,
      withFileTypes: true,
    })
      .filter((e) => e.isFile() && e.name === 'index.html')
      .map((e) => {
        const rel = e.parentPath.split('dist/')[1].split('/').slice(1).join('/');
        return [rel || 'home', '/' + (rel ? rel + '/' : '')];
      })
      .filter(([name]) => !name.startsWith('internal'))
      .sort()
  : SAMPLE;

/* ----------------------------------------------------------------- plumbing */

const waitPort = (port) =>
  new Promise((resolve, reject) => {
    const started = Date.now();
    const attempt = () => {
      const s = createConnection({ port, host: '127.0.0.1' })
        .on('connect', () => (s.destroy(), resolve()))
        .on('error', () => {
          s.destroy();
          if (Date.now() - started > 20000) reject(new Error('Chrome did not open its debug port'));
          else setTimeout(attempt, 200);
        });
    };
    attempt();
  });

const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--remote-allow-origins=*',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--font-render-hinting=none',
    'about:blank',
  ],
  { stdio: 'ignore' }
);
const stopChrome = () => {
  if (!chrome.killed) chrome.kill();
};
process.once('exit', stopChrome);
process.once('SIGINT', () => process.exit(130));
process.once('SIGTERM', () => process.exit(143));

await waitPort(PORT);

const { webSocketDebuggerUrl } = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json();
const ws = new WebSocket(webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  if (ws.readyState === WebSocket.OPEN) {
    resolve();
    return;
  }
  const timer = setTimeout(() => reject(new Error('Chrome WebSocket did not open')), 10000);
  ws.addEventListener(
    'open',
    () => {
      clearTimeout(timer);
      resolve();
    },
    { once: true }
  );
  ws.addEventListener(
    'error',
    () => {
      clearTimeout(timer);
      reject(new Error('Chrome WebSocket failed'));
    },
    { once: true }
  );
});

let seq = 0;
const pending = new Map();
const events = [];
ws.onmessage = (m) => {
  const msg = JSON.parse(m.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
  } else if (msg.method) {
    events.push(msg);
  }
};

const send = (method, params = {}, sessionId) =>
  new Promise((resolve, reject) => {
    const id = ++seq;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });

const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
const call = (method, params) => send(method, params, sessionId);

await call('Page.enable');
await call('Runtime.enable');
await call('Log.enable');

/* ------------------------------------------------------------------- probe */

/**
 * Runs in the page. Returns the defects a static checker cannot see: real layout
 * overflow, elements clipped by their container, failed images, and computed contrast.
 */
const PROBE = `(() => {
  const relLum = (rgb) => {
    const [r, g, b] = rgb.map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const parse = (s) => (s.match(/[\\d.]+/g) || []).slice(0, 3).map(Number);
  const bgOf = (el) => {
    for (let n = el; n && n !== document.documentElement; n = n.parentElement) {
      const c = getComputedStyle(n).backgroundColor;
      const p = parse(c);
      if (p.length === 3 && !/rgba\\(0, 0, 0, 0\\)|transparent/.test(c)) return p;
    }
    return [255, 255, 255];
  };

  const out = {
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
    overflow: [],
    clipped: [],
    brokenImages: [],
    lowContrast: [],
    emptyHeadings: [],
  };

  if (out.scrollWidth > out.innerWidth + 1) {
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      if (r.right > out.innerWidth + 1 || r.left < -1) {
        out.overflow.push({
          tag: el.tagName.toLowerCase(),
          cls: el.className?.toString().slice(0, 60),
          left: Math.round(r.left),
          right: Math.round(r.right),
        });
      }
    }
    out.overflow = out.overflow.slice(0, 8);
  }

  for (const img of document.images) {
    if (!img.complete || img.naturalWidth === 0) out.brokenImages.push(img.currentSrc || img.src);
  }

  for (const el of document.querySelectorAll('h1,h2,h3,h4,p,li,a,button,td,th,figcaption,span')) {
    if (!el.textContent.trim()) continue;
    if (el.querySelector('h1,h2,h3,h4,p,li,a,button,td,th,figcaption')) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    // Screen-reader-only text is clipped to 1x1 on purpose: it is not a layout defect, and
    // its colour is never seen, so it is exempt from both the clipping and contrast checks.
    if (r.width <= 1 || r.height <= 1) continue;

    // Text taller than its clipping container is text the visitor cannot read.
    if (el.scrollHeight > el.clientHeight + 2 && cs.overflow !== 'visible') {
      out.clipped.push({ tag: el.tagName.toLowerCase(), text: el.textContent.trim().slice(0, 55) });
    }

    const fg = parse(cs.color);
    const bg = bgOf(el);
    if (fg.length !== 3) continue;
    const l1 = relLum(fg);
    const l2 = relLum(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const size = parseFloat(cs.fontSize);
    const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
    const min = large ? 3 : 4.5;
    if (ratio < min) {
      out.lowContrast.push({
        text: el.textContent.trim().slice(0, 45),
        ratio: Math.round(ratio * 100) / 100,
        need: min,
        size: Math.round(size),
      });
    }
  }
  out.clipped = out.clipped.slice(0, 8);
  const seen = new Set();
  out.lowContrast = out.lowContrast.filter((c) => {
    const k = c.text + c.ratio;
    return seen.has(k) ? false : (seen.add(k), true);
  }).slice(0, 10);

  for (const h of document.querySelectorAll('h1,h2,h3')) {
    if (!h.textContent.trim()) out.emptyHeadings.push(h.tagName);
  }
  return JSON.stringify(out);
})()`;

/* -------------------------------------------------------------------- shoot */

mkdirSync(OUT, { recursive: true });
const report = [];

for (const vp of VIEWPORTS) {
  await call('Emulation.setDeviceMetricsOverride', {
    width: vp.width,
    height: vp.height,
    deviceScaleFactor: 1,
    mobile: vp.mobile,
  });

  for (const [name, path] of PAGES) {
    if (!ALL && vp.id === 'mobile' && !['home', 'chief', 'article', 'services'].includes(name)) continue;

    events.length = 0;
    await call('Page.navigate', { url: BASE + path });
    await new Promise((r) => setTimeout(r, 2200));
    // Force lazy images to resolve before judging what failed to load.
    await call('Runtime.evaluate', {
      expression: `window.scrollTo(0, document.body.scrollHeight); [...document.images].forEach(i => i.loading = 'eager');`,
    });
    await new Promise((r) => setTimeout(r, 1800));
    // The site sets scroll-behavior: smooth, so an animated scroll back to the top can
    // still be in flight at capture time and the sticky header gets painted mid-page.
    await call('Runtime.evaluate', {
      expression: `document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 0);`,
    });
    await new Promise((r) => setTimeout(r, 500));

    const { result } = await call('Runtime.evaluate', { expression: PROBE, returnByValue: true });
    const probe = JSON.parse(result.value);

    const { contentSize } = await call('Page.getLayoutMetrics');
    const height = Math.min(Math.ceil(contentSize.height), 14000);
    let file = null;

    if (SHOTS) {
      // captureBeyondViewport repaints position:sticky at the wrong offset, which makes
      // the header look broken in the shot. Growing the viewport to the page height and
      // capturing normally keeps sticky elements where the visitor actually sees them.
      await call('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height,
        deviceScaleFactor: 1,
        mobile: vp.mobile,
      });
      await new Promise((r) => setTimeout(r, 350));

      const shot = await call('Page.captureScreenshot', {
        format: 'jpeg',
        quality: 78,
        clip: { x: 0, y: 0, width: vp.width, height, scale: vp.id === 'desktop' ? 0.62 : 1 },
      });
      file = join(OUT, `${vp.id}-${name}.jpg`);
      writeFileSync(file, Buffer.from(shot.data, 'base64'));

      // The full-page shot is scaled down to stay readable as a whole; the first screens
      // are also kept at native scale, where type and spacing can actually be judged.
      const topHeight = Math.min(height, vp.mobile ? 1700 : 1500);
      await call('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: topHeight,
        deviceScaleFactor: 1,
        mobile: vp.mobile,
      });
      await new Promise((r) => setTimeout(r, 350));
      const top = await call('Page.captureScreenshot', {
        format: 'jpeg',
        quality: 82,
        clip: { x: 0, y: 0, width: vp.width, height: topHeight, scale: 1 },
      });
      writeFileSync(join(OUT, `${vp.id}-${name}-top.jpg`), Buffer.from(top.data, 'base64'));

      // Restore the real viewport so the next page lays out at the intended size.
      await call('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.mobile,
      });
    }

    const consoleErrors = events
      .filter((e) => e.method === 'Log.entryAdded' && e.params.entry.level === 'error')
      .map((e) => e.params.entry.text.slice(0, 120));

    report.push({ viewport: vp.id, page: name, path, height, file, consoleErrors, ...probe });
  }
}

await send('Target.closeTarget', { targetId });
ws.close();
chrome.kill();

/* ------------------------------------------------------------------ report */

let defects = 0;
for (const r of report) {
  const issues = [];
  if (r.scrollWidth > r.innerWidth + 1) {
    issues.push(`horizontal overflow ${r.scrollWidth}px > ${r.innerWidth}px`);
    for (const o of r.overflow) issues.push(`  overflowing <${o.tag} class="${o.cls}"> right=${o.right}`);
  }
  for (const b of r.brokenImages) issues.push(`broken image ${b}`);
  for (const c of r.clipped) issues.push(`clipped text <${c.tag}> "${c.text}"`);
  for (const c of r.lowContrast) issues.push(`contrast ${c.ratio}:1 (need ${c.need}) ${c.size}px "${c.text}"`);
  for (const h of r.emptyHeadings) issues.push(`empty ${h}`);
  for (const e of r.consoleErrors) issues.push(`console error: ${e}`);

  const label = `${r.viewport}/${r.page}`.padEnd(18);
  if (issues.length) {
    defects += issues.length;
    console.log(`\x1b[31m✗\x1b[0m ${label} ${r.height}px tall`);
    for (const i of issues) console.log(`    ${i}`);
  } else {
    console.log(`\x1b[32m✓\x1b[0m ${label} ${r.height}px tall — clean`);
  }
}

console.log(`\nscreenshots: ${OUT}`);
console.log(defects ? `\x1b[31m${defects} defect(s)\x1b[0m` : '\x1b[32mno layout defects\x1b[0m');
process.exit(defects ? 1 : 0);
