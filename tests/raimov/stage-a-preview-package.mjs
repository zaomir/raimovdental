#!/usr/bin/env node

import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import {
  existsSync,
  readFileSync,
  rmSync,
  statSync,
} from 'node:fs';
import net from 'node:net';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const outputRelative = 'artifacts/raimov-stage-a-preview/package-test';
const outputRoot = join(ROOT, outputRelative);

function getFreePort() {
  return new Promise((resolvePort, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      const port = typeof address === 'object' && address ? address.port : null;
      server.close((error) => {
        if (error) reject(error);
        else if (!port) reject(new Error('Could not allocate a test port'));
        else resolvePort(port);
      });
    });
  });
}

async function waitForServer(url, attempts = 60) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, { redirect: 'manual' });
      if (response.ok) return response;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 150));
  }
  throw new Error(`Preview package server did not start: ${lastError?.message || 'unknown error'}`);
}

rmSync(outputRoot, { recursive: true, force: true });

const packageResult = spawnSync(
  process.execPath,
  ['scripts/raimov/package-stage-a-preview.mjs', outputRelative],
  { cwd: ROOT, encoding: 'utf8' },
);
assert.equal(
  packageResult.status,
  0,
  `Packager failed:\n${packageResult.stdout}\n${packageResult.stderr}`,
);
assert.match(packageResult.stdout, /RAIMOV_STAGE_A_PACKAGE_OK/);

const expectedFiles = [
  'stage-a/index.html',
  'stage-a/stage-a.css',
  'stage-a/assets/fonts.css',
  'stage-a/assets/atabek-portrait.jpg',
  'preview-manifest.json',
];
for (const path of expectedFiles) {
  assert.ok(existsSync(join(outputRoot, path)), `Missing packaged file: ${path}`);
}

const html = readFileSync(join(outputRoot, 'stage-a/index.html'), 'utf8');
const css = readFileSync(join(outputRoot, 'stage-a/stage-a.css'), 'utf8');
const fontsCss = readFileSync(join(outputRoot, 'stage-a/assets/fonts.css'), 'utf8');
const manifest = JSON.parse(
  readFileSync(join(outputRoot, 'preview-manifest.json'), 'utf8'),
);

assert.match(html, /noindex,nofollow,noarchive,nosnippet/);
assert.match(html, /\.\/assets\/atabek-portrait\.jpg/);
assert.doesNotMatch(html, /\.\.\/public\//);
assert.match(css, /@import url\("\.\/assets\/fonts\.css"\)/);
assert.doesNotMatch(css, /\.\.\/src\//);
assert.match(fontsCss, /\.\/fonts\//);
assert.doesNotMatch(fontsCss, /\.\.\/fonts\//);
assert.equal(manifest.route, '/stage-a/');
assert.equal(manifest.accessPolicy, 'server-side-auth-required');
assert.equal(manifest.robotsPolicy, 'noindex,nofollow,noarchive,nosnippet');
assert.ok(manifest.totalBytes > 0);

const fontMatch = fontsCss.match(/url\(["']?\.\/fonts\/([^"')]+)["']?\)/);
assert.ok(fontMatch, 'No packaged font URL found');
const packagedFont = join(outputRoot, 'stage-a/assets/fonts', fontMatch[1]);
assert.ok(existsSync(packagedFont), `Packaged font missing: ${fontMatch[1]}`);
assert.ok(statSync(packagedFont).size > 0, 'Packaged font is empty');

const port = await getFreePort();
const server = spawn(
  'python3',
  ['-m', 'http.server', String(port), '--bind', '127.0.0.1', '--directory', outputRoot],
  { cwd: ROOT, stdio: ['ignore', 'pipe', 'pipe'] },
);

try {
  const routeUrl = `http://127.0.0.1:${port}/stage-a/`;
  await waitForServer(routeUrl);

  for (const path of [
    '/stage-a/',
    '/stage-a/stage-a.css',
    '/stage-a/assets/fonts.css',
    '/stage-a/assets/atabek-portrait.jpg',
    `/stage-a/assets/fonts/${fontMatch[1]}`,
  ]) {
    const response = await fetch(`http://127.0.0.1:${port}${path}`);
    assert.equal(response.status, 200, `Expected 200 for ${path}, got ${response.status}`);
  }

  const servedHtml = await (await fetch(routeUrl)).text();
  assert.match(servedHtml, /Стратегия Дмитрия/);
  assert.match(servedHtml, /Raimov System/);
  assert.doesNotMatch(servedHtml, /https?:\/\//i);
} finally {
  server.kill('SIGTERM');
  rmSync(outputRoot, { recursive: true, force: true });
}

console.log('RAIMOV_STAGE_A_PREVIEW_PACKAGE_TEST_OK');
