/**
 * Review Hub persistence — atom B3.
 *
 * One JSON state file plus an append-only JSONL journal, chosen over SQLite because the
 * pilot handles tens of tokens, the host has no native build toolchain, and a plain-text
 * journal is what the weekly review in SOP §12 actually reads.
 *
 * Data minimisation is a hard rule: a record holds a token, coarse visit metadata and the
 * patient's own words. No name, no phone, no diagnosis, no visit notes. The manager
 * reconciles a token with a patient through the admin journal, not through this file.
 */

import { createHash, randomBytes } from 'node:crypto';
import { mkdirSync, readFileSync, renameSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

const DATA_DIR = process.env.FEEDBACK_DATA_DIR || '/var/lib/expert-feedback-hub';
const STATE = join(DATA_DIR, 'state.json');
const JOURNAL = join(DATA_DIR, 'journal.jsonl');

export const PLATFORMS = ['yandex', 'twogis', 'google'];

/** Tokens stop working after this many days, so a leaked link cannot be replayed forever. */
const TTL_DAYS = 60;
const TTL_MS = TTL_DAYS * 24 * 60 * 60 * 1000;

let cache = null;

function load() {
  if (!cache) {
    mkdirSync(DATA_DIR, { recursive: true });
    cache = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : { tokens: {} };
  }
  let pruned = false;
  for (const [token, record] of Object.entries(cache.tokens)) {
    if (expired(record)) {
      delete cache.tokens[token];
      pruned = true;
    }
  }
  if (pruned) persist();
  pruneJournal();
  return cache;
}

/** Keep the operational journal under the same 60-day retention promise as token state. */
function pruneJournal() {
  if (!existsSync(JOURNAL)) return;
  const cutoff = Date.now() - TTL_MS;
  const kept = readFileSync(JOURNAL, 'utf8')
    .split('\n')
    .filter(Boolean)
    .filter((line) => {
      try {
        return Date.parse(JSON.parse(line).at) >= cutoff;
      } catch {
        return false;
      }
    });
  const tmp = `${JOURNAL}.tmp`;
  writeFileSync(tmp, kept.length ? `${kept.join('\n')}\n` : '');
  renameSync(tmp, JOURNAL);
}

/** Write through a temp file so a crash mid-write cannot truncate the journal's index. */
function persist() {
  const tmp = `${STATE}.tmp`;
  mkdirSync(dirname(STATE), { recursive: true });
  writeFileSync(tmp, JSON.stringify(cache, null, 2));
  renameSync(tmp, STATE);
}

export function logEvent(event, token, extra = {}) {
  mkdirSync(DATA_DIR, { recursive: true });
  const row = { at: new Date().toISOString(), event, token, ...extra };
  appendFileSync(JOURNAL, `${JSON.stringify(row)}\n`);
  return row;
}

/**
 * Tokens are 18 random bytes in base64url: long enough that guessing one is not a path into
 * another patient's page, short enough to survive being pasted into WhatsApp.
 */
export function createToken({ serviceCategory = null, doctorCode = null, source = 'admin' } = {}) {
  const state = load();
  const token = randomBytes(18).toString('base64url');
  state.tokens[token] = {
    token,
    createdAt: new Date().toISOString(),
    serviceCategory,
    doctorCode,
    source,
    openedAt: null,
    score: null,
    scoredAt: null,
    branch: null,
    clicks: {},
    nudges: 0,
    recovery: null,
    stopped: null,
    publishDetected: {},
  };
  persist();
  logEvent('token_created', token, { serviceCategory, doctorCode, source });
  return state.tokens[token];
}

function expired(record) {
  const age = Date.now() - Date.parse(record.createdAt);
  return age > TTL_MS;
}

/** Returns null for unknown, malformed and expired tokens alike — the caller must not tell them apart. */
export function getToken(token) {
  if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{16,64}$/.test(token)) return null;
  const record = load().tokens[token];
  if (!record || expired(record)) return null;
  return record;
}

export function markOpened(token) {
  const r = getToken(token);
  if (!r) return null;
  if (!r.openedAt) {
    r.openedAt = new Date().toISOString();
    persist();
    logEvent('hub_opened', token);
  }
  return r;
}

/**
 * A score is written once. Changing it needs an admin reset (atom B4), so a patient cannot
 * be walked from a 2 to a 5 by anyone standing next to them.
 */
export function setScore(token, score) {
  const r = getToken(token);
  if (!r) return { error: 'gone' };
  if (!Number.isInteger(score) || score < 1 || score > 5) return { error: 'range' };
  if (r.score !== null) return { error: 'already', record: r };
  r.score = score;
  r.scoredAt = new Date().toISOString();
  r.branch = score >= 4 ? 'promoter' : 'detractor';
  persist();
  logEvent('csat_scored', token, { score, branch: r.branch });
  return { record: r };
}

export function markPlatformClick(token, platform) {
  const r = getToken(token);
  if (!r) return { error: 'gone' };
  if (!PLATFORMS.includes(platform)) return { error: 'unknown-platform' };
  if (r.score === null) return { error: 'not-scored' };
  if (!r.clicks[platform]) {
    r.clicks[platform] = new Date().toISOString();
    persist();
    logEvent('platform_clicked', token, { platform, total: Object.keys(r.clicks).length });
  }
  return { record: r };
}

export function saveRecovery(
  token,
  { topics = [], comment = '', privacyConsent = false, contactConsent = false }
) {
  const r = getToken(token);
  if (!r) return { error: 'gone' };
  if (r.branch !== 'detractor') return { error: 'wrong-branch' };
  if (!privacyConsent) return { error: 'consent-required' };
  r.recovery = {
    topics: topics.slice(0, 8),
    comment: String(comment).slice(0, 2000),
    privacyConsent: true,
    contactConsent: Boolean(contactConsent),
    status: 'NEW',
    submittedAt: new Date().toISOString(),
  };
  persist();
  logEvent('recovery_submitted', token, { contactConsent: r.recovery.contactConsent });
  return { record: r };
}

export function stopCycle(token, reason = 'patient_opt_out') {
  const r = getToken(token);
  if (!r) return { error: 'gone' };
  if (!r.stopped) {
    r.stopped = { reason, at: new Date().toISOString() };
    persist();
    logEvent('review_cycle_stopped', token, { reason });
  }
  return { record: r };
}

/** Admin reset for atom B4: clears the score so a mis-tap can be corrected on purpose. */
export function resetScore(token) {
  const r = getToken(token);
  if (!r) return { error: 'gone' };
  r.score = null;
  r.scoredAt = null;
  r.branch = null;
  r.clicks = {};
  r.recovery = null;
  persist();
  logEvent('admin_reset', token);
  return { record: r };
}

export function setRecoveryStatus(token, status) {
  const allowed = ['NEW', 'CONTACTED', 'IN_PROGRESS', 'CLOSED', 'ESCALATED'];
  const r = getToken(token);
  if (!r?.recovery) return { error: 'gone' };
  if (!allowed.includes(status)) return { error: 'status' };
  r.recovery.status = status;
  persist();
  logEvent('recovery_status', token, { status });
  return { record: r };
}

/** Weekly reconciliation of clicks against what is actually visible on the map (atom E2). */
export function setPublishDetected(token, platform, detected) {
  const r = getToken(token);
  if (!r) return { error: 'gone' };
  if (!PLATFORMS.includes(platform)) return { error: 'unknown-platform' };
  r.publishDetected[platform] = detected ? new Date().toISOString() : null;
  persist();
  logEvent('publish_detected', token, { platform, detected: Boolean(detected) });
  return { record: r };
}

export function allTokens() {
  return Object.values(load().tokens).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** Short, non-reversible handle for logs and alerts, so full tokens stay out of chat history. */
export function shortId(token) {
  return createHash('sha256').update(token).digest('hex').slice(0, 8);
}
