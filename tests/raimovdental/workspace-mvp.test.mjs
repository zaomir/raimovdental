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
assert.match(app, /i54-feedback-quiz/);
assert.match(app, /quizAdmin/);
assert.match(app, /Отправить файл прайса и закончить диалог/);
assert.match(app, /Одно содержательное касание/);
assert.match(app, /Работа ограничена/);
assert.match(app, /state\.score>=90&&criticalOk/);
assert.match(app, /admin-feedback-sop\.json/);
assert.match(app, /Когда просить отзыв/);
assert.match(app, /feedbackLessons/);
assert.match(app, /feedbackWhenRead/);
assert.match(app, /i51-when-to-ask/);
assert.match(app, /i52-qr-platforms/);
assert.match(app, /qrPlatforms/);
assert.match(app, /QR и три площадки/);
assert.match(app, /reward-for-review/);
assert.match(app, /publication_disclaimer/);
assert.match(app, /Можно ли обещать скидку, подарок или баллы за публичный отзыв/);
assert.match(app, /critical:true,source:'admin-feedback-sop\.json · prohibitions · reward'/);
assert.match(app, /Равный контур: не навязывать одну площадку/);
assert.match(app, /i53-post-visit/);
assert.match(app, /Визит состоялся/);
assert.match(app, /postVisitChecklist/);
assert.match(app, /post_visit_checklist/);
assert.match(app, /data-checklist-step/);
assert.match(app, /openPostVisitChecklist/);
assert.match(app, /i55-manager-feedback/);
assert.match(app, /assignFeedbackRetake/);
assert.match(app, /feedbackTeamStats/);
assert.match(app, /Назначить пересдачу/);
assert.match(app, /уроки регламента отзывов/);
assert.match(app, /readLiveAdminFeedback/);
assert.match(app, /i41-patient-path/);
assert.match(app, /function pathView/);
assert.match(app, /patient-path\.json/);
assert.match(app, /\['path','Путь'\]/);
assert.match(app, /Путь пациента/);
assert.match(app, /data-path-step/);
assert.match(app, /i42-route-switch/);
assert.match(app, /function routeNextHint/);
assert.match(app, /state\.pathRoute/);
assert.match(app, /data-path-route/);
assert.match(app, /P07:'admin_questions'/);
assert.match(app, /P08:'first_visit_result'/);
assert.match(app, /P09:'question'/);
assert.match(app, /P10:'page_logic'/);
assert.match(app, /P11:'first_visit_result'/);
assert.match(app, /i43-demo-path-position/);
assert.match(app, /DEMO_PATH_CASE/);
assert.match(app, /stepId:'P08'/);
assert.match(app, /data-path-position/);
assert.match(app, /data-path-current/);
assert.match(app, /function demoPathCaseHtml/);
assert.match(app, /Текущая позиция на пути/);
assert.match(app, /i44-next-action-gate/);
assert.match(app, /bindDemoPathCloseGate/);
assert.match(app, /Нельзя закрыть контакт \/ передачу без next action/);
assert.match(app, /demoPathClose/);
assert.match(app, /i11-unified-inbox/);
assert.match(app, /DEMO_INBOX/);
assert.match(app, /function inboxListHtml/);
assert.match(app, /Единый inbox обращений/);
assert.match(app, /data-inbox-channel/);
assert.match(app, /channelKey:'call'/);
assert.match(app, /channelKey:'whatsapp'/);
assert.match(app, /channelKey:'form'/);
assert.match(app, /channel:'Звонок'/);
assert.match(app, /channel:'WhatsApp'/);
assert.match(app, /channel:'Форма'/);
const patientPath = JSON.parse(readFileSync(join(distRoot, 'content/patient-path.json'), 'utf8'));
assert.equal(patientPath.steps.length, 14);
assert.ok(patientPath.routes && patientPath.routes.veneers && patientPath.routes.implants && patientPath.routes.ortho);
assert.ok(patientPath.routes.veneers.admin_questions);
assert.ok(patientPath.routes.implants.first_visit_result);
assert.ok(patientPath.routes.ortho.page_logic);
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
assert.match(appJs, /i44-next-action-gate/);
assert.match(appJs, /syncOutcomeNextGate/);
assert.match(appJs, /Нельзя закрыть контакт \/ передачу без next action/);
assert.match(adminIndex, /journalStatus/);
assert.match(adminIndex, /app\.js\?v=20260807-i44/);
const recontact = JSON.parse(readFileSync(join(distRoot, 'content/recontact-9.json'), 'utf8'));
assert.equal(recontact.length, 9);
assert.ok(recontact.every((item) => item.id && item.rule && item.delay && item.channel));
assert.ok(scripts.every((item) => item.id && item.title && item.body && item.next_action));
assert.equal(scripts.filter((item) => item.dont_say).length, 25);

console.log('expert-dental-workspace-dist-preservation+passwordless-demo: PASS');
