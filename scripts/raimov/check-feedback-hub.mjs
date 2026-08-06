#!/usr/bin/env node
/**
 * Compliance gates for the Review Hub.
 *
 *   node scripts/raimov/check-feedback-hub.mjs
 *
 * The pilot has two rules that are easy to break with one well-meaning copy edit, and both
 * are what would make the whole scheme review-gating rather than review-collecting:
 *
 *   no reward     — nothing is offered in exchange for a rating or a published review;
 *   no pre-filter — every patient answers the same neutral question and sees the same
 *                   optional map links; recovery runs independently for low scores.
 *
 * Canon: POST_VISIT_FEEDBACK_LOOP.md §7, §11; IMPLEMENTATION_PLAN_ATOMIC.md «вне пилота».
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const HUB = join(REPO, 'site-raimovdental', 'feedback-hub');

const failures = [];
const fail = (where, msg) => failures.push(`${where}: ${msg}`);

const copy = readFileSync(join(HUB, 'content.mjs'), 'utf8');
const render = readFileSync(join(HUB, 'lib', 'render.mjs'), 'utf8');
const store = readFileSync(join(HUB, 'lib', 'store.mjs'), 'utf8');
const server = readFileSync(join(HUB, 'server.mjs'), 'utf8');
const notify = readFileSync(join(HUB, 'lib', 'notify.mjs'), 'utf8');

/* --------------------------------------------------------------- copy rules */

/**
 * Reward detection is proximity-based inside one sentence, not adjacent-word: «скидка 10%
 * за отзыв» must be caught just as surely as «скидка за отзыв».
 */
const REWARD_LEXEMES = /(скидк|бонус|балл|подар|вознагражд|кэшбэк|промокод|купон)/i;
const REVIEW_LEXEMES = /(отзыв|оценк|звёзд|звезд)/i;

/**
 * Only an explicit denial verb clears a sentence — a stray «не» elsewhere does not.
 * No `\b` here on purpose: JavaScript word boundaries are ASCII-only, so `\bне` never
 * matches Cyrillic and the clause would silently pass everything.
 */
const DENIAL = /(^|[^а-яёa-z])не\s+(даём|даем|дарим|начисляем|предлагаем|обещаем|просим|проверяем|влияет)/i;

const PRESSURE = [
  [/поставьте\s+(нам\s+)?(пять|5)/i, 'просьба поставить пять'],
  [/нужны\s+только\s+хорошие/i, 'pre-filter в тексте'],
  [/если\s+вам\s+понравилось[^.!?]{0,60}отзыв/i, 'условный pre-filter'],
  [/оцените\s+нас\s+на\s+(пять|5)/i, 'просьба поставить пять'],
  [/только\s+(у\s+|для\s+)?довольн\w+/i, 'pre-filter «только довольных»'],
  [/(просим|попросим)\s+отзыв\w*\s+только/i, 'pre-filter по настроению пациента'],
];

// The loyalty programme is a different contour and must not appear on the hub (SOP §11).
const OTHER_CONTOURS = [
  [/expert\s*care/i, 'упоминание программы лояльности'],
  [/программ\w+\s+лояльност/i, 'упоминание программы лояльности'],
  [/начислен\w+\s+балл|накоплен\w+\s+балл/i, 'упоминание баллов'],
];

/*
 * Every rule is evaluated sentence by sentence, and the denial exemption applies only inside
 * the sentence that carries it. A window that spilled into neighbouring strings let the
 * footer's «не даём скидок» absolve unrelated violations further down the file.
 */
const prose = copy.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
for (const raw of prose.split(/(?<=[.!?])\s+|\n{2,}/)) {
  const sentence = raw.trim();
  if (!sentence) continue;
  const excused = DENIAL.test(sentence);

  if (REWARD_LEXEMES.test(sentence) && REVIEW_LEXEMES.test(sentence) && !excused) {
    fail('content.mjs', `reward-for-review: «${sentence.slice(0, 80)}»`);
  }
  for (const [list, kind] of [
    [PRESSURE, 'pre-filter / давление'],
    [OTHER_CONTOURS, 'чужой контур'],
  ]) {
    for (const [re, why] of list) {
      const hit = sentence.match(re);
      if (hit && !excused) fail('content.mjs', `${kind}: «${hit[0].trim()}» — ${why}`);
    }
  }
}

if (!/не\s+даём\s+скидок\s+и\s+бонусов\s+за\s+отзывы/i.test(copy)) {
  fail('content.mjs', 'отсутствует явная оговорка «не даём скидок и бонусов за отзывы»');
}
if (!/не\s+просим\s+ставить\s+пять/i.test(copy)) {
  fail('content.mjs', 'отсутствует оговорка «не просим ставить пять звёзд»');
}
if (!/модерац/i.test(copy)) {
  fail('content.mjs', 'нет оговорки, что публикация зависит от модерации площадки (SOP §14)');
}

/* ------------------------------------------------------------ branch rules */

if (!/renderDetractor/.test(render)) fail('render.mjs', 'нет recovery-ветки 1–3★');
const detractorBody = render.slice(render.indexOf('export function renderDetractor'));
const detractorOnly = detractorBody.slice(0, detractorBody.indexOf('export function renderToken'));
if (!/platformOptions\(record\)/.test(detractorOnly)) {
  fail('render.mjs', 'ветка 1–3★ скрывает нейтральные кнопки карт');
}

if (/branch\s*!==\s*'promoter'/.test(store)) {
  fail('store.mjs', 'сервер запрещает карты для 1–3★ — это review gating');
}
if (!/r\.score\s*!==\s*null/.test(store)) {
  fail('store.mjs', 'нет защиты от повторной оценки без admin reset (атом B4)');
}
if (!/function\s+pruneJournal/.test(store) || (store.match(/pruneJournal\(\)/g) ?? []).length < 2) {
  fail('store.mjs', 'journal.jsonl не очищается по 60-дневному retention');
}
if (!/review_cycle_stopped/.test(store)) fail('store.mjs', 'нет события review_cycle_stopped');
for (const event of ['hub_opened', 'csat_scored', 'platform_clicked']) {
  if (!store.includes(event)) fail('store.mjs', `нет события ${event} (SOP §5)`);
}

/* --------------------------------------------------------------- pii rules */

// Scanned with comments stripped: a comment stating that diagnoses are excluded is the
// opposite of a violation, and flagging it would train writers to delete the explanation.
const code = store.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
const PII = [/\bphone\b\s*[:=]/i, /\bpatientName\b/, /\bdiagnos/i, /\bfullName\b/, /\bbirth/i];
for (const re of PII) {
  if (re.test(code)) fail('store.mjs', `поле похоже на PII/PHI: ${re}`);
}
if (!/privacy_consent[^>]+required/.test(render)) {
  fail('render.mjs', 'нет обязательного явного согласия на обработку обратной связи');
}
if (/privacy_consent[^>]+checked/.test(render) || /contact_consent[^>]+checked/.test(render)) {
  fail('render.mjs', 'согласие предвыбрано');
}
const notifyCode = notify.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/.*$/gm, ' ');
for (const sensitive of ['record.score', 'serviceCategory', 'doctorCode', 'r?.comment', 'r.comment', 'topics']) {
  if (notifyCode.includes(sensitive)) fail('notify.mjs', `чувствительное поле уходит в Telegram: ${sensitive}`);
}

/* ------------------------------------------------------------ server rules */

if (!/noindex/.test(server) && !/noindex/.test(render)) {
  fail('server.mjs', 'нет noindex на страницах хаба');
}
if (!/timingSafeEqual/.test(server)) fail('server.mjs', 'admin-токен сравнивается небезопасно');
if (!/127\.0\.0\.1/.test(server)) fail('server.mjs', 'сервис слушает не только loopback');

/* -------------------------------------------------------------------- report */

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log('Review Hub gates passed: no reward, no pre-filter, no PII, branches isolated.');
