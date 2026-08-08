#!/usr/bin/env node
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const base = join(root, 'docs', 'raimov', 'operations', 'expert-dental');
const required = [
  'README.md',
  'FILE_ARCHITECTURE.md',
  'PLANNING_AND_REPORTING.md',
  'MATERIALS_REGISTER.md',
  'LINKS_REGISTER.md',
  'CHANGELOG.md',
  'periods/month-01/PLAN.md',
  'periods/month-01/STATUS.md',
  'periods/month-01/reports/README.md',
  'periods/month-01/reports/2026-08-02-first-two-weeks.md',
  'reports/2026-08-first-half/AGENT_HANDOFF_V1_1.md',
  'reports/2026-08-first-half/README.md',
  'reports/2026-08-first-half/WEB_REPORT_CONTENT.md',
  'reports/2026-08-first-half/REPORT_PAGES_BLUEPRINT.md',
  'reports/2026-08-first-half/manifest.json',
  'templates/REPORT_TEMPLATE.md',
  'templates/MATERIAL_ENTRY_TEMPLATE.md',
];

for (const relative of required) {
  assert.ok(existsSync(join(base, relative)), `missing Expert Dental operating file: ${relative}`);
}

const plan = readFileSync(join(base, 'periods/month-01/PLAN.md'), 'utf8');
const planNumbers = [...plan.matchAll(/^### (\d+)\./gm)].map((match) => Number(match[1]));
assert.equal(planNumbers.length, 16, 'month one plan must render exactly 16 numbered items');
assert.deepEqual([...planNumbers].sort((a, b) => a - b), Array.from({ length: 16 }, (_, index) => index + 1), 'month one plan must use every number 1–16 exactly once');
assert.equal((plan.match(/^## [1-5]\. /gm) || []).length, 5, 'month one plan must contain five approved groups');
assert.equal((plan.match(/\*\*Цель блока:\*\*/g) || []).length, 5, 'every plan group must have a goal');

const ssot = readFileSync(join(root, 'docs/ssot/EXPERT_DENTAL_MONTH_1_PLAN_AND_REPORTS.md'), 'utf8');
assert.match(ssot, /operational_root: docs\/raimov\/operations\/expert-dental\//, 'month one SSOT routes to operational root');
assert.match(ssot, /План состоит строго из 16 пунктов/, 'month one immutability remains explicit');
assert.match(ssot, /Cursor не использовать/, 'Cursor prohibition remains explicit');

function tableIds(text, prefix) {
  return [...text.matchAll(new RegExp(`^\\| (${prefix}-\\d{3}) \\|`, 'gm'))].map((match) => match[1]);
}

function expectedIds(prefix, count) {
  return Array.from({ length: count }, (_, index) => `${prefix}-${String(index + 1).padStart(3, '0')}`);
}

const materials = readFileSync(join(base, 'MATERIALS_REGISTER.md'), 'utf8');
const materialIds = tableIds(materials, 'ED-MAT');
assert.equal(materialIds.length, new Set(materialIds).size, 'material IDs must be unique');
assert.deepEqual([...materialIds].sort(), expectedIds('ED-MAT', 68), 'material IDs must be continuous ED-MAT-001…068');
assert.match(materials, /ED-MAT-035 \| QR material/, 'Yandex QR material must be registered');
assert.match(materials, /ED-MAT-042 \| Automated guard/, 'operating architecture guard must be registered');
assert.match(materials, /ED-MAT-043 \| Package handoff/, 'closed v1.1 package handoff must be registered');
assert.match(materials, /ED-MAT-050 \| Package README/, 'all received v1.1 package materials must be registered');
assert.match(materials, /ED-MAT-051 \| Detailed web report/, 'published eight-page continuation must be registered');
assert.match(materials, /ED-MAT-052 \| Production evidence/, 'production evidence must be registered');
assert.match(materials, /ED-MAT-060 \| Content package/, 'workspace content pack must be registered');
assert.match(materials, /ED-MAT-061 \| Automated test/, 'workspace MVP test must be registered');
assert.match(materials, /ED-MAT-062 \| Execution index/, 'outside-UI execution index must be registered');
assert.match(materials, /ED-MAT-067 \| Reputation cadence/, 'reputation cadence pack must be registered');
assert.match(materials, /ED-MAT-068 \| Reputation weekly log/, 'G4 weekly log series must be registered');
assert.match(materials, /девять статей блога/i, 'nine-article package must be registered');
assert.match(materials, /source not received/i, 'unreceived ZIP remains explicitly marked');
assert.match(materials, /следующий материал: `ED-MAT-069`/, 'next material ID must advance to ED-MAT-069');

const links = readFileSync(join(base, 'LINKS_REGISTER.md'), 'utf8');
const linkIds = tableIds(links, 'ED-LINK');
assert.equal(linkIds.length, new Set(linkIds).size, 'link IDs must be unique');
assert.ok(linkIds.includes('ED-LINK-033'), 'price page link must be registered');
assert.ok(linkIds.includes('ED-LINK-036'), 'presentation link must be registered');
assert.ok(linkIds.includes('ED-LINK-037'), 'hub present-scenario link must be registered');
assert.ok(linkIds.includes('ED-LINK-038'), 'presentation plan-map link must be registered');
assert.ok(linkIds.includes('ED-LINK-039'), 'render deep-links must be registered');
assert.ok(linkIds.includes('ED-LINK-040'), 'Google Maps resolved place link must be registered');
assert.ok(linkIds.includes('ED-LINK-041'), 'Google Maps writereview link must be registered');
for (const id of expectedIds('ED-LINK', 32)) {
  assert.ok(linkIds.includes(id), `links register missing ${id}`);
}
for (const url of [
  'https://raimovdental.com/ru/valeria/',
  'https://raimovdental.com/ru/valeria/month-1/plan/',
  'https://raimovdental.com/ru/valeria/month-1/reports/first-two-weeks/',
  'https://raimovdental.com/ru/valeria/month-1/reports/first-two-weeks/details/',
  'https://raimovdental.com/ru/valeria/month-1/reports/first-two-weeks/details/competitors/',
  'https://raimovdental.com/ru/valeria/month-1/reports/first-two-weeks/details/next/',
  'https://raimovdental.com/assets/img/workspace/',
  'https://raimovdental.com/assets/img/workspace/#present',
  'https://raimovdental.com/assets/img/workspace/presentation/#plan-map',
  'https://raimovdental.com/render/#scripts',
  'https://2gis.kg/bishkek/firm/70000001089655879',
  'https://yandex.ru/maps/org/ekspert_dental_studiya/222117460907/',
  'http://expertdental.kg/services',
  'http://expertdental.kg/contacts',
  'http://expertdental.kg/blog',
  'http://expertdental.kg/home-new',
  'https://search.google.com/local/writereview?placeid=ChIJq-8xG8a3njgR-Jz17KDbaKw',
]) {
  assert.ok(links.includes(url), `links register missing ${url}`);
}
assert.match(links, /Следующая ссылка: `ED-LINK-042`/, 'next link ID must advance to ED-LINK-042');
assert.doesNotMatch(links, /sandbox:\/\/mnt\/data\//, 'temporary sandbox links must not enter the project links register');

const report = readFileSync(join(base, 'periods/month-01/reports/2026-08-02-first-two-weeks.md'), 'utf8');
assert.match(report, /status: PUBLISHED_WITH_DETAILED_CONTINUATION/, 'interim report records published continuation');
assert.match(report, /Новые отзывы Google Maps \| 11/, 'interim report records 11 Google reviews');
assert.match(report, /Новые отзывы 2ГИС \| 20/, 'interim report records 20 2GIS reviews');
assert.match(report, /Опубликованные статьи блога \| 9/, 'interim report records nine blog articles');
assert.match(report, /Аналитико-управленческая система версии 1\.1/, 'interim report integrates the validated management system');
assert.match(report, /Это первая версия живой системы, а не окончательный отчёт/, 'interim report carries living-system statement');
assert.match(report, /\/reports\/first-two-weeks\/details\//, 'interim report links to its detailed continuation');
assert.doesNotMatch(report, /исходники пока не переданы|не считается независимо проверенным|не считаются проверенными или опубликованными/i, 'obsolete missing-source report language must be absent');
assert.match(report, /нельзя автоматически считать ростом/i, 'report separates activity from business result');

const handoff = readFileSync(join(base, 'reports/2026-08-first-half/AGENT_HANDOFF_V1_1.md'), 'utf8');
assert.match(handoff, /SOURCES_RECEIVED \/ VALIDATED \/ PUBLISHED/, 'package handoff states received, validated and published');
assert.doesNotMatch(handoff, /SOURCES_MISSING \/ NOT_PUBLISHED/, 'obsolete missing-source handoff status must be absent');
assert.match(handoff, /15 сильных конкурентов|15 конкурентов/, 'package handoff records competitor scope');
assert.match(handoff, /14 этапов пути пациента/, 'package handoff records patient-path scope');
assert.match(handoff, /25 сценариев|25 скриптов/, 'package handoff records script scope');
assert.match(handoff, /Cursor не использовался|Cursor не использовать/, 'package handoff preserves Cursor prohibition and execution status');

const evidence = readFileSync(join(root, 'docs/audits/raimovdental-expert-dental-report/LAST_RUN.md'), 'utf8');
assert.match(evidence, /status: `success`/, 'production evidence records success');
assert.match(evidence, /(?:final_smoke|readable_materials)_run_id: `\d+`/, 'production evidence records a successful verification run');
assert.match(evidence, /detailed_routes_verified: `8`/, 'production evidence records eight verified routes');
assert.match(evidence, /public_edge_smoke: `PASS`/, 'production evidence records public-edge smoke success');
assert.match(evidence, /password-only 0726; no username/, 'production evidence records password-only access');
assert.match(evidence, /materials_readable_in_pages: `true`/, 'production evidence records in-page readable materials');
assert.match(evidence, /downloads_required: `false`/, 'production evidence confirms downloads are not required');
assert.match(evidence, /completed_count: `7 of 16`/, 'production evidence records seven completed plan items');
assert.match(evidence, /item_16: `in_progress`/, 'production evidence keeps item 16 in progress');

console.log('expert-dental-operating-architecture: PASS');
