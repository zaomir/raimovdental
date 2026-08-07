#!/usr/bin/env node
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const sourceRoot = join(process.cwd(), 'site-raimovdental', 'public', 'assets', 'img', 'workspace');
const distRoot = join(process.cwd(), 'site-raimovdental', 'dist', 'assets', 'img', 'workspace');
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
  'content/scripts-25.json',
  'content/recontact-9.json',
  'content/patient-path.json',
  'content/admin-feedback-sop.json',
  'content/gaps.md',
];

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
  'Презентация для Атабека',
  'Администратор',
  'Врач',
  'Управляющий',
  'Руководитель клиники',
]) assert.match(hub, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

const presentation = readFileSync(join(distRoot, 'presentation/index.html'), 'utf8');
for (const token of [
  'Что уже сделано для вашей клиники',
  'Каких результатов можно добиться',
  'shots/01-hub.png',
  'shots/06-render-call.png',
  'shots/09-owner-summary.png',
  'noindex,nofollow,noarchive,nosnippet',
]) assert.match(presentation, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

for (const token of [
  'Рабочая система',
  'Начать работу',
  'Передать смену',
  'Принять дежурство',
  'Принять обращение',
  'Новая маршрутизация медицинского обращения',
  'Пошаговый опросник передачи врачу',
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

assert.match(app, /\/render\/#scripts/);
assert.match(app, /\/render\/#recontact/);
assert.match(app, /i76-scripts-recontact/);
assert.match(app, /quizAdmin/);
assert.match(app, /Отправить файл прайса и закончить диалог/);
assert.match(app, /Одно содержательное касание/);
assert.match(app, /Работа ограничена/);
assert.match(app, /state\.score>=90&&criticalOk/);
const scripts = JSON.parse(readFileSync(join(distRoot, 'content/scripts-25.json'), 'utf8'));
assert.equal(scripts.length, 25);
const adminIndex = readFileSync(join(process.cwd(), 'site-raimovdental', 'public', 'assets', 'img', 'admin', 'index.html'), 'utf8');
assert.match(adminIndex, /id="openScripts"/);
assert.match(adminIndex, /scripts-catalog\.js/);
assert.match(adminIndex, /id="scriptsModal"/);
assert.match(adminIndex, /id="scriptsDetailView"/);
assert.match(adminIndex, /id="scriptsBack"/);
assert.match(adminIndex, /data-quick="price"/);
assert.match(adminIndex, /data-quick="fear"/);
assert.match(adminIndex, /id="openRecontact"/);
assert.match(adminIndex, /recontact-catalog\.js/);
assert.match(adminIndex, /id="recontactModal"/);
const catalogJs = readFileSync(join(process.cwd(), 'site-raimovdental', 'public', 'assets', 'img', 'admin', 'scripts-catalog.js'), 'utf8');
assert.match(catalogJs, /renderDetail/);
assert.match(catalogJs, /dont_say/);
assert.match(catalogJs, /openById/);
const appJs = readFileSync(join(process.cwd(), 'site-raimovdental', 'public', 'assets', 'img', 'admin', 'app.js'), 'utf8');
assert.match(appJs, /scriptMap = \{ price: 'S05', fear: 'S08' \}/);
assert.match(appJs, /state\.screen === 'fear'/);
const recontactJs = readFileSync(join(process.cwd(), 'site-raimovdental', 'public', 'assets', 'img', 'admin', 'recontact-catalog.js'), 'utf8');
assert.match(recontactJs, /createTask/);
assert.match(recontactJs, /createManualTask/);
assert.match(recontactJs, /recontact-9\.json/);
assert.match(recontactJs, /expert-dental-recontact-tasks-v1/);
assert.match(appJs, /__missed__/);
assert.match(appJs, /data-return-work/);
assert.match(appJs, /returnJournalToWork/);
assert.match(adminIndex, /journalStatus/);
const recontact = JSON.parse(readFileSync(join(distRoot, 'content/recontact-9.json'), 'utf8'));
assert.equal(recontact.length, 9);
assert.ok(recontact.every((item) => item.id && item.rule && item.delay && item.channel));
assert.ok(scripts.every((item) => item.id && item.title && item.body && item.next_action));
assert.equal(scripts.filter((item) => item.dont_say).length, 25);

console.log('expert-dental-workspace-dist-preservation+passwordless-demo: PASS');
