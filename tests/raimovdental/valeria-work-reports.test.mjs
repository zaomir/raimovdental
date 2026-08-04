#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { workspace, periods } from '../../site-raimovdental/work-reports/content.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const dist = join(root, 'site-raimovdental/dist');
const failures = [];
const check = (condition, message) => {
  if (condition) console.log(`PASS ${message}`);
  else { console.error(`FAIL ${message}`); failures.push(message); }
};

const first = periods[0];
check(workspace.owner === 'CAESTHETIC', 'client reports owner is CAESTHETIC');
check(workspace.projectManager === 'Валерия Петрова', 'project manager is canonical');
check(workspace.title === 'Планы и отчёты CAESTHETIC', 'client-facing title uses CAESTHETIC');
check(first?.slug === 'month-1', 'first period is month-1');
check(first?.plan.length === 16, 'first-month plan has exactly 16 items');
check(first?.plan[0] === 'Аудит и аналитика: карты, сайт, Instagram, WhatsApp и обработка заявок.', 'first plan item is canonical');
check(first?.plan[15] === 'Ежемесячное наполнение карт содержательными отзывами от реальных пациентов, ответы на отзывы и последовательное усиление доверия к клинике.', 'last plan item is canonical');
check(first?.planGroups.length === 5, 'first-month plan has exactly five groups');
const groupedNumbers = first?.planGroups.flatMap((group) => group.items) || [];
check(groupedNumbers.length === 16, 'grouped plan contains 16 references');
check([...groupedNumbers].sort((a, b) => a - b).every((number, index) => number === index + 1), 'every plan number appears exactly once');
check(first?.reports.length === 1, 'one interim report is published');
check(first?.reports[0]?.sections.some((section) => section.title === 'Аналитико-управленческая система версии 1.1'), 'management system section exists in report source');
check(first?.reports[0]?.sections.some((section) => section.title === 'Это первая версия живой системы, а не окончательный отчёт'), 'living-system section exists in report source');

const routes = [
  'ru/valeria/index.html',
  'ru/valeria/month-1/index.html',
  'ru/valeria/month-1/plan/index.html',
  'ru/valeria/month-1/reports/index.html',
  'ru/valeria/month-1/reports/first-two-weeks/index.html',
  'ru/assets/work-reports.css',
];
for (const route of routes) check(existsSync(join(dist, route)), `built ${route}`);

const clientPages = routes.filter((route) => route.endsWith('.html')).map((route) => ({ route, html: readFileSync(join(dist, route), 'utf8') }));
for (const { route, html } of clientPages) {
  check(/CAESTHETIC/.test(html), `${route} carries CAESTHETIC brand`);
  check(!/Планы и отчёты работы Валерии|работы Валерии|— Валерия(?:<|$)/.test(html), `${route} has no legacy Valeria product naming`);
  check(/Стратегия Дмитрия/.test(html), `${route} uses Dmitry strategy navigation label`);
}

const index = readFileSync(join(dist, 'ru/valeria/index.html'), 'utf8');
check(/Руководитель проекта — Валерия Петрова/.test(index), 'index names Valeria only as project manager');
check((index.match(/Валерия Петрова/g) || []).length === 1, 'project manager appears exactly once on index');
check(/Уважаемый Атабек Саидович/.test(index), 'index uses respectful client address');
check(!/\/ru\/valeria\/expert-dental\//.test(index), 'no parallel Expert Dental report is added to periods index');

for (const route of routes.filter((route) => route.endsWith('.html') && route !== 'ru/valeria/index.html')) {
  const html = readFileSync(join(dist, route), 'utf8');
  check(!/Валерия Петрова/.test(html), `${route} does not repeat project manager name`);
}

const planPath = join(dist, 'ru/valeria/month-1/plan/index.html');
if (existsSync(planPath)) {
  const plan = readFileSync(planPath, 'utf8');
  check((plan.match(/class="plan-group"/g) || []).length === 5, 'rendered plan contains five groups');
  check((plan.match(/class="plan-item"/g) || []).length === 16, 'rendered plan contains exactly 16 items');
  check((plan.match(/data-plan-number="/g) || []).length === 16, 'rendered plan preserves explicit source numbering');
  check((plan.match(/Цель блока:/g) || []).length === 5, 'each plan group has a goal');
  check(/К отчётам/.test(plan), 'plan has reports CTA');
  check(/href="\/ru\/valeria\/month-1\/reports\/"/.test(plan), 'plan reports CTA has canonical destination');
  check((plan.match(/data-plan-number="\d+" data-plan-status="completed"/g) || []).length === 7, 'plan renders seven confirmed completed items');
  for (const number of [2, 4, 5, 7, 9, 13, 15]) check(new RegExp(`data-plan-number="${number}" data-plan-status="completed"`).test(plan), `plan item ${number} is completed`);
  check(/7 из 16 выполнено/.test(plan), 'plan shows completed summary');
  check((plan.match(/data-plan-number="\d+" data-plan-status="in-progress"/g) || []).length === 3, 'plan renders exactly three in-progress items');
  for (const number of [12, 14, 16]) check(new RegExp(`data-plan-number="${number}" data-plan-status="in-progress"`).test(plan), `plan item ${number} is in progress`);
  check((plan.match(/↻ В работе/g) || []).length === 3, 'plan shows three visible in-progress badges');
  check(/пункты 12, 14 и 16/.test(plan), 'plan summary names current in-progress items');
  check(!/data-plan-number="16" data-plan-status="completed"/.test(plan), 'plan item 16 is not completed');
  check(/data-plan-number="16" data-plan-status="in-progress"/.test(plan), 'plan item 16 remains in progress');
  check(/noindex,nofollow,noarchive,nosnippet/.test(plan), 'plan is noindex');
  check(!/<script\b/i.test(plan), 'plan has zero client JavaScript');
}

const reportPath = join(dist, 'ru/valeria/month-1/reports/first-two-weeks/index.html');
if (existsSync(reportPath)) {
  const report = readFileSync(reportPath, 'utf8');
  check(/11<\/strong><span>новых отзывов в Google Maps/.test(report), 'Google Maps result rendered');
  check(/20<\/strong><span>новых отзывов в 2ГИС/.test(report), '2GIS result rendered');
  check(/9<\/strong><span>опубликованных статей блога/.test(report), 'blog result rendered');
  check(/база отзывов была небольшой/.test(report), 'gradual review pace explained');
  check(/Аналитико-управленческая система версии 1\.1/.test(report), 'management system section rendered');
  check(/15 конкурентов/.test(report), 'management system competitor scope rendered');
  check(/14 этапов пути пациента/.test(report), 'management system patient-path scope rendered');
  check(/25 скриптов/.test(report), 'management system script scope rendered');
  check(/Это первая версия живой системы, а не окончательный отчёт/.test(report), 'living-system statement rendered');
  check(!/исходники ещё не переданы|исходники ожидают передачи|не как проверенный или опубликованный результат/.test(report), 'obsolete missing-source language removed');
  check(/Открыть подробное продолжение отчёта/.test(report), 'detailed continuation CTA rendered');
  check(/\/ru\/valeria\/month-1\/reports\/first-two-weeks\/details\//.test(report), 'detailed continuation nested below interim report');
  check(/href="https:\/\/raimovdental\.com\/assets\/img\/workspace\/"/.test(report), 'clinic interfaces link rendered');
  check(/Открыть интерфейсы клиники/.test(report), 'clinic interfaces action label rendered');
  check(/команда CAESTHETIC/.test(report), 'report identifies CAESTHETIC as executor');
  check(!/name=["']username["']/i.test(report), 'no username field appears');
  check(!/<script\b/i.test(report), 'report has zero client JavaScript');
}

const reportsIndex = readFileSync(join(dist, 'ru/valeria/month-1/reports/index.html'), 'utf8');
check(/Продолжение отчёта за первые две недели/.test(reportsIndex), 'reports index shows detailed continuation');
check(/\/ru\/valeria\/month-1\/reports\/first-two-weeks\/details\//.test(reportsIndex), 'reports index links to continuation');

const manifest = JSON.parse(readFileSync(join(dist, 'route-manifest.json'), 'utf8'));
check(manifest.work_reports?.owner === 'CAESTHETIC', 'manifest owner is CAESTHETIC');
check(manifest.work_reports?.projectManager === 'Валерия Петрова', 'manifest records project manager');
check(manifest.work_reports?.base === '/ru/valeria/', 'manifest registers reports workspace');
check(manifest.work_reports?.private === true, 'manifest marks reports workspace private');
check(manifest.expert_dental_report?.routes === 8, 'manifest registers eight detailed continuation routes');
check(manifest.expert_dental_report?.parent === '/ru/valeria/month-1/reports/first-two-weeks/', 'manifest registers interim report as parent');

process.exit(failures.length ? 1 : 0);
