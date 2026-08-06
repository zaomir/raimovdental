#!/usr/bin/env node
/**
 * One-time asset preparation for the Expert Dental Studio patient site.
 *
 * Sources live outside the repo (Tilda CDN, Dropbox `ROVLEX/Фото Для Отзывов/Фото От Клиники`,
 * founder-supplied portraits). This script normalises them into
 * `site-raimovdental/patient-site/assets/img/**` so the builder only ever reads committed files.
 *
 * Run manually when source material changes:
 *   node scripts/raimov/prepare-patient-assets.mjs
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const STAGE = join(REPO, 'tmp', 'ed-assets');
const OUT = join(REPO, 'site-raimovdental', 'patient-site', 'assets');

// Founder-supplied and generated originals land outside the repo; override with ASSET_INBOX.
const INBOX = process.env.ASSET_INBOX || '/root/.cursor/projects/var-www-grainee-v2/assets';

const FONT_FAMILIES = [
  { id: 'cormorant-garamond', spec: 'Cormorant+Garamond:wght@300;400;500' },
  { id: 'manrope', spec: 'Manrope:wght@400;500;600;700' },
];

// Dropbox filenames are stable; index-based picks would silently drift.
const CLINIC_PHOTOS = [
  ['Sezim - IMG_4953.jpeg', 'clinic/reception.jpg', 'wide'],
  ['Sezim - IMG_4952.jpeg', 'clinic/waiting.jpg', 'wide'],
  ['Sezim - 2222.jpeg', 'clinic/lounge.jpg', 'portrait'],
  ['Sezim - IMG_4955.jpeg', 'clinic/hall.jpg', 'portrait'],
  ['Sezim - IMG_4958.jpeg', 'clinic/operatory.jpg', 'portrait'],
  ['Sezim - IMG_4966.jpeg', 'clinic/chair.jpg', 'portrait'],
  ['Sezim - IMG_4967.jpeg', 'clinic/xray.jpg', 'wide'],
  ['Sezim - IMG_4494.jpeg', 'clinic/ct.jpg', 'wide'],
  ['Sezim - IMG_4493.jpeg', 'clinic/sterilization.jpg', 'wide'],
  ['Sezim - IMG_4961.jpeg', 'clinic/facade.jpg', 'wide'],
  ['Sezim - IMG_4960.jpeg', 'clinic/ortho-room.jpg', 'portrait'],
  ['Sezim - IMG_4965.jpeg', 'clinic/neon.jpg', 'portrait'],
  ['Sezim - IMG_4531.jpeg', 'clinic/braces.jpg', 'wide'],
  ['Sezim - IMG_4492.jpeg', 'clinic/sign.jpg', 'wide'],
];

const PORTRAITS = [
  'raimov-atabek',
  'talyshkhanov-mirali',
  'khalbaev-islambek',
  'duisheeva-aiday',
  'kerimkulova-aiperi',
  'ergeshova-begimai',
  'taalaibekova-cholpon',
];

function log(...args) {
  console.log('[assets]', ...args);
}

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function python(source) {
  const out = execFileSync('python3', ['-c', source], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  if (out.trim()) console.log(out.trim());
  return out;
}

/* ------------------------------------------------------------------ fonts */

async function buildFonts() {
  const outDir = join(OUT, 'fonts');
  ensureDir(outDir);
  const ua =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  const blocks = [];
  const byUrl = new Map();

  for (const { id, spec } of FONT_FAMILIES) {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${spec}&display=swap`;
    const css = await fetch(cssUrl, { headers: { 'User-Agent': ua } }).then((r) => r.text());

    // Keep only cyrillic + latin: the site is RU-only with latin brand strings.
    const faces = css.split('/*').slice(1);
    for (const face of faces) {
      const subset = face.slice(0, face.indexOf('*/')).trim();
      if (!['cyrillic', 'latin'].includes(subset)) continue;
      const url = face.match(/https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2/)?.[0];
      const weight = face.match(/font-weight:\s*([\d\s]+);/)?.[1].trim() ?? '400';
      const family = face.match(/font-family:\s*'([^']+)'/)?.[1] ?? id;
      if (!url) continue;

      // Variable families serve one file for every weight — dedupe on the source URL.
      let file = byUrl.get(url);
      if (!file) {
        file = `${id}-${weight.replace(/\s+/g, '-')}-${subset}.woff2`;
        byUrl.set(url, file);
        const target = join(outDir, file);
        if (!existsSync(target)) {
          const bytes = Buffer.from(await fetch(url, { headers: { 'User-Agent': ua } }).then((r) => r.arrayBuffer()));
          writeFileSync(target, bytes);
          log('font', file, bytes.length);
        }
      }
      const range = face.match(/unicode-range:\s*([^;]+);/)?.[1] ?? '';
      blocks.push(
        `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:swap;` +
          `src:url('../fonts/${file}') format('woff2');unicode-range:${range}}`
      );
    }
  }

  ensureDir(join(OUT, 'css'));
  writeFileSync(join(OUT, 'css', 'fonts.css'), `${blocks.join('\n')}\n`, 'utf8');
  log('fonts.css written', blocks.length, 'faces');
}

/* ----------------------------------------------------------------- images */

const PY_HELPERS = `
import sys, os
from PIL import Image, ImageOps, ImageFilter

def load(path):
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)
    return im.convert('RGB')

def save_variants(im, out_base, widths, quality=82):
    os.makedirs(os.path.dirname(out_base), exist_ok=True)
    widths = [w for w in widths if w <= im.width] or [im.width]
    for w in widths:
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS)
        r = r.filter(ImageFilter.UnsharpMask(radius=1.1, percent=52, threshold=3))
        suffix = '' if w == widths[0] else f'-{w}'
        r.save(f'{out_base}{suffix}.jpg', 'JPEG', quality=quality, optimize=True, progressive=True)
        print('wrote', f'{out_base}{suffix}.jpg', r.size)
`;

function processClinicPhotos() {
  const src = join(STAGE, 'dropbox');
  if (!existsSync(src)) {
    log('SKIP clinic photos — run rclone copy into tmp/ed-assets/dropbox first');
    return;
  }
  const entries = CLINIC_PHOTOS.map(([file, target, shape]) => [join(src, file), join(OUT, 'img', target), shape]);
  python(`${PY_HELPERS}
import json
jobs = json.loads(r'''${JSON.stringify(entries)}''')
for src, target, shape in jobs:
    if not os.path.exists(src):
        print('MISSING', src); continue
    im = load(src)
    # Crop to a predictable aspect so grid cards never letterbox.
    ratio = 3/2 if shape == 'wide' else 3/4
    w, h = im.size
    if w / h > ratio:
        nw = round(h * ratio); im = im.crop(((w - nw)//2, 0, (w - nw)//2 + nw, h))
    else:
        nh = round(w / ratio); top = max(0, round((h - nh) * 0.38)); im = im.crop((0, top, w, top + nh))
    base = target[:-4]
    widths = [1600, 1000, 640] if shape == 'wide' else [1100, 760, 480]
    save_variants(im, base, widths)
`);
}

function processPortraits() {
  const jobs = PORTRAITS.map((slug) => [join(INBOX, `ed-portrait-${slug}.png`), join(OUT, 'img', 'doctors', slug)]);
  python(`${PY_HELPERS}
import json
jobs = json.loads(r'''${JSON.stringify(jobs)}''')
for src, base in jobs:
    if not os.path.exists(src):
        print('MISSING', src); continue
    im = load(src)
    s = min(im.size)
    im = im.crop(((im.width - s)//2, 0, (im.width - s)//2 + s, s))
    save_variants(im, base, [900, 560, 360], quality=86)
`);
}

function processTeamPhoto() {
  python(`${PY_HELPERS}
import glob
cands = sorted(glob.glob(os.path.join(r'''${INBOX}''', 'dental-new4-*.png')))
if not cands:
    print('MISSING team photo'); raise SystemExit(0)
im = load(cands[-1])
# Founder-supplied render carries a soft black vignette frame; trim it off.
w, h = im.size
im = im.crop((round(w*0.045), round(h*0.055), round(w*0.955), round(h*0.985)))
save_variants(im, r'''${join(OUT, 'img', 'team', 'team')}''', [920, 720, 480], quality=88)
`);
}

function buildLogo() {
  python(`${PY_HELPERS}
import glob
cands = sorted(glob.glob(os.path.join(r'''${INBOX}''', 'EXPERT_DENTAL-logo-*.png')))
if not cands:
    print('MISSING logo'); raise SystemExit(0)
im = Image.open(cands[-1]).convert('RGBA')
os.makedirs(r'''${join(OUT, 'img', 'brand')}''', exist_ok=True)
im.save(os.path.join(r'''${join(OUT, 'img', 'brand')}''', 'logo.png'))
print('wrote logo', im.size)
`);
}

/* -------------------------------------------------------------------- run */

const only = process.argv[2];
if (!only || only === 'fonts') await buildFonts();
if (!only || only === 'clinic') processClinicPhotos();
if (!only || only === 'portraits') processPortraits();
if (!only || only === 'team') processTeamPhoto();
if (!only || only === 'logo') buildLogo();
log('done');
