/**
 * Manager alert for the 1–3★ branch — atom B6, SLA in SOP §9 (≤15 min in working hours).
 *
 * The alert carries a short token handle, the score, the topics the patient ticked and their
 * comment. It deliberately does not carry a name or a phone: the manager resolves the patient
 * through the admin journal, which keeps identity out of a group chat.
 *
 * If the channel is not configured the submission is still stored and still visible in the
 * admin journal — a missing secret must never swallow a complaint.
 */

import { shortId } from './store.mjs';

const TOPIC_LABELS = {
  service: 'сервис и отношение',
  waiting: 'ожидание и запись',
  communication: 'объяснения и коммуникация',
  cleanliness: 'чистота и комфорт',
  'stage-result': 'результат этапа',
  price: 'стоимость и расчёт',
  other: 'другое',
};

function config() {
  const token = (process.env.TELEGRAM_BOT_TOKEN || process.env.TELEGRAM_ORDERS_BOT_TOKEN || '').trim();
  const chatId = (
    process.env.MANAGER_REPUTATION_TG_CHAT_ID ||
    process.env.TELEGRAM_MANAGER_REPUTATION_CHAT_ID ||
    ''
  ).trim();
  return { token, chatId };
}

export function channelReady() {
  const { token, chatId } = config();
  return Boolean(token && chatId);
}

export function composeAlert(record, adminUrl) {
  const r = record.recovery;
  const topics = (r?.topics ?? []).map((t) => TOPIC_LABELS[t] ?? t).join(', ') || 'не указаны';
  const lines = [
    `⚠️ Оценка ${record.score}/5 — нужен разбор`,
    `Обращение: ${shortId(record.token)}`,
    record.serviceCategory ? `Услуга: ${record.serviceCategory}` : null,
    record.doctorCode ? `Врач: ${record.doctorCode}` : null,
    `Темы: ${topics}`,
    r?.comment ? `Комментарий: ${r.comment}` : 'Комментарий: не оставлен',
    `Связаться по WhatsApp: ${r?.consent ? 'да, пациент согласен' : 'согласия нет'}`,
    'SLA: первый контакт ≤ 4 рабочих часов, закрытие ≤ 48 часов.',
    adminUrl ? `Журнал: ${adminUrl}` : null,
  ];
  return lines.filter(Boolean).join('\n');
}

export async function sendAlert(record, adminUrl) {
  const { token, chatId } = config();
  const text = composeAlert(record, adminUrl);
  if (!token || !chatId) {
    console.warn('[hub] alert channel not configured; recovery stored but not delivered');
    return { delivered: false, reason: 'not-configured', text };
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error('[hub] alert delivery failed', res.status);
      return { delivered: false, reason: `http-${res.status}`, text };
    }
    return { delivered: true, text };
  } catch (err) {
    console.error('[hub] alert delivery error', err?.message);
    return { delivered: false, reason: 'network', text };
  }
}
