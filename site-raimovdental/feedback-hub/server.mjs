#!/usr/bin/env node
/**
 * Expert Dental Studio — Review Hub (atoms B1–B8).
 *
 * Canon: docs/raimov/operations/expert-dental/reputation/IMPLEMENTATION_PLAN_ATOMIC.md
 *        docs/raimov/operations/expert-dental/reputation/POST_VISIT_FEEDBACK_LOOP.md
 *
 * Scope boundary from the plan §0: this process owns /feedback/* and nothing else. It never
 * touches the patient site's markup, routes or stylesheet; nginx proxies only that prefix.
 *
 *   FEEDBACK_PORT           listen port (default 8613, loopback only)
 *   FEEDBACK_DATA_DIR       journal + state directory
 *   FEEDBACK_ADMIN_TOKEN    bearer token for /feedback/admin
 *   FEEDBACK_ORIGIN         public origin, used when printing patient links
 *   TELEGRAM_BOT_TOKEN      alert channel (atom A5); absent = stored but not delivered
 *   MANAGER_REPUTATION_TG_CHAT_ID
 */

import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { timingSafeEqual } from 'node:crypto';

import * as store from './lib/store.mjs';
import * as render from './lib/render.mjs';
import { renderAdmin, toCsv } from './lib/admin.mjs';
import { sendAlert } from './lib/notify.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.FEEDBACK_PORT || 8613);
const ORIGIN = process.env.FEEDBACK_ORIGIN || 'https://clinic.raimovdental.com';
const ADMIN_TOKEN = (process.env.FEEDBACK_ADMIN_TOKEN || '').trim();

const CSS = readFileSync(join(HERE, 'assets', 'hub.css'), 'utf8');
const JS = readFileSync(join(HERE, 'assets', 'hub.js'), 'utf8');
const TEAM_IMAGE = readFileSync(join(HERE, '..', 'patient-site', 'assets', 'img', 'team', 'team-720.jpg'));
// Content hash keeps the CDN from serving yesterday's stylesheet after a hub deploy.
const hash = (s) => {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
};
const CSS_HREF = `/feedback/hub.${hash(CSS)}.css`;
const JS_HREF = `/feedback/hub.${hash(JS)}.js`;
render.assets.jsHref = JS_HREF;
render.assets.origin = ORIGIN;

/* -------------------------------------------------------------------- helpers */

const SECURITY_HEADERS = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'no-referrer',
  'x-robots-tag': 'noindex, nofollow, noarchive',
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store',
    ...SECURITY_HEADERS,
    ...headers,
  });
  res.end(body);
}

/** Post/redirect/get: a refresh after scoring must not replay the score. */
function seeOther(res, location) {
  res.writeHead(303, { location, 'cache-control': 'no-store', ...SECURITY_HEADERS });
  res.end();
}

function found(res, location) {
  res.writeHead(302, { location, 'cache-control': 'no-store', ...SECURITY_HEADERS });
  res.end();
}

async function readForm(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 64 * 1024) throw new Error('payload too large');
    chunks.push(chunk);
  }
  const params = new URLSearchParams(Buffer.concat(chunks).toString('utf8'));
  return params;
}

function adminAuthorised(req, url) {
  if (!ADMIN_TOKEN) return false;
  const header = (req.headers.authorization || '').replace(/^Bearer\s+/i, '');
  const supplied = header || url.searchParams.get('key') || '';
  if (supplied.length !== ADMIN_TOKEN.length) return false;
  return timingSafeEqual(Buffer.from(supplied), Buffer.from(ADMIN_TOKEN));
}

/* --------------------------------------------------------------------- routes */

const server = createServer(async (req, res) => {
  let url;
  try {
    url = new URL(req.url, ORIGIN);
  } catch {
    return send(res, 400, 'Bad request');
  }
  const path = url.pathname.replace(/\/+$/, '') || '/feedback';
  const method = req.method || 'GET';

  try {
    /* ------------------------------------------------------------- assets */

    if (method === 'GET' && /^\/feedback\/hub\.[a-z0-9]+\.css$/.test(path)) {
      return send(res, 200, CSS, {
        'content-type': 'text/css; charset=utf-8',
        'cache-control': 'public, max-age=31536000, immutable',
      });
    }
    if (
      method === 'GET' &&
      (path === '/feedback/hub.js' || /^\/feedback\/hub\.[a-z0-9]+\.js$/.test(path))
    ) {
      return send(res, 200, JS, {
        'content-type': 'application/javascript; charset=utf-8',
        'cache-control':
          path === '/feedback/hub.js'
            ? 'public, max-age=60'
            : 'public, max-age=31536000, immutable',
      });
    }
    if (method === 'GET' && path === '/feedback/team.jpg') {
      return send(res, 200, TEAM_IMAGE, {
        'content-type': 'image/jpeg',
        'cache-control': 'public, max-age=86400',
      });
    }
    if (method === 'GET' && path === '/feedback/health') {
      return send(res, 200, JSON.stringify({ ok: true, tokens: store.allTokens().length }), {
        'content-type': 'application/json; charset=utf-8',
      });
    }

    /* -------------------------------------------------------------- admin */

    if (path.startsWith('/feedback/admin')) {
      if (!adminAuthorised(req, url)) {
        // Same neutral page an unknown token gets: the admin surface does not announce itself.
        return send(res, 404, render.renderGone(CSS_HREF));
      }
      if (method === 'GET' && path === '/feedback/admin') {
        return send(res, 200, renderAdmin(CSS_HREF, ORIGIN));
      }
      if (method === 'GET' && path === '/feedback/admin/journal.csv') {
        return send(res, 200, toCsv(), {
          'content-type': 'text/csv; charset=utf-8',
          'content-disposition': 'attachment; filename="review-hub-journal.csv"',
        });
      }
      if (method === 'POST' && path === '/feedback/admin/token') {
        const form = await readForm(req);
        const result = store.createToken({
          patientRefHash: form.get('patient_ref_hash') || '',
          serviceCategory: form.get('service_category') || null,
          doctorCode: form.get('doctor_code') || null,
          source: form.get('source') || 'admin',
        });
        if (result.error) {
          const message =
            result.error === 'frequency-cap'
              ? `Для этого псевдонима цикл уже создавался. Новый можно открыть после ${result.retryAfter.slice(
                  0,
                  10
                )}.`
              : 'Нужен 64-символьный HMAC пациента из CRM. Имя и телефон сюда вводить нельзя.';
          return send(res, 409, renderAdmin(CSS_HREF, ORIGIN, { error: message }));
        }
        return send(res, 200, renderAdmin(CSS_HREF, ORIGIN, { created: result.record }));
      }
      if (method === 'POST' && path === '/feedback/admin/reset') {
        const form = await readForm(req);
        store.resetScore(form.get('token') || '');
        return seeOther(res, `/feedback/admin?key=${encodeURIComponent(url.searchParams.get('key') || '')}`);
      }
      if (method === 'POST' && path === '/feedback/admin/status') {
        const form = await readForm(req);
        store.setRecoveryStatus(form.get('token') || '', form.get('status') || 'NEW');
        return seeOther(res, `/feedback/admin?key=${encodeURIComponent(url.searchParams.get('key') || '')}`);
      }
      return send(res, 404, render.renderGone(CSS_HREF));
    }

    /* ------------------------------------------------------------ landing */

    if (method === 'GET' && path === '/feedback') {
      store.logEvent('anon_hub_opened', null, { source: 'landing' });
      return send(res, 200, render.renderLanding(CSS_HREF));
    }

    // Eternal QA link: mint a fresh unscored token on every open → always the 1–5 page.
    if (method === 'GET' && path === '/feedback/demo') {
      const record = store.createDemoToken();
      return found(res, `/feedback/${record.token}`);
    }

    const anonymousClick = path.match(/^\/feedback\/out\/(yandex|twogis|google)$/);
    if (method === 'GET' && anonymousClick) {
      const platform = anonymousClick[1];
      store.logEvent('anon_platform_clicked', null, { platform });
      return found(res, render.PLATFORM_URLS[platform]);
    }

    /* -------------------------------------------------------- token pages */

    const match = path.match(
      /^\/feedback\/([A-Za-z0-9_-]{16,64})(\/(score|click|already-reviewed|recovery|stop))?$/
    );
    if (!match) {
      if (method === 'GET') {
        store.logEvent('anon_hub_opened', null, { source: 'malformed-token' });
        return send(res, 200, render.renderLanding(CSS_HREF));
      }
      return send(res, 404, render.renderGone(CSS_HREF));
    }

    const token = match[1];
    const action = match[3];
    const record = store.getToken(token);
    // Unknown, expired and malformed links all become the same useful, non-identifying fallback.
    if (!record) {
      if (method === 'GET') {
        store.logEvent('anon_hub_opened', null, { source: 'unknown-token' });
        return send(res, 200, render.renderLanding(CSS_HREF));
      }
      return send(res, 404, render.renderGone(CSS_HREF));
    }

    if (method === 'GET' && !action) {
      store.markOpened(token);
      return send(res, 200, render.renderToken(store.getToken(token), CSS_HREF));
    }

    if (method !== 'POST') return send(res, 405, render.renderGone(CSS_HREF));

    const form = await readForm(req);

    if (action === 'score') {
      store.setScore(token, Number.parseInt(form.get('score') ?? '', 10));
      return seeOther(res, `/feedback/${token}`);
    }

    if (action === 'click') {
      const platform = form.get('platform') || '';
      const result = store.markPlatformClick(token, platform);
      if (result.error) return seeOther(res, `/feedback/${token}`);
      const target = render.PLATFORM_URLS[platform];
      // Straight to the map: the patient came here to write, not to read another page.
      return seeOther(res, target || `/feedback/${token}`);
    }

    if (action === 'already-reviewed') {
      store.markPlatformAlreadyReviewed(token, form.get('platform'));
      return seeOther(res, `/feedback/${token}`);
    }

    if (action === 'recovery') {
      const result = store.saveRecovery(token, {
        topics: form.getAll('topics'),
        comment: form.get('comment') || '',
        privacyConsent: form.get('privacy_consent') === '1',
        contactConsent: form.get('contact_consent') === '1',
      });
      if (!result.error) {
        const adminUrl = ADMIN_TOKEN ? `${ORIGIN}/feedback/admin` : null;
        // Awaited so a delivery failure is logged next to the submission that caused it.
        await sendAlert(result.record, adminUrl);
      }
      return seeOther(res, `/feedback/${token}`);
    }

    if (action === 'stop') {
      store.stopCycle(token);
      return seeOther(res, `/feedback/${token}`);
    }

    return send(res, 404, render.renderGone(CSS_HREF));
  } catch (err) {
    console.error('[hub]', err?.message);
    return send(res, 500, render.renderGone(CSS_HREF));
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[hub] listening on 127.0.0.1:${PORT} origin=${ORIGIN}`);
  if (!ADMIN_TOKEN) console.warn('[hub] FEEDBACK_ADMIN_TOKEN is empty — admin journal disabled');
});
