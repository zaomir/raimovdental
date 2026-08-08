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
  'presentation/shots/10-admin-path.png',
  'presentation/shots/11-render-scripts.png',
  'presentation/shots/12-render-markers.png',
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
  'ip3-present-scenario',
  '7 → 5 → 4 → 1 → 10 → 11 → 8',
  'data-plan-point="7"',
  'data-plan-point="5"',
  'data-plan-point="4"',
  'data-plan-point="1"',
  'data-plan-point="10"',
  'data-plan-point="11"',
  'data-plan-point="8"',
  'Пункт 7 · скрипты',
  'Пункт 8 · источники',
]) assert.match(hub, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

const presentation = readFileSync(join(distRoot, 'presentation/index.html'), 'utf8');
for (const token of [
  'Что уже сделано для вашей клиники',
  'Каких результатов можно добиться',
  'shots/01-hub.png',
  'shots/06-render-call.png',
  'shots/09-owner-summary.png',
  'shots/10-admin-path.png',
  'shots/11-render-scripts.png',
  'shots/12-render-markers.png',
  'id="plan-map"',
  'Пункты плана → экраны интерфейса',
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
assert.match(app, /\/render\/#markers/);
assert.match(app, /Маркеры до кресла/);
assert.match(app, /i111-speech-markers-before/);
assert.match(app, /renderSpeechMarkersBeforeCard/);
assert.match(app, /speech-markers-before\.json/);
assert.match(app, /i112-speech-markers-chair/);
assert.match(app, /doctorSpeechMarkersChairHtml/);
assert.match(app, /renderSpeechMarkersChairCard/);
assert.match(app, /speech-markers-chair\.json/);
assert.match(app, /Когда не говорить/);
assert.match(app, /data-chair-when-not/);
assert.match(app, /MC01/);
assert.match(app, /i114-marker-route/);
assert.match(app, /applyMarkerRoute/);
assert.match(app, /markerRouteLinkHtml/);
assert.match(app, /bindMarkerRouteLink/);
assert.match(app, /data-apply-marker-route/);
assert.match(app, /Выбрать → маршрут/);
assert.match(app, /selectedMarkerId/);
assert.match(app, /markerNextStep/);
assert.match(app, /i54-feedback-quiz|i115-markers-quiz/);
assert.match(app, /i115-markers-quiz/);
assert.match(app, /data-atom="i115-markers-quiz"/);
assert.match(app, /quizAdmin/);
assert.match(app, /quizDoctor/);
assert.match(app, /updatesDoctor/);
assert.match(app, /Маркеры до кресла и связка с маршрутом/);
assert.match(app, /Маркеры потребности в кресле/);
assert.match(app, /speech-markers-before\.json · MB01 · route/);
assert.match(app, /speech-markers-chair\.json · MC02 · when_not_to_speak/);
assert.match(app, /speech-markers-chair\.json · when_not_to_speak/);
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
assert.match(app, /i12-sla-status/);
assert.match(app, /INBOX_SLA/);
assert.match(app, /inboxStatuses/);
assert.match(app, /bindInboxSla/);
assert.match(app, /'новое','в работе','записан','упущен','передан врачу'/);
assert.match(app, /i13-inquiry-card/);
assert.match(app, /i82-source-gate/);
assert.match(app, /sources\.json/);
assert.match(app, /isSourceSet/);
assert.match(app, /inqClose/);
assert.match(app, /Нельзя закрыть контакт без источника/);
assert.match(app, /sourceKey/);
assert.match(app, /sourceCatalog/);
assert.match(app, /i83-source-funnel/);
assert.match(app, /managerSourceFunnelHtml/);
assert.match(app, /managerSourceFunnelStats/);
assert.match(app, /DEMO_SOURCE_FUNNEL/);
assert.match(app, /Воронка по источникам/);
assert.match(app, /Обращения → записи → визиты → упущенные/);
assert.match(app, /data-source-funnel-row/);
assert.match(app, /i84-clinic-health/);
assert.match(app, /i84-owner-sources/);
assert.match(app, /i84-month-plan-link/);
assert.match(app, /ownerClinicHealthHtml/);
assert.match(app, /\/ru\/valeria\/month-1\/plan\//);
assert.match(app, /admin-updates-v2/);
assert.match(app, /UPDATES_PASS_SCORE=70/);
assert.match(app, /updatesProgress/);
assert.match(app, /admin-updates-quiz/);
assert.match(app, /startUpdatesTest/);
assert.match(app, /updateAckCheckbox/);
assert.match(app, /Ознакомлен/);
assert.match(app, /admin-onboarding-control/);
assert.match(app, /ensureUpdatesProgress/);
assert.match(app, /buildMandatoryTestQuestions/);
assert.match(app, /score>=UPDATES_PASS_SCORE/);
assert.match(app, /atom:'i85-source-quiz'/);
assert.match(app, /\$\{q\.atom\|\|'i115-markers-quiz'\}/);
assert.match(app, /Источник обращения обязателен \(I8\.2\)/);
assert.match(app, /без источника контакт не закрывается/);
assert.match(app, /sources\.json · I8\.2 · i82-source-gate/);
assert.match(app, /roleKey==='admin'\|\|roleKey==='manager'\|\|roleKey==='owner'/);
assert.match(app, /inquiryCardHtml/);
assert.match(app, /bindInquiryCard/);
assert.match(app, /inboxCards/);
assert.match(app, /inqChannel/);
assert.match(app, /inqNeed/);
assert.match(app, /inqSource/);
assert.match(app, /inqNext/);
assert.match(app, /inqOwner/);
assert.match(app, /заглушка до I8/);
assert.match(app, /function inboxListHtml/);
assert.match(app, /Единый inbox обращений/);
assert.match(app, /data-inbox-channel/);
assert.match(app, /channelKey:'call'/);
assert.match(app, /channelKey:'whatsapp'/);
assert.match(app, /channelKey:'form'/);
assert.match(app, /channel:'Звонок'/);
assert.match(app, /channel:'WhatsApp'/);
assert.match(app, /channel:'Форма'/);
assert.match(app, /i14-inquiry-audit/);
assert.match(app, /i14-demo-violation/);
assert.match(app, /managerInquiryAuditHtml/);
assert.match(app, /bindInquiryAudit/);
assert.match(app, /INQUIRY_AUDIT_STEPS/);
assert.match(app, /DEMO_INQUIRY_VIOLATION/);
assert.match(app, /inquiryAuditChecklist/);
assert.match(app, /data-inquiry-audit-step/);
assert.match(app, /Как проверять обработку заявок/);
assert.match(app, /Демо-нарушение/);
assert.match(app, /Аудит карт, сайта и Instagram — вне этого экрана/);
assert.match(app, /i102-doctor-role/);
assert.match(app, /i102-doctor-tasks/);
assert.match(app, /i103-internal-lesson/);
assert.match(app, /renderInternalMarketingLesson/);
assert.match(app, /internalLessonRead/);
assert.match(app, /id="internalLesson"/);
assert.match(app, /Урок внутреннего направления/);
assert.match(app, /i104-propose-consult/);
assert.match(app, /i104-internal-referrals/);
assert.match(app, /data-propose-consult/);
assert.match(app, /bindProposeConsult/);
assert.match(app, /createInternalReferral/);
assert.match(app, /internalReferrals/);
assert.match(app, /Предложить консультацию узкого/);
assert.match(app, /Внутренние направления/);
assert.match(app, /i105-referral-metrics/);
assert.match(app, /managerReferralStats/);
assert.match(app, /managerReferralControlHtml/);
assert.match(app, /bindManagerReferralMetrics/);
assert.match(app, /managerReferralDemo/);
assert.match(app, /setManagerReferralStatus/);
assert.match(app, /Создано \/ принято \/ потеряно/);
assert.match(app, /data-referral-status/);
assert.match(app, /ed-workspace-doctor/);
assert.match(app, /i113-handoff-journal/);
assert.match(app, /handoffJournalHtml/);
assert.match(app, /bindHandoffJournal/);
assert.match(app, /createHandoffJournalEntry/);
assert.match(app, /setHandoffAcceptanceStatus/);
assert.match(app, /data-handoff-create/);
assert.match(app, /data-handoff-status/);
assert.match(app, /data-handoff-acceptance/);
assert.match(app, /Журнал внутренних передач/);
assert.match(app, /От кого/);
assert.match(app, /к кому/);
assert.match(app, /статус принятия/);
assert.match(app, /doctorClinicRole/);
assert.match(app, /data-doctor-clinic-role/);
assert.match(app, /bindDoctorClinicRole/);
assert.match(app, /doctorClinicRoleSwitcherHtml/);
assert.match(app, /doctorTaskSetHtml/);
assert.match(app, /internal-marketing\.json/);
assert.match(app, /Терапевт/);
assert.match(app, /Гигиенист/);
const patientPath = JSON.parse(readFileSync(join(distRoot, 'content/patient-path.json'), 'utf8'));
assert.equal(patientPath.steps.length, 14);
assert.ok(patientPath.routes && patientPath.routes.veneers && patientPath.routes.implants && patientPath.routes.ortho);
assert.ok(patientPath.routes.veneers.admin_questions);
assert.ok(patientPath.routes.implants.first_visit_result);
assert.ok(patientPath.routes.ortho.page_logic);
const internalMarketing = JSON.parse(readFileSync(join(distRoot, 'content/internal-marketing.json'), 'utf8'));
assert.equal(internalMarketing.atom, 'I10.1');
assert.equal(internalMarketing.status, 'draft_pending_clinic');
assert.ok(Array.isArray(internalMarketing.roles));
assert.equal(internalMarketing.roles.length, 2);
assert.ok(internalMarketing.roles.every((role) => role.id && role.title && Array.isArray(role.when_to_refer) && role.when_to_refer.length === 3));
assert.deepEqual(internalMarketing.priority_routes, ['veneers', 'implants', 'ortho']);
assert.ok(internalMarketing.boundaries && Array.isArray(internalMarketing.boundaries.dont));
assert.ok(internalMarketing.lesson && internalMarketing.lesson.status === 'draft_pending_clinic');
const scripts = JSON.parse(readFileSync(join(distRoot, 'content/scripts-25.json'), 'utf8'));
assert.equal(scripts.length, 25);
assert.deepEqual(
  scripts.map((item) => item.id),
  Array.from({ length: 25 }, (_, i) => `S${String(i + 1).padStart(2, '0')}`),
);
assert.ok(scripts.every((item) => item.source_ref && item.dont_say));
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
assert.match(adminIndex, /id="openMarkers"/);
assert.match(adminIndex, /speech-markers-before\.js/);
assert.match(adminIndex, /id="markersModal"/);
assert.match(adminIndex, /i111-speech-markers-before/);
const markersBefore = JSON.parse(readFileSync(join(distRoot, 'content/speech-markers-before.json'), 'utf8'));
assert.equal(markersBefore.atom, 'I11.1');
assert.equal(markersBefore.status, 'draft_pending_clinic');
assert.ok(Array.isArray(markersBefore.markers));
assert.equal(markersBefore.markers.length, 3);
assert.deepEqual(markersBefore.markers.map((m) => m.id), ['MB01', 'MB02', 'MB03']);
assert.deepEqual(markersBefore.markers.map((m) => m.route), ['veneers', 'implants', 'ortho']);
assert.ok(markersBefore.markers.every((m) => m.id && m.route && m.listen_for && m.clarify_questions && m.phrase_status === 'draft_pending_clinic'));
assert.deepEqual(markersBefore.priority_routes, ['veneers', 'implants', 'ortho']);
const markersChair = JSON.parse(readFileSync(join(distRoot, 'content/speech-markers-chair.json'), 'utf8'));
assert.equal(markersChair.atom, 'I11.2');
assert.equal(markersChair.status, 'draft_pending_clinic');
assert.ok(markersChair.when_not_to_speak && Array.isArray(markersChair.when_not_to_speak.items) && markersChair.when_not_to_speak.items.length >= 3);
assert.ok(Array.isArray(markersChair.markers));
assert.equal(markersChair.markers.length, 3);
assert.ok(markersChair.markers.every((m) => m.id && m.route && m.observe_for && m.chair_logic && m.when_not_to_speak_draft && m.phrase_status === 'draft_pending_clinic' && m.phrase_draft === ''));
assert.deepEqual(markersChair.markers.map((m) => m.id), ['MC01', 'MC02', 'MC03']);
assert.deepEqual(markersChair.priority_routes, ['veneers', 'implants', 'ortho']);
const sources = JSON.parse(readFileSync(join(distRoot, 'content/sources.json'), 'utf8'));
assert.equal(sources.atom, 'I8.1');
assert.equal(sources.status, 'draft_pending_clinic');
assert.ok(Array.isArray(sources.sources));
assert.equal(sources.sources.length, 6);
assert.deepEqual(sources.sources.map((s) => s.key), ['maps', 'site', 'instagram', 'whatsapp', 'referral', 'other']);
assert.ok(sources.sources.every((s) => s.id && s.label && s.source_ref));
const markersJs = readFileSync(join(process.cwd(), 'site-raimovdental', 'public', 'assets', 'img', 'admin', 'speech-markers-before.js'), 'utf8');
assert.match(markersJs, /speech-markers-before\.json/);
assert.match(markersJs, /openMarkers/);
assert.match(markersJs, /#markers/);
assert.match(markersJs, /applyMarkerRouteToWorkspace/);
assert.match(markersJs, /i114-marker-route/);
assert.match(markersJs, /Применить маршрут/);
assert.match(markersJs, /ed-workspace-admin/);
assert.match(adminIndex, /speech-markers-before\.js\?v=20260808-i114/);
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
assert.deepEqual(
  recontact.map((item) => item.id),
  Array.from({ length: 9 }, (_, i) => `R${String(i + 1).padStart(2, '0')}`),
);
assert.ok(recontact.every((item) => item.id && item.rule && item.delay && item.channel && item.source_ref));
assert.ok(scripts.every((item) => item.id && item.title && item.body && item.next_action));
assert.equal(scripts.filter((item) => item.dont_say).length, 25);

// IP.1 · content pack markers — admin-feedback-sop keys
const feedbackSop = JSON.parse(readFileSync(join(distRoot, 'content/admin-feedback-sop.json'), 'utf8'));
assert.equal(feedbackSop.version, '1.0');
assert.ok(feedbackSop.source_ref);
assert.ok(feedbackSop.ask_moment && feedbackSop.ask_moment.text && feedbackSop.ask_moment.restriction);
assert.ok(feedbackSop.neutral_texts && feedbackSop.neutral_texts.in_clinic && feedbackSop.neutral_texts.whatsapp_followup);
assert.equal(feedbackSop.platforms.length, 3);
assert.deepEqual(feedbackSop.platforms.map((p) => p.link_id), ['ED-LINK-010', 'ED-LINK-009', 'ED-LINK-008']);
assert.ok(feedbackSop.platforms.every((p) => p.name && p.url && p.source_ref));
assert.equal(feedbackSop.prohibitions.length, 12);
assert.ok(feedbackSop.prohibitions.every((p) => p.text && p.source_ref));
assert.equal(feedbackSop.post_visit_checklist.length, 5);
assert.ok(feedbackSop.post_visit_checklist.every((step) => step.step && step.action && step.restriction && step.owner));
assert.equal(feedbackSop.sop_steps.length, 8);
assert.ok(feedbackSop.sop_steps.every((step) => step.step && step.action && step.owner));
assert.ok(feedbackSop.publication_disclaimer && feedbackSop.publication_disclaimer.text);
assert.ok(feedbackSop.prohibitions.some((p) => /скидк|балл|подарок/i.test(p.text)));

console.log('expert-dental-workspace-dist-preservation+passwordless-demo+ip3-present-scenario: PASS');
