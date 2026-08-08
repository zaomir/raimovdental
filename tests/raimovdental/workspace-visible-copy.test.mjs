#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(process.cwd(), 'site-raimovdental', 'dist', 'assets', 'img');
const pages = [
  'workspace/app.html',
  'workspace/index.html',
  'workspace/presentation/index.html',
  'admin/index.html',
];

for (const relative of pages) {
  const html = readFileSync(join(root, relative), 'utf8');
  assert.match(html, /copy-sanitizer\.js/, `${relative} must sanitize user-visible copy`);
}

const sanitizer = readFileSync(join(root, 'workspace/copy-sanitizer.js'), 'utf8');
const forbidden = [
  'draft_pending_clinic', 'patient-path', 'source_ref', 'next action', 'next step',
  'inbox', 'SLA', 'gate', 'Live', 'KPI', 'PHI', 'localStorage', 'clinic health',
  'veneers', 'implants', 'ortho',
];

for (const term of forbidden) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  assert.match(sanitizer, new RegExp(escaped, 'i'), `missing visible-copy replacement: ${term}`);
}
assert.match(sanitizer, /\\\/render\\\//);
assert.match(sanitizer, /ED-\(\?:MAT\|LINK\)/);

assert.match(sanitizer, /I\\d\+\(\?:\\\.\\d\+\)\?/);
assert.match(sanitizer, /\(\?:MB\|MC\|S\|R\|P\)/);
assert.doesNotMatch(sanitizer, /querySelectorAll\(['"]script/);

console.log('workspace-visible-copy-runtime-sanitizer: PASS');
