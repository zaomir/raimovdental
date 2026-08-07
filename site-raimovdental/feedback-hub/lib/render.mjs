/**
 * Review Hub markup.
 *
 * A deliberately separate template tree from the patient site (atomic plan §0): the hub
 * shares the clinic's design tokens through its own stylesheet and nothing else, so the
 * parallel contour can keep reshaping the home page without touching this surface.
 *
 * Everything works without JavaScript. Each control is a real form posting to a real route,
 * because a patient reading this on a phone with a flaky connection still has to be able to
 * report that something went wrong.
 */

import { maps } from '../../patient-site/config/site.mjs';
import * as copy from '../content.mjs';

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const PLATFORM_LABELS = {
  yandex: 'Яндекс Карты',
  twogis: '2ГИС',
  google: 'Google Maps',
};

export const PLATFORM_URLS = {
  yandex: maps.yandexReviews,
  twogis: maps.twoGisReviews,
  google: maps.googleReviews,
};
const PLATFORM_CTA = {
  yandex: 'Оставить отзыв на Яндекс Картах',
  twogis: 'Оставить отзыв на 2ГИС',
  // A direct Google writereview URL requires the clinic's Place ID; until then be explicit.
  google: 'Открыть карточку в Google Maps',
};

/** Mutated by server.mjs so a hub.js deploy busts the edge cache the same way CSS does. */
export const assets = {
  jsHref: '/feedback/hub.js',
  origin: 'https://clinic.raimovdental.com',
};

function shell({ title, description, path = '/feedback/', body, cssHref, noJs = false }) {
  const fullTitle = `${title} — ${copy.clinic.name}`;
  const canonical = `${assets.origin}${path}`;
  const ogImage = `${assets.origin}/feedback/team.jpg`;
  const desc = description || copy.seo.landing;
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: fullTitle,
    description: desc,
    url: canonical,
    isPartOf: {
      '@type': 'WebSite',
      name: copy.clinic.name,
      url: `${assets.origin}/`,
    },
    about: {
      '@type': 'Dentist',
      name: copy.clinic.name,
      url: `${assets.origin}/`,
    },
  });
  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:locale" content="ru_KG">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(ogImage)}">
<link rel="stylesheet" href="${esc(cssHref)}">
<script type="application/ld+json">${jsonLd}</script>
</head>
<body>
<main class="hub" id="main">
  <header class="hub__head">
    <p class="hub__brand">${esc(copy.clinic.name)}</p>
  </header>
  ${body}
</main>
<footer class="hub__foot">
  <p>${esc(copy.footerNote)}</p>
</footer>
${noJs ? '' : `<script src="${esc(assets.jsHref)}" defer></script>`}
</body>
</html>`;
}

/** Unknown routes use the same useful marketing fallback and never reveal token state. */
export function renderGone(cssHref) {
  return renderLanding(cssHref);
}

export function renderLanding(cssHref) {
  const platforms = Object.entries(PLATFORM_LABELS)
    .map(
      ([id, label]) => `<li class="platform">
        <a class="platform__btn" href="/feedback/out/${esc(id)}" rel="nofollow noopener">
          ${esc(PLATFORM_CTA[id] ?? `Открыть ${label}`)}
        </a>
      </li>`
    )
    .join('');
  return shell({
    title: copy.landing.title,
    description: copy.seo.landing,
    path: '/feedback/',
    cssHref,
    noJs: true,
    body: `<section class="card">
      <h1 class="hub__title">${esc(copy.landing.title)}</h1>
      <p class="hub__lead">${esc(copy.landing.lead)}</p>
      <img class="hub__team" src="/feedback/team.jpg" width="720" height="297"
        alt="${esc(copy.landing.teamAlt)}">
      <h2 class="hub__subtitle">${esc(copy.landing.mapsTitle)}</h2>
      <ul class="platforms">${platforms}</ul>
      <p class="hub__minor"><a href="https://wa.me/${esc(copy.clinic.phone.replace('+', ''))}">
        ${esc(copy.landing.whatsappLabel)}</a></p>
    </section>`,
  });
}

function scale(token) {
  const stars = [1, 2, 3, 4, 5]
    .map(
      (n) => `<button class="star" type="submit" name="score" value="${n}"
        aria-label="Оценка ${n} из 5"><span class="star__n">${n}</span></button>`
    )
    .join('');
  return `<form class="scale" method="post" action="/feedback/${esc(token)}/score">
    <fieldset>
      <legend class="visually-hidden">${esc(copy.intro.legend)}</legend>
      <div class="scale__row">${stars}</div>
      <div class="scale__ends"><span>${esc(copy.intro.scaleLow)}</span><span>${esc(
    copy.intro.scaleHigh
  )}</span></div>
    </fieldset>
  </form>`;
}

export function renderIntro(record, cssHref) {
  return shell({
    title: copy.intro.title,
    description: copy.seo.intro,
    path: `/feedback/${record.token}/`,
    cssHref,
    body: `<section class="card">
      <h1 class="hub__title">${esc(copy.intro.title)}</h1>
      <p class="hub__lead">${esc(copy.intro.lead)}</p>
      ${scale(record.token)}
    </section>
    ${optOutForm(record)}`,
  });
}

function optOutForm(record) {
  if (record.stopped) return '';
  return `<form class="opt-out" method="post" action="/feedback/${esc(record.token)}/stop">
    <button class="opt-out__btn" type="submit">${esc(copy.optOut.label)}</button>
  </form>`;
}

export function renderStopped(cssHref) {
  return shell({
    title: copy.optOut.confirmTitle,
    description: copy.seo.stopped,
    path: '/feedback/',
    cssHref,
    noJs: true,
    body: `<section class="card">
      <h1 class="hub__title">${esc(copy.optOut.confirmTitle)}</h1>
      <p class="hub__lead">${esc(copy.optOut.confirmLead)}</p>
    </section>`,
  });
}

/** Same neutral platform choices after every score; score never controls their availability. */
function platformOptions(record) {
  const done = (platform) => Boolean(record.clicks?.[platform] || record.alreadyReviewed?.[platform]);
  const remaining = Object.keys(PLATFORM_LABELS).filter((p) => !done(p));
  const rows = Object.entries(PLATFORM_LABELS)
    .map(([id, label]) => {
      if (done(id)) {
        return `<li class="platform platform--done">
          <span class="platform__label">${esc(label)}</span>
          <span class="platform__state">${esc(copy.promoter.doneLabel)}</span>
        </li>`;
      }
      return `<li class="platform">
        <form method="post" action="/feedback/${esc(record.token)}/click">
          <input type="hidden" name="platform" value="${esc(id)}">
          <button class="platform__btn" type="submit">${esc(
            PLATFORM_CTA[id] ?? `Открыть ${label}`
          )}</button>
        </form>
        <form class="platform__already" method="post" action="/feedback/${esc(
          record.token
        )}/already-reviewed">
          <input type="hidden" name="platform" value="${esc(id)}">
          <button class="platform__already-btn" type="submit">${esc(copy.promoter.alreadyLabel)}</button>
        </form>
      </li>`;
    })
    .join('');

  return `<section class="card">
    <h2 class="hub__title">${esc(copy.promoter.title)}</h2>
    <p class="hub__lead">${esc(remaining.length ? copy.promoter.lead : copy.promoter.allDone)}</p>
    <ul class="platforms">${rows}</ul>
    ${
      remaining.length
        && (Object.keys(record.clicks ?? {}).length || Object.keys(record.alreadyReviewed ?? {}).length)
        ? `<p class="hub__note">${esc(copy.promoter.doneHint)}</p>`
        : ''
    }
    <p class="hub__fine">${esc(copy.promoter.disclaimer)}</p>
  </section>`;
}

export function renderPromoter(record, cssHref) {
  return shell({
    title: copy.promoter.title,
    description: copy.seo.promoter,
    path: `/feedback/${record.token}/`,
    cssHref,
    body: `<h1 class="visually-hidden">${esc(copy.promoter.title)}</h1>
    ${platformOptions(record)}
    ${optOutForm(record)}`,
  });
}

/** 1–3: recovery only — public map CTAs stay on the 4–5 promoter branch. */
export function renderDetractor(record, cssHref) {
  if (record.recovery) {
    return shell({
      title: copy.detractor.thanksTitle,
      description: copy.seo.thanks,
      path: `/feedback/${record.token}/`,
      cssHref,
      noJs: true,
      body: `<section class="card">
        <h1 class="hub__title">${esc(copy.detractor.thanksTitle)}</h1>
        <p class="hub__lead">${esc(copy.detractor.thanksLead)}</p>
        <p><a class="hub__wa" href="https://wa.me/${esc(
          copy.clinic.phone.replace('+', '')
        )}">Написать в WhatsApp</a></p>
      </section>
      ${optOutForm(record)}`,
    });
  }

  const topics = copy.detractor.topics
    .map(
      (t) => `<label class="check">
        <input type="checkbox" name="topics" value="${esc(t.id)}">
        <span>${esc(t.label)}</span>
      </label>`
    )
    .join('');

  return shell({
    title: copy.detractor.title,
    description: copy.seo.detractor,
    path: `/feedback/${record.token}/`,
    cssHref,
    body: `<section class="card" id="recovery">
      <h1 class="hub__title">${esc(copy.detractor.title)}</h1>
      <p class="hub__lead">${esc(copy.detractor.lead)}</p>
      <form class="recovery" method="post" action="/feedback/${esc(record.token)}/recovery">
        <fieldset class="recovery__topics">
          <legend class="recovery__legend">${esc(copy.detractor.topicsLabel)}</legend>
          ${topics}
        </fieldset>
        <label class="check">
          <input type="checkbox" name="privacy_consent" value="1" required>
          <span>${esc(copy.detractor.privacyConsentLabel)}</span>
        </label>
        <label class="check">
          <input type="checkbox" name="contact_consent" value="1">
          <span>${esc(copy.detractor.contactConsentLabel)}</span>
        </label>
        <p class="hub__fine">${esc(copy.detractor.privacyNote)}</p>
        <p class="hub__fine"><a href="/privacy/" target="_blank" rel="noopener">
          Политика конфиденциальности</a></p>
        <button class="btn" type="submit">${esc(copy.detractor.submit)}</button>
      </form>
    </section>
    ${optOutForm(record)}`,
  });
}

export function renderToken(record, cssHref) {
  if (record.stopped) return renderStopped(cssHref);
  if (record.score === null) return renderIntro(record, cssHref);
  return record.branch === 'promoter'
    ? renderPromoter(record, cssHref)
    : renderDetractor(record, cssHref);
}
