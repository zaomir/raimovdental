/**
 * Admin journal — atom B8, columns per SOP §10.
 *
 * Staff-only by bearer token, and served with noindex so a shared link cannot leak into a
 * search index. It shows exactly the fields the weekly 30-minute review needs and nothing
 * more: no free-text identity, no clinical notes.
 */

import { allTokens, PLATFORMS, shortId } from './store.mjs';

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const day = (iso) => (iso ? iso.slice(0, 16).replace('T', ' ') : '—');

export const CSV_COLUMNS = [
  'token_short',
  'created_at',
  'service_category',
  'doctor_code',
  'hub_opened',
  'score',
  'branch',
  'yandex_click',
  'twogis_click',
  'google_click',
  'yandex_already_reviewed',
  'twogis_already_reviewed',
  'google_already_reviewed',
  'nudges',
  'publish_detected',
  'recovery_status',
  'stopped_reason',
];

export function toCsv() {
  const rows = allTokens().map((t) => [
    shortId(t.token),
    t.createdAt,
    t.serviceCategory ?? '',
    t.doctorCode ?? '',
    t.openedAt ?? '',
    t.score ?? '',
    t.branch ?? '',
    t.clicks.yandex ?? '',
    t.clicks.twogis ?? '',
    t.clicks.google ?? '',
    t.alreadyReviewed?.yandex ?? '',
    t.alreadyReviewed?.twogis ?? '',
    t.alreadyReviewed?.google ?? '',
    t.nudges ?? 0,
    PLATFORMS.filter((p) => t.publishDetected?.[p]).join('|'),
    t.recovery?.status ?? '',
    t.stopped?.reason ?? '',
  ]);
  const quote = (v) => `"${String(v).replace(/"/g, '""')}"`;
  return [CSV_COLUMNS, ...rows].map((r) => r.map(quote).join(',')).join('\n');
}

export function renderAdmin(cssHref, origin, { created = null } = {}) {
  const tokens = allTokens();
  const open = tokens.filter((t) => t.recovery && t.recovery.status !== 'CLOSED').length;
  const scored = tokens.filter((t) => t.score !== null);
  const multi = scored.filter(
    (t) => new Set([...Object.keys(t.clicks ?? {}), ...Object.keys(t.alreadyReviewed ?? {})]).size >= 2
  ).length;

  const rows = tokens
    .map((t) => {
      const covered = PLATFORMS.filter((p) => t.clicks?.[p] || t.alreadyReviewed?.[p]);
      const methods = covered
        .map((p) => `${p}:${t.alreadyReviewed?.[p] ? 'already_reviewed' : 'clicked'}`)
        .join(', ');
      const status = t.recovery
        ? `<span class="pill ${t.recovery.status === 'CLOSED' ? '' : 'pill--alert'}">${esc(
            t.recovery.status
          )}</span>`
        : '—';
      const recovery = t.recovery
        ? `<strong>${esc(t.recovery.topics.join(', ') || 'без темы')}</strong><br>
           ${esc(t.recovery.comment || 'без комментария')}<br>
           Контакт в WhatsApp: ${t.recovery.contactConsent ? 'разрешён' : 'не разрешён'}`
        : '—';
      return `<tr>
        <td><code>${esc(shortId(t.token))}</code></td>
        <td>${esc(day(t.createdAt))}</td>
        <td>${esc(t.serviceCategory ?? '—')}</td>
        <td>${esc(t.doctorCode ?? '—')}</td>
        <td>${t.openedAt ? esc(day(t.openedAt)) : '—'}</td>
        <td>${t.score ?? '—'}</td>
        <td>${esc(t.branch ?? '—')}</td>
        <td>${covered.length}/3 ${esc(methods)}</td>
        <td>${status}</td>
        <td>${recovery}</td>
        <td>${t.stopped ? esc(t.stopped.reason) : '—'}</td>
        <td><a href="/feedback/${esc(t.token)}">открыть</a></td>
      </tr>`;
    })
    .join('');

  const banner = created
    ? `<p class="hub__note"><strong>Ссылка для пациента:</strong>
        <code>${esc(origin)}/feedback/${esc(created.token)}</code></p>`
    : '';

  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>Журнал Review Hub</title>
<link rel="stylesheet" href="${esc(cssHref)}">
</head>
<body>
<main class="admin">
  <h1 class="hub__title">Журнал Review Hub</h1>
  <p class="hub__lead">Циклов: ${tokens.length} · с оценкой: ${scored.length} ·
     2+ площадки: ${multi} · открытых разборов: ${open}</p>
  ${banner}
  <div class="admin__bar">
    <form method="post" action="/feedback/admin/token">
      <input type="hidden" name="source" value="admin">
      <button class="btn" type="submit">Создать ссылку</button>
    </form>
    <a class="btn" href="/feedback/admin/journal.csv">Скачать CSV</a>
  </div>
  <table>
    <thead><tr>
      <th>Обращение</th><th>Создан</th><th>Услуга</th><th>Врач</th><th>Открыт</th>
      <th>Оценка</th><th>Ветка</th><th>Площадки</th><th>Статус</th><th>Комментарий</th><th>Стоп</th><th></th>
    </tr></thead>
    <tbody>${rows || '<tr><td colspan="12">Пока пусто</td></tr>'}</tbody>
  </table>
</main>
</body>
</html>`;
}
