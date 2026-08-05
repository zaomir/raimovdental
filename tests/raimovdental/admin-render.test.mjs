#!/usr/bin/env node
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..', '..');
const build = spawnSync(process.execPath, [join(repo, 'scripts/build-raimovdental.mjs')], {
  cwd: repo,
  encoding: 'utf8',
});
assert.equal(build.status, 0, build.stderr || build.stdout || 'RAIMOV build failed');

const root = join(repo, 'site-raimovdental', 'dist', 'assets', 'img', 'admin');
for (const name of ['index.html', 'app.css', 'app.js', 'journal.css', 'doctor-transfer.js', 'ux.css', 'ux.js', 'handoff-accordion.css', 'handoff-accordion.js', 'call-guidance.css', 'call-guidance.js', 'home-care-matrix.js', 'home-care-ui.js', 'home-care-ui.css']) {
  assert.ok(existsSync(join(root, name)), `missing admin render asset: ${name}`);
}

const htmlPath = join(root, 'index.html');
const jsPath = join(root, 'app.js');
const transferPath = join(root, 'doctor-transfer.js');
const uxPath = join(root, 'ux.js');
const accordionPath = join(root, 'handoff-accordion.js');
const guidancePath = join(root, 'call-guidance.js');
const matrixPath = join(root, 'home-care-matrix.js');
const homeCareUiPath = join(root, 'home-care-ui.js');
const html = readFileSync(htmlPath, 'utf8');
const js = readFileSync(jsPath, 'utf8');
const transfer = readFileSync(transferPath, 'utf8');
const ux = readFileSync(uxPath, 'utf8');
const accordion = readFileSync(accordionPath, 'utf8');
const guidance = readFileSync(guidancePath, 'utf8');
const matrix = readFileSync(matrixPath, 'utf8');
const homeCareUi = readFileSync(homeCareUiPath, 'utf8');
const uxCss = readFileSync(join(root, 'ux.css'), 'utf8');
const accordionCss = readFileSync(join(root, 'handoff-accordion.css'), 'utf8');
const guidanceCss = readFileSync(join(root, 'call-guidance.css'), 'utf8');
const nginx = readFileSync(join(repo, 'deploy', 'nginx', 'raimovdental.com.conf'), 'utf8');

for (const path of [jsPath, transferPath, uxPath, accordionPath, guidancePath, matrixPath, homeCareUiPath]) {
  const syntax = spawnSync(process.execPath, ['--check', path], { encoding: 'utf8' });
  assert.equal(syntax.status, 0, syntax.stderr || syntax.stdout || `${path} syntax invalid`);
}

assert.match(html, /noindex,nofollow,noarchive/);
assert.match(html, /Рендер администратора/);
assert.match(html, /Демо-режим · вход без пароля · без CRM/);
assert.match(html, /sessionStorage\.setItem\('ed-admin','1'\)/);
assert.doesNotMatch(html, /type=["']password["']/i);
assert.doesNotMatch(html, />Пароль</);
assert.match(html, /К интерфейсам/);
assert.match(html, /Журнал обращений/);
assert.match(html, /doctor-transfer\.js/);
assert.match(html, /handoff-accordion\.css/);
assert.match(html, /handoff-accordion\.js/);
assert.match(html, /ux\.css/);
assert.match(html, /ux\.js/);
assert.match(html, /call-guidance\.css/);
assert.match(html, /call-guidance\.js/);
assert.match(html, /home-care-matrix\.js/);
assert.match(html, /home-care-ui\.js/);
assert.match(html, /home-care-ui\.css/);
assert.match(js, /openApp/);
assert.match(js, /homecare/);
assert.match(js, /ExpertDentalHomeCareUI/);
assert.match(guidance, /HC-01/);
assert.match(guidance, /Закрытие визита · уход и памятка/);
assert.match(matrix, /ExpertDentalHomeCare/);
assert.match(matrix, /Профессиональная гигиена/);
assert.match(homeCareUi, /renderAdminPanel/);
assert.match(homeCareUi, /doctorPanelHtml/);
assert.match(homeCareUi, /memo_printed/);
assert.match(js, /\+996/);
assert.match(js, /Записан на приём/);
assert.match(js, /Передан врачу/);
assert.match(js, /Следующее действие/);
assert.match(js, /Мария Ивановна/);
assert.match(js, /Айбек Нурланович/);
assert.match(js, /Елена Сергеевна/);
assert.match(js, /triage-bleeding/);
assert.match(js, /triage-restoration/);
assert.match(js, /renderJournal/);
assert.match(js, /localStorage/);
assert.match(transfer, /Последняя процедура пациента/);
assert.match(transfer, /Да, вопрос после этой процедуры/);
assert.match(transfer, /подставлена автоматически/);
assert.match(transfer, /data-choice/);
assert.match(transfer, /Нормальная со слов пациента/);
assert.match(transfer, /Неизвестно/);
assert.doesNotMatch(transfer, /<select/);
assert.match(transfer, /Перевести звонок лечащему врачу/);
assert.match(transfer, /Перевести свободному врачу срочной группы/);
assert.match(transfer, /Перевести дежурному врачу/);
assert.match(transfer, /Обычная передача врачу/);
assert.match(transfer, /Срочная передача врачу/);
assert.match(transfer, /Экстренная медицинская маршрутизация/);
assert.match(transfer, /Опросник уже передан на экран врача/);
assert.match(transfer, /Врач принял обращение/);
assert.match(transfer, /Назначен обратный звонок/);
assert.match(transfer, /expert-dental-contact-journal-v2/);
assert.match(transfer, /expert-dental-handoff-v2/);
assert.match(accordion, /Вопрос \$\{current\} из/);
assert.match(accordion, /Обязательный вопрос/);
assert.match(accordion, /handoff-step-header/);
assert.match(accordion, /Назад/);
assert.match(accordion, /showReview/);
assert.match(accordion, /aria-expanded/);
assert.match(accordion, /advanceFrom/);
assert.match(accordion, /следующий вопрос откроется автоматически/);
assert.match(accordion, /needsManualConfirmation/);
assert.match(accordion, /window\.setTimeout/);
assert.match(accordionCss, /\.handoff-step\.is-active/);
assert.match(accordionCss, /\.handoff-step-body/);
assert.match(accordionCss, /\.handoff-step-summary/);
assert.match(accordionCss, /\.choice-button\.is-selected\{[^}]*background:var\(--brand\)/s);
assert.match(accordionCss, /\.choice-button\.is-selected strong\{color:#fff\}/);
assert.match(ux, /MutationObserver/);
assert.match(ux, /ux-primary/);
assert.match(uxCss, /one visually dominant action/i);
assert.match(uxCss, /\.option:hover/);
assert.match(guidance, /Обычный звонок/);
assert.match(guidance, /Срочный звонок/);
assert.match(guidance, /S01/);
assert.match(guidance, /S16/);
assert.match(guidance, /Имплантация и стоимость/);
assert.match(guidance, /Виниры и эстетика/);
assert.match(guidance, /Брекеты и элайнеры/);
assert.match(guidance, /красные флаги/);
assert.match(guidance, /экстренн(?:ая|ой) медицинск/);
assert.match(guidance, /Тёплая передача/);
assert.match(guidance, /requestAnimationFrame/);
assert.match(guidance, /dataset\.signature/);
assert.match(guidanceCss, /call-priority-bar/);
assert.match(guidanceCss, /data-call-priority="urgent"/);
assert.match(guidanceCss, /call-script-guide/);
assert.match(nginx, /location = \/render\//);
assert.match(nginx, /X-Robots-Tag "noindex, nofollow, noarchive"/);

console.log('admin-render passwordless+priority-routing+contextual-call-scripts+urgent-routine-doctor-handoff: PASS');
