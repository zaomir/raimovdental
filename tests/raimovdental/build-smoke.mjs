#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const dist = join(root, 'site-raimovdental/dist');
if (!existsSync(join(dist,'ru/index.html'))) {
  const run = spawnSync(process.execPath,[join(root,'scripts/build-raimovdental.mjs')],{cwd:root,stdio:'inherit'});
  if (run.status !== 0) process.exit(run.status || 1);
}
const required = [
  'ru/index.html','ru/current-state/index.html','ru/revenue-engine/index.html','ru/access-continuity/index.html',
  'ru/raimov-system/index.html','ru/personal-brand/index.html','ru/academy/index.html','ru/clinics/index.html',
  'ru/atabek-role/index.html','ru/implementation/index.html','ru/decisions/index.html',
  'ru/assets/strategy-atlas.css','ru/assets/atabek-portrait.jpg','404.html','robots.txt','route-manifest.json'
];
for (const rel of required) {
  if (!existsSync(join(dist,rel))) { console.error(`FAIL missing ${rel}`); process.exit(1); }
}
const home = readFileSync(join(dist,'ru/index.html'),'utf8');
if (!/noindex,nofollow/.test(home) || /<script\b/i.test(home)) {
  console.error('FAIL home privacy/client-JS contract');
  process.exit(1);
}
if (existsSync(join(dist,'sitemap.xml')) || existsSync(join(dist,'stage-a'))) {
  console.error('FAIL private atlas emitted forbidden surface');
  process.exit(1);
}
console.log('PASS build-smoke one-reader strategy atlas');
