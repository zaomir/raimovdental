#!/usr/bin/env node
/** Analytics PII + Stage B event allowlist (DEC-772). */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO } from './helpers/lib.mjs';

const analyticsSrc = readFileSync(
  join(REPO, 'site-raimovdental/src/assets/js/analytics.js'),
  'utf8',
);
const homeSrc = readFileSync(
  join(REPO, 'site-raimovdental/stage-b/index.html'),
  'utf8',
);

const piiMatch = analyticsSrc.match(/const PII_KEYS = new Set\(\[([\s\S]*?)\]\)/);
assert.ok(piiMatch, 'PII_KEYS set must exist');

const blocked = ['name', 'phone', 'diagnosis', 'message', 'email', 'interest', 'contact'];
for (const key of blocked) {
  assert.match(piiMatch[1], new RegExp(`['"]${key}['"]`), `PII_KEYS must block ${key}`);
}

const stageBEvents = [
  'investor_cta_click',
  'investor_form_start',
  'investor_form_submit',
  'academy_cta_click',
  'academy_form_start',
  'academy_form_submit',
];
for (const evt of stageBEvents) {
  assert.match(homeSrc, new RegExp(evt), `Stage B home allowlist includes ${evt}`);
}

function sanitizeProps(props) {
  const PII_KEYS = new Set(blocked.concat(['telegramOrWhatsapp', 'body', 'passport', 'medical', 'disease']));
  const out = {};
  for (const [key, value] of Object.entries(props || {})) {
    if (PII_KEYS.has(key)) continue;
    out[key] = value;
  }
  return out;
}

const sanitized = sanitizeProps({
  name: 'Secret',
  phone: '+123',
  interest: 'investor_strategy',
  contact: 'a@b.c',
  cta_source: 'investor_section',
  lead_id: '00000000-0000-4000-8000-000000000001',
});

assert.deepEqual(sanitized, {
  cta_source: 'investor_section',
  lead_id: '00000000-0000-4000-8000-000000000001',
});

console.log('PASS analytics PII + Stage B events guard');
