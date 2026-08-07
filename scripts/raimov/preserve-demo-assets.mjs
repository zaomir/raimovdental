#!/usr/bin/env node
import assert from 'node:assert/strict';
import { cpSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..', '..');
const site = join(repo, 'site-raimovdental');
const source = join(site, 'public', 'assets', 'img', 'workspace');
const target = join(site, 'dist', 'assets', 'img', 'workspace');

const required = [
  'index.html',
  'app.html',
  'admin/index.html',
  'doctor/index.html',
  'manager/index.html',
  'owner/index.html',
  'motion.css',
  'motion.js',
  'presentation/index.html',
  'presentation/shots/01-hub.png',
  'presentation/shots/09-owner-summary.png',
];

assert.ok(existsSync(join(site, 'dist')), 'RAIMOV dist must exist before preserving demo assets');
for (const relative of required) {
  assert.ok(existsSync(join(source, relative)), `missing workspace source asset: ${relative}`);
}

mkdirSync(dirname(target), { recursive: true });
cpSync(source, target, { recursive: true, force: true });

for (const relative of required) {
  assert.ok(existsSync(join(target, relative)), `workspace asset missing from dist: ${relative}`);
}

const hub = readFileSync(join(target, 'index.html'), 'utf8');
const app = readFileSync(join(target, 'app.html'), 'utf8');
assert.match(hub, /Как презентовать владельцу/);
assert.match(hub, /Интерфейсы по ролям/);
assert.match(hub, /presentation\//);
assert.match(hub, /Презентация для Атабека/);
const presentation = readFileSync(join(target, 'presentation/index.html'), 'utf8');
assert.match(presentation, /Что уже сделано для вашей клиники/);
assert.match(presentation, /shots\/06-render-call\.png/);
assert.match(presentation, /noindex,nofollow,noarchive,nosnippet/);
assert.match(app, /Демо · вход без пароля/);
assert.doesNotMatch(app, /type=["']password["']/i);
assert.doesNotMatch(app, /pass\s*:/i);

console.log('raimov-demo-assets-preserved: PASS');
