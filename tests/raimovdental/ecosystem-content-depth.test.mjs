#!/usr/bin/env node
/** Scanability and minimal-copy contract for the one-reader atlas. */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pass, fail, exitResults } from './helpers/lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const dist = join(root, 'site-raimovdental/dist');
const failures = [];
const assert = (cond, name, detail='') => {
  if (cond) pass(name, detail);
  else { failures.push(name); fail(name, detail); }
};
const strip = (html) => html.replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
const words = (html) => strip(html).split(' ').filter(Boolean).length;

const homePath = join(dist, 'ru/index.html');
if (!existsSync(homePath)) process.exit(2);
const home = readFileSync(homePath,'utf8');
const homeWords = words(home);
assert(homeWords >= 180 && homeWords <= 650, 'home copy stays scannable', String(homeWords));
assert((home.match(/class="module-card"/g)||[]).length === 10, 'exactly ten visual module cards');
assert((home.match(/class="flow-node/g)||[]).length >= 6, 'home uses graphic flow nodes');

for (const slug of ['current-state','revenue-engine','access-continuity','raimov-system','personal-brand','academy','clinics','atabek-role','implementation','decisions']) {
  const path = join(dist,'ru',slug,'index.html');
  if (!existsSync(path)) { failures.push(slug); continue; }
  const html = readFileSync(path,'utf8');
  const count = words(html);
  assert(count >= 120 && count <= 620, `${slug}: concise detail copy`, String(count));
  assert((html.match(/<h2/g)||[]).length >= 3, `${slug}: diagonal-reading subheads`);
  assert((html.match(/flow-node/g)||[]).length >= 4, `${slug}: visual logic flow`);
}
assert(!/\bTBD\b|placeholder|CONTENT PENDING/i.test(home), 'no placeholders');
exitResults(failures);
