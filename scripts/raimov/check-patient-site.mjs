#!/usr/bin/env node
/**
 * Quality gates for the built patient site.
 *
 *   node scripts/raimov/check-patient-site.mjs [--dist <path>]
 *
 * Covers the contracts the build itself cannot see, because they are properties of the
 * rendered HTML rather than of the content model:
 *   SEO      — one H1, unique title/description, canonical, OG, breadcrumbs
 *   schema   — JSON-LD parses, required @types present, FAQPage only with a visible FAQ
 *   a11y     — alt text, lang, skip link, labelled controls, no positive tabindex
 *   privacy  — no route or link leaks the private raimovdental.com strategy surface
 *   anti-slop — banned AI-copy patterns from docs/ssot/WEBSITE_STUDIO_STANDARD.md §8.2
 *   claims   — no guaranteed outcomes or unverifiable superlatives on a medical site
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const { lockedPassages } = await import(
  join(REPO, 'site-raimovdental', 'patient-site', 'content', 'homepage.mjs')
);
const homepageSource = readFileSync(
  join(REPO, 'site-raimovdental', 'patient-site', 'content', 'homepage.mjs'),
  'utf8'
);
/** The only rating the site may quote, straight from the clinic's map data. */
const RATING = (() => {
  const raw = JSON.parse(
    readFileSync(join(REPO, 'site-raimovdental', 'src', 'data', 'reviews.ru.json'), 'utf8')
  );
  return raw.aggregateRating?.publishable ? raw.aggregateRating : null;
})();
const argv = process.argv.slice(2);
const DIST = argv.includes('--dist')
  ? argv[argv.indexOf('--dist') + 1]
  : join(REPO, 'site-raimovdental', 'dist', 'patient-staging');

const failures = [];
const warnings = [];
const fail = (page, msg) => failures.push(`${page}: ${msg}`);
const warn = (page, msg) => warnings.push(`${page}: ${msg}`);

const typedHomepagePrices =
  homepageSource.match(
    /(?:[1-9]\d{2,}|[1-9]\d{0,2}(?:[ \u00a0]\d{3})+)\s*(?:[–-]\s*\d[\d ]*)?\s*(?:сом|\$)/g
  ) ?? [];
if (typedHomepagePrices.length) {
  fail(
    'content/homepage.mjs',
    `typed prices bypass SKU resolution: ${[...new Set(typedHomepagePrices)].join(', ')}`
  );
}

/* ------------------------------------------------------------------ banned */

/**
 * Marketing filler and LLM tics. Each entry is a regex plus the reason, so a failure
 * tells the writer what to do instead of just flagging a string.
 */
const SLOP = [
  [/в современном (быстро меняющемся )?мире/i, 'пустой зачин'],
  [/в наши дни|в сегодняшнем мире/i, 'пустой зачин'],
  [/революционн(ое|ый|ая)/i, 'необоснованное превосходство'],
  [/инновационн(ый|ое|ая)\s+подход/i, 'общая фраза без механизма'],
  [/комплексн(ый|ое)\s+инновационн/i, 'нанизанные прилагательные'],
  [/раскро(йте|ем)\s+(весь\s+)?потенциал/i, 'маркетинговый штамп'],
  [/на\s+новый\s+уровень/i, 'маркетинговый штамп'],
  [/бесшовн(ый|ое)\s+опыт/i, 'калька без механизма'],
  [/не\s+просто\s+\w+,?\s+а\s+/i, 'конструкция «не просто X, а Y»'],
  [/погрузитесь\s+в/i, 'маркетинговый штамп'],
  [/в\s+мире\s+стоматологии/i, 'пустой зачин'],
  [/природа\s+наделила/i, 'декоративный зачин'],
  [/волшебн(ое|ый)\s+средство|волшебная\s+таблетка/i, 'публицистический штамп'],
  [/худшая\s+стратегия/i, 'оценочная риторика вместо факта'],
  [/золот(ой|ым)\s+стандарт/i, 'непроверяемое утверждение'],
  [/индивидуальный\s+подход\s+к\s+каждому/i, 'пустое обещание'],
  [/команда\s+профессионалов\s+своего\s+дела/i, 'пустое обещание'],
  [/широкий\s+спектр\s+услуг/i, 'общая фраза'],
  [/современное\s+оборудование\s+последнего\s+поколения/i, 'непроверяемое утверждение'],
  [/давайте\s+разбер[её]мся|итак,/i, 'разговорный LLM-коннектор'],
  [/важно\s+отметить,\s+что/i, 'пустой коннектор'],
  [/стоит\s+отметить,\s+что/i, 'пустой коннектор'],
  [/в\s+заключение(,| хочется)/i, 'пустой коннектор'],
  [/подводя\s+итог/i, 'пустой коннектор'],
  [/\bкак\s+известно\b/i, 'подмена источника'],
];

/**
 * Claims a medical site must not make (SSOT §10, §15.3, §26).
 * `(?<!не )` matters: "не гарантирует успех" is the correct framing, not a violation.
 */
const CLAIMS = [
  [/(?<!не )гарантиру(ем|ет|ется)\s+(результат|излечен|успех)/i, 'обещание результата'],
  [/\b100\s*%\s*(результат|гарант|успех)/i, 'обещание результата'],
  [/навсегда\s+(избав|решит)/i, 'обещание результата'],
  [/(?<!не )гарант(ия|ируем)\s+(результат|успех|излечен)/i, 'обещание результата'],
  [/безболезненн(о|ая|ый)\s+(гарантирован|всегда)/i, 'обещание отсутствия боли'],
  [/лучш(ая|ий|ие)\s+(клиника|врач|стоматолог)/i, 'непроверяемое превосходство'],
  [/№\s*1\s+в\s+(Бишкеке|Кыргызстане)/i, 'непроверяемое превосходство'],
  [/единственн(ый|ая)\s+в\s+(Бишкеке|Кыргызстане)/i, 'непроверяемое превосходство'],
  [/ведущий\s+(имплантолог|специалист|врач)/i, 'непроверяемое превосходство'],
  [/самые\s+низкие\s+цены|дешевле\s+всех/i, 'непроверяемое ценовое утверждение'],
];

/**
 * Home page specification §4 — things that must never appear on a public page of this clinic.
 * Outcome counters and reward-for-treatment offers are the two that keep resurfacing.
 */
const FORBIDDEN = [
  [/бесплатн\w*\s+консультаци/i, 'только «цифровая примерка — 0 сом», не «бесплатная консультация»'],
  [/скидка\s+только\s+сегодня|успейте|акция\s+месяца/i, 'срочность и акции на медуслуги'],
  [/рассрочка\s*0\s*%|налоговый\s+вычет/i, 'финансовые обещания вне компетенции клиники'],
  [/гарантийный\s+срок|гарантия\s+\d+\s+(год|лет)/i, 'гарантийный срок в годах'],
  [/\b\d[\d\s]{2,}\+?\s+(пациент|улыб|винир)\w*\s+(за|вылечен|установлен)/i, 'счётчик результатов лечения'],
];

/** Locked passages: reviewed copy that must reach the page whole (content/homepage.mjs). */
const LOCKED_ROUTES = { '/': true };

/** DEC-251 — public HTML must not mention AI outside the allowed /text routes. */
const AI_MENTION = /\b(ChatGPT|GPT-[0-9]|Claude|нейросет\w*|искусственн\w+ интеллект\w*)\b/i;

/** The private strategy surface must never be referenced from the patient site. */
const PRIVATE_LEAK = /(raimovdental\.com\/(ru|en)|strategy-atlas|\/ru\/atlas|founder-notes)/i;

/* -------------------------------------------------------------------- utils */

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) walk(full, out);
    else if (e.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const textOf = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ');

const attrOf = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`, 'i'))?.[1];

/** Root-relative src/href/srcset targets in a tag, as paths under the dist root. */
const localAssetRefs = (tag) => {
  const refs = [];
  for (const name of ['src', 'href']) {
    const v = attrOf(tag, name);
    if (v?.startsWith('/assets/')) refs.push(v.slice(1));
  }
  for (const candidate of (attrOf(tag, 'srcset') ?? '').split(',')) {
    const url = candidate.trim().split(/\s+/)[0];
    if (url.startsWith('/assets/')) refs.push(url.slice(1));
  }
  return refs;
};

/* --------------------------------------------------------------------- run */

const files = walk(DIST);
if (!files.length) {
  console.error(`No HTML found in ${DIST}. Run the builder first.`);
  process.exit(1);
}

const titles = new Map();
const descriptions = new Map();
let faqPages = 0;
let checkedImages = 0;

for (const file of files) {
  const page = '/' + relative(DIST, file).replace(/index\.html$/, '').replace(/\\/g, '/');
  const html = readFileSync(file, 'utf8');
  const text = textOf(html);
  // The 404 document and the internal build report are not indexable routes and are
  // exempt from the SEO contracts that only make sense for real pages.
  const internal = page.startsWith('/internal/') || page === '/404.html';

  /* ------------------------------------------------------------------ head */

  if (!/<html lang="ru">/.test(html)) fail(page, 'missing lang="ru"');

  const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  if (!title) fail(page, 'missing <title>');
  else {
    if (title.length > 65) warn(page, `title is ${title.length} chars (>65)`);
    if (titles.has(title) && !internal) fail(page, `duplicate title, also on ${titles.get(title)}`);
    titles.set(title, page);
  }

  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!desc) fail(page, 'missing meta description');
  else {
    if (desc.length < 70) warn(page, `description is ${desc.length} chars (<70)`);
    if (desc.length > 180) warn(page, `description is ${desc.length} chars (>180)`);
    if (descriptions.has(desc) && !internal) fail(page, `duplicate description, also on ${descriptions.get(desc)}`);
    descriptions.set(desc, page);
  }

  if (!/<link rel="canonical" href="https:\/\/[^"]+"/.test(html)) fail(page, 'missing canonical');
  for (const og of ['og:title', 'og:description', 'og:url', 'og:image']) {
    if (!html.includes(`property="${og}"`)) fail(page, `missing ${og}`);
  }
  for (const og of ['og:image:width', 'og:image:height', 'og:image:alt']) {
    if (!html.includes(`property="${og}"`)) fail(page, `missing ${og}`);
  }
  for (const twitter of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt']) {
    if (!html.includes(`name="${twitter}"`)) fail(page, `missing ${twitter}`);
  }

  /* ----------------------------------------------------------------- body */

  const h1s = html.match(/<h1[\s>]/g) ?? [];
  if (!internal && h1s.length !== 1) fail(page, `expected exactly one <h1>, found ${h1s.length}`);
  const headingLevels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((match) => Number(match[1]));
  for (let index = 1; index < headingLevels.length; index += 1) {
    if (headingLevels[index] > headingLevels[index - 1] + 1) {
      fail(
        page,
        `heading level jumps from h${headingLevels[index - 1]} to h${headingLevels[index]}`
      );
      break;
    }
  }

  if (page === '/' && RATING?.sourceUrl) {
    for (const tag of html.match(/<a\b[^>]*data-event="reviews_outbound_click"[^>]*>/g) ?? []) {
      if (attrOf(tag, 'href') !== RATING.sourceUrl) {
        fail(page, 'review proof link must use the verified aggregate source URL');
      }
    }
  }

  if (!html.includes('class="skip-link"')) fail(page, 'missing skip link');
  if (/tabindex="[1-9]/.test(html)) fail(page, 'positive tabindex found');

  for (const tag of html.match(/<img\b[^>]*>/g) ?? []) {
    checkedImages += 1;
    const alt = attrOf(tag, 'alt');
    if (alt === undefined) fail(page, `<img> without alt: ${tag.slice(0, 90)}`);
    else if (!alt.trim()) warn(page, `empty alt: ${tag.slice(0, 90)}`);
    if (!attrOf(tag, 'width') || !attrOf(tag, 'height')) {
      fail(page, `<img> without width/height (CLS): ${tag.slice(0, 90)}`);
    }
    for (const ref of localAssetRefs(tag)) {
      if (!existsSync(join(DIST, ref))) fail(page, `<img> points at a missing file: ${ref}`);
    }
  }

  // Stylesheets and scripts ship under content-hashed names, so a build that forgets to
  // emit one produces an unstyled page that every other gate here would still pass.
  for (const tag of html.match(/<(?:link\b[^>]*rel="stylesheet"|script\b)[^>]*>/g) ?? []) {
    for (const ref of localAssetRefs(tag)) {
      if (!existsSync(join(DIST, ref))) fail(page, `asset reference points at a missing file: ${ref}`);
    }
  }

  for (const tag of html.match(/<iframe\b[^>]*>/g) ?? []) {
    if (!attrOf(tag, 'title')) fail(page, '<iframe> without title');
  }

  for (const tag of html.match(/<button\b[^>]*>/g) ?? []) {
    if (attrOf(tag, 'aria-expanded') && !attrOf(tag, 'aria-controls')) {
      fail(page, 'button with aria-expanded but no aria-controls');
    }
  }

  // External links must not leak referrer or pass authority unintentionally.
  for (const tag of html.match(/<a\b[^>]*href="https?:\/\/[^"]*"[^>]*>/g) ?? []) {
    const href = attrOf(tag, 'href');
    if (href.includes('wa.me') || href.includes('maps.google')) continue;
    const rel = attrOf(tag, 'rel') ?? '';
    if (!rel.includes('noopener')) fail(page, `external link without rel=noopener: ${href}`);
  }

  /* --------------------------------------------------------------- schema */

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (!blocks.length) fail(page, 'no JSON-LD');
  for (const [, raw] of blocks) {
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      fail(page, `JSON-LD does not parse: ${e.message}`);
      continue;
    }
    const nodes = parsed['@graph'] ?? [parsed];
    const types = nodes.flatMap((n) => (Array.isArray(n['@type']) ? n['@type'] : [n['@type']]));

    if (!internal && !types.includes('Dentist')) fail(page, 'JSON-LD missing Dentist/MedicalClinic node');
    // Category pages are ItemList archives; article pages carry FAQPage plus Article.
    if (page.startsWith('/blog/') && types.includes('FAQPage') && !types.includes('Article')) {
      fail(page, 'article route JSON-LD missing Article type');
    }

    if (types.includes('FAQPage')) {
      faqPages += 1;
      const faq = nodes.find((n) => n['@type'] === 'FAQPage');
      // FAQPage is only legitimate when the same Q&A is visible in the page body.
      for (const q of faq.mainEntity) {
        const needle = q.name.replace(/&/g, '&amp;').slice(0, 40);
        if (!text.includes(q.name.slice(0, 40)) && !html.includes(needle)) {
          fail(page, `FAQPage question not visible on page: "${q.name.slice(0, 50)}"`);
        }
      }
    }

    for (const n of nodes) {
      /*
       * A rating may be published only as the clinic's own map profile aggregate: it has to
       * carry the source URL and match the figures in reviews.ru.json. Self-authored `review`
       * nodes stay banned outright — those are the ones that invent testimonials.
       */
      const r = n.aggregateRating;
      if (r) {
        if (!RATING) fail(page, 'aggregateRating published without verified review data');
        else if (!r.url?.includes('2gis.kg')) fail(page, 'aggregateRating without a source URL');
        else if (r.ratingValue !== RATING.value || r.reviewCount !== RATING.reviewCount) {
          fail(page, `aggregateRating ${r.ratingValue}/${r.reviewCount} does not match reviews.ru.json`);
        }
      }
      if (n.review) fail(page, 'review markup published without verified reviews');
    }

    if (!internal && !types.includes('BreadcrumbList') && page !== '/') {
      fail(page, 'missing BreadcrumbList');
    }
  }

  /* ------------------------------------------------------------ copy gates */

  for (const [re, why] of SLOP) {
    const hit = text.match(re);
    if (hit) fail(page, `AI-slop «${hit[0].trim()}» — ${why}`);
  }
  for (const [re, why] of CLAIMS) {
    const hit = text.match(re);
    if (hit) fail(page, `запрещённое утверждение «${hit[0].trim()}» — ${why}`);
  }
  for (const [re, why] of FORBIDDEN) {
    const hit = text.match(re);
    if (hit) fail(page, `спецификация §4: «${hit[0].trim()}» — ${why}`);
  }
  if (AI_MENTION.test(text)) fail(page, 'public page mentions AI (DEC-251)');
  if (PRIVATE_LEAK.test(html)) fail(page, 'links to the private raimovdental strategy surface');
  if (!internal && /(?:proposed|REQUIRES_CLINIC_APPROVAL|DEC-\d+)/i.test(text)) {
    fail(page, 'internal status marker leaked into public copy');
  }
  if (/href=["'][^"']*\/null(?:["'/?#]|$)/i.test(html)) {
    fail(page, 'public link points to /null');
  }
  if (!internal && /LO-8888\s+8888\s+88/.test(text)) {
    fail(page, 'unverified licence placeholder is public');
  }
  if (!internal && /Expert Care 12/i.test(text)) {
    fail(page, 'gated proposed product is public');
  }
  if (
    page.startsWith('/blog/')
    && /Проверил:|lastReviewed|reviewedBy/.test(html)
    && !html.includes('data-review-evidence')
  ) {
    fail(page, 'medical review attestation lacks explicit approval evidence');
  }

  /*
   * Locked passages must arrive whole. Truncating one is not a styling choice: each protects
   * the clinic in a named situation (free/paid boundary, no promised result, clinical
   * protocol, price disclaimer, contraindications).
   */
  if (LOCKED_ROUTES[page]) {
    for (const note of lockedPassages) {
      const needle = note.text.replace(/\s+/g, ' ').trim();
      if (!text.includes(needle)) {
        fail(page, `locked-оговорка отсутствует или сокращена: «${needle.slice(0, 60)}…»`);
      }
    }
  }

  // Structural slop: the same sentence repeated across sections reads as filler.
  const sentences = text.split(/(?<=[.!?])\s+/).filter((s) => s.length > 60);
  const seen = new Set();
  for (const s of sentences) {
    const key = s.trim().toLowerCase();
    if (seen.has(key)) warn(page, `repeated sentence: "${s.slice(0, 70)}…"`);
    seen.add(key);
  }
}

/* --------------------------------------------------- cross-page contracts */

const routes = files.map((f) => '/' + relative(DIST, f).replace(/index\.html$/, '').replace(/\\/g, '/'));
for (const required of [
  '/',
  '/services/',
  '/services/smile-preview/',
  '/services/named-checkup/',
  '/doctors/',
  '/doctors/raimov-atabek/',
  '/blog/',
  '/blog/cifrovaya-primerka-ulybki/',
  '/blog/imennoy-chekap/',
  '/contacts/',
  '/privacy/',
  '/legal/',
]) {
  if (!routes.includes(required)) fail('site', `missing required route ${required}`);
}

const routeHtml = new Map(
  files.map((file) => [
    '/' + relative(DIST, file).replace(/index\.html$/, '').replace(/\\/g, '/'),
    readFileSync(file, 'utf8'),
  ])
);
function requireCta(route, label, message) {
  const html = routeHtml.get(route) ?? '';
  if (!html.includes(`>${label}</a>`)) fail(route, `CTA label missing: «${label}»`);
  const messages = [...html.matchAll(/href="(https:\/\/wa\.me\/[^"]+)"/g)].map(([, href]) => {
    const url = new URL(href.replace(/&amp;/g, '&'));
    return url.searchParams.get('text');
  });
  if (!messages.includes(message)) fail(route, `WhatsApp CTA message mismatch: «${message}»`);
}
requireCta(
  '/services/smile-preview/',
  'Записаться на примерку — 0 сом',
  'Хочу записаться на цифровую примерку улыбки — 0 сом.'
);
requireCta(
  '/services/named-checkup/',
  'Записаться на чек-ап — 0 сом',
  'Хочу записаться на именной чек-ап — 0 сом.'
);

const sitemap = readFileSync(join(DIST, 'sitemap.xml'), 'utf8');
if (sitemap.includes('/internal/')) fail('sitemap.xml', 'internal route present in sitemap');
for (const r of routes) {
  if (r.startsWith('/internal/') || r === '/404.html') continue;
  if (!sitemap.includes(`${r}</loc>`)) fail('sitemap.xml', `route missing: ${r}`);
}

/* ------------------------------------------------------------------ report */

const pad = (n) => String(n).padStart(4);
console.log(`pages     ${pad(files.length)}`);
console.log(`images    ${pad(checkedImages)}`);
console.log(`FAQPage   ${pad(faqPages)}`);
console.log(`warnings  ${pad(warnings.length)}`);
console.log(`failures  ${pad(failures.length)}`);

if (warnings.length) console.log('\nWarnings:\n' + warnings.map((w) => `  · ${w}`).join('\n'));

if (failures.length) {
  console.error('\nFailures:\n' + failures.map((f) => `  ✗ ${f}`).join('\n'));
  process.exit(1);
}
console.log('\nAll gates passed.');
