#!/usr/bin/env node
/** One-reader strategy atlas contract (DEC-775). */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pass, fail, exitResults } from './helpers/lib.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '../..');
const dist = join(root, 'site-raimovdental/dist');
const failures = [];
const assert = (cond, name) => {
  if (cond) pass(name);
  else { failures.push(name); fail(name); }
};

const homePath = join(dist, 'ru/index.html');
if (!existsSync(homePath)) process.exit(2);
const home = readFileSync(homePath, 'utf8');

assert(/noindex,nofollow,noarchive,nosnippet/.test(home), 'home is private noindex');
assert(/Стратегия Дмитрия для Атабека Раимова/.test(home), 'one-reader framing');
assert(/Атабек, вот какую систему я предлагаю/.test(home), 'direct personal H1');
assert(/Карта стратегии RAIMOV DENTAL/.test(home), 'strategy map named');
assert(/Стратегия в одной линии/.test(home), 'visual trajectory present');
assert(/Усилить Expert Dental/.test(home) && /Открывать свои клиники/.test(home), 'trajectory endpoints present');
assert(/10 элементов стратегии/.test(home), 'ten modules announced');
assert(!/investor-form|academy-form|public-lead-forms|gtag|dataLayer/.test(home), 'public forms and analytics removed');
assert(!/Обсудить развитие RAIMOV DENTAL|публичное предложение/.test(home), 'public investor language removed');
assert(!/<script\b/i.test(home), 'zero client JavaScript');
assert(/\/ru\/current-state\//.test(home) && /\/ru\/decisions\//.test(home), 'first and final detail routes linked');

const slugs = ['current-state','revenue-engine','access-continuity','raimov-system','personal-brand','academy','clinics','atabek-role','implementation','decisions'];
for (const slug of slugs) {
  const path = join(dist, 'ru', slug, 'index.html');
  assert(existsSync(path), `route ${slug} built`);
  if (!existsSync(path)) continue;
  const html = readFileSync(path, 'utf8');
  assert(/Суть за 15 секунд/.test(html), `${slug}: summary first`);
  assert(/Вернуться к карте стратегии/.test(html), `${slug}: return to map`);
  assert(/class="page-nav"/.test(html), `${slug}: previous/next navigation`);
  assert(/noindex,nofollow,noarchive,nosnippet/.test(html), `${slug}: noindex`);
  assert(!/<script\b/i.test(html), `${slug}: zero JS`);
}

const robots = readFileSync(join(dist, 'robots.txt'), 'utf8');
assert(/User-agent: \*\nDisallow: \/\n/.test(robots), 'robots disallows all');
assert(!existsSync(join(dist, 'sitemap.xml')), 'no sitemap for private atlas');
assert(!existsSync(join(dist, 'stage-a')), 'stage-a remains outside dist');
assert(existsSync(join(dist, 'ru/assets/strategy-atlas.css')), 'private CSS lives under protected /ru/');
assert(existsSync(join(dist, 'ru/assets/atabek-portrait.jpg')), 'private portrait lives under protected /ru/');
assert(readdirSync(join(dist, 'ru')).length >= 12, 'route tree contains ten pages, home and assets');

const nginx = readFileSync(join(root, 'deploy/nginx/raimovdental.com.conf'), 'utf8');
assert(/location \^~ \/ru\//.test(nginx), 'nginx protects /ru/ prefix');
assert(/auth_basic_user_file \/etc\/nginx\/\.htpasswd-raimov-stage-a/.test(nginx), 'nginx reuses server-side credentials');
assert(/X-Robots-Tag "noindex, nofollow, noarchive, nosnippet"/.test(nginx), 'nginx noindex header');
assert(/BEGIN RAIMOV_STAGE_A_PREVIEW/.test(nginx), 'Stage A archive preserved');
assert(/location = \/render\//.test(nginx), 'operational render preserved');

exitResults(failures);
