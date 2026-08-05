#!/usr/bin/env node
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const sourceRoot = join(process.cwd(), 'site-raimovdental', 'public', 'assets', 'img', 'workspace');
const distRoot = join(process.cwd(), 'site-raimovdental', 'dist', 'assets', 'img', 'workspace');
const required = ['index.html', 'app.html', 'admin/index.html', 'doctor/index.html', 'manager/index.html', 'owner/index.html', 'motion.css', 'motion.js', 'home-care-matrix.js'];

for (const relative of required) {
  assert.ok(existsSync(join(sourceRoot, relative)), `missing workspace source: ${relative}`);
  assert.ok(existsSync(join(distRoot, relative)), `workspace omitted from canonical dist build: ${relative}`);
}

const hub = readFileSync(join(distRoot, 'index.html'), 'utf8');
const app = readFileSync(join(distRoot, 'app.html'), 'utf8');
for (const token of [
  'Одна система.',
  'Интерфейсы по ролям',
  'Как презентовать владельцу',
  'Администратор',
  'Врач',
  'Управляющий',
  'Руководитель клиники',
]) assert.match(hub, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

for (const token of [
  'Рабочая система',
  'Начать работу',
  'Передать смену',
  'Принять дежурство',
  'Принять обращение',
  'Новая маршрутизация медицинского обращения',
  'Пошаговый опросник передачи врачу',
  'Матрица ухода и памятки после процедуры',
  'home-care-matrix.js',
  'ExpertDentalHomeCareUI',
  'Демо · вход без пароля',
]) assert.match(app, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

assert.doesNotMatch(app, /type=["']password["']/i);
assert.doesNotMatch(app, /pass\s*:/i);
assert.match(hub, /@media\(max-width:820px\)/);
assert.match(app, /@media\(max-width:780px\)/);
assert.match(hub, /noindex,nofollow,noarchive,nosnippet/);
assert.match(app, /noindex,nofollow,noarchive,nosnippet/);

for (const role of ['admin', 'doctor', 'manager', 'owner']) {
  const wrapper = readFileSync(join(distRoot, role, 'index.html'), 'utf8');
  assert.match(wrapper, /fetch\('\.\.\/app\.html'/);
}

console.log('expert-dental-workspace-dist-preservation+passwordless-demo: PASS');
