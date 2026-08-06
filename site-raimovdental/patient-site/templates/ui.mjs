/**
 * Shared rendering primitives for the Expert Dental Studio patient site.
 *
 * Plain template literals, no framework: the output is static HTML and the whole point
 * of the stack is that a page weighs almost nothing on a mobile connection in Bishkek.
 */

import { brand, contacts, cta, nav, footerNav } from '../config/site.mjs';

/* ------------------------------------------------------------------ escaping */

export function esc(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function attr(value = '') {
  return esc(value);
}

/* -------------------------------------------------------------- inline markup */

/**
 * Renders the restricted inline syntax used in content modules:
 *   **bold**, [label](/internal/), [label](ref:source-id), [label](https://external)
 * Everything else is escaped. `refs` is the reference registry; `used` collects the
 * reference ids encountered so the article can print a numbered source list.
 */
export function inline(text = '', { refs = {}, used = null } = {}) {
  let html = esc(text);

  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => {
    if (href.startsWith('ref:')) {
      const id = href.slice(4);
      const ref = refs[id];
      if (!ref) throw new Error(`Unknown reference id "${id}" in copy: ${text.slice(0, 60)}`);
      if (used && !used.includes(id)) used.push(id);
      const index = used ? used.indexOf(id) + 1 : '';
      return `<a href="${attr(ref.url)}" target="_blank" rel="noopener nofollow" hreflang="${attr(
        ref.lang
      )}">${label}</a><sup class="t-small">${index}</sup>`;
    }
    if (/^https?:/.test(href)) {
      return `<a href="${attr(href)}" target="_blank" rel="noopener nofollow">${label}</a>`;
    }
    return `<a href="${attr(href)}">${label}</a>`;
  });

  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  return html;
}

/* -------------------------------------------------------------------- images */

/**
 * Responsive <img> from the generated variant manifest.
 * `manifest` maps a base name ("clinic/reception") to the widths available on disk.
 */
export function image(manifest, name, alt, { sizes = '100vw', loading = 'lazy', className = '', priority = false } = {}) {
  const entry = manifest[name];
  if (!entry) throw new Error(`Missing image asset: ${name}`);
  const src = `/assets/img/${name}.jpg`;
  const srcset = entry.variants.map((v) => `${v.src} ${v.width}w`).join(', ');
  return `<img src="${attr(src)}" srcset="${attr(srcset)}" sizes="${attr(sizes)}" width="${entry.width}" height="${
    entry.height
  }" alt="${attr(alt)}"${className ? ` class="${attr(className)}"` : ''} loading="${
    priority ? 'eager' : loading
  }" decoding="${priority ? 'sync' : 'async'}"${priority ? ' fetchpriority="high"' : ''}>`;
}

export function archImage(manifest, name, alt, opts = {}) {
  const { modifier = '', ...rest } = opts;
  return `<div class="arch${modifier ? ` ${modifier}` : ''}">${image(manifest, name, alt, rest)}</div>`;
}

/* ----------------------------------------------------------------- CTA links */

export function waHref(message) {
  return `https://wa.me/${contacts.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function telHref() {
  return `tel:${contacts.phone}`;
}

export function ctaPair({ context = '', message, primaryLabel = cta.primary, onDark = false } = {}) {
  const msg = message || 'Здравствуйте. Хочу записаться на диагностику в Expert Dental Studio.';
  return `<div class="btn-row">
      <a class="btn ${onDark ? 'btn--onDark' : 'btn--primary'}" href="${attr(waHref(msg))}" data-cta-context="${attr(
    context
  )}">${esc(primaryLabel)}</a>
      <a class="btn ${onDark ? 'btn--ghostDark' : 'btn--ghost'}" href="${attr(telHref())}" data-cta-context="${attr(
    context
  )}">${esc(cta.call)} ${esc(contacts.phoneDisplay)}</a>
    </div>`;
}

export function ctaBand({ title, text, context = '', message } = {}) {
  return `<section class="section section--tight" aria-labelledby="cta-band-title">
    <div class="shell">
      <div class="cta-band">
        <div>
          <h2 class="cta-band__title" id="cta-band-title">${esc(title)}</h2>
          <p class="cta-band__text">${esc(text)}</p>
        </div>
        ${ctaPair({ context, message, onDark: true })}
      </div>
    </div>
  </section>`;
}

/* -------------------------------------------------------------- breadcrumbs */

export function breadcrumbs(trail) {
  const items = trail
    .map((c, i) =>
      i === trail.length - 1
        ? `<li aria-current="page">${esc(c.label)}</li>`
        : `<li><a href="${attr(c.href)}">${esc(c.label)}</a></li>`
    )
    .join('');
  return `<nav aria-label="Хлебные крошки"><ol class="breadcrumbs">${items}</ol></nav>`;
}

/* ----------------------------------------------------------------------- FAQ */

export function faqBlock(items, { idPrefix = 'faq', title = 'Частые вопросы', refs = {} } = {}) {
  if (!items?.length) return '';
  const rows = items
    .map((item, i) => {
      const qId = `${idPrefix}-q-${i}`;
      const aId = `${idPrefix}-a-${i}`;
      return `<div class="faq__item">
        <h3 style="margin:0">
          <button class="faq__q" id="${qId}" aria-expanded="true" aria-controls="${aId}" type="button">
            <span>${esc(item.q)}</span>
          </button>
        </h3>
        <div class="faq__a" id="${aId}" role="region" aria-labelledby="${qId}"><p>${inline(item.a, { refs })}</p></div>
      </div>`;
    })
    .join('');
  return `<div class="stack" style="--stack-gap:1.25rem">
      ${title ? `<h2 class="display t-h2">${esc(title)}</h2>` : ''}
      <div class="faq" data-faq>${rows}</div>
    </div>`;
}

/* ------------------------------------------------------------------- prices */

export function priceRows(rows) {
  return rows
    .map(
      (r) => `<div class="price-row">
      <div class="price-row__name">${esc(r.name)}</div>
      <div class="price-row__value">${esc(r.price)}</div>
      ${r.includes && r.includes !== '—' ? `<p class="price-row__includes">${esc(r.includes)}</p>` : ''}
    </div>`
    )
    .join('');
}

export function priceBlock({ title, rows, note }) {
  if (!rows.length) return '';
  return `<div class="price-block">
    <div class="price-block__head">
      <h3 class="display t-h3">${esc(title)}</h3>
      ${note ? `<p class="t-small t-mute">${esc(note)}</p>` : ''}
    </div>
    ${priceRows(rows)}
  </div>`;
}

/* -------------------------------------------------------------------- cards */

export function doctorCard(manifest, doctor) {
  const photo = doctor.photo
    ? image(manifest, doctor.photo, doctor.photoAlt, { sizes: '(min-width: 62rem) 20vw, 45vw' })
    : `<div class="monogram" role="img" aria-label="${attr(doctor.photoAlt)}">${esc(initials(doctor.name))}</div>`;
  return `<a class="doctor-card" href="/doctors/${attr(doctor.slug)}/">
    <div class="doctor-card__photo">${photo}</div>
    <div>
      <div class="doctor-card__name">${esc(doctor.name)}</div>
      <div class="doctor-card__role">${esc(doctor.role)}</div>
    </div>
  </a>`;
}

export function initials(fullName) {
  const parts = fullName.split(/\s+/);
  return `${parts[1]?.[0] ?? ''}${parts[0]?.[0] ?? ''}`.toUpperCase();
}

export function postCard(manifest, article, categories, { feature = false } = {}) {
  const cat = categories[article.category];
  return `<a class="post-card${feature ? ' post-card--feature' : ''}" href="/blog/${attr(article.slug)}/">
    <div class="post-card__media">${image(manifest, article.cover, article.coverAlt, {
      sizes: feature ? '(min-width: 52rem) 55vw, 92vw' : '(min-width: 62rem) 30vw, 92vw',
    })}</div>
    <div class="stack" style="--stack-gap:.55rem">
      <span class="post-card__cat">${esc(cat.label)}</span>
      <h3 class="post-card__title">${esc(article.title)}</h3>
      <p class="card__text">${esc(article.excerpt)}</p>
      <p class="post-card__meta">${article.readingTime} мин чтения · обновлено ${formatDate(article.updated)}</p>
    </div>
  </a>`;
}

export function formatDate(iso) {
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
  ];
  const d = new Date(`${iso}T00:00:00Z`);
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/* -------------------------------------------------------------------- shell */

function navLinks(list) {
  return list.map((n) => `<a href="${attr(n.href)}">${esc(n.label)}</a>`).join('');
}

export function header() {
  return `<header class="masthead">
    <div class="shell masthead__bar">
      <a class="brandmark" href="/" aria-label="${attr(`${brand.name} — на главную`)}">
        <span class="brandmark__word">Expert</span>
        <span class="brandmark__sub">Dental Studio</span>
      </a>
      <nav class="nav" aria-label="Основная навигация">${navLinks(nav)}</nav>
      <div class="masthead__actions">
        <a class="masthead__phone" href="${attr(telHref())}">${esc(contacts.phoneDisplay)}</a>
        <button class="burger" type="button" data-drawer-toggle aria-expanded="false" aria-controls="site-drawer">
          <span class="burger__icon" aria-hidden="true"></span>Меню
        </button>
      </div>
    </div>
    <div class="drawer" id="site-drawer" data-drawer data-open="false">
      <div class="shell">
        ${navLinks(nav)}
        <div class="btn-row mt-2">
          <a class="btn btn--primary" href="${attr(
            waHref('Здравствуйте. Хочу записаться на приём в Expert Dental Studio.')
          )}" data-cta-context="drawer">${esc(cta.whatsapp)}</a>
        </div>
      </div>
    </div>
  </header>`;
}

export function footer() {
  const cols = footerNav
    .map(
      (col) => `<div>
        <div class="colophon__title">${esc(col.title)}</div>
        <ul>${col.links.map((l) => `<li><a href="${attr(l.href)}">${esc(l.label)}</a></li>`).join('')}</ul>
      </div>`
    )
    .join('');

  return `<footer class="colophon">
    <div class="shell">
      <div class="colophon__grid">
        <div>
          <div class="colophon__title">${esc(brand.name)}</div>
          <p style="margin-bottom:1rem">${esc(brand.legalNote)}. ${esc(contacts.hoursDisplay)}.</p>
          <ul>
            <li><a href="${attr(telHref())}">${esc(contacts.phoneDisplay)}</a></li>
            <li><a href="${attr(
              waHref('Здравствуйте. Пишу с сайта Expert Dental Studio.')
            )}">${esc(cta.whatsapp)}</a></li>
            <li>${esc(contacts.addressFull)}</li>
          </ul>
        </div>
        ${cols}
      </div>
      <div class="colophon__bottom">
        <span>© ${new Date().getFullYear()} ${esc(brand.name)}</span>
        <span>Информация на сайте не является медицинской консультацией и не заменяет очный приём.</span>
      </div>
    </div>
  </footer>`;
}

export function actionBar(context = '') {
  return `<div class="action-bar">
    <a href="${attr(waHref('Здравствуйте. Хочу записаться на приём в Expert Dental Studio.'))}" data-cta-context="${attr(
    `sticky-${context}`
  )}">${esc(cta.whatsapp)}</a>
    <a href="${attr(telHref())}" data-cta-context="${attr(`sticky-${context}`)}">Позвонить</a>
  </div>`;
}
