#!/usr/bin/env node
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { report } from '../../site-raimovdental/expert-dental-report/data.mjs';
import { scriptsMaterials } from '../../site-raimovdental/expert-dental-report/scripts-materials.mjs';
import { reputationMaterials } from '../../site-raimovdental/expert-dental-report/reputation-materials.mjs';
import { journeyMaterials } from '../../site-raimovdental/expert-dental-report/journey-materials.mjs';
import { competitionMaterials } from '../../site-raimovdental/expert-dental-report/competition-materials.mjs';
import { measurementMaterials } from '../../site-raimovdental/expert-dental-report/measurement-materials.mjs';

const root = process.cwd();
const base = join(root, 'site-raimovdental', 'dist', 'ru', 'valeria', 'month-1', 'reports', 'first-two-weeks', 'details');
const routes = ['', 'competitors', 'position', 'patient-path', 'scripts', 'reputation', 'measurement', 'next'];

assert.equal(report.version, '1.1');
assert.equal(report.snapshotDate, '03.08.2026');
assert.equal(scriptsMaterials.scriptLibrary.length, 25, 'all 25 scripts must exist in the readable source');
assert.equal(scriptsMaterials.followupMatrix.length, 9, 'all 9 follow-up rules must exist');
assert.equal(reputationMaterials.reviewSopDetailed.length, 8, 'all 8 review SOP steps must exist');
assert.equal(reputationMaterials.reviewJournalFields.length, 20, 'review journal schema must be complete');
assert.equal(journeyMaterials.patientPathDetailed.length, 14, 'all 14 patient-path steps must exist');
assert.equal(journeyMaterials.serviceRoutesDetailed.length, 3, 'all three service routes must exist');
assert.equal(competitionMaterials.competitorsDetailed.length, 16, 'Expert plus 15 competitors must exist');
assert.equal(measurementMaterials.kpiDetailed.length, 16, 'all 16 KPI must exist');
assert.equal(measurementMaterials.neededDataDetailed.length, 9, 'complete data request list must exist');

for (const slug of routes) {
  const file = join(base, slug, 'index.html');
  assert.ok(existsSync(file), `missing ${slug || 'hub'}`);
  const html = readFileSync(file, 'utf8');
  assert.match(html, /noindex,nofollow/);
  assert.match(html, /CAESTHETIC/);
  assert.match(html, /Версия/);
  assert.match(html, /03\.08\.2026/);
  assert.match(html, /К карте материалов/);
  assert.match(html, /Продолжение отчёта за первые две недели/);
  assert.doesNotMatch(html, /<script\b/i);
  assert.doesNotMatch(html, /скачать|download/i, 'materials must be readable in-page, not presented as downloads');
}

const hub = readFileSync(join(base, 'index.html'), 'utf8');
assert.match(hub, /Все разработанные документы доступны для чтения/);
assert.match(hub, /25<\/strong><span>полных скриптов/);
assert.match(hub, /14<\/strong><span>этапов пути/);
assert.match(hub, /16<\/strong><span>KPI/);
assert.match(hub, /Открыть и читать/);

const competitors = readFileSync(join(base, 'competitors', 'index.html'), 'utf8');
assert.equal((competitors.match(/<details class="material">/g) || []).length, 16, 'all competitor cards must render');
for (const marker of ['Metadent', '32 карата', 'Кронис', 'Ответ Expert', 'Дополнительный источник']) assert.match(competitors, new RegExp(marker));

const patient = readFileSync(join(base, 'patient-path', 'index.html'), 'utf8');
assert.equal((patient.match(/<details class="material">/g) || []).length, 17, '14 path steps plus three service routes must render');
for (const marker of ['14 этапов', 'Имплантация', 'Виниры', 'Ортодонтия', 'Что фиксировать', 'Следующий шаг']) assert.match(patient, new RegExp(marker));

const scripts = readFileSync(join(base, 'scripts', 'index.html'), 'utf8');
assert.equal((scripts.match(/<details class="material">/g) || []).length, 25, 'all 25 scripts must render');
for (const id of Array.from({ length: 25 }, (_, index) => `S${String(index + 1).padStart(2, '0')}`)) assert.match(scripts, new RegExp(`${id} ·`));
for (const marker of ['Не говорить', 'Что фиксировать', '9 регламентов возврата обращений', 'ID обращения']) assert.match(scripts, new RegExp(marker));

const reputation = readFileSync(join(base, 'reputation', 'index.html'), 'utf8');
assert.ok((reputation.match(/<details class="material">/g) || []).length >= 13, '8 SOP steps and review themes must render');
for (const marker of ['8 шагов белой системы отзывов', 'Что говорит администратор', 'Одно сообщение после согласия', 'Код пациента']) assert.match(reputation, new RegExp(marker));
assert.match(reputation, /поставьте 5 звёзд/i, 'ethical restriction against asking for five stars is readable');

const measurement = readFileSync(join(base, 'measurement', 'index.html'), 'utf8');
assert.equal((measurement.match(/<tbody><tr>/g) || []).length, 1, 'KPI table must render');
for (const marker of ['WhatsApp → запись', 'Консультация → план', 'План → старт', '16 показателей']) assert.match(measurement, new RegExp(marker));

const next = readFileSync(join(base, 'next', 'index.html'), 'utf8');
for (const marker of ['Выгрузка WhatsApp/CRM', 'Список врачей, услуг, графиков', 'Причины отказов после консультации']) assert.match(next, new RegExp(marker));

const reportPage = readFileSync(join(root, 'site-raimovdental', 'dist', 'ru', 'valeria', 'month-1', 'reports', 'first-two-weeks', 'index.html'), 'utf8');
assert.match(reportPage, /Открыть подробное продолжение отчёта/);
assert.match(reportPage, /\/ru\/valeria\/month-1\/reports\/first-two-weeks\/details\//);
assert.doesNotMatch(reportPage, /исходники ожидают передачи|не переданы/);

const workHub = readFileSync(join(root, 'site-raimovdental', 'dist', 'ru', 'valeria', 'index.html'), 'utf8');
assert.doesNotMatch(workHub, /\/ru\/valeria\/expert-dental\//, 'detailed report must not be a parallel top-level workspace');
assert.ok(!existsSync(join(root, 'site-raimovdental', 'dist', 'ru', 'valeria', 'expert-dental')), 'legacy parallel route must not be generated');

const manifest = JSON.parse(readFileSync(join(root, 'site-raimovdental', 'dist', 'route-manifest.json'), 'utf8'));
assert.equal(manifest.expert_dental_report?.base, '/ru/valeria/month-1/reports/first-two-weeks/details/');
assert.equal(manifest.expert_dental_report?.routes, 8);
assert.deepEqual(manifest.expert_dental_report?.readableMaterials, { scripts: 25, followups: 9, reviewSopSteps: 8, patientPathSteps: 14, serviceRoutes: 3, kpis: 16, competitors: 16 });

console.log('expert-dental-web-report-readable-materials: PASS');
