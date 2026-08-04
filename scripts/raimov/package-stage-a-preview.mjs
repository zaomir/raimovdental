#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const outputArg = process.argv[2] || 'artifacts/raimov-stage-a-preview/package';
const outputRoot = resolve(ROOT, outputArg);

function fail(message) {
  console.error(`RAIMOV_STAGE_A_PACKAGE_FAIL: ${message}`);
  process.exit(1);
}

function requireFile(path, label) {
  if (!existsSync(path)) fail(`${label} is missing: ${relative(ROOT, path)}`);
}

if (outputRoot === ROOT || !outputRoot.startsWith(`${ROOT}/`)) {
  fail('output must be a dedicated directory inside the repository');
}

const source = {
  html: join(ROOT, 'site-raimovdental/stage-a/index.html'),
  css: join(ROOT, 'site-raimovdental/stage-a/stage-a.css'),
  fontsCss: join(ROOT, 'site-raimovdental/src/assets/css/fonts.css'),
  fontsDir: join(ROOT, 'site-raimovdental/src/assets/fonts'),
  portrait: join(
    ROOT,
    'site-raimovdental/public/assets/img/doctor/atabek-portrait.jpg',
  ),
};

for (const [label, path] of Object.entries(source)) {
  if (label !== 'fontsDir') requireFile(path, label);
}
if (!existsSync(source.fontsDir)) fail('font directory is missing');

const routeRoot = join(outputRoot, 'stage-a');
const assetsRoot = join(routeRoot, 'assets');
const packagedFontsDir = join(assetsRoot, 'fonts');

rmSync(outputRoot, { recursive: true, force: true });
mkdirSync(packagedFontsDir, { recursive: true });

const originalHtml = readFileSync(source.html, 'utf8');
const originalCss = readFileSync(source.css, 'utf8');
const originalFontsCss = readFileSync(source.fontsCss, 'utf8');

const portraitReference = '../public/assets/img/doctor/atabek-portrait.jpg';
if (!originalHtml.includes(portraitReference)) {
  fail(`expected portrait reference not found: ${portraitReference}`);
}

const fontImport = '@import url("../src/assets/css/fonts.css");';
if (!originalCss.includes(fontImport)) {
  fail(`expected font import not found: ${fontImport}`);
}

const html = originalHtml.replace(
  portraitReference,
  './assets/atabek-portrait.jpg',
);
const css = originalCss.replace(
  fontImport,
  '@import url("./assets/fonts.css");',
);
const fontsCss = originalFontsCss.replaceAll('../fonts/', './fonts/');

const fontNames = [
  ...new Set(
    [...fontsCss.matchAll(/url\(["']?\.\/fonts\/([^"')]+)["']?\)/g)].map(
      (match) => match[1],
    ),
  ),
];
if (fontNames.length === 0) fail('no self-hosted font files were detected');

for (const fontName of fontNames) {
  const fontSource = join(source.fontsDir, basename(fontName));
  requireFile(fontSource, `font ${fontName}`);
  cpSync(fontSource, join(packagedFontsDir, basename(fontName)));
}

writeFileSync(join(routeRoot, 'index.html'), html);
writeFileSync(join(routeRoot, 'stage-a.css'), css);
writeFileSync(join(assetsRoot, 'fonts.css'), fontsCss);
cpSync(source.portrait, join(assetsRoot, 'atabek-portrait.jpg'));

for (const [label, content] of [
  ['HTML', html],
  ['CSS', css],
  ['font CSS', fontsCss],
]) {
  if (content.includes('../public/') || content.includes('../src/')) {
    fail(`${label} still references source-only paths`);
  }
  if (/https?:\/\//i.test(content)) {
    fail(`${label} contains an external HTTP resource`);
  }
}

const sourceSha =
  process.env.GITHUB_SHA ||
  execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: ROOT,
    encoding: 'utf8',
  }).trim();

const files = [
  join(routeRoot, 'index.html'),
  join(routeRoot, 'stage-a.css'),
  join(assetsRoot, 'fonts.css'),
  join(assetsRoot, 'atabek-portrait.jpg'),
  ...fontNames.map((fontName) => join(packagedFontsDir, basename(fontName))),
].map((path) => ({
  path: relative(outputRoot, path),
  bytes: statSync(path).size,
}));

const manifest = {
  project: 'raimovdental',
  surface: 'stage-a-protected-preview',
  sourceSha,
  generatedAt: new Date().toISOString(),
  route: '/stage-a/',
  accessPolicy: 'server-side-auth-required',
  robotsPolicy: 'noindex,nofollow,noarchive,nosnippet',
  files,
  totalBytes: files.reduce((sum, file) => sum + file.bytes, 0),
};

writeFileSync(
  join(outputRoot, 'preview-manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(
  `RAIMOV_STAGE_A_PACKAGE_OK route=/stage-a/ files=${files.length} bytes=${manifest.totalBytes} source_sha=${sourceSha}`,
);
