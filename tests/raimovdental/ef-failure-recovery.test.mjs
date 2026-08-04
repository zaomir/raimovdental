#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO } from './helpers/lib.mjs';

const efSrc = readFileSync(
  join(REPO, 'supabase/functions/submit-raimovdental-lead/index.ts'),
  'utf8',
);

assert.match(efSrc, /RAIMOV_CRM_WEBHOOK_URL/);
assert.match(efSrc, /notifyCrm\(/);
assert.match(efSrc, /tg alert failed/);
assert.match(efSrc, /crm webhook failed/);
assert.doesNotMatch(efSrc, /\.delete\(/);

const insertIdx = efSrc.indexOf('.insert(insertRow)');
const crmIdx = efSrc.indexOf('await notifyCrm');
const tgIdx = efSrc.indexOf('await sendAdminTelegram');
assert.ok(insertIdx > -1 && crmIdx > insertIdx && tgIdx > crmIdx, 'lead insert must precede CRM/TG side effects');

assert.match(efSrc, /investor_strategy/);
assert.match(efSrc, /academy_interest/);

console.log('PASS submit-raimovdental-lead failure isolation guard');
