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

function shell({ title, body, cssHref, noJs = false }) {
  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive">
<title>${esc(title)} — ${esc(copy.clinic.name)}</title>
<link rel="stylesheet" href="${esc(cssHref)}">
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
${noJs ? '' : '<script src="/feedback/hub.js" defer></script>'}
</body>
</html>`;
}

/** Neutral page for unknown, expired or malformed tokens — it reveals nothing either way. */
export function renderGone(cssHref) {
  return shell({
    title: copy.gone.title,
    cssHref,
    noJs: true,
    body: `<section class="card">
      <h1 class="hub__title">${esc(copy.gone.title)}</h1>
      <p class="hub__lead">${esc(copy.gone.lead)}</p>
      <p><a class="hub__wa" href="https://wa.me/${esc(copy.clinic.phone.replace('+', ''))}">Написать в WhatsApp</a></p>
    </section>`,
  });
}

export function renderLanding(cssHref) {
  return shell({
    title: copy.landing.title,
    cssHref,
    noJs: true,
    body: `<section class="card">
      <h1 class="hub__title">${esc(copy.landing.title)}</h1>
      <p class="hub__lead">${esc(copy.landing.lead)}</p>
      <p><a class="hub__wa" href="https://wa.me/${esc(copy.clinic.phone.replace('+', ''))}">Написать в WhatsApp</a></p>
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
    cssHref,
    noJs: true,
    body: `<section class="card">
      <h1 class="hub__title">${esc(copy.optOut.confirmTitle)}</h1>
      <p class="hub__lead">${esc(copy.optOut.confirmLead)}</p>
    </section>`,
  });
}

/**
 * 4–5 branch. A platform already clicked renders as a disabled "done" row rather than
 * disappearing, so a returning patient can see at a glance what is left.
 */
export function renderPromoter(record, cssHref) {
  const remaining = Object.keys(PLATFORM_LABELS).filter((p) => !record.clicks[p]);
  const rows = Object.entries(PLATFORM_LABELS)
    .map(([id, label]) => {
      if (record.clicks[id]) {
        return `<li class="platform platform--done">
          <span class="platform__label">${esc(label)}</span>
          <span class="platform__state">${esc(copy.promoter.doneLabel)}</span>
        </li>`;
      }
      return `<li class="platform">
        <form method="post" action="/feedback/${esc(record.token)}/click">
          <input type="hidden" name="platform" value="${esc(id)}">
          <button class="platform__btn" type="submit">${esc(label)}</button>
        </form>
      </li>`;
    })
    .join('');

  return shell({
    title: copy.promoter.title,
    cssHref,
    body: `<section class="card">
      <h1 class="hub__title">${esc(copy.promoter.title)}</h1>
      <p class="hub__lead">${esc(remaining.length ? copy.promoter.lead : copy.promoter.allDone)}</p>
      <ul class="platforms">${rows}</ul>
      ${
        remaining.length && Object.keys(record.clicks).length
          ? `<p class="hub__note">${esc(copy.promoter.doneHint)}</p>`
          : ''
      }
      <p class="hub__fine">${esc(copy.promoter.disclaimer)}</p>
    </section>
    ${optOutForm(record)}`,
  });
}

/** 1–3 branch. The map buttons are absent from the markup entirely, not merely hidden. */
export function renderDetractor(record, cssHref) {
  if (record.recovery) {
    return shell({
      title: copy.detractor.thanksTitle,
      cssHref,
      noJs: true,
      body: `<section class="card">
        <h1 class="hub__title">${esc(copy.detractor.thanksTitle)}</h1>
        <p class="hub__lead">${esc(copy.detractor.thanksLead)}</p>
        <p><a class="hub__wa" href="https://wa.me/${esc(
          copy.clinic.phone.replace('+', '')
        )}">Написать в WhatsApp</a></p>
      </section>`,
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
    cssHref,
    body: `<section class="card" id="recovery">
      <h1 class="hub__title">${esc(copy.detractor.title)}</h1>
      <p class="hub__lead">${esc(copy.detractor.lead)}</p>
      <form class="recovery" method="post" action="/feedback/${esc(record.token)}/recovery">
        <fieldset class="recovery__topics">
          <legend class="recovery__legend">${esc(copy.detractor.topicsLabel)}</legend>
          ${topics}
        </fieldset>
        <label class="field">
          <span class="field__label">${esc(copy.detractor.commentLabel)}
            <span class="field__hint">${esc(copy.detractor.commentHint)}</span></span>
          <textarea class="field__control" name="comment" rows="4" maxlength="2000"></textarea>
        </label>
        <label class="check">
          <input type="checkbox" name="consent" value="1" checked>
          <span>${esc(copy.detractor.consentLabel)}</span>
        </label>
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
