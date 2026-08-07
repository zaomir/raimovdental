/**
 * Page renderers.
 *
 * Every page is assembled from the content modules; no copy is invented at render time.
 * Page order follows docs/ssot/EXPERT_DENTAL_WEBSITE_SSOT.md §8 (home), §9 (service),
 * §10 (doctor), §12 (prices), §14 (blog catalog) and §15 (article).
 */

import { brand, contacts, cta, maps, pendingFromClinic, social } from '../config/site.mjs';
import { chief } from '../content/chief.mjs';
import { categories } from '../content/articles.mjs';
import { references } from '../content/references.mjs';
import * as home from '../content/homepage.mjs';
import {
  archImage,
  portraitImage,
  attr,
  bookingForm,
  breadcrumbs,
  ctaBand,
  ctaPair,
  doctorCard,
  esc,
  faqBlock,
  formatDate,
  image,
  initials,
  inline,
  lockedNote,
  mapLinks,
  methodsTable,
  money,
  postCard,
  priceBlock,
  routerTable,
  telHref,
  trustStrip,
  waHref,
} from './ui.mjs';

/* ------------------------------------------------------------------ helpers */

function pickRows(prices, directionId, filter) {
  const dir = prices.byDirection[directionId];
  if (!dir) throw new Error(`Unknown price direction: ${directionId}`);
  if (!filter?.length) return dir.items;
  const needles = filter.map((f) => f.toLowerCase());
  return dir.items.filter((i) => needles.some((n) => i.name.toLowerCase().includes(n)));
}

function list(items, { refs = references, prices } = {}) {
  return `<ul>${items.map((i) => `<li>${inline(money(i, prices), { refs })}</li>`).join('')}</ul>`;
}

function sectionHead({ kicker, title, lead, id }) {
  return `<div class="section-head">
    ${kicker ? `<span class="kicker">${esc(kicker)}</span>` : ''}
    <h2 class="display t-h2"${id ? ` id="${attr(id)}"` : ''}>${esc(title)}</h2>
    ${lead ? `<p class="t-lead">${inline(lead)}</p>` : ''}
  </div>`;
}

function priceDisclaimer(prices) {
  return `<p class="price-note">${esc(prices.disclaimer)} Прайс обновлён ${formatDate(prices.lastUpdated)}.</p>`;
}

/* --------------------------------------------------------------------- home */

export function homePage({ manifest, services, doctors, articles, prices, reviews, cases }) {
  const ordered = [...services].sort((a, b) => a.order - b.order);
  const chiefDoctor = doctors.find((d) => d.chief);
  const rating = reviews?.aggregateRating;

  const heroTitle = home.hero.titleEm
    ? esc(home.hero.title).replace(esc(home.hero.titleEm), `<em>${esc(home.hero.titleEm)}</em>`)
    : esc(home.hero.title);

  return `
  <section class="hero">
    <div class="shell hero__grid">
      <div class="stack stack--gap-14">
        <span class="kicker">${esc(brand.legalNote)}</span>
        <h1 class="display hero__title">${heroTitle}</h1>
        <p class="t-lead">${esc(home.hero.lead)}</p>
        <div class="btn-row">
          <a class="btn btn--primary" href="${attr(waHref(home.waPrefills.hero))}"
             data-cta-context="hero" data-event="preview_cta_click">${esc(home.hero.primaryLabel)}</a>
          <a class="btn btn--ghost" href="${attr(home.hero.secondaryHref)}"
             data-cta-context="hero-start" data-event="router_row_click">${esc(home.hero.secondaryLabel)}</a>
        </div>
        ${lockedNote(home.hero.note, prices)}
        <p class="t-small t-mute">${esc(home.hero.location)}</p>
      </div>
      <div class="hero__media">
        ${portraitImage(manifest, chiefDoctor.photo, chiefDoctor.photoAlt, {
          sizes: '(min-width: 56rem) 38vw, 92vw',
          priority: true,
        })}
        <div class="hero__badge">
          <span class="kicker">Профильное направление</span>
          <p class="t-small mt-1">Гнатология и функциональная диагностика ВНЧС</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--bone" id="${attr(home.router.id)}" aria-labelledby="router-title">
    <div class="shell">
      ${sectionHead({
        kicker: home.router.kicker,
        title: home.router.title,
        lead: home.router.lead,
        id: 'router-title',
      })}
      ${routerTable(home.router.rows, prices, ordered)}
    </div>
  </section>

  <section class="section" id="${attr(home.preview.id)}" aria-labelledby="preview-title">
    <div class="shell">
      ${sectionHead({
        kicker: home.preview.kicker,
        title: home.preview.title,
        lead: home.preview.lead,
        id: 'preview-title',
      })}
      <div class="grid grid--4 mt-4">
        ${home.preview.columns
          .map(
            (c) => `<div class="spec-card${c.tone === 'exclusion' ? ' spec-card--out' : ''}">
              <h3 class="spec-card__title">${esc(c.title)}</h3>
              <ul class="spec-card__list">
                ${c.items.map((i) => `<li>${esc(money(i, prices))}</li>`).join('')}
              </ul>
            </div>`
          )
          .join('')}
      </div>
      ${lockedNote(home.preview.note, prices)}
      <div class="btn-row mt-3">
        <a class="btn btn--primary" href="${attr(waHref(home.waPrefills.preview))}"
           data-cta-context="preview" data-event="preview_cta_click">${esc(home.preview.ctaLabel)}</a>
      </div>
    </div>
  </section>

  <section class="section section--forest fluted" id="${attr(home.approach.id)}" aria-labelledby="approach-title">
    <div class="shell shell--narrow shell--centered">
      <div class="stack stack--gap-115">
        <span class="kicker kicker--onDark">${esc(home.approach.kicker)}</span>
        <h2 class="display t-h2" id="approach-title">${esc(home.approach.title)}</h2>
        ${home.approach.paragraphs.map((p) => `<p class="t-lead">${esc(p)}</p>`).join('')}
        <p><a class="link-arrow link-arrow--onDark" href="${attr(home.approach.link.href)}">${esc(
    home.approach.link.label
  )} →</a></p>
      </div>
    </div>
  </section>

  <section class="section" id="${attr(home.process.id)}" aria-labelledby="process-title">
    <div class="shell">
      ${sectionHead({ kicker: home.process.kicker, title: home.process.title, id: 'process-title' })}
      <ol class="steps steps--numbered">
        ${home.process.steps
          .map(
            (s) => `<li class="step">
              <div>
                <div class="step__title">${esc(s.title)}${
              s.meta ? ` <span class="step__meta">${esc(money(s.meta, prices))}</span>` : ''
            }</div>
                <p class="step__text">${esc(money(s.text, prices))}</p>
              </div>
            </li>`
          )
          .join('')}
      </ol>
      <div class="stack stack--gap-085 mt-4">
        ${home.process.notes.map((n) => lockedNote(n, prices)).join('')}
      </div>
      <p class="t-small t-mute mt-3">${esc(home.process.term)}</p>
      <div class="btn-row mt-3">
        <a class="btn btn--primary" href="${attr(waHref(home.waPrefills.process))}"
           data-cta-context="process" data-event="preview_cta_click">${esc(home.preview.ctaLabel)}</a>
      </div>
    </div>
  </section>

  <section class="section section--bone" id="${attr(home.work.id)}" aria-labelledby="work-title">
    <div class="shell">
      ${sectionHead({
        kicker: home.work.kicker,
        title: home.work.title,
        lead: home.work.lead,
        id: 'work-title',
      })}
      <div class="grid grid--3">
        ${(cases ?? [])
          .map(
            (c) => `<article class="case-card">
              <div class="case-card__media" role="img"
                   aria-label="Подтверждённая пара фотографий до и после готовится к публикации">
                <div class="case-card__placeholder" aria-hidden="true"><strong>До</strong><span>Материал готовится</span></div>
                <div class="case-card__placeholder" aria-hidden="true"><strong>После</strong><span>Материал готовится</span></div>
              </div>
              <h3 class="case-card__title">${esc(c.title)}</h3>
              <p class="case-card__problem">${esc(c.problem)}</p>
              <ol class="case-card__stages">${c.stages.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
              <p class="case-card__meta">${esc(c.durationRange)}</p>
            </article>`
          )
          .join('')}
      </div>
      <p class="t-small t-mute mt-3">${esc(home.work.pendingNote)}</p>
    </div>
  </section>

  <section class="section" id="${attr(home.methods.id)}" aria-labelledby="methods-title">
    <div class="shell">
      ${sectionHead({ kicker: home.methods.kicker, title: home.methods.title, id: 'methods-title' })}
      <ul class="guidance">
        ${home.methods.guidance.map((g) => `<li>${esc(g)}</li>`).join('')}
      </ul>
      <div class="mt-4">${methodsTable(home.methods, prices)}</div>
      <div class="btn-row mt-3">
        <a class="btn btn--primary" href="${attr(waHref(home.waPrefills.methods))}"
           data-cta-context="methods" data-event="preview_cta_click">${esc(home.preview.ctaLabel)}</a>
      </div>
    </div>
  </section>

  <section class="section section--bone" id="${attr(home.pricing.id)}" aria-labelledby="prices-title">
    <div class="shell">
      ${sectionHead({ kicker: home.pricing.kicker, title: home.pricing.title, id: 'prices-title' })}
      <dl class="price-groups">
        ${home.pricing.groups
          .map(
            (g) => `<div class="price-groups__row${g.tone === 'free' ? ' price-groups__row--free' : ''}">
              <dt>${esc(g.label)}</dt>
              <dd>${esc(money(g.text, prices))}</dd>
            </div>`
          )
          .join('')}
      </dl>
      ${lockedNote(home.pricing.note, prices)}
      <p class="mt-3">${esc(money(home.pricing.other, prices))}</p>
      ${priceDisclaimer(prices)}
      <div class="btn-row mt-3">
        <a class="btn btn--primary" href="${attr(home.pricing.ctaHref)}"
           data-cta-context="prices" data-event="price_page_click">${esc(home.pricing.ctaLabel)}</a>
      </div>
      <p class="t-small t-mute mt-2">${esc(home.pricing.payment)}</p>
    </div>
  </section>

  ${trustStrip(home.trust, prices, {
    license: brand.license ? `Лицензия ${brand.license}` : null,
    since: `С ${brand.founded} года`,
  })}

  <section class="section" id="${attr(home.team.id)}" aria-labelledby="team-title">
    <div class="shell">
      ${sectionHead({ kicker: home.team.kicker, title: home.team.title, id: 'team-title' })}
      <div class="grid grid--doctors">
        ${doctors
          .slice(0, 8)
          .map((d) => doctorCard(manifest, d, { prices, services: ordered, context: 'home-doctors' }))
          .join('')}
      </div>
      <figure class="pull-quote mt-4">
        <blockquote><p>${esc(home.team.quote.text)}</p></blockquote>
        <figcaption>— ${esc(home.team.quote.author)}${
    chiefDoctor ? `, <a href="/doctors/${attr(chiefDoctor.slug)}/">главный врач</a>` : ''
  }</figcaption>
      </figure>
    </div>
  </section>

  ${
    rating
      ? `<section class="section section--bone" id="${attr(home.reviewsBlock.id)}" aria-labelledby="reviews-title">
    <div class="shell">
      ${sectionHead({
        kicker: home.reviewsBlock.kicker,
        title: home.reviewsBlock.title,
        lead: `**${String(rating.value).replace('.', ',')} из 5** на основании **${
          rating.reviewCount
        }** отзывов на 2ГИС · срез ${formatDate(rating.capturedAt)}`,
        id: 'reviews-title',
      })}
      <p class="t-body shell--narrow">Отзывы читаются на странице клиники в 2ГИС. Мы не перепечатываем
        отдельные цитаты без стабильной ссылки на конкретную публикацию.</p>
      <p class="mt-3"><a class="link-arrow" href="${attr(maps.twoGisReviews)}" target="_blank"
        rel="noopener nofollow" data-event="reviews_outbound_click"
        data-cta-context="reviews-all">${esc(home.reviewsBlock.ctaLabel)} →</a></p>
    </div>
  </section>`
      : ''
  }

  <section class="section" id="faq" aria-labelledby="home-faq-title">
    <div class="shell shell--narrow shell--centered">
      ${faqBlock(home.faq, { idPrefix: 'home', title: 'Частые вопросы', prices })}
    </div>
  </section>

  <section class="section section--bone" id="${attr(home.servicesBlock.id)}" aria-labelledby="services-title">
    <div class="shell">
      ${sectionHead({
        kicker: home.servicesBlock.kicker,
        title: home.servicesBlock.title,
        lead: home.servicesBlock.lead,
        id: 'services-title',
      })}
      <div class="grid grid--3">
        ${ordered
          .filter((s) => !s.productType)
          .map(
            (s, i) => `<a class="card card--service${i === 0 ? ' card--lead' : ''}"
              href="/services/${attr(s.slug)}/">
              <h3 class="card__title">${esc(s.navLabel)}</h3>
              <p class="card__text">${esc(s.result)}</p>
              <span class="card__foot">Подробнее →</span>
            </a>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="section section--forest" id="${attr(home.finalCta.id)}" aria-labelledby="book-title">
    <div class="shell split split--even">
      <div class="stack stack--gap-11">
        <h2 class="display t-h2" id="book-title">${esc(home.finalCta.title)}</h2>
        <p class="t-lead">${esc(home.finalCta.lead)}</p>
        <ul class="channels">
          <li><a href="${attr(waHref(home.waPrefills.final))}" data-cta-context="book-channels"
            data-event="whatsapp_click">WhatsApp ${esc(contacts.phoneDisplay)}</a></li>
          <li><a href="${attr(social.telegram)}" target="_blank" rel="noopener">Telegram ${esc(
    social.telegramHandle
  )}</a></li>
          <li><a href="${attr(telHref())}" data-cta-context="book-channels">Позвонить ${esc(
    contacts.phoneDisplay
  )}</a></li>
        </ul>
      </div>
      ${bookingForm(home.finalCta, home.waPrefills.final)}
    </div>
  </section>

  ${contactStrip(manifest)}`;
}

/* -------------------------------------------------------------- chief band */

function chiefBand(manifest, doctor) {
  return `<section class="section chief fluted" aria-labelledby="chief-title">
    <div class="shell chief__grid">
      <div class="chief__photo">
        ${image(manifest, doctor.photo, doctor.photoAlt, { sizes: '(min-width: 56rem) 24rem, 70vw' })}
      </div>
      <div class="stack stack--gap-125">
        <span class="kicker kicker--onDark">Главный врач</span>
        <h2 class="display t-h2" id="chief-title">${esc(doctor.name)}</h2>
        <p class="chief__quote">«${esc(chief.quote)}»</p>
        <ul class="chief__list">
          ${chief.focus.items
            .slice(0, 4)
            .map((i) => `<li><span>${esc(i)}</span></li>`)
            .join('')}
        </ul>
        <div class="btn-row">
          <a class="btn btn--onDark" href="/doctors/raimov-atabek/">О главном враче</a>
          <a class="btn btn--ghostDark" href="${attr(waHref(chief.whatsappMessage))}" data-cta-context="chief-band">
            Записаться к Атабеку Саидовичу</a>
        </div>
      </div>
    </div>
  </section>`;
}

/* ----------------------------------------------------------- contact strip */

function contactStrip(manifest) {
  return `<section class="section section--tight" id="contacts" aria-labelledby="contact-strip">
    <div class="shell split split--even">
      <div class="stack stack--gap-125">
        <span class="kicker">Как добраться</span>
        <h2 class="display t-h2" id="contact-strip">Клиника в центре Бишкека</h2>
        <dl class="info-list">
          <div><dt>Адрес</dt><dd class="info-list__value">${esc(contacts.addressFull)}, ${esc(
    contacts.postalCode
  )}<br>
            <span class="t-small t-mute">${esc(contacts.streetNote)}</span></dd></div>
          <div><dt>Часы работы</dt><dd class="info-list__value">${esc(contacts.hoursDisplay)}</dd></div>
          <div><dt>Парковка</dt><dd class="info-list__value">${esc(contacts.parking)}</dd></div>
          <div><dt>Телефон и WhatsApp</dt><dd class="info-list__value">
            <a href="${attr(telHref())}">${esc(contacts.phoneDisplay)}</a></dd></div>
          <div><dt>Мессенджеры</dt><dd class="info-list__value">
            <a href="${attr(social.telegram)}" target="_blank" rel="noopener">Telegram ${esc(
    social.telegramHandle
  )}</a> · <a href="${attr(social.instagram)}" target="_blank" rel="noopener">Instagram ${esc(
    social.instagramHandle
  )}</a></dd></div>
          <div><dt>Карты</dt><dd class="info-list__value">${mapLinks()}</dd></div>
        </dl>
      </div>
      <div class="gallery gallery--duo">
        <figure>${image(manifest, 'clinic/facade', 'Фасад здания, в котором находится Expert Dental Studio', {
          sizes: '(min-width: 56rem) 24vw, 45vw',
        })}<figcaption>Вход в клинику</figcaption></figure>
        <figure>${image(manifest, 'clinic/reception', 'Ресепшен Expert Dental Studio', {
          sizes: '(min-width: 56rem) 24vw, 45vw',
        })}<figcaption>Ресепшен</figcaption></figure>
      </div>
    </div>
  </section>`;
}

/* ------------------------------------------------------------ services list */

export function servicesIndexPage({ services, prices }) {
  const ordered = [...services].sort((a, b) => a.order - b.order);
  const screening = ordered.filter((service) => service.productType === 'screening');
  const memberships = ordered.filter((service) => service.productType === 'membership');
  const clinical = ordered.filter((service) => !service.productType);
  const directions = Object.values(prices.byDirection);
  const serviceCards = (items, { membership = false } = {}) =>
    items
      .map(
        (service) => `<a class="card card--service${membership ? ' card--lead' : ''}"
          href="/services/${attr(service.slug)}/">
          ${
            membership
              ? '<span class="tag tag--ok">Профилактический абонемент</span>'
              : ''
          }
          <h3 class="card__title">${esc(service.navLabel)}</h3>
          <p class="card__text">${esc(service.result)}</p>
          <span class="card__foot">Подробнее →</span>
        </a>`
      )
      .join('');

  return `
  <section class="section section--tight">
    <div class="shell">
      ${breadcrumbs([{ href: '/', label: 'Главная' }, { href: '/services/', label: 'Услуги и цены' }])}
      <div class="section-head section-head--compact">
        <span class="kicker">Услуги и цены</span>
        <h1 class="display t-h1">Что мы лечим и сколько это стоит</h1>
        <p class="t-lead">Один прайс для сайта, администратора и врача. Итоговая стоимость определяется
          после осмотра — до начала лечения.</p>
      </div>
      <div class="stack stack--gap-14 mt-4">
        <div>
          <span class="kicker">Первый шаг</span>
          <h2 class="display t-h3 mt-1">Скрининг и маршрут</h2>
          <div class="grid grid--3 mt-2">${serviceCards(screening)}</div>
        </div>
        <div>
          <span class="kicker">Профилактика</span>
          <h2 class="display t-h3 mt-1">Программа на 12 месяцев</h2>
          <div class="grid grid--3 mt-2">${serviceCards(memberships, { membership: true })}</div>
        </div>
        <div>
          <span class="kicker">Лечение</span>
          <h2 class="display t-h3 mt-1">Клинические направления</h2>
          <div class="grid grid--3 mt-2">${serviceCards(clinical)}</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--bone" aria-labelledby="full-price">
    <div class="shell">
      ${sectionHead({ kicker: 'Прайс', title: 'Полный перечень', id: 'full-price' })}
      ${directions.map((d) => priceBlock({ title: d.name, rows: d.items })).join('')}
      ${priceDisclaimer(prices)}
    </div>
  </section>

  ${ctaBand({
    title: 'Не знаете, какая услуга нужна?',
    text: 'Опишите администратору, что беспокоит, — он подберёт специалиста и подходящее время.',
    context: 'services-index',
    message: 'Здравствуйте. Не знаю, к какому врачу записаться. Подскажите, пожалуйста.',
    primaryLabel: 'Помогите выбрать услугу',
  })}`;
}

/* --------------------------------------------------------- service detail */

export function servicePage({ manifest, service, services, doctors, articles, prices }) {
  const serviceDoctors = service.doctors.map((slug) => doctors.find((d) => d.slug === slug)).filter(Boolean);
  const serviceArticles = service.articles.map((slug) => articles.find((a) => a.slug === slug)).filter(Boolean);
  const related = service.related.map((slug) => services.find((s) => s.slug === slug)).filter(Boolean);
  const labels = service.sectionLabels ?? {};

  const priceRowsAll = (service.priceDirections || []).flatMap((d) => pickRows(prices, d, service.priceFilter));

  return `
  <section class="section section--tight">
    <div class="shell">
      ${breadcrumbs([
        { href: '/', label: 'Главная' },
        { href: '/services/', label: 'Услуги и цены' },
        { href: `/services/${service.slug}/`, label: service.navLabel },
      ])}
      <div class="split split--center">
        <div class="stack stack--gap-125">
          <span class="kicker">${esc(service.kicker)}</span>
          <h1 class="display t-h1">${esc(service.title)}</h1>
          <p class="t-lead">${esc(service.lead)}</p>
          <p><strong>Результат:</strong> ${esc(service.result)}</p>
          ${ctaPair({
            context: `service-${service.slug}`,
            message:
              service.ctaMessage
              ?? `Здравствуйте. Хочу записаться на консультацию — «${service.navLabel}».`,
            primaryLabel: service.ctaLabel ?? `Записаться — ${service.navLabel}`,
          })}
        </div>
        ${archImage(manifest, service.image, service.imageAlt, {
          sizes: '(min-width: 56rem) 46vw, 92vw',
          priority: true,
        })}
      </div>
    </div>
  </section>

  <section class="section section--bone">
    <div class="shell split">
      <div class="stack stack--gap-1">
        <span class="kicker">${esc(labels.symptomsKicker ?? 'Симптомы и показания')}</span>
        <h2 class="display t-h2">${esc(labels.symptomsTitle ?? 'Когда стоит записаться')}</h2>
      </div>
      <div class="prose">${list(service.symptoms)}
        <div class="callout callout--note mt-3">
          <div class="callout__title">Кому подходит</div>
          ${list(service.suitableFor)}
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="shell split">
      <div class="stack stack--gap-1">
        <span class="kicker">${esc(labels.diagnosticsKicker ?? 'Диагностика')}</span>
        <h2 class="display t-h2">${esc(labels.diagnosticsTitle ?? 'Что делают до лечения')}</h2>
        <p class="t-lead">${esc(
          labels.diagnosticsLead ?? 'План строится по результатам обследования, а не по названию услуги.'
        )}</p>
      </div>
      <div class="prose">${list(service.diagnostics)}</div>
    </div>
  </section>

  <section class="section section--forest fluted">
    <div class="shell">
      ${sectionHead({
        kicker: labels.optionsKicker ?? 'Варианты лечения',
        title: labels.optionsTitle ?? 'Что можно сделать',
      })}
      <div class="grid grid--2">
        ${service.options
          .map(
            (o) => `<div>
              <h3 class="card__title card__title--onDark">${esc(o.name)}</h3>
              <p class="card__text card__text--onDark">${esc(o.text)}</p>
            </div>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="shell">
      ${sectionHead({
        kicker: labels.stagesKicker ?? 'Этапы',
        title: labels.stagesTitle ?? 'Как проходит лечение',
      })}
      <div class="steps steps--row">
        ${service.stages
          .map(
            (s) => `<div class="step">
              <div class="step__title">${esc(s.title)}</div>
              <p class="step__text">${esc(s.text)}</p>
            </div>`
          )
          .join('')}
      </div>
      <div class="callout mt-4"><div class="callout__title">Сроки</div><p>${esc(service.timeline)}</p></div>
    </div>
  </section>

  <section class="section section--bone" aria-labelledby="service-price">
    <div class="shell">
      ${sectionHead({
        kicker: 'Стоимость',
        title: labels.priceTitle ?? 'Цены и что на них влияет',
        id: 'service-price',
      })}
      <div class="split">
        <div class="prose">
          <h3 class="heading-flush">От чего зависит итоговая сумма</h3>
          ${list(service.priceFactors, { prices })}
        </div>
        <div>
          ${priceRowsAll.length ? priceBlock({ title: 'Прайс', rows: priceRowsAll }) : ''}
          ${priceDisclaimer(prices)}
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="shell">
      ${sectionHead({
        kicker: 'Врачи',
        title: 'Кто ведёт это направление',
        lead: 'Можно записаться сразу к нужному специалисту — администратор увидит направление в сообщении.',
      })}
      <div class="grid grid--doctors">${serviceDoctors
        .map((d) =>
          doctorCard(manifest, d, {
            prices,
            services,
            context: `service-${service.slug}`,
            topic: service.navLabel,
            consultationTier:
              service.productType === 'screening'
                ? false
                : service.slug === 'gnathology'
                  ? 'gnathology'
                  : undefined,
          })
        )
        .join('')}</div>
    </div>
  </section>

  <section class="section section--bone">
    <div class="shell split">
      <div class="stack stack--gap-1">
        <span class="kicker">Ограничения</span>
        <h2 class="display t-h2">О чём важно знать заранее</h2>
        <p class="t-lead">Мы не обещаем результат заранее. Вот что реально влияет на прогноз.</p>
      </div>
      <div class="prose">${list(service.risks)}</div>
    </div>
  </section>

  <section class="section">
    <div class="shell shell--narrow shell--centered">
      ${faqBlock(service.faq, { idPrefix: `svc-${service.slug}`, prices })}
    </div>
  </section>

  ${
    serviceArticles.length
      ? `<section class="section section--bone">
    <div class="shell">
      ${sectionHead({ kicker: 'Читать дальше', title: 'Статьи по теме' })}
      <div class="grid grid--3">${serviceArticles.map((a) => postCard(manifest, a, categories)).join('')}</div>
    </div>
  </section>`
      : ''
  }

  <section class="section section--tight">
    <div class="shell">
      <p class="kicker">Смежные направления</p>
      <div class="chip-row mt-1">
        ${related.map((r) => `<a class="chip" href="/services/${attr(r.slug)}/">${esc(r.navLabel)}</a>`).join('')}
      </div>
    </div>
  </section>

  ${ctaBand({
    title: service.productType ? service.ctaLabel : 'Запишитесь на диагностику',
    text: `${contacts.adminSla}. ${contacts.hoursDisplay}.`,
    context: `service-${service.slug}-footer`,
    message:
      service.ctaMessage
      ?? `Здравствуйте. Хочу записаться на консультацию — «${service.navLabel}».`,
    primaryLabel: service.ctaLabel ?? `Записаться — ${service.navLabel}`,
  })}`;
}

/* --------------------------------------------------------------- doctors */

export function doctorsIndexPage({ manifest, doctors, prices, services }) {
  const chiefDoctor = doctors.find((d) => d.chief);
  const rest = doctors.filter((d) => !d.chief);

  return `
  <section class="section section--tight">
    <div class="shell">
      ${breadcrumbs([{ href: '/', label: 'Главная' }, { href: '/doctors/', label: 'Врачи' }])}
      <div class="section-head">
        <span class="kicker">Команда</span>
        <h1 class="display t-h1">Врачи Expert Dental Studio</h1>
        <p class="t-lead">Восемь специалистов разных направлений. Сложные случаи ведутся совместно:
          ортодонт, хирург, ортопед и терапевт согласуют этапы между собой.</p>
      </div>
    </div>
  </section>

  ${chiefBand(manifest, chiefDoctor)}

  <section class="section">
    <div class="shell">
      ${sectionHead({ kicker: 'Специалисты', title: 'Остальные врачи клиники' })}
      <div class="grid grid--doctors">${rest
        .map((d) => doctorCard(manifest, d, { prices, services, context: 'doctors-index' }))
        .join('')}</div>
      <figure class="team-band team-band--flush mt-4">
        ${image(manifest, 'team/team', 'Команда врачей Expert Dental Studio', {
          sizes: '(min-width: 74rem) 74rem, 100vw',
        })}
        <figcaption class="team-band__caption">Команда Expert Dental Studio, Бишкек</figcaption>
      </figure>
    </div>
  </section>

  ${ctaBand({
    title: 'Не знаете, к какому врачу записаться?',
    text: 'Опишите администратору, что беспокоит. Он подберёт специалиста или предложит начать с диагностики.',
    context: 'doctors-index',
    message: 'Здравствуйте. Подскажите, к какому врачу мне записаться.',
    primaryLabel: 'Помогите выбрать врача',
  })}`;
}

export function doctorPage({ manifest, doctor, services, articles, prices }) {
  const consultations = (doctor.consultationTiers ?? [doctor.consultationTier])
    .map((tier) => prices.consultationByTier[tier])
    .filter(Boolean);
  const docServices = doctor.services.map((s) => services.find((x) => x.slug === s)).filter(Boolean);
  const authored = articles.filter((a) => a.author === doctor.slug || a.relatedDoctor === doctor.slug);

  const photo = doctor.photo
    ? portraitImage(manifest, doctor.photo, doctor.photoAlt, {
        sizes: '(min-width: 56rem) 30vw, 80vw',
        priority: true,
      })
    : `<div class="portrait portrait--square"><div class="monogram">${esc(initials(doctor.name))}</div></div>`;

  return `
  <section class="section section--tight">
    <div class="shell">
      ${breadcrumbs([
        { href: '/', label: 'Главная' },
        { href: '/doctors/', label: 'Врачи' },
        { href: `/doctors/${doctor.slug}/`, label: doctor.name },
      ])}
      <div class="split split--center">
        <div class="content-portrait">${photo}</div>
        <div class="stack stack--gap-115">
          <span class="kicker">${esc(doctor.role)}</span>
          <h1 class="display t-h1">${esc(doctor.name)}</h1>
          <p class="t-lead">${esc(doctor.lead)}</p>
          <dl class="info-list info-list--facts">
            ${doctor.facts
              .map(
                (f) => `<div><dt>${esc(f.label)}</dt>
                  <dd class="info-list__value">${esc(f.value)}</dd></div>`
              )
              .join('')}
          </dl>
          ${ctaPair({
            context: `doctor-${doctor.slug}`,
            message: `Здравствуйте. Хочу записаться к врачу ${doctor.name}. Направление: ${doctor.role}.`,
            primaryLabel: `Записаться к ${doctor.bookingName ?? doctor.shortName}`,
          })}
        </div>
      </div>
    </div>
  </section>

  <section class="section section--bone">
    <div class="shell split">
      <div class="stack stack--gap-1">
        <span class="kicker">Приём</span>
        <h2 class="display t-h2">С чем обращаются к врачу</h2>
      </div>
      <div class="prose">${list(doctor.treats)}</div>
    </div>
  </section>

  <section class="section">
    <div class="shell split">
      <div class="stack stack--gap-1">
        <span class="kicker">Методы</span>
        <h2 class="display t-h2">Как работает</h2>
      </div>
      <div class="prose">${list(doctor.methods)}</div>
    </div>
  </section>

  <section class="section section--bone">
    <div class="shell">
      ${sectionHead({ kicker: 'Направления', title: 'Услуги врача' })}
      <div class="grid grid--3">
        ${docServices
          .map(
            (s) => `<a class="card card--service" href="/services/${attr(s.slug)}/">
              <h3 class="card__title">${esc(s.navLabel)}</h3>
              <p class="card__text">${esc(s.result)}</p>
              <span class="card__foot">Подробнее →</span>
            </a>`
          )
          .join('')}
      </div>
      ${
        consultations.length
          ? `<div class="mt-4">${priceBlock({ title: 'Варианты консультации', rows: consultations })}${priceDisclaimer(
              prices
            )}</div>`
          : ''
      }
    </div>
  </section>

  ${
    authored.length
      ? `<section class="section">
    <div class="shell">
      ${sectionHead({ kicker: 'Публикации', title: 'Статьи врача' })}
      <div class="grid grid--3">${authored.slice(0, 3).map((a) => postCard(manifest, a, categories)).join('')}</div>
    </div>
  </section>`
      : ''
  }

  ${ctaBand({
    title: `Записаться к врачу ${doctor.bookingName ?? doctor.shortName}`,
    text: `${contacts.adminSla}. ${contacts.hoursDisplay}.`,
    context: `doctor-${doctor.slug}-footer`,
    message: `Здравствуйте. Хочу записаться к врачу ${doctor.name}. Направление: ${doctor.role}.`,
    primaryLabel: `Записаться к ${doctor.bookingName ?? doctor.shortName}`,
  })}`;
}

/* --------------------------------------------------------- chief doctor page */

export function chiefPage({ manifest, doctor, services, articles, prices }) {
  const consultation = prices.consultationByTier[doctor.consultationTier];
  const chiefServices = chief.services.map((s) => services.find((x) => x.slug === s)).filter(Boolean);
  const reviewed = articles.filter(
    (a) => a.reviewer === doctor.slug && a.reviewedAt && a.reviewEvidence
  );

  return `
  <section class="section section--tight">
    <div class="shell">
      ${breadcrumbs([
        { href: '/', label: 'Главная' },
        { href: '/doctors/', label: 'Врачи' },
        { href: '/doctors/raimov-atabek/', label: 'Главный врач' },
      ])}
      <div class="split split--center">
        <div class="content-portrait">
          ${portraitImage(manifest, doctor.photo, doctor.photoAlt, {
            sizes: '(min-width: 56rem) 30vw, 80vw',
            priority: true,
          })}
        </div>
        <div class="stack stack--gap-115">
          <span class="kicker">Главный врач и основатель клиники</span>
          <h1 class="display t-h1">${esc(doctor.name)}</h1>
          <p class="t-lead">${esc(chief.positioning)}</p>
          <div class="hero__facts hero__facts--offset">
            ${chief.figures
              .map(
                (f) => `<div><div class="fact__value numeral">${esc(f.value)}</div>
                  <div class="fact__label">${esc(f.label)}<br><span class="t-small">${esc(f.source)}</span></div></div>`
              )
              .join('')}
          </div>
          ${ctaPair({
            context: 'chief-hero',
            message: chief.whatsappMessage,
            primaryLabel: 'Записаться к Атабеку Саидовичу',
          })}
        </div>
      </div>
    </div>
  </section>

  <section class="section section--forest fluted">
    <div class="shell shell--narrow shell--centered text-center">
      <p class="chief__quote">«${esc(chief.quote)}»</p>
      <p class="t-small chief__quote-note mt-2">${esc(chief.quoteNote)}</p>
    </div>
  </section>

  <section class="section">
    <div class="shell split">
      <div class="stack stack--gap-1">
        <span class="kicker">Подход</span>
        <h2 class="display t-h2">Прикус и сустав — одна система</h2>
      </div>
      <div class="prose">${chief.intro.map((p) => `<p>${inline(p)}</p>`).join('')}</div>
    </div>
  </section>

  <section class="section section--bone">
    <div class="shell split">
      <div class="stack stack--gap-1">
        <span class="kicker">Клинический профиль</span>
        <h2 class="display t-h2">${esc(chief.focus.title)}</h2>
      </div>
      <div class="prose">${list(chief.focus.items)}</div>
    </div>
  </section>

  <section class="section">
    <div class="shell">
      ${sectionHead({ kicker: 'Инструменты', title: chief.methods.title })}
      <div class="grid grid--2">
        ${chief.methods.items
          .map(
            (m) => `<div class="card card--service">
              <h3 class="card__title">${esc(m.name)}</h3>
              <p class="card__text">${esc(m.text)}</p>
            </div>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="section section--bone">
    <div class="shell">
      ${sectionHead({
        kicker: 'Вне приёма',
        title: 'Преподавание и профессиональное сообщество',
        lead: 'Часть работы главного врача — обучение практикующих стоматологов и разбор клинических случаев с коллегами.',
      })}
      <div class="grid grid--2">
        ${chief.practice
          .filter((p) => p.verified)
          .map(
            (p) => `<div class="card">
              <h3 class="card__title">${esc(p.title)}</h3>
              <p class="card__text">${esc(p.text)}</p>
            </div>`
          )
          .join('')}
      </div>
      ${
        chief.talks.length
          ? `<div class="mt-4"><h3 class="card__title">Выступления</h3><div class="prose mt-1">${list(
              chief.talks.map((t) => `[${t.title}](${t.url}) — ${t.venue}${t.date ? `, ${t.date}` : ''}`)
            )}</div></div>`
          : ''
      }
      ${
        social.chiefInstagram
          ? `<p class="t-small mt-3">Клинические разборы и учебные материалы Атабек Саидович публикует в
              <a href="${attr(social.chiefInstagram)}" rel="noopener nofollow" target="_blank">Instagram
              @doctor_raimov</a>.</p>`
          : ''
      }
    </div>
  </section>

  <section class="section">
    <div class="shell">
      ${sectionHead({ kicker: 'Квалификация', title: 'Дипломы и сертификаты' })}
      ${
        chief.credentials.length
          ? `<div class="gallery">${chief.credentials
              .map(
                (c) => `<figure>${image(manifest, c.image, c.alt, {
                  sizes: '(min-width: 56rem) 22vw, 45vw',
                })}<figcaption>${esc(c.title)}</figcaption></figure>`
              )
              .join('')}</div>`
          : `<p class="medical-note">${esc(chief.credentialsFallback)}</p>`
      }
    </div>
  </section>

  <section class="section section--bone">
    <div class="shell">
      ${sectionHead({ kicker: 'Направления', title: 'Приём главного врача' })}
      <div class="grid grid--3">
        ${chiefServices
          .map(
            (s) => `<a class="card card--service" href="/services/${attr(s.slug)}/">
              <h3 class="card__title">${esc(s.navLabel)}</h3>
              <p class="card__text">${esc(s.result)}</p>
              <span class="card__foot">Подробнее →</span>
            </a>`
          )
          .join('')}
      </div>
      ${
        consultation
          ? `<div class="mt-4">${priceBlock({
              title: 'Консультация главного врача',
              rows: [consultation, prices.consultationByTier.gnathology].filter(Boolean),
            })}${priceDisclaimer(prices)}</div>`
          : ''
      }
    </div>
  </section>

  ${
    reviewed.length
      ? `<section class="section">
    <div class="shell">
      ${sectionHead({
        kicker: 'Медицинская проверка',
        title: 'Материалы блога, прошедшие проверку',
        lead: 'Медицинские утверждения в статьях блога проверяет главный врач перед публикацией.',
      })}
      <div class="grid grid--3">${reviewed.slice(0, 3).map((a) => postCard(manifest, a, categories)).join('')}</div>
      <p class="mt-3"><a class="link-arrow" href="/blog/">Все статьи блога →</a></p>
    </div>
  </section>`
      : ''
  }

  ${ctaBand({
    title: 'Записаться к главному врачу',
    text: 'Консультация по ортодонтии и гнатологии. Опишите жалобы администратору — он подберёт удобное время.',
    context: 'chief-footer',
    message: chief.whatsappMessage,
    primaryLabel: 'Записаться к Атабеку Саидовичу',
  })}`;
}

/* ------------------------------------------------------------------- blog */

export function blogIndexPage({ manifest, articles }) {
  const sorted = [...articles].sort((a, b) => b.published.localeCompare(a.published));
  const [feature, ...rest] = sorted;

  return `
  <section class="section section--tight">
    <div class="shell">
      ${breadcrumbs([{ href: '/', label: 'Главная' }, { href: '/blog/', label: 'Блог' }])}
      <div class="section-head">
        <span class="kicker">Блог ${esc(brand.name)}</span>
        <h1 class="display t-h1">Понятно о здоровье зубов и современных методах лечения</h1>
        <p class="t-lead">Врачи клиники рассказывают, как распознать проблему, выбрать метод лечения
          и избежать лишних процедур.</p>
        <p class="t-small t-mute">Материалы носят справочный характер и не заменяют очный приём.
          Медицинская проверка указывается только у статей с подтверждённым согласованием.</p>
      </div>
      <div class="chip-row">
        <a class="chip" aria-current="true" href="/blog/">Все материалы</a>
        ${Object.values(categories)
          .map((c) => `<a class="chip" href="/blog/${attr(c.slug)}/">${esc(c.label)}</a>`)
          .join('')}
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="shell">${postCard(manifest, feature, categories, {
      feature: true,
      headingLevel: 2,
    })}</div>
  </section>

  ${Object.values(categories)
    .map((cat) => {
      const items = rest.filter((a) => a.category === cat.id);
      if (!items.length) return '';
      return `<section class="section section--tight" aria-labelledby="cat-${cat.id}">
        <div class="shell">
          ${sectionHead({ kicker: cat.label, title: cat.blurb, id: `cat-${cat.id}` })}
          <div class="grid grid--3">${items.map((a) => postCard(manifest, a, categories)).join('')}</div>
          <p class="mt-3"><a class="link-arrow" href="/blog/${attr(cat.slug)}/">Все материалы рубрики →</a></p>
        </div>
      </section>`;
    })
    .join('')}

  ${ctaBand({
    title: 'Не уверены, с чего начать?',
    text: 'Расскажите администратору, что беспокоит. Он поможет выбрать специалиста и удобное время консультации.',
    context: 'blog-index',
    message: 'Здравствуйте. Читаю блог Expert Dental Studio и хочу записаться на консультацию.',
    primaryLabel: 'Помогите выбрать врача',
  })}`;
}

export function blogCategoryPage({ manifest, category, articles, services }) {
  const service = services.find((s) => s.slug === category.service);
  return `
  <section class="section section--tight">
    <div class="shell">
      ${breadcrumbs([
        { href: '/', label: 'Главная' },
        { href: '/blog/', label: 'Блог' },
        { href: `/blog/${category.slug}/`, label: category.label },
      ])}
      <div class="section-head">
        <span class="kicker">Рубрика</span>
        <h1 class="display t-h1">${esc(category.label)}</h1>
        <p class="t-lead">${esc(category.blurb)}</p>
      </div>
      <div class="chip-row">
        <a class="chip" href="/blog/">Все материалы</a>
        ${Object.values(categories)
          .map(
            (c) =>
              `<a class="chip" href="/blog/${attr(c.slug)}/"${
                c.id === category.id ? ' aria-current="true"' : ''
              }>${esc(c.label)}</a>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="section section--tight">
    <div class="shell">
      <div class="grid grid--3">${articles
        .map((a) => postCard(manifest, a, categories, { headingLevel: 2 }))
        .join('')}</div>
      ${
        service
          ? `<p class="mt-4"><a class="link-arrow" href="/services/${attr(service.slug)}/">
            Услуга по теме: ${esc(service.navLabel)} →</a></p>`
          : ''
      }
    </div>
  </section>

  ${ctaBand({
    title: 'Остались вопросы по теме?',
    text: `${contacts.adminSla}. Напишите — подберём врача и время.`,
    context: `blog-cat-${category.id}`,
    message: `Здравствуйте. У меня вопрос по теме «${category.label}».`,
    primaryLabel: 'Обсудить тему с врачом',
  })}`;
}

/* ------------------------------------------------------------- article page */

export function articlePage({ manifest, article, author, reviewer, category, services, articles, prices }) {
  const usedRefs = [];
  const service = services.find((s) => s.slug === article.relatedService);
  const relatedDoc = article.relatedDoctor;
  const relatedArticles = article.relatedArticles.map((s) => articles.find((a) => a.slug === s)).filter(Boolean);

  const headings = article.blocks.filter((b) => b.t === 'h2');
  const slugify = (s) =>
    s
      .toLowerCase()
      .replace(/[^a-zа-яё0-9]+/gi, '-')
      .replace(/^-|-$/g, '');

  const bodyHtml = article.blocks
    .map((b) => {
      switch (b.t) {
        case 'h2':
          return `<h2 id="${attr(slugify(b.text))}">${esc(b.text)}</h2>`;
        case 'h3':
          return `<h3 id="${attr(slugify(b.text))}">${esc(b.text)}</h3>`;
        case 'p':
          return `<p>${inline(money(b.text, prices), { refs: references, used: usedRefs })}</p>`;
        case 'ul':
          return `<ul>${b.items
            .map((i) => `<li>${inline(i, { refs: references, used: usedRefs })}</li>`)
            .join('')}</ul>`;
        case 'ol':
          return `<ol>${b.items
            .map((i) => `<li>${inline(i, { refs: references, used: usedRefs })}</li>`)
            .join('')}</ol>`;
        case 'table':
          return `<div class="table-scroll" tabindex="0" role="region"
            aria-label="Таблица в статье"><table>
            <thead><tr>${b.head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead>
            <tbody>${b.rows
              .map((r) => `<tr>${r.map((c) => `<td>${inline(c, { refs: references, used: usedRefs })}</td>`).join('')}</tr>`)
              .join('')}</tbody>
          </table></div>`;
        case 'callout':
          return `<div class="callout callout--${attr(b.variant)}">
            <div class="callout__title">${esc(b.title)}</div>
            ${b.text ? `<p>${inline(b.text, { refs: references, used: usedRefs })}</p>` : ''}
            ${b.items ? list(b.items) : ''}
          </div>`;
        case 'priceTable': {
          const rows = pickRows(prices, b.direction, b.filter);
          return rows.length ? priceBlock({ title: b.caption ?? 'Стоимость', rows }) : '';
        }
        default:
          throw new Error(`Unknown block type "${b.t}" in article ${article.slug}`);
      }
    })
    .join('\n');

  const refsHtml = usedRefs.length
    ? `<section class="refs mt-4" aria-labelledby="refs-title">
        <h2 class="card__title" id="refs-title">Источники</h2>
        <ol class="mt-1">${usedRefs
          .map((id) => {
            const r = references[id];
            return `<li><a href="${attr(r.url)}" target="_blank" rel="noopener nofollow">${esc(r.title)}</a>
              <span class="t-mute">— ${esc(r.org)}</span></li>`;
          })
          .join('')}</ol>
      </section>`
    : '';

  const authorPhoto = author.photo
    ? image(manifest, author.photo, author.photoAlt, { sizes: '4.5rem' })
    : `<div class="monogram monogram--small">${esc(initials(author.name))}</div>`;

  return `
  <article data-article-slug="${attr(article.slug)}">
  <section class="shell shell--narrow article-head">
    ${breadcrumbs([
      { href: '/', label: 'Главная' },
      { href: '/blog/', label: 'Блог' },
      { href: `/blog/${category.slug}/`, label: category.label },
      { href: `/blog/${article.slug}/`, label: article.title },
    ])}
    <span class="kicker">${esc(category.label)}</span>
    <h1 class="display t-h1 mt-1">${esc(article.title)}</h1>
    <p class="t-lead mt-2">${esc(article.excerpt)}</p>
    <div class="byline mt-3">
      <span>Автор: <strong>${esc(author.name)}</strong>, ${esc(author.role.toLowerCase())}</span>
      ${
        article.reviewedAt && article.reviewEvidence
          ? `<span data-review-evidence="${attr(article.reviewEvidence)}">Медицинская проверка:
              <strong>${esc(reviewer.name)}</strong>,
              ${formatDate(article.reviewedAt)}</span>`
          : ''
      }
      <span>Обновлено ${formatDate(article.updated)}</span>
      <span>${article.readingTime} мин чтения</span>
    </div>
  </section>

  <div class="shell shell--narrow">
    ${archImage(manifest, article.cover, article.coverAlt, {
      modifier: 'arch--sm',
      sizes: '(min-width: 44rem) 44rem, 92vw',
      priority: true,
    })}
  </div>

  <section class="shell shell--narrow mt-4">
    <div class="summary-box">
      <div class="toc__title">Коротко</div>
      <ul>${article.summary.map((s) => `<li><span>${inline(s)}</span></li>`).join('')}</ul>
    </div>

    <nav class="toc mt-3" aria-labelledby="toc-title">
      <div class="toc__title" id="toc-title">Содержание</div>
      <ol>${headings.map((h) => `<li><a href="#${attr(slugify(h.text))}">${esc(h.text)}</a></li>`).join('')}</ol>
    </nav>

    <div class="prose mt-4">${bodyHtml}</div>

    ${refsHtml}

    <div class="medical-note mt-4" data-article-end>
      Материал носит информационный характер и не заменяет очную консультацию. Диагноз ставится только
      после осмотра, а при необходимости — по результатам снимков.
      ${
        article.reviewedAt && article.reviewEvidence
          ? `Медицинскую проверку материала выполнил ${esc(reviewer.name)},
              ${esc(reviewer.role.toLowerCase())}. Дата проверки — ${formatDate(article.reviewedAt)}.`
          : ''
      }
    </div>

    <div class="author-box mt-3">
      <div class="author-box__photo">${authorPhoto}</div>
      <div>
        <div class="card__title">${esc(author.name)}</div>
        <p class="card__text">${esc(author.role)} · ${esc(author.specialtyLine)}</p>
        <p class="mt-1"><a class="link-arrow" href="/doctors/${attr(author.slug)}/">Профиль врача →</a></p>
      </div>
    </div>

    ${
      service
        ? `<div class="callout callout--note mt-3">
            <div class="callout__title">Услуга по теме</div>
            <p><a href="/services/${attr(service.slug)}/"><strong>${esc(service.title)}</strong></a> — ${esc(
            service.result
          )}.</p>
            <p class="mt-1"><a class="link-arrow" href="/doctors/${attr(relatedDoc)}/">Врач по этому направлению →</a></p>
          </div>`
        : ''
    }

    <div class="mt-4">${faqBlock(article.faq, { idPrefix: `art-${article.slug}`, prices })}</div>
  </section>
  </article>

  ${ctaBand({
    title: 'Обсудить тему с врачом',
    text: `${contacts.adminSla}. ${contacts.hoursDisplay}.`,
    context: `article-${article.slug}`,
    message: `Здравствуйте. Я прочитал статью «${article.title}»${
      service ? ` по направлению «${service.navLabel}»` : ''
    } и хочу обсудить тему с врачом.`,
    primaryLabel: 'Обсудить тему с врачом',
  })}

  ${
    relatedArticles.length
      ? `<section class="section section--bone">
    <div class="shell">
      ${sectionHead({ kicker: 'Читать дальше', title: 'Связанные материалы' })}
      <div class="grid grid--3">${relatedArticles.map((a) => postCard(manifest, a, categories)).join('')}</div>
    </div>
  </section>`
      : ''
  }`;
}

/* ------------------------------------------------------------ static pages */

export function aboutPage({ manifest, doctors, prices }) {
  const gallery = [
    ['clinic/reception', 'Ресепшен Expert Dental Studio'],
    ['clinic/waiting', 'Зона ожидания'],
    ['clinic/operatory', 'Лечебный кабинет'],
    ['clinic/ortho-room', 'Кабинет ортодонтии'],
    ['clinic/sterilization', 'Стерилизационная'],
    ['clinic/neon', 'Интерьер клиники'],
  ];

  return `
  <section class="section section--tight">
    <div class="shell">
      ${breadcrumbs([{ href: '/', label: 'Главная' }, { href: '/about/', label: 'О клинике' }])}
      <div class="split split--center">
        <div class="stack stack--gap-115">
          <span class="kicker">О клинике</span>
          <h1 class="display t-h1">Клиника, где план лечения составляют до его начала</h1>
          <p class="t-lead">Expert Dental Studio — стоматология в центре Бишкека. Мы работаем командой:
            ортодонт, гнатолог, хирург-имплантолог, ортопед и терапевты согласуют этапы между собой,
            а не лечат каждый свою часть отдельно.</p>
          ${ctaPair({
            context: 'about-hero',
            message: 'Здравствуйте. Читаю страницу «О клинике» и хочу записаться на первичный приём.',
            primaryLabel: 'Записаться на первичный приём',
          })}
        </div>
        ${archImage(manifest, 'clinic/hall', 'Интерьер Expert Dental Studio', {
          sizes: '(min-width: 56rem) 44vw, 92vw',
          priority: true,
        })}
      </div>
    </div>
  </section>

  <section class="section section--bone">
    <div class="shell">
      ${sectionHead({ kicker: 'Как мы работаем', title: 'Четыре принципа' })}
      <div class="steps steps--row">
        <div class="step"><div class="step__title">Диагностика до лечения</div>
          <p class="step__text">Осмотр, фотопротокол и снимки по показаниям. План и стоимость известны до начала работы.</p></div>
        <div class="step"><div class="step__title">Один план на всех врачей</div>
          <p class="step__text">Если задача требует нескольких специалистов, они согласуют последовательность этапов.</p></div>
        <div class="step"><div class="step__title">Сустав оценивается по показаниям</div>
          <p class="step__text">Перед большим протезированием или ортодонтией врач определяет,
            нужна ли функциональная диагностика положения нижней челюсти.</p></div>
        <div class="step"><div class="step__title">Один источник цен</div>
          <p class="step__text">Прайс на сайте, у администратора и у врача — один и тот же.</p></div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="shell">
      ${sectionHead({ kicker: 'Клиника', title: 'Как у нас внутри' })}
      <div class="gallery">
        ${gallery
          .map(
            ([img, alt]) => `<figure>${image(manifest, img, alt, {
              sizes: '(min-width: 56rem) 22vw, 45vw',
            })}<figcaption>${esc(alt)}</figcaption></figure>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="section section--forest equipment-safety" aria-labelledby="equipment-safety-title">
    <div class="shell">
      ${sectionHead({
        kicker: 'Оборудование и безопасность',
        title: 'Инструменты выбирают по задаче, а не ради технологии',
        id: 'equipment-safety-title',
      })}
      <p class="t-lead shell--narrow">
        Оборудование помогает врачу увидеть детали и контролировать этапы лечения. Конкретный метод
        обследования или изоляции назначают после осмотра — не каждому пациенту нужен весь список.
      </p>
      <div class="grid grid--3 mt-4">
        <article class="step">
          <h3 class="step__title">КТ по показаниям</h3>
          <p class="step__text">Трёхмерное исследование используют, когда врачу нужно оценить кость,
            корни или положение непрорезавшихся зубов. Назначение определяет врач.</p>
        </article>
        <article class="step">
          <h3 class="step__title">Микроскоп</h3>
          <p class="step__text">Увеличение применяют при сложной анатомии корневых каналов,
            перелечивании и поиске инородных фрагментов — по клинической необходимости.</p>
        </article>
        <article class="step">
          <h3 class="step__title">Внутриротовое сканирование</h3>
          <p class="step__text">Цифровая модель помогает планировать ортодонтические,
            ортопедические и эстетические этапы без традиционного слепка, когда это уместно.</p>
        </article>
        <article class="step">
          <h3 class="step__title">Изоляция коффердамом</h3>
          <p class="step__text">Рабочее поле изолируют от слюны при реставрациях и лечении каналов,
            если этого требует выбранный клинический протокол.</p>
        </article>
        <article class="step">
          <h3 class="step__title">Стерилизационная</h3>
          <p class="step__text">Отдельное помещение стерилизационной показано в фотогалерее выше.
            Вопросы о порядке обработки инструментов можно задать администратору до приёма.</p>
        </article>
        <article class="step">
          <h3 class="step__title">Air Flow и ультразвук</h3>
          <p class="step__text">Метод снятия мягких и твёрдых отложений подбирают после оценки
            состояния эмали, дёсен и объёма налёта.</p>
        </article>
      </div>
    </div>
  </section>

  <section class="section section--bone">
    <div class="shell">
      ${sectionHead({ kicker: 'Команда', title: 'Врачи клиники' })}
      <div class="grid grid--4">${doctors.slice(0, 8).map((d) => doctorCard(manifest, d)).join('')}</div>
      <p class="mt-3"><a class="link-arrow" href="/doctors/">Все врачи →</a></p>
    </div>
  </section>

  ${contactStrip(manifest)}

  ${ctaBand({
    title: 'Приходите на диагностику',
    text: `${contacts.hoursDisplay}. ${contacts.parking}.`,
    context: 'about-footer',
    message: 'Здравствуйте. Читаю страницу «О клинике» и хочу записаться на диагностику.',
    primaryLabel: 'Записаться на диагностику',
  })}`;
}

export function contactsPage({ manifest }) {
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(contacts.mapQuery)}&output=embed&hl=ru`;
  return `
  <section class="section section--tight">
    <div class="shell">
      ${breadcrumbs([{ href: '/', label: 'Главная' }, { href: '/contacts/', label: 'Контакты' }])}
      <div class="split">
        <div class="stack stack--gap-15">
          <div>
            <span class="kicker">Контакты</span>
            <h1 class="display t-h1 mt-1">Как нас найти</h1>
          </div>
          <dl class="info-list">
            <div><dt>Адрес</dt><dd class="info-list__value">${esc(contacts.addressFull)}<br>
              <span class="t-small t-mute">${esc(contacts.streetNote)}</span></dd></div>
            <div><dt>Телефон</dt><dd class="info-list__value">
              <a href="${attr(telHref())}">${esc(contacts.phoneDisplay)}</a></dd></div>
            <div><dt>WhatsApp</dt><dd class="info-list__value">
              <a href="${attr(
                waHref('Здравствуйте. Пишу со страницы контактов Expert Dental Studio.')
              )}" data-cta-context="contacts-details">${esc(contacts.phoneDisplay)}</a><br>
              <span class="t-small t-mute">${esc(contacts.whatsappNote)}. ${esc(contacts.adminSla)}.</span></dd></div>
            <div><dt>Часы работы</dt><dd class="info-list__value">${esc(
              contacts.hoursDisplay
            )}</dd></div>
            <div><dt>Парковка</dt><dd class="info-list__value">${esc(contacts.parking)}</dd></div>
          </dl>
          ${ctaPair({
            context: 'contacts',
            message: 'Здравствуйте. Хочу записаться на приём. Подскажите, пожалуйста, свободное время.',
            primaryLabel: 'Записаться на приём',
          })}
        </div>
        <div class="stack stack--gap-1">
          ${archImage(manifest, 'clinic/facade', 'Фасад здания, в котором находится Expert Dental Studio', {
            modifier: 'arch--sm',
            sizes: '(min-width: 56rem) 44vw, 92vw',
            priority: true,
          })}
          <div class="map-frame">
            <iframe src="${attr(mapSrc)}" title="Карта: ${attr(contacts.addressFull)}" loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>

  ${ctaBand({
    title: 'Напишите — ответим быстро',
    text: `${contacts.whatsappNote}. ${contacts.adminSla}.`,
    context: 'contacts-footer',
    message: 'Здравствуйте. Пишу со страницы контактов, хочу записаться на приём.',
    primaryLabel: 'Записаться на приём',
  })}`;
}

export function legalPage({ kind }) {
  const isPrivacy = kind === 'privacy';
  const title = isPrivacy ? 'Политика конфиденциальности' : 'Правовая информация';
  const href = isPrivacy ? '/privacy/' : '/legal/';

  const privacyBody = `
    <h2>Какие данные мы получаем</h2>
    <p>Сайт не создаёт личных кабинетов и не хранит форму записи на своём сервере. Форма составляет
      сообщение и открывает WhatsApp; до отправки вы можете проверить и изменить его. WhatsApp является
      сторонним сервисом и обрабатывает отправленные данные по своим условиям. Не отправляйте через
      форму диагнозы, снимки, медицинские документы и другие чувствительные сведения.</p>
    <p>При записи вы добровольно передаёте имя, номер телефона и краткую тему обращения после отдельного
      согласия с этой политикой. Также данные могут быть переданы при звонке администратору.</p>
    <h2>Зачем они нужны</h2>
    <ul>
      <li>Записать вас на приём и согласовать время.</li>
      <li>Ответить на вопрос о лечении или стоимости.</li>
      <li>Напомнить о назначенном визите.</li>
    </ul>
    <p>Данные не используются для рассылок без вашего согласия. Доступ к ним получают только
      сотрудники и технические обработчики, необходимые для записи и связи, либо лица,
      которым данные должны быть переданы по законодательству Кыргызской Республики.</p>
    <h2>Обратная связь после визита</h2>
    <p>По персональной ссылке вы можете добровольно поставить оценку и выбрать одну или несколько
      тем обращения. Свободный текст и медицинские сведения Review Hub не собирает. Перед отправкой
      сайт запрашивает отдельное согласие. Оценка и темы хранятся до 60 дней в защищённом журнале,
      после чего удаляются. В уведомление управляющему передаётся только обезличенный номер обращения —
      без оценки, врача, услуги и выбранных тем. Разрешение связаться в WhatsApp запрашивается отдельно
      и не выбирается заранее.</p>
    <h2>Медицинская тайна</h2>
    <p>Сведения о вашем обращении, диагнозе и лечении составляют врачебную тайну. Клинические фотографии
      и материалы лечения публикуются только с отдельного письменного согласия пациента.</p>
    <h2>Аналитика</h2>
    <p>Для оценки работы сайта могут применяться сервисы веб-аналитики, собирающие обезличенные данные
      о посещениях: страницы, источник перехода, тип устройства. Эти данные не позволяют вас
      идентифицировать. Отключить сбор можно средствами браузера.</p>
    <h2>Как связаться</h2>
    <p>По вопросам обработки персональных данных напишите в WhatsApp на номер
      <a href="${attr(waHref('Здравствуйте. У меня вопрос об обработке персональных данных.'))}">${esc(
        contacts.phoneDisplay
      )}</a> или обратитесь к администратору клиники
      по адресу ${esc(contacts.addressFull)}.</p>`;

  const legalBody = `
    <h2>О клинике</h2>
    <p>${esc(brand.name)} (${esc(brand.nameRu)}) — стоматологическая клиника в Бишкеке.
      Адрес: ${esc(contacts.addressFull)}. Телефон: ${esc(contacts.phoneDisplay)}.
      Часы работы: ${esc(contacts.hoursDisplay)}.</p>
    <h2>Лицензия</h2>
    <p>Клиника осуществляет медицинскую деятельность на основании лицензии. Реквизиты лицензии
      и разрешительные документы предоставляются по запросу в клинике.</p>
    <h2>Информация на сайте</h2>
    <ul>
      <li>Материалы сайта носят информационный характер и не являются медицинской консультацией.</li>
      <li>Диагноз ставится только после очного осмотра, при необходимости — по результатам исследований.</li>
      <li>Информация на сайте не является публичной офертой.</li>
      <li>Указанные цены являются ориентировочными. Итоговая стоимость определяется после осмотра
        и зависит от клинической ситуации, объёма лечения и выбранных материалов.</li>
      <li>Результат лечения зависит от исходной ситуации, выполнения рекомендаций и индивидуальных
        особенностей организма. Клиника не гарантирует конкретный результат заранее.</li>
    </ul>
    <h2>Противопоказания</h2>
    <p>Имеются противопоказания. Необходима консультация специалиста.</p>
    <h2>Материалы и права</h2>
    <p>Фотографии клиники, портреты врачей и тексты принадлежат ${esc(brand.name)}.
      Клинические материалы публикуются с согласия пациентов.</p>`;

  return `
  <section class="section section--tight">
    <div class="shell shell--narrow shell--centered">
      ${breadcrumbs([{ href: '/', label: 'Главная' }, { href, label: title }])}
      <h1 class="display t-h1">${esc(title)}</h1>
      <div class="prose mt-3">${isPrivacy ? privacyBody : legalBody}</div>
      <p class="medical-note mt-4">Страница обновлена ${formatDate(new Date().toISOString().slice(0, 10))}.</p>
    </div>
  </section>`;
}

export function notFoundPage() {
  return `
  <section class="section">
    <div class="shell shell--narrow shell--centered text-center">
      <span class="kicker">Ошибка 404</span>
      <h1 class="display t-h1 mt-1">Такой страницы нет</h1>
      <p class="t-lead mt-2">Возможно, адрес изменился. Начните с главной или посмотрите услуги и цены.</p>
      <div class="btn-row btn-row--center mt-3">
        <a class="btn btn--primary" href="/">На главную</a>
        <a class="btn btn--ghost" href="/services/">Услуги и цены</a>
      </div>
    </div>
  </section>`;
}

/** Internal-only build report; never linked and always noindex. */
export function pendingPage() {
  return `
  <section class="section">
    <div class="shell shell--narrow shell--centered">
      <h1 class="display t-h1">Материалы, ожидаемые от клиники</h1>
      <p class="t-lead mt-2">Служебная страница. Пока перечисленное не получено, соответствующие блоки
        сайта не публикуются — вместо них не ставятся выдуманные данные.</p>
      <div class="prose mt-3">${list(pendingFromClinic)}</div>
    </div>
  </section>`;
}
