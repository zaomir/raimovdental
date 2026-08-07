#!/usr/bin/env node
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const planPath = join(repo, 'site-raimovdental', 'dist', 'ru', 'valeria', 'month-1', 'plan', 'index.html');
const inProgress = [12, 14, 16];

if (!existsSync(planPath)) throw new Error('MONTH1 STATUS FAIL: rendered plan is missing');
let html = readFileSync(planPath, 'utf8');

const progressCss = `
    .plan-item[data-plan-status="in-progress"]{border-color:rgba(169,100,63,.45);background:linear-gradient(135deg,#fff7ec,#fffdf8);box-shadow:inset 5px 0 0 #a9643f,0 10px 30px rgba(169,100,63,.07)}
    .plan-item[data-plan-status="in-progress"] .plan-item-number{background:#a9643f}
    .plan-item-status.is-progress{background:#a9643f}
`;

if (!html.includes('.plan-item[data-plan-status="in-progress"]')) {
  html = html.replace('    @media(max-width:640px)', `${progressCss}    @media(max-width:640px)`);
}

for (const number of inProgress) {
  const opening = `<article class="plan-item" data-plan-number="${number}" data-plan-status="active">`;
  const replacement = `<article class="plan-item" data-plan-number="${number}" data-plan-status="in-progress" aria-label="Пункт ${number}, в работе">`;
  if (!html.includes(opening) && !html.includes(replacement)) throw new Error(`MONTH1 STATUS FAIL: plan item ${number} not found`);
  html = html.replace(opening, replacement);

  const copyOpening = `<span class="plan-item-number">${number}</span><div class="plan-item-copy"><p>`;
  const copyReplacement = `<span class="plan-item-number">${number}</span><div class="plan-item-copy"><span class="plan-item-status is-progress">↻ В работе</span><p>`;
  if (!html.includes(copyReplacement)) {
    if (!html.includes(copyOpening)) throw new Error(`MONTH1 STATUS FAIL: plan item ${number} copy not found`);
    html = html.replace(copyOpening, copyReplacement);
  }
}

html = html.replace(
  'Галочкой отмечены выполненные пункты — нажмите на карточку, чтобы открыть отчёт по задаче. Остальные задачи продолжаются.',
  'Галочкой отмечены выполненные пункты — нажмите на карточку, чтобы открыть отчёт по задаче. Отдельной отметкой «В работе» выделены пункты 12, 14 и 16 — работа по ним уже ведётся и продолжается.'
);

writeFileSync(planPath, html, 'utf8');

const rendered = readFileSync(planPath, 'utf8');
if ((rendered.match(/data-plan-number="\d+" data-plan-status="in-progress"/g) || []).length !== inProgress.length) {
  throw new Error('MONTH1 STATUS FAIL: in-progress item count is incorrect');
}
for (const number of inProgress) {
  if (!rendered.includes(`data-plan-number="${number}" data-plan-status="in-progress"`)) {
    throw new Error(`MONTH1 STATUS FAIL: item ${number} is not marked in progress`);
  }
}
console.log(`month1-plan-progress: PASS items=${inProgress.join(',')}`);
