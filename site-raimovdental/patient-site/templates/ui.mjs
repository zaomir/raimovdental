/**
 * Shared rendering primitives for the Expert Dental Studio patient site.
 *
 * Plain template literals, no framework: the output is static HTML and the whole point
 * of the stack is that a page weighs almost nothing on a mobile connection in Bishkek.
 */

import { brand, contacts, cta, nav, footerNav, maps, social } from '../config/site.mjs';

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

/* -------------------------------------------------------------------- prices */

/**
 * Replaces every `{{price:sku}}` token with the figure from PRICE_CATALOG.json.
 * Copy modules never carry a typed price, so the page and the catalog cannot disagree.
 * An unknown SKU throws: a broken build is cheaper than a wrong price on a medical site.
 */
export function money(text = '', prices) {
  return String(text).replace(/\{\{price:([a-z0-9-]+)\}\}/gi, (_m, sku) => {
    const item = prices?.bySku?.[sku];
    if (!item) throw new Error(`Unknown price SKU "${sku}" in copy: ${String(text).slice(0, 70)}`);
    return item.price;
  });
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
  const src = entry.variants[entry.variants.length - 1].src;
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

/** The arch is the clinic's interior motif; faces get a plain frame instead. */
export function portraitImage(manifest, name, alt, opts = {}) {
  const { modifier = '', ...rest } = opts;
  return `<div class="portrait${modifier ? ` ${modifier}` : ''}">${image(manifest, name, alt, rest)}</div>`;
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

/* ------------------------------------------------------- home page primitives */

/**
 * A reviewed passage that protects the clinic. Rendered at body size with a visible rule —
 * never small print, never inside a collapsed accordion. See content/homepage.mjs.
 */
export function lockedNote(note, prices, { title = '', onDark = false } = {}) {
  if (!note) return '';
  const heading = title || note.title || '';
  return `<div class="note-locked${onDark ? ' note-locked--onDark' : ''}">
    ${heading ? `<strong class="note-locked__title">${esc(heading)}</strong> ` : ''}
    <span>${inline(money(note.text, prices))}</span>
  </div>`;
}

export function trustStrip({ stats, infrastructure }, prices, { license, since } = {}) {
  const cells = stats
    .map((s) => {
      const value = s.source
        ? `<a href="${attr(maps[s.source])}" target="_blank" rel="noopener nofollow"
             data-cta-context="trust-rating" data-event="reviews_outbound_click">${esc(s.value)}</a>`
        : esc(s.value);
      return `<div class="trust__cell">
        <div class="trust__value numeral">${value}</div>
        <div class="trust__label">${esc(s.label)}</div>
      </div>`;
    })
    .join('');
  const meta = [license, since, infrastructure].filter(Boolean).map(esc).join(' · ');
  return `<section class="trust" aria-label="Клиника в цифрах">
    <div class="shell">
      <div class="trust__grid">${cells}</div>
      ${meta ? `<p class="trust__meta">${money(meta, prices)}</p>` : ''}
    </div>
  </section>`;
}

/**
 * The router: one actionable row per way a patient arrives. Each row opens WhatsApp with its
 * own draft; the direction link beside it is a sibling, never nested inside the row link,
 * so the markup stays valid and both targets are reachable by keyboard.
 */
export function routerTable(rows, prices, services) {
  const items = rows
    .map((r, i) => {
      const service = services?.find((s) => `/services/${s.slug}/` === r.href);
      return `<li class="router__row${r.highlight ? ' router__row--lead' : ''}">
        <a class="router__link" href="${attr(waHref(r.wa))}"
           data-cta-context="router-${i}" data-event="router_row_click">
          <span class="router__situation">${esc(r.situation)}</span>
          <span class="router__step">${esc(r.step)}</span>
          <span class="router__price${r.free ? ' router__price--free' : ''}">${esc(
        money(r.price, prices)
      )}${r.free ? '<span class="router__free-mark" aria-hidden="true">✓</span>' : ''}</span>
        </a>
        ${
          service
            ? `<a class="router__more" href="${attr(r.href)}">
                 <span class="visually-hidden">${esc(r.situation)}: </span>о направлении</a>`
            : ''
        }
      </li>`;
    })
    .join('');
  return `<ul class="router" role="list">${items}</ul>`;
}

/** Four-column comparison that becomes stacked blocks under 46rem via `data-label`. */
export function methodsTable({ columns, rows }, prices) {
  const head = columns.map((c) => `<th scope="col">${esc(c)}</th>`).join('');
  const body = rows
    .map((r) => {
      const name = r.href
        ? `<a href="${attr(r.href)}">${esc(r.method)}</a>`
        : esc(r.method);
      return `<tr${r.highlight ? ' class="is-lead"' : ''}>
        <th scope="row" data-label="${attr(columns[0])}">${name}</th>
        <td data-label="${attr(columns[1])}">${esc(r.task)}</td>
        <td data-label="${attr(columns[2])}"><span class="tag tag--${attr(
        reversibilityTone(r.reversibility)
      )}">${esc(r.reversibility)}</span></td>
        <td data-label="${attr(columns[3])}" class="numeral">${esc(money(r.price, prices))}</td>
      </tr>`;
    })
    .join('');
  return `<div class="table-wrap" tabindex="0" role="region"
    aria-label="Сравнение методов лечения"><table class="cmp">
    <thead><tr>${head}</tr></thead>
    <tbody>${body}</tbody>
  </table></div>`;
}

function reversibilityTone(value) {
  if (/^полная/i.test(value)) return 'ok';
  if (/^условная/i.test(value)) return 'warn';
  return 'stop';
}

export function reviewCard(review) {
  const paras = String(review.quote)
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${esc(p)}</p>`)
    .join('');
  return `<figure class="review">
    <blockquote class="review__quote">${paras}</blockquote>
    <figcaption class="review__meta">
      ${review.authorDisplay ? `<span class="review__author">${esc(review.authorDisplay)}</span>` : ''}
      <a href="${attr(review.sourceUrl || maps.twoGisReviews)}" target="_blank" rel="noopener nofollow"
         data-event="reviews_outbound_click" data-cta-context="review-card">Отзыв на 2ГИС</a>
    </figcaption>
  </figure>`;
}

/**
 * Booking form. There is no server: the form composes a WhatsApp message from the fields.
 * The inputs carry no `name`, so without JavaScript the form still submits to wa.me with the
 * default draft in the hidden `text` field and the patient types the rest.
 */
export function bookingForm({ fields, submitLabel, note }, defaultMessage) {
  const inputs = fields
    .map((f) => {
      const id = `book-${f.name}`;
      const label = `<label class="field__label" for="${attr(id)}">${esc(f.label)}${
        f.optional ? ' <span class="field__hint">(необязательно)</span>' : ''
      }</label>`;
      const control =
        f.type === 'textarea'
          ? `<textarea class="field__control" id="${attr(id)}" rows="3" data-book-field="${attr(
              f.name
            )}"${f.required ? ' required' : ''}></textarea>`
          : `<input class="field__control" id="${attr(id)}" type="${attr(f.type)}" data-book-field="${attr(
              f.name
            )}" autocomplete="${attr(f.autocomplete || 'off')}"${f.required ? ' required' : ''}>`;
      return `<div class="field">${label}${control}</div>`;
    })
    .join('');

  return `<form class="book-form" method="get" action="https://wa.me/${attr(contacts.whatsapp)}"
      data-book-form target="_blank" rel="noopener">
    <input type="hidden" name="text" value="${attr(defaultMessage)}" data-book-text>
    ${inputs}
    <button class="btn btn--primary btn--wide" type="submit"
      data-cta-context="home-form" data-event="form_submit">${esc(submitLabel)}</button>
    ${note ? `<p class="book-form__note">${esc(note)}</p>` : ''}
  </form>`;
}

/* -------------------------------------------------------------------- cards */

/**
 * A doctor card answers the three questions a patient actually has before choosing:
 * what this doctor treats, what the first visit costs, and how to reach them. `context`
 * and `topic` shape the WhatsApp draft so the message names the page the patient came
 * from — an administrator reading it knows the case before replying.
 */
export function doctorCard(manifest, doctor, { prices, services, context = 'doctors', topic = '' } = {}) {
  const photo = doctor.photo
    ? image(manifest, doctor.photo, doctor.photoAlt, { sizes: '(min-width: 62rem) 20vw, 45vw' })
    : `<div class="monogram" role="img" aria-label="${attr(doctor.photoAlt)}">${esc(initials(doctor.name))}</div>`;

  const consultation = prices?.consultationByTier?.[doctor.consultationTier];
  const treats = (doctor.treats ?? []).slice(0, 3);
  const facts = doctor.facts ?? [];
  // "Направление" repeats the role line; the rest of the facts are the parts a patient
  // weighs when choosing — who the doctor sees and how long they have been practising.
  const audience = facts.find((f) => f.label === 'Приём')?.value;
  const credentials = facts.filter((f) => !['Направление', 'Приём'].includes(f.label)).map((f) => f.value);
  const directions = (doctor.services ?? [])
    .map((id) => services?.find((s) => s.slug === id))
    .filter(Boolean)
    .slice(0, 3);

  const message = topic
    ? `Здравствуйте. Хочу записаться к врачу ${doctor.name} — «${topic}».`
    : `Здравствуйте. Хочу записаться к врачу ${doctor.name} (${doctor.role.toLowerCase()}).`;

  return `<article class="doctor-card">
    <a class="doctor-card__photo" href="/doctors/${attr(doctor.slug)}/" tabindex="-1" aria-hidden="true">${photo}</a>
    <div class="doctor-card__body">
      <h3 class="doctor-card__name"><a href="/doctors/${attr(doctor.slug)}/">${esc(doctor.name)}</a></h3>
      <p class="doctor-card__role">${esc(doctor.role)}</p>
      ${audience ? `<p class="doctor-card__audience">Принимает: ${esc(audience.toLowerCase())}</p>` : ''}
      ${
        treats.length
          ? `<ul class="doctor-card__treats">${treats.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`
          : ''
      }
      ${credentials.length ? `<p class="doctor-card__meta">${esc(credentials.join(' · '))}</p>` : ''}
      ${
        directions.length
          ? `<p class="doctor-card__meta">Направления: ${directions
              .map((s) => `<a href="/services/${attr(s.slug)}/">${esc(lowerFirst(s.navLabel))}</a>`)
              .join(', ')}</p>`
          : ''
      }
      ${
        consultation
          ? `<p class="doctor-card__price">Консультация — <strong>${esc(consultation.price)}</strong></p>`
          : ''
      }
      <div class="doctor-card__actions">
        <a class="btn btn--primary btn--sm" href="${attr(waHref(message))}" data-cta-context="${attr(
    `${context}-${doctor.slug}`
  )}">Записаться</a>
        <a class="doctor-card__more" href="/doctors/${attr(doctor.slug)}/">О враче</a>
      </div>
    </div>
  </article>`;
}

/** Mid-sentence casing that leaves acronyms like ВНЧС intact. */
function lowerFirst(text) {
  return text.charAt(0).toLowerCase() + text.slice(1);
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

export function header(assets, waMessage) {
  return `<header class="masthead">
    <div class="shell masthead__bar">
      <a class="brandmark" href="/" aria-label="${attr(`${brand.name} — на главную`)}">
        <img src="${assets['img/brand/logo-260.png']}"
             srcset="${assets['img/brand/logo-260.png']} 260w, ${assets['img/brand/logo-520.png']} 520w"
             sizes="168px" width="1024" height="363" alt="${attr(brand.name)}" decoding="async">
      </a>
      <nav class="nav" aria-label="Основная навигация">${navLinks(nav)}</nav>
      <div class="masthead__actions">
        <a class="masthead__phone" href="${attr(telHref())}">${esc(contacts.phoneDisplay)}</a>
        <button class="burger" type="button" data-drawer-toggle aria-expanded="false" aria-controls="site-drawer">
          <span class="burger__icon" aria-hidden="true"></span>Меню
        </button>
      </div>
    </div>
    <div class="drawer" id="site-drawer" data-drawer data-open="false" hidden>
      <div class="shell">
        ${navLinks(nav)}
        <div class="btn-row mt-2">
          <a class="btn btn--primary" href="${attr(waHref(waMessage))}"
             data-cta-context="drawer">${esc(cta.whatsapp)}</a>
        </div>
      </div>
    </div>
  </header>`;
}

/** Map profiles the clinic actually holds; missing ones are simply absent. */
export function mapLinks() {
  return [
    ['2ГИС', maps.twoGis],
    ['Яндекс Карты', maps.yandex],
    ['Google Maps', maps.google],
  ]
    .filter(([, url]) => url)
    .map(([label, url]) => `<a href="${attr(url)}" target="_blank" rel="noopener">${esc(label)}</a>`)
    .join(' · ');
}

export function footer(assets, waMessage) {
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
          <img class="colophon__logo" src="${assets['img/brand/logo-light-260.png']}"
               srcset="${assets['img/brand/logo-light-260.png']} 260w, ${assets['img/brand/logo-light-520.png']} 520w"
               sizes="200px" width="1024" height="363" alt="${attr(brand.name)}" loading="lazy" decoding="async">
          <p style="margin-bottom:1rem">${esc(brand.legalNote)}. ${esc(contacts.hoursDisplay)}.</p>
          <ul>
            <li><a href="${attr(telHref())}">${esc(contacts.phoneDisplay)}</a></li>
            <li><a href="${attr(waHref(waMessage))}" data-event="whatsapp_click"
              data-cta-context="footer">${esc(cta.whatsapp)}</a></li>
            <li><a href="${attr(social.telegram)}" target="_blank" rel="noopener">Telegram ${esc(
    social.telegramHandle
  )}</a></li>
            <li><a href="${attr(social.instagram)}" target="_blank" rel="noopener">Instagram ${esc(
    social.instagramHandle
  )}</a></li>
            <li>${esc(contacts.addressFull)}, ${esc(contacts.postalCode)}</li>
            <li>${mapLinks()}</li>
          </ul>
        </div>
        ${cols}
      </div>
      <p class="colophon__legal">${esc(brand.legalName)} · Лицензия ${esc(brand.license)}</p>
      <p class="colophon__warning">Имеются противопоказания. Необходима консультация специалиста.</p>
      <div class="colophon__bottom">
        <span>© ${new Date().getFullYear()} ${esc(brand.name)}</span>
        <span>Информация на сайте не является медицинской консультацией и не заменяет очный приём.</span>
      </div>
    </div>
  </footer>`;
}

export function actionBar(context = '', waMessage) {
  return `<div class="action-bar">
    <a href="${attr(waHref(waMessage))}" data-cta-context="${attr(
    `sticky-${context}`
  )}">${esc(cta.whatsapp)}</a>
    <a href="${attr(telHref())}" data-cta-context="${attr(`sticky-${context}`)}">Позвонить</a>
  </div>`;
}
