#!/usr/bin/env node
/** Stage B public lead forms → EF chain (DEC-772). */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO } from './helpers/lib.mjs';

const formsSrc = readFileSync(
  join(REPO, 'site-raimovdental/stage-b/public-lead-forms.js'),
  'utf8',
);
const efSrc = readFileSync(
  join(REPO, 'supabase/functions/submit-raimovdental-lead/index.ts'),
  'utf8',
);

assert.match(formsSrc, /resolveSubmitUrl/, 'submit URL from site config');
assert.match(formsSrc, /investor_strategy/);
assert.match(formsSrc, /academy_interest/);
assert.match(formsSrc, /Запрос получен\. Представитель RAIMOV DENTAL свяжется с вами\./);
assert.match(formsSrc, /_form_submit/);
assert.match(formsSrc, /formType \+ '_form_submit'/);
assert.match(formsSrc, /website/, 'honeypot field');
assert.doesNotMatch(formsSrc, /diagnosis|symptoms|medical_history|investment_amount|roi/i);
assert.match(formsSrc, /succeeded/, 'duplicate submit protection');

assert.match(efSrc, /investor_strategy/);
assert.match(efSrc, /academy_interest/);
assert.match(efSrc, /lead_type/);
assert.match(efSrc, /interestNote|interest_note/);
assert.match(efSrc, /"investment_amount"/, 'EF forbids investment_amount field');

console.log('PASS stage-b lead-form EF chain guard');
