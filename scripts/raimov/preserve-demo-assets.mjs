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
  'content/scripts-25.json',
  'content/recontact-9.json',
  'content/patient-path.json',
  'content/admin-feedback-sop.json',
  'content/internal-marketing.json',
  'content/speech-markers-before.json',
  'content/speech-markers-chair.json',
  'content/sources.json',
  'content/gaps.md',
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
assert.match(app, /\/render\/#scripts/);
assert.match(app, /\/render\/#recontact/);
assert.match(app, /\/render\/#markers/);
assert.match(app, /Маркеры до кресла/);
assert.match(app, /i115-markers-quiz/);
assert.match(app, /quizAdmin/);
assert.match(app, /quizDoctor/);
assert.match(app, /updatesDoctor/);
assert.match(app, /data-atom="i115-markers-quiz"/);
assert.match(app, /Маркеры до кресла и связка с маршрутом/);
assert.match(app, /Маркеры потребности в кресле/);
assert.match(app, /Работа ограничена/);
assert.match(app, /reward-for-review/);
assert.match(app, /admin-feedback-sop\.json/);
assert.match(app, /Когда просить отзыв/);
assert.match(app, /feedbackLessons/);
assert.match(app, /i52-qr-platforms/);
assert.match(app, /QR и три площадки/);
assert.match(app, /feedbackWhenRead/);
assert.match(app, /i53-post-visit/);
assert.match(app, /postVisitChecklist/);
assert.match(app, /data-checklist-step/);
assert.match(app, /i11-unified-inbox/);
assert.match(app, /DEMO_INBOX/);
assert.match(app, /Единый inbox обращений/);
assert.match(app, /channelKey:'call'/);
assert.match(app, /channelKey:'whatsapp'/);
assert.match(app, /channelKey:'form'/);
assert.match(app, /i14-inquiry-audit/);
assert.match(app, /i14-demo-violation/);
assert.match(app, /Как проверять обработку заявок/);
assert.match(app, /DEMO_INQUIRY_VIOLATION/);
assert.match(app, /i82-source-gate/);
assert.match(app, /sources\.json/);
assert.match(app, /Нельзя закрыть контакт без источника/);
assert.match(app, /i83-source-funnel/);
assert.match(app, /managerSourceFunnelStats/);
assert.match(app, /Воронка по источникам/);
assert.match(app, /i102-doctor-role/);
assert.match(app, /i102-doctor-tasks/);
assert.match(app, /i104-propose-consult/);
assert.match(app, /i104-internal-referrals/);
assert.match(app, /i105-referral-metrics/);
assert.match(app, /managerReferralStats/);
assert.match(app, /i112-speech-markers-chair/);
assert.match(app, /speech-markers-chair\.json/);
assert.match(app, /Когда не говорить/);
assert.match(app, /i114-marker-route/);
assert.match(app, /applyMarkerRoute/);
assert.match(app, /data-apply-marker-route/);
assert.match(app, /i113-handoff-journal/);
assert.match(app, /handoffJournalHtml/);
assert.match(app, /data-handoff-create/);
assert.match(app, /Журнал внутренних передач/);
assert.match(app, /data-propose-consult/);
assert.match(app, /Предложить консультацию узкого/);
assert.match(app, /doctorClinicRole/);
assert.match(app, /data-doctor-clinic-role/);
assert.match(app, /internal-marketing\.json/);
assert.doesNotMatch(app, /type=["']password["']/i);
assert.doesNotMatch(app, /pass\s*:/i);
const scripts = JSON.parse(readFileSync(join(target, 'content/scripts-25.json'), 'utf8'));
assert.equal(scripts.length, 25);
const adminIndex = readFileSync(join(site, 'public', 'assets', 'img', 'admin', 'index.html'), 'utf8');
assert.match(adminIndex, /id="openScripts"/);
assert.match(adminIndex, /scripts-catalog\.js/);
assert.match(adminIndex, /id="openRecontact"/);
assert.match(adminIndex, /recontact-catalog\.js/);
assert.match(adminIndex, /id="recontactModal"/);
assert.match(adminIndex, /id="openMarkers"/);
assert.match(adminIndex, /speech-markers-before\.js/);
assert.match(adminIndex, /speech-markers-before\.js\?v=20260808-i114/);
assert.match(adminIndex, /id="markersModal"/);
assert.match(adminIndex, /i111-speech-markers-before/);
const markersBeforeJs = readFileSync(join(site, 'public', 'assets', 'img', 'admin', 'speech-markers-before.js'), 'utf8');
assert.match(markersBeforeJs, /i114-marker-route/);
assert.match(markersBeforeJs, /applyMarkerRouteToWorkspace/);
const markersJson = JSON.parse(readFileSync(join(target, 'content/speech-markers-before.json'), 'utf8'));
assert.equal(markersJson.atom, 'I11.1');
assert.equal(markersJson.status, 'draft_pending_clinic');
assert.ok(Array.isArray(markersJson.markers) && markersJson.markers.length === 3);
const markersChairJson = JSON.parse(readFileSync(join(target, 'content/speech-markers-chair.json'), 'utf8'));
assert.equal(markersChairJson.atom, 'I11.2');
assert.equal(markersChairJson.status, 'draft_pending_clinic');
assert.ok(markersChairJson.when_not_to_speak && Array.isArray(markersChairJson.when_not_to_speak.items));
assert.ok(Array.isArray(markersChairJson.markers) && markersChairJson.markers.length === 3);

console.log('raimov-demo-assets-preserved: PASS');
