#!/usr/bin/env node
/**
 * Builds the Expert Dental Studio patient site.
 *
 * Host-aware by design: the same routes render for the staging subdomain and for the
 * production domain, so the move from clinic.raimovdental.com to expertdental.kg is a
 * flag change rather than a rebuild.
 *
 *   node scripts/raimov/build-patient-site.mjs                    # staging
 *   node scripts/raimov/build-patient-site.mjs --host production
 *   node scripts/raimov/build-patient-site.mjs --out /tmp/preview
 *
 * The build fails loudly on a broken internal link, a missing image variant, an unknown
 * price direction or an article that does not satisfy the interlinking contract. A site
 * that ships with a dead link to a service page is worse than a build that refuses.
 */

import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SRC = join(REPO, 'site-raimovdental', 'patient-site');

const { hosts, brand, contacts } = await import(join(SRC, 'config/site.mjs'));
const { services, serviceBySlug, serviceRedirects } = await import(join(SRC, 'content/services.mjs'));
const { doctors, doctorBySlug } = await import(join(SRC, 'content/doctors.mjs'));
const { articles, articleBySlug, categories } = await import(join(SRC, 'content/articles.mjs'));
const { references } = await import(join(SRC, 'content/references.mjs'));
const { chief } = await import(join(SRC, 'content/chief.mjs'));
const homeContent = await import(join(SRC, 'content/homepage.mjs'));
const layout = await import(join(SRC, 'templates/layout.mjs'));
const pages = await import(join(SRC, 'templates/pages.mjs'));
const schema = await import(join(SRC, 'templates/schema.mjs'));

/* --------------------------------------------------------------------- args */

const argv = process.argv.slice(2);
function flag(name, fallback) {
  const i = argv.indexOf(`--${name}`);
  return i > -1 ? argv[i + 1] : fallback;
}

const HOST = flag('host', 'staging');
if (!hosts[HOST]) throw new Error(`Unknown host "${HOST}". Use staging or production.`);
const ORIGIN = hosts[HOST].origin;
const OUT = flag('out', join(REPO, 'site-raimovdental', 'dist', `patient-${HOST}`));

const problems = [];
function fail(msg) {
  problems.push(msg);
}

/* ------------------------------------------------------------------ prices */

function loadPrices() {
  const raw = JSON.parse(
    readFileSync(join(REPO, 'docs/raimov/operations/expert-dental/pricing/PRICE_CATALOG.json'), 'utf8')
  );
  const publishableDirections = raw.directions.filter(
    (d) => d.status !== 'proposed' && !/do_not_publish/i.test(d.publishGate ?? d.note ?? '')
  );
  const byDirection = {};
  for (const d of publishableDirections) {
    byDirection[d.id] = {
      id: d.id,
      name: d.name,
      items: d.items.map((i) => ({ name: i.name, includes: i.includes, price: i.price, note: i.note })),
    };
  }

  // Consultation tiers are addressed by id from doctor records.
  const consultationByTier = {};
  for (const item of publishableDirections.find((d) => d.id === 'diagnostics').items) {
    if (item.consultationTierId) consultationByTier[item.consultationTierId] = item;
  }

  // Copy addresses prices by SKU through {{price:sku}}, so a figure can never drift from
  // the catalog: an unknown or duplicated SKU stops the build instead of shipping.
  const bySku = {};
  for (const d of publishableDirections) {
    for (const item of d.items) {
      if (!item.sku) continue;
      if (bySku[item.sku]) throw new Error(`Duplicate price SKU in catalog: ${item.sku}`);
      bySku[item.sku] = { ...item, directionId: d.id };
    }
  }

  return {
    byDirection,
    consultationByTier,
    bySku,
    lastUpdated: raw.lastUpdated,
    // The catalog CTA advertises a free consultation while the same catalog prices it at
    // 550–5000 сом. The site follows the price rows: one number, one source (SSOT §12).
    disclaimer:
      (raw.disclaimer ?? '')
        .split(/(?<=[.!?])\s+/)
        .filter((sentence) => !/Expert Care/i.test(sentence))
        .join(' ')
      || 'Цены ориентировочные. Итоговая стоимость определяется после осмотра и зависит от клинической ситуации.',
  };
}

/* ------------------------------------------------------- reviews and cases */

const DATA = join(REPO, 'site-raimovdental', 'src', 'data');

/**
 * Public map reviews. Only rows the clinic marked `publishable` are rendered, and only the
 * 2GIS aggregate is quoted — the site never invents a rating or a testimonial.
 */
function loadReviews() {
  const raw = JSON.parse(readFileSync(join(DATA, 'reviews.ru.json'), 'utf8'));
  const rating = raw.aggregateRating?.publishable ? raw.aggregateRating : null;
  const keep = (list) => (list ?? []).filter((r) => r.publishable && r.quote?.trim());
  const items = keep(raw.reviews);
  const teaser = keep(raw.homeTeaserItems);
  if (rating && !items.length) fail('reviews.ru.json: rating is publishable but no review passes the filter');
  return { aggregateRating: rating, items, homeTeaserItems: teaser.length ? teaser : items.slice(0, 3) };
}

/** Verified treatment pathways. Photo pairs are not published until the clinic supplies them. */
function loadCases() {
  const raw = JSON.parse(readFileSync(join(DATA, 'cases.ru.json'), 'utf8'));
  const verified = new Set(raw.verifiedCases ?? []);
  return (raw.cases ?? []).filter((c) => c.publishable && c.status === 'verified' && verified.has(c.slug));
}

/* ------------------------------------------------------------ image manifest */

/** Minimal JPEG SOF reader — avoids pulling an image library into the build. */
function jpegSize(path) {
  const buf = readFileSync(path);
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = buf[i + 1];
    const len = buf.readUInt16BE(i + 2);
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { height: buf.readUInt16BE(i + 5), width: buf.readUInt16BE(i + 7) };
    }
    i += 2 + len;
  }
  throw new Error(`Cannot read JPEG dimensions: ${path}`);
}

/**
 * Photos keep stable filenames on disk but ship under a content-hashed URL. The edge
 * caches images for 30 days, and the API token available to the deploy cannot purge,
 * so a replaced portrait would otherwise stay invisible for a month.
 */
function fingerprintImage(full, rel) {
  const body = readFileSync(full);
  const hash = createHash('sha256').update(body).digest('hex').slice(0, 10);
  const hashed = `${rel}.${hash}.jpg`;
  const dest = join(OUT, 'assets', 'img', hashed);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, body);
  return `/assets/img/${hashed}`;
}

function buildImageManifest() {
  const root = join(SRC, 'assets', 'img');
  const manifest = {};
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith('.jpg')) continue;
      const rel = relative(root, full).replace(/\\/g, '/').slice(0, -4);
      const base = rel.replace(/-\d+$/, '');
      const { width, height } = jpegSize(full);
      manifest[base] ??= { width: 0, height: 0, variants: [] };
      manifest[base].variants.push({ src: fingerprintImage(full, rel), width });
      if (width > manifest[base].width) {
        manifest[base].width = width;
        manifest[base].height = height;
      }
    }
  };
  walk(root);
  for (const entry of Object.values(manifest)) entry.variants.sort((a, b) => a.width - b.width);
  return manifest;
}

/* -------------------------------------------------------------- validation */

function validateContent() {
  const serviceSlugs = new Set(services.map((s) => s.slug));
  const doctorSlugs = new Set(doctors.map((d) => d.slug));
  const articleSlugs = new Set(articles.map((a) => a.slug));

  for (const s of services) {
    for (const d of s.doctors) if (!doctorSlugs.has(d)) fail(`service ${s.slug}: unknown doctor "${d}"`);
    for (const r of s.related) if (!serviceSlugs.has(r)) fail(`service ${s.slug}: unknown related service "${r}"`);
    for (const a of s.articles) if (!articleSlugs.has(a)) fail(`service ${s.slug}: unknown article "${a}"`);
    if (!s.faq?.length) fail(`service ${s.slug}: FAQ is required (SSOT §9)`);
  }

  for (const d of doctors) {
    for (const s of d.services) if (!serviceSlugs.has(s)) fail(`doctor ${d.slug}: unknown service "${s}"`);
  }

  // SSOT §18.3 — every article links to a service, a doctor, 2–3 siblings and a booking CTA.
  for (const a of articles) {
    if (!serviceSlugs.has(a.relatedService)) fail(`article ${a.slug}: unknown related service`);
    if (!doctorSlugs.has(a.relatedDoctor)) fail(`article ${a.slug}: unknown related doctor`);
    if (!doctorSlugs.has(a.author)) fail(`article ${a.slug}: unknown author`);
    if (!doctorSlugs.has(a.reviewer)) fail(`article ${a.slug}: unknown reviewer`);
    if (!categories[a.category]) fail(`article ${a.slug}: unknown category`);
    if (a.relatedArticles.length < 2 || a.relatedArticles.length > 3) {
      fail(`article ${a.slug}: needs 2–3 related articles, has ${a.relatedArticles.length}`);
    }
    for (const r of a.relatedArticles) {
      if (!articleSlugs.has(r)) fail(`article ${a.slug}: unknown related article "${r}"`);
      if (r === a.slug) fail(`article ${a.slug}: links to itself`);
    }
    if (!a.faq?.length) fail(`article ${a.slug}: FAQ is required before FAQPage schema (SSOT §18.2)`);
    if (!a.references?.length) fail(`article ${a.slug}: at least one external authoritative source required`);
    for (const r of a.references) if (!references[r]) fail(`article ${a.slug}: unknown reference "${r}"`);
    if (!a.summary?.length) fail(`article ${a.slug}: «Коротко» block is required (SSOT §15.1)`);
  }

  if (!doctors.some((d) => d.chief)) fail('no chief doctor flagged in content/doctors.mjs');
  for (const s of chief.services) if (!serviceSlugs.has(s)) fail(`chief: unknown service "${s}"`);

  if (HOST === 'production') {
    if (!brand.license) {
      fail('production legal gate: verified licence number is required');
    }
    for (const a of articles) {
      if (!a.reviewedAt || !a.reviewEvidence) {
        fail(`production medical gate: article ${a.slug} lacks reviewedAt/reviewEvidence`);
      }
    }
  }
}

/* ---------------------------------------------------------------- emitting */

const written = new Map();

function emit(route, html) {
  const target = route === '/' ? 'index.html' : `${route.replace(/^\/|\/$/g, '')}/index.html`;
  const full = join(OUT, target);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, html, 'utf8');
  written.set(route, html);
}

function page({
  route,
  title,
  description,
  body,
  nodes,
  pageId,
  ogImage,
  ogImageWidth,
  ogImageHeight,
  ogImageAlt,
  ogType,
  waMessage,
}) {
  emit(
    route,
    layout.document({
      host: HOST,
      url: route,
      title,
      description,
      body,
      pageId,
      ogImage,
      ogImageWidth,
      ogImageHeight,
      ogImageAlt,
      ogType,
      waMessage,
      assets: fingerprints,
      schema: schema.graph(ORIGIN, nodes),
    })
  );
}

/**
 * Copies CSS/JS under a content-hashed name and returns the map the layout renders.
 * Without this, a CDN in front of the origin keeps serving the previous stylesheet for
 * up to the cache lifetime after a deploy, which is exactly how a fixed contrast bug
 * reappears in production.
 */
function fingerprintAssets() {
  const map = {};
  for (const rel of [
    'css/fonts.css',
    'css/site.css',
    'js/site.js',
    'img/brand/logo-260.png',
    'img/brand/logo-520.png',
    'img/brand/logo-light-260.png',
    'img/brand/logo-light-520.png',
  ]) {
    const body = readFileSync(join(SRC, 'assets', rel));
    const hash = createHash('sha256').update(body).digest('hex').slice(0, 10);
    const ext = rel.slice(rel.lastIndexOf('.'));
    const hashed = `${rel.slice(0, -ext.length)}.${hash}${ext}`;
    const dest = join(OUT, 'assets', hashed);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, body);
    map[rel] = `/assets/${hashed}`;
  }
  return map;
}

function crumbs(route, trail) {
  return { ...schema.breadcrumbNode(ORIGIN, trail), '@id': `${ORIGIN}${route}#breadcrumb` };
}

/* -------------------------------------------------------------------- build */

validateContent();
if (problems.length) {
  console.error('Content validation failed:\n' + problems.map((p) => `  - ${p}`).join('\n'));
  process.exit(1);
}

// The output tree must be cleared first: both fingerprint passes write hashed copies
// into it, and wiping afterwards would silently drop every file the HTML points at.
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const fingerprints = fingerprintAssets();
const manifest = buildImageManifest();
const prices = loadPrices();
const reviews = loadReviews();
const cases = loadCases();
const ctx = { manifest, services, doctors, articles, prices, categories, reviews, cases };

const clinic = schema.clinicNode(ORIGIN, { rating: reviews.aggregateRating });
const physicians = doctors.map((d) =>
  schema.physicianNode(ORIGIN, d.chief ? { ...d, knowsAbout: chief.knowsAbout } : d)
);

/* home */
{
  const route = '/';
  const title = 'Виниры и эстетика зубов в Бишкеке — Expert Dental Studio';
  const description =
    'Виниры и эстетическая реставрация в Бишкеке. Цифровая примерка улыбки — 0 сом: показываем вариант формы на экране до обточки. Керамические виниры E-max, отбеливание, гнатология.';
  page({
    route,
    title,
    description,
    pageId: 'home',
    waMessage: 'Здравствуйте. Пишу с сайта Expert Dental Studio, хочу записаться на диагностику.',
    body: pages.homePage(ctx),
    nodes: [
      clinic,
      ...physicians,
      schema.webPageNode(ORIGIN, { url: route, title, description, breadcrumb: false }),
      schema.faqNode(homeContent.faq),
    ],
  });
}

/* services */
{
  const route = '/services/';
  const title = 'Услуги и цены — Expert Dental Studio, Бишкек';
  const description =
    'Полный перечень услуг и актуальный прайс стоматологии Expert Dental Studio: диагностика, терапия, эндодонтия, хирургия, имплантация, ортопедия, ортодонтия, детский приём и гигиена.';
  page({
    route,
    title,
    description,
    pageId: 'services',
    waMessage: 'Здравствуйте. Смотрю раздел «Услуги и цены» и хочу уточнить стоимость лечения.',
    body: pages.servicesIndexPage(ctx),
    nodes: [
      clinic,
      schema.webPageNode(ORIGIN, { url: route, title, description }),
      crumbs(route, [
        { href: '/', label: 'Главная' },
        { href: route, label: 'Услуги и цены' },
      ]),
    ],
  });
}

for (const service of services) {
  const route = `/services/${service.slug}/`;
  const socialImage = manifest[service.image];
  page({
    route,
    title: service.metaTitle,
    description: service.metaDescription,
    pageId: `service-${service.slug}`,
    waMessage: `Здравствуйте. Смотрю страницу «${service.navLabel}» и хочу записаться на консультацию.`,
    ogImage: `/assets/img/${service.image}.jpg`,
    ogImageWidth: socialImage?.width,
    ogImageHeight: socialImage?.height,
    ogImageAlt: service.imageAlt,
    body: pages.servicePage({ ...ctx, service }),
    nodes: [
      clinic,
      schema.serviceNode(ORIGIN, service),
      schema.webPageNode(ORIGIN, {
        url: route,
        title: service.metaTitle,
        description: service.metaDescription,
        medical: true,
      }),
      crumbs(route, [
        { href: '/', label: 'Главная' },
        { href: '/services/', label: 'Услуги и цены' },
        { href: route, label: service.navLabel },
      ]),
      schema.faqNode(service.faq),
      ...service.doctors.map((s) => physicians.find((p) => p['@id'].includes(`/doctors/${s}/`))),
    ],
  });
}

/* doctors */
{
  const route = '/doctors/';
  const title = 'Врачи Expert Dental Studio — стоматологи в Бишкеке';
  const description =
    'Восемь врачей клиники Expert Dental Studio: ортодонт-гнатолог, хирург-имплантолог, ортопеды, терапевты, гигиенист и детский стоматолог. Направления, методы и запись на приём.';
  page({
    route,
    title,
    description,
    pageId: 'doctors',
    waMessage: 'Здравствуйте. Смотрю раздел «Врачи» и хочу подобрать специалиста.',
    body: pages.doctorsIndexPage(ctx),
    nodes: [
      clinic,
      ...physicians,
      schema.webPageNode(ORIGIN, { url: route, title, description }),
      crumbs(route, [
        { href: '/', label: 'Главная' },
        { href: route, label: 'Врачи' },
      ]),
    ],
  });
}

for (const doctor of doctors) {
  const route = `/doctors/${doctor.slug}/`;
  const isChief = Boolean(doctor.chief);
  // Patronymics blow the 65-char title budget, so meta uses surname + given name.
  const metaName = doctor.name.split(' ').slice(0, 2).join(' ');
  const title = isChief ? chief.metaTitle : `${metaName} — ${doctor.metaRole} | Expert Dental`;
  const description = isChief
    ? chief.metaDescription
    : `${doctor.name} — ${doctor.metaRole} Expert Dental Studio в Бишкеке. ${doctor.specialtyLine}. Запись на приём.`;
  const socialImage = doctor.photo ? manifest[doctor.photo] : null;
  page({
    route,
    title,
    description,
    pageId: isChief ? 'chief' : `doctor-${doctor.slug}`,
    waMessage: `Здравствуйте. Смотрю страницу врача ${doctor.name} и хочу записаться на приём.`,
    ogType: 'profile',
    ogImage: doctor.photo ? `/assets/img/${doctor.photo}.jpg` : undefined,
    ogImageWidth: socialImage?.width,
    ogImageHeight: socialImage?.height,
    ogImageAlt: doctor.photoAlt,
    body: isChief ? pages.chiefPage({ ...ctx, doctor }) : pages.doctorPage({ ...ctx, doctor }),
    nodes: [
      clinic,
      physicians.find((p) => p['@id'].includes(`/doctors/${doctor.slug}/`)),
      schema.webPageNode(ORIGIN, { url: route, title, description }),
      crumbs(route, [
        { href: '/', label: 'Главная' },
        { href: '/doctors/', label: 'Врачи' },
        { href: route, label: isChief ? 'Главный врач' : doctor.name },
      ]),
    ],
  });
}

/* blog */
{
  const route = '/blog/';
  const title = 'Блог о стоматологии — Expert Dental Studio, Бишкек';
  const description =
    'Статьи врачей Expert Dental Studio о лечении зубов, детской стоматологии, винирах и сохранении зубов. Понятно о диагностике, методах лечения и стоимости.';
  page({
    route,
    title,
    description,
    pageId: 'blog',
    waMessage: 'Здравствуйте. Читаю блог Expert Dental Studio и хочу записаться на консультацию.',
    body: pages.blogIndexPage(ctx),
    nodes: [
      clinic,
      {
        '@type': 'Blog',
        '@id': `${ORIGIN}/blog/#blog`,
        name: `Блог ${brand.name}`,
        url: `${ORIGIN}/blog/`,
        inLanguage: 'ru',
        publisher: { '@id': schema.organisationId(ORIGIN) },
        blogPost: articles.map((a) => ({ '@id': `${ORIGIN}/blog/${a.slug}/#article` })),
      },
      schema.webPageNode(ORIGIN, { url: route, title, description }),
      crumbs(route, [
        { href: '/', label: 'Главная' },
        { href: route, label: 'Блог' },
      ]),
    ],
  });
}

for (const category of Object.values(categories)) {
  const route = `/blog/${category.slug}/`;
  const items = articles.filter((a) => a.category === category.id);
  const title = `${category.label} — блог Expert Dental Studio`;
  const description = `${category.blurb}. Статьи врачей Expert Dental Studio в Бишкеке по теме «${category.label.toLowerCase()}».`;
  page({
    route,
    title,
    description,
    pageId: `blog-${category.id}`,
    waMessage: `Здравствуйте. Читаю раздел блога «${category.label}» и хочу задать вопрос врачу.`,
    body: pages.blogCategoryPage({ ...ctx, category, articles: items }),
    nodes: [
      clinic,
      schema.webPageNode(ORIGIN, { url: route, title, description }),
      crumbs(route, [
        { href: '/', label: 'Главная' },
        { href: '/blog/', label: 'Блог' },
        { href: route, label: category.label },
      ]),
      {
        '@type': 'ItemList',
        itemListElement: items.map((a, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${ORIGIN}/blog/${a.slug}/`,
          name: a.title,
        })),
      },
    ],
  });
}

for (const article of articles) {
  const route = `/blog/${article.slug}/`;
  const author = doctorBySlug.get(article.author);
  const reviewer = doctorBySlug.get(article.reviewer);
  const category = categories[article.category];
  const socialImage = manifest[article.cover];
  page({
    route,
    title: article.metaTitle,
    description: article.metaDescription,
    pageId: `article-${article.slug}`,
    waMessage: `Здравствуйте. Прочитал статью «${article.title}» и хочу записаться на консультацию.`,
    ogType: 'article',
    ogImage: `/assets/img/${article.cover}.jpg`,
    ogImageWidth: socialImage?.width,
    ogImageHeight: socialImage?.height,
    ogImageAlt: article.coverAlt,
    body: pages.articlePage({ ...ctx, article, author, reviewer, category }),
    nodes: [
      clinic,
      schema.articleNode(ORIGIN, article, { author, reviewer, category }),
      physicians.find((p) => p['@id'].includes(`/doctors/${author.slug}/`)),
      physicians.find((p) => p['@id'].includes(`/doctors/${reviewer.slug}/`)),
      crumbs(route, [
        { href: '/', label: 'Главная' },
        { href: '/blog/', label: 'Блог' },
        { href: `/blog/${category.slug}/`, label: category.label },
        { href: route, label: article.title },
      ]),
      schema.faqNode(article.faq),
    ],
  });
}

/* static */
{
  const about = {
    route: '/about/',
    title: 'О клинике Expert Dental Studio — стоматология в Бишкеке',
    description:
      'Expert Dental Studio: команда из восьми врачей, диагностика на месте, единый план лечения и один источник цен. Адрес, часы работы и интерьер клиники.',
  };
  page({
    ...about,
    pageId: 'about',
    waMessage: 'Здравствуйте. Читаю страницу «О клинике» и хочу записаться на приём.',
    body: pages.aboutPage(ctx),
    nodes: [
      clinic,
      schema.webPageNode(ORIGIN, { url: about.route, title: about.title, description: about.description }),
      crumbs(about.route, [
        { href: '/', label: 'Главная' },
        { href: about.route, label: 'О клинике' },
      ]),
    ],
  });

  const contactsPage = {
    route: '/contacts/',
    title: 'Контакты Expert Dental Studio — Бишкек, Киевская 88',
    description: `Адрес: ${contacts.addressFull}. Телефон и WhatsApp: ${contacts.phoneDisplay}. ${contacts.hoursDisplay}. ${contacts.parking}.`,
  };
  page({
    ...contactsPage,
    pageId: 'contacts',
    waMessage: 'Здравствуйте. Нашёл контакты на сайте и хочу записаться на приём.',
    body: pages.contactsPage(ctx),
    nodes: [
      clinic,
      schema.webPageNode(ORIGIN, {
        url: contactsPage.route,
        title: contactsPage.title,
        description: contactsPage.description,
      }),
      crumbs(contactsPage.route, [
        { href: '/', label: 'Главная' },
        { href: contactsPage.route, label: 'Контакты' },
      ]),
    ],
  });

  for (const kind of ['privacy', 'legal']) {
    const route = `/${kind}/`;
    const title =
      kind === 'privacy'
        ? 'Политика конфиденциальности — Expert Dental Studio'
        : 'Правовая информация — Expert Dental Studio';
    const description =
      kind === 'privacy'
        ? 'Как Expert Dental Studio обрабатывает персональные данные пациентов, что относится к врачебной тайне и какие данные собирает аналитика сайта.'
        : 'Правовая информация Expert Dental Studio: лицензия, статус информации на сайте, оговорка о ценах, противопоказания и права на материалы.';
    page({
      route,
      title,
      description,
      pageId: kind,
      waMessage: 'Здравствуйте. Читаю правовой раздел сайта, есть вопрос по записи и приёму.',
      body: pages.legalPage({ kind }),
      nodes: [
        clinic,
        schema.webPageNode(ORIGIN, { url: route, title, description }),
        crumbs(route, [
          { href: '/', label: 'Главная' },
          { href: route, label: title.split(' —')[0] },
        ]),
      ],
    });
  }
}

/* 404 + internal pending report */
writeFileSync(
  join(OUT, '404.html'),
  layout.document({
    host: HOST,
    url: '/404/',
    title: 'Страница не найдена — Expert Dental Studio',
    description:
      'Запрошенная страница Expert Dental Studio не найдена. Перейдите к услугам, врачам или контактам стоматологической клиники в Бишкеке.',
    robotsOverride: 'noindex,follow',
    body: pages.notFoundPage(),
    schema: schema.graph(ORIGIN, [clinic]),
    pageId: '404',
    waMessage: 'Здравствуйте. Не нашёл нужную страницу на сайте — подскажите, пожалуйста.',
    assets: fingerprints,
  }),
  'utf8'
);

emit(
  '/internal/pending/',
  layout.document({
    host: 'staging',
    url: '/internal/pending/',
    title: 'Ожидаемые материалы — служебная страница',
    description:
      'Служебный перечень материалов и подтверждений, которые клиника должна предоставить до переноса сайта на основной домен.',
    robotsOverride: 'noindex,nofollow,noarchive,nosnippet',
    body: pages.pendingPage(),
    schema: schema.graph(ORIGIN, []),
    pageId: 'internal',
    waMessage: 'Здравствуйте. Пишу по служебной странице сайта Expert Dental Studio.',
    assets: fingerprints,
  })
);

/* ------------------------------------------------------------------ assets */

cpSync(join(SRC, 'assets'), join(OUT, 'assets'), { recursive: true });

// Favicon: the brand arch reduced to a single mark, so no extra binary to maintain.
writeFileSync(
  join(OUT, 'assets', 'img', 'brand', 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="5" fill="#1e3a32"/><path d="M16 6c-4.4 0-8 3.6-8 8v12h5V14a3 3 0 0 1 6 0v12h5V14c0-4.4-3.6-8-8-8Z" fill="#d9c49a"/></svg>`,
  'utf8'
);

/* -------------------------------------------------------- sitemap / robots */

const routes = [...written.keys()].filter((r) => !r.startsWith('/internal/'));

const priorityOf = (r) => {
  if (r === '/') return '1.0';
  if (r === '/services/' || r === '/doctors/' || r === '/blog/') return '0.9';
  if (r.startsWith('/services/') || r.startsWith('/doctors/')) return '0.8';
  if (r.startsWith('/blog/')) return '0.7';
  return '0.4';
};

const lastmodOf = (r) => {
  const slug = r.match(/^\/blog\/([^/]+)\/$/)?.[1];
  return articleBySlug.get(slug)?.updated ?? new Date().toISOString().slice(0, 10);
};

writeFileSync(
  join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .sort()
  .map(
    (r) =>
      `  <url><loc>${ORIGIN}${r}</loc><lastmod>${lastmodOf(r)}</lastmod><priority>${priorityOf(r)}</priority></url>`
  )
  .join('\n')}
</urlset>
`,
  'utf8'
);

writeFileSync(
  join(OUT, 'robots.txt'),
  // /feedback/ is the Review Hub: a per-patient token surface that must never be indexed
  // on either host, including after the production cutover.
  hosts[HOST].indexable
    ? `User-agent: *\nAllow: /\nDisallow: /internal/\nDisallow: /feedback/\n\nSitemap: ${ORIGIN}/sitemap.xml\n`
    : `User-agent: *\nDisallow: /\n`,
  'utf8'
);

/* ---------------------------------------------------------------- redirects */

// Emitted as an nginx map so the same file drives both hosts and legacy Tilda URLs.
// Covers every URL in the expertdental.kg sitemap that does not survive the move;
// same-slug pages (/contacts, /services, /blog/*) are handled by nginx trailing-slash
// normalisation, so listing them here would be dead weight.
const legacy = {
  ...serviceRedirects,
  '/expertdentalkg': '/',
  '/expertdentalkg/': '/',
  '/price': '/services/',
  '/price/': '/services/',
  '/doctors/gribanova-marina': '/doctors/gribanova-marina/',
  // Tilda draft duplicate of the front page.
  '/home-new': '/',
  '/home-new/': '/',
  // Tilda's misspelt "cases" page; the new site shows work in the homepage block.
  '/kaces': '/#work',
  '/kaces/': '/#work',
};

writeFileSync(
  join(OUT, 'redirects.map'),
  Object.entries(legacy)
    .map(([from, to]) => `${from} ${to};`)
    .join('\n') + '\n',
  'utf8'
);

/* ------------------------------------------------------------- link checker */

const known = new Set(routes.map((r) => r));
known.add('/internal/pending/');

for (const [route, html] of written) {
  for (const m of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    const href = m[1];
    if (href.startsWith('/assets/')) {
      if (!existsSync(join(OUT, href.slice(1)))) fail(`${route}: missing asset ${href}`);
      continue;
    }
    if (!known.has(href)) fail(`${route}: dead internal link ${href}`);
  }
}

if (problems.length) {
  console.error('Build validation failed:\n' + problems.map((p) => `  - ${p}`).join('\n'));
  process.exit(1);
}

/* -------------------------------------------------------------------- done */

const bytes = (dir) =>
  readdirSync(dir, { withFileTypes: true }).reduce(
    (sum, e) => sum + (e.isDirectory() ? bytes(join(dir, e.name)) : statSync(join(dir, e.name)).size),
    0
  );

console.log(`host      ${HOST} (${ORIGIN}, ${hosts[HOST].indexable ? 'indexable' : 'noindex'})`);
console.log(`routes    ${routes.length}`);
console.log(`articles  ${articles.length} · services ${services.length} · doctors ${doctors.length}`);
console.log(`output    ${OUT}`);
console.log(`size      ${(bytes(OUT) / 1024 / 1024).toFixed(2)} MB`);
