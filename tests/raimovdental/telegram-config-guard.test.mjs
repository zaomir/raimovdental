#!/usr/bin/env node
/** Telegram deeplink config still present; Stage B does not require patient CTA sources. */
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { REPO } from './helpers/lib.mjs';

const siteConfigSrc = readFileSync(
  join(REPO, 'site-raimovdental/src/config/site.config.mjs'),
  'utf8',
);

assert.match(siteConfigSrc, /telegramDeepLink/);
assert.match(siteConfigSrc, /telegramAllowedSources/);
assert.match(siteConfigSrc, /consentVersion: '2026-07-31'/);
assert.match(siteConfigSrc, /mode: 'strategic'/);
assert.doesNotMatch(siteConfigSrc, /saidov/i);

const telegramPath = join(REPO, 'site-raimovdental/src/assets/js/telegram.js');
if (existsSync(telegramPath)) {
  const telegramSrc = readFileSync(telegramPath, 'utf8');
  assert.match(telegramSrc, /contacts\.telegramDeepLink/);
  assert.doesNotMatch(telegramSrc, /t\.me\/[a-z0-9_]+/i, 'hardcoded bot username forbidden');
}

console.log('PASS telegram config guard (Stage B)');
