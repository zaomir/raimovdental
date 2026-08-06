/**
 * Page renderers.
 *
 * Every page is assembled from the content modules; no copy is invented at render time.
 * Page order follows docs/ssot/EXPERT_DENTAL_WEBSITE_SSOT.md §8 (home), §9 (service),
 * §10 (doctor), §12 (prices), §14 (blog catalog) and §15 (article).
 */

import { brand, contacts, cta, pendingFromClinic, social } from '../config/site.mjs';
import { chief } from '../content/chief.mjs';
import { categories } from '../content/articles.mjs';
import { references } from '../content/references.mjs';
import {
  archImage,
  attr,
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
  postCard,
  priceBlock,
  telHref,
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

function list(items, { refs = references } = {}) {
  return `<ul>${items.map((i) => `<li>${inline(i, { refs })}</li>`).join('')}</ul>`;
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

export function homePage({ manifest, services, doctors, articles, prices }) {
  const featured = services.filter((s) => s.featured).sort((a, b) => a.order - b.order);
  const chiefDoctor = doctors.find((d) => d.chief);
  const latest = [...articles].sort((a, b) => b.published.localeCompare(a.published)).slice(0, 3);

  const problems = [
    { title: 'Щёлкает или болит челюсть', href: '/services/gnathology/', text: 'Диагностика ВНЧС и жевательных мышц.' },
    { title: 'Неправильный прикус', href: '/services/orthodontics/', text: 'Брекеты, элайнеры, расширение челюсти.' },
    { title: 'Нет одного или нескольких зубов', href: '/services/implantation/', text: 'Имплантация и протезирование.' },
    { title: 'Зуб разрушен, боюсь потерять', href: '/services/endodontics/', text: 'Лечение каналов под микроскопом.' },
    { title: 'Не нравится улыбка', href: '/services/veneers/', text: 'Виниры и эстетическая реставрация.' },
    { title: 'Ребёнок боится стоматолога', href: '/services/pediatric-dentistry/', text: 'Детский приём с адаптацией.' },
  ];

  const firstVisit = [
    { title: 'Разговор', text: 'Что беспокоит, как давно и что уже делали раньше.' },
    { title: 'Осмотр и фотопротокол', text: 'Врач фиксирует исходное состояние — будет с чем сравнивать.' },
    { title: 'Снимки по показаниям', text: 'Рентген или КТ назначаются, когда осмотра недостаточно.' },
    { title: 'План и стоимость', text: 'Последовательность этапов и расчёт — до начала лечения.' },
  ];

  const equipment = [
    ['clinic/ct', 'Компьютерный томограф для планирования имплантации'],
    ['clinic/xray', 'Рентген-кабинет клиники'],
    ['clinic/sterilization', 'Стерилизационная: инструменты обрабатываются между приёмами'],
  ];

  const faq = [
    {
      q: 'Сколько стоит консультация?',
      a: 'Консультация платная, её стоимость зависит от врача и направления: общий приём, ортопедия и имплантация, ортодонтия и гнатология тарифицируются отдельно. Все тарифы указаны в разделе [услуги и цены](/services/).',
    },
    {
      q: 'Как записаться?',
      a: `Напишите в WhatsApp — он принимает сообщения круглосуточно, администратор отвечает в рабочее время. Либо позвоните по номеру ${contacts.phoneDisplay}.`,
    },
    {
      q: 'Где вы находитесь и есть ли парковка?',
      a: `${contacts.addressFull}, ${contacts.streetNote}. ${contacts.parking}.`,
    },
    {
      q: 'Можно ли поставить диагноз по фотографии?',
      a: 'Нет. По фотографии нельзя оценить состояние корня, кости и прикуса. Диагноз ставится только после очного осмотра, а при необходимости — по снимку.',
    },
    {
      q: 'Работаете ли вы с детьми?',
      a: 'Да. Детский приём ведут отдельные врачи, а первый визит строится как знакомство с кабинетом — подробнее на странице [детской стоматологии](/services/pediatric-dentistry/).',
    },
  ];

  return `
  <section class="hero">
    <div class="shell hero__grid">
      <div class="stack" style="--stack-gap:1.4rem">
        <span class="kicker">${esc(brand.legalNote)}</span>
        <h1 class="display hero__title">Стоматология <em>комплексного</em> лечения в Бишкеке</h1>
        <p class="t-lead">Ортодонтия, лечение ВНЧС, имплантация, протезирование и терапия — с единым планом
          и участием профильных специалистов, а не набором отдельных процедур.</p>
        ${ctaPair({
          context: 'hero',
          message: 'Здравствуйте. Хочу записаться на диагностику в Expert Dental Studio.',
        })}
        <div class="hero__facts">
          <div><div class="fact__value numeral">8</div><div class="fact__label">врачей разных направлений</div></div>
          <div><div class="fact__value numeral">${esc(contacts.hoursShort)}</div><div class="fact__label">приём ежедневно</div></div>
          <div><div class="fact__value numeral">24/7</div><div class="fact__label">WhatsApp принимает сообщения</div></div>
        </div>
      </div>
      <div class="hero__media">
        ${archImage(manifest, 'clinic/lounge', 'Интерьер Expert Dental Studio: зелёные панели и арочные ниши', {
          sizes: '(min-width: 56rem) 38vw, 92vw',
          priority: true,
        })}
        <div class="hero__badge">
          <span class="kicker">Профильное направление</span>
          <p class="t-small mt-1" style="margin-top:.35rem">Диагностика и лечение дисфункции височно-нижнечелюстного сустава</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section section--bone" aria-labelledby="problems-title">
    <div class="shell">
      ${sectionHead({
        kicker: 'С чем обращаются',
        title: 'Начните с того, что беспокоит',
        lead: 'Не обязательно знать название процедуры. Выберите проблему — дальше расскажем, как её решают и кто из врачей этим занимается.',
        id: 'problems-title',
      })}
      <div class="grid grid--3">
        ${problems
          .map(
            (p) => `<a class="card card--problem" href="${attr(p.href)}">
              <h3 class="card__title">${esc(p.title)}</h3>
              <p class="card__text">${esc(p.text)}</p>
              <span class="card__foot">Подробнее →</span>
            </a>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="services-title">
    <div class="shell">
      ${sectionHead({
        kicker: 'Направления',
        title: 'Что мы лечим',
        lead: 'Полный перечень услуг и актуальный прайс — в [разделе цен](/services/).',
        id: 'services-title',
      })}
      <div class="grid grid--3">
        ${featured
          .map(
            (s) => `<a class="card card--service" href="/services/${attr(s.slug)}/">
              <h3 class="card__title">${esc(s.navLabel)}</h3>
              <p class="card__text">${esc(s.result)}</p>
              <span class="card__foot">Подробнее →</span>
            </a>`
          )
          .join('')}
      </div>
    </div>
  </section>

  ${chiefBand(manifest, chiefDoctor)}

  <section class="section" aria-labelledby="team-title">
    <div class="shell">
      ${sectionHead({
        kicker: 'Команда',
        title: 'Врачи клиники',
        lead: 'Сложные планы ведёт не один специалист: ортодонт, хирург, ортопед и терапевт согласуют этапы между собой.',
        id: 'team-title',
      })}
      <div class="grid grid--4">
        ${doctors
          .slice(0, 8)
          .map((d) => doctorCard(manifest, d))
          .join('')}
      </div>
      <div class="mt-4">
        <figure class="team-band" style="margin:0">
          ${image(manifest, 'team/team', 'Команда врачей Expert Dental Studio', {
            sizes: '(min-width: 74rem) 74rem, 100vw',
          })}
          <figcaption class="team-band__caption">Команда Expert Dental Studio, Бишкек</figcaption>
        </figure>
      </div>
    </div>
  </section>

  <section class="section section--forest fluted" aria-labelledby="visit-title">
    <div class="shell">
      ${sectionHead({ kicker: 'Первый приём', title: 'Как проходит диагностика', id: 'visit-title' })}
      <div class="steps steps--row">
        ${firstVisit
          .map(
            (s) => `<div class="step">
              <div class="step__title">${esc(s.title)}</div>
              <p class="step__text">${esc(s.text)}</p>
            </div>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="equipment-title">
    <div class="shell split">
      <div class="stack" style="--stack-gap:1rem">
        <span class="kicker">Оборудование и безопасность</span>
        <h2 class="display t-h2" id="equipment-title">Диагностика на месте</h2>
        <p class="t-lead">Снимки и планирование выполняются в клинике, поэтому план лечения обсуждается на том же приёме,
          а не через неделю после визита в сторонний центр.</p>
        <ul class="chief__list" style="color:var(--ink-soft)">
          <li>Инструменты проходят полный цикл обработки между приёмами.</li>
          <li>Лечение проводится под изоляцией коффердамом там, где этого требует протокол.</li>
          <li>Рентгенологическое исследование назначается по показаниям, а не всем подряд.</li>
        </ul>
      </div>
      <div class="gallery">
        ${equipment
          .map(
            ([img, alt]) => `<figure>
              ${image(manifest, img, alt, { sizes: '(min-width: 56rem) 20vw, 45vw' })}
              <figcaption>${esc(alt)}</figcaption>
            </figure>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="section section--bone" aria-labelledby="prices-title">
    <div class="shell">
      ${sectionHead({
        kicker: 'Стоимость',
        title: 'С чего начинается счёт',
        lead: 'Диагностика оплачивается отдельно, и её стоимость известна заранее. Стоимость лечения называется после осмотра — до его начала.',
        id: 'prices-title',
      })}
      ${priceBlock({ title: 'Консультация и диагностика', rows: prices.byDirection.diagnostics.items })}
      ${priceDisclaimer(prices)}
      <p class="mt-3"><a class="link-arrow" href="/services/">Полный прайс по всем направлениям →</a></p>
    </div>
  </section>

  <section class="section" aria-labelledby="blog-title">
    <div class="shell">
      ${sectionHead({
        kicker: 'Блог',
        title: 'Понятно о лечении',
        lead: 'Материалы готовят врачи клиники. Каждый разбирает одну ситуацию и заканчивается тем, что делать дальше.',
        id: 'blog-title',
      })}
      <div class="grid grid--3">${latest.map((a) => postCard(manifest, a, categories)).join('')}</div>
      <p class="mt-3"><a class="link-arrow" href="/blog/">Все статьи →</a></p>
    </div>
  </section>

  <section class="section section--bone" aria-labelledby="home-faq">
    <div class="shell shell--narrow" style="margin-inline:auto">
      ${faqBlock(faq, { idPrefix: 'home', title: 'Частые вопросы' })}
    </div>
  </section>

  ${contactStrip(manifest)}

  ${ctaBand({
    title: 'Запишитесь на диагностику',
    text: `${contacts.adminSla}. ${contacts.hoursDisplay}.`,
    context: 'home-footer',
    message: 'Здравствуйте. Хочу записаться на диагностику в Expert Dental Studio.',
  })}`;
}

/* -------------------------------------------------------------- chief band */

function chiefBand(manifest, doctor) {
  return `<section class="section chief fluted" aria-labelledby="chief-title">
    <div class="shell chief__grid">
      <div class="chief__photo">
        ${image(manifest, doctor.photo, doctor.photoAlt, { sizes: '(min-width: 56rem) 24rem, 70vw' })}
      </div>
      <div class="stack" style="--stack-gap:1.25rem">
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
  return `<section class="section section--tight" aria-labelledby="contact-strip">
    <div class="shell split split--even">
      <div class="stack" style="--stack-gap:1.25rem">
        <span class="kicker">Как добраться</span>
        <h2 class="display t-h2" id="contact-strip">Клиника в центре Бишкека</h2>
        <dl class="info-list">
          <div><dt>Адрес</dt><dd class="info-list__value" style="margin:0">${esc(contacts.addressFull)}<br>
            <span class="t-small t-mute">${esc(contacts.streetNote)}</span></dd></div>
          <div><dt>Часы работы</dt><dd class="info-list__value" style="margin:0">${esc(contacts.hoursDisplay)}</dd></div>
          <div><dt>Парковка</dt><dd class="info-list__value" style="margin:0">${esc(contacts.parking)}</dd></div>
          <div><dt>Телефон и WhatsApp</dt><dd class="info-list__value" style="margin:0">
            <a href="${attr(telHref())}">${esc(contacts.phoneDisplay)}</a></dd></div>
        </dl>
      </div>
      <div class="gallery" style="grid-template-columns:1fr 1fr">
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

export function servicesIndexPage({ manifest, services, prices }) {
  const ordered = [...services].sort((a, b) => a.order - b.order);
  const directions = Object.values(prices.byDirection);

  return `
  <section class="section section--tight">
    <div class="shell">
      ${breadcrumbs([{ href: '/', label: 'Главная' }, { href: '/services/', label: 'Услуги и цены' }])}
      <div class="section-head" style="margin-bottom:2rem">
        <span class="kicker">Услуги и цены</span>
        <h1 class="display t-h1">Что мы лечим и сколько это стоит</h1>
        <p class="t-lead">Один прайс для сайта, администратора и врача. Итоговая стоимость определяется
          после осмотра — до начала лечения.</p>
      </div>
      <div class="grid grid--3">
        ${ordered
          .map(
            (s) => `<a class="card card--service" href="/services/${attr(s.slug)}/">
              <h2 class="card__title">${esc(s.navLabel)}</h2>
              <p class="card__text">${esc(s.result)}</p>
              <span class="card__foot">Подробнее →</span>
            </a>`
          )
          .join('')}
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
  })}`;
}

/* --------------------------------------------------------- service detail */

export function servicePage({ manifest, service, services, doctors, articles, prices }) {
  const serviceDoctors = service.doctors.map((slug) => doctors.find((d) => d.slug === slug)).filter(Boolean);
  const serviceArticles = service.articles.map((slug) => articles.find((a) => a.slug === slug)).filter(Boolean);
  const related = service.related.map((slug) => services.find((s) => s.slug === slug)).filter(Boolean);

  const priceRowsAll = (service.priceDirections || []).flatMap((d) => pickRows(prices, d, service.priceFilter));

  return `
  <section class="section section--tight">
    <div class="shell">
      ${breadcrumbs([
        { href: '/', label: 'Главная' },
        { href: '/services/', label: 'Услуги и цены' },
        { href: `/services/${service.slug}/`, label: service.navLabel },
      ])}
      <div class="split" style="align-items:center">
        <div class="stack" style="--stack-gap:1.25rem">
          <span class="kicker">${esc(service.kicker)}</span>
          <h1 class="display t-h1">${esc(service.title)}</h1>
          <p class="t-lead">${esc(service.lead)}</p>
          <p><strong>Результат:</strong> ${esc(service.result)}</p>
          ${ctaPair({
            context: `service-${service.slug}`,
            message: `Здравствуйте. Хочу записаться на консультацию — «${service.navLabel}».`,
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
      <div class="stack" style="--stack-gap:1rem">
        <span class="kicker">Симптомы и показания</span>
        <h2 class="display t-h2">Когда стоит записаться</h2>
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
      <div class="stack" style="--stack-gap:1rem">
        <span class="kicker">Диагностика</span>
        <h2 class="display t-h2">Что делают до лечения</h2>
        <p class="t-lead">План строится по результатам обследования, а не по названию услуги.</p>
      </div>
      <div class="prose">${list(service.diagnostics)}</div>
    </div>
  </section>

  <section class="section section--forest fluted">
    <div class="shell">
      ${sectionHead({ kicker: 'Варианты лечения', title: 'Что можно сделать' })}
      <div class="grid grid--2">
        ${service.options
          .map(
            (o) => `<div>
              <h3 class="card__title" style="color:var(--bone)">${esc(o.name)}</h3>
              <p class="card__text" style="color:rgba(247,244,239,.75)">${esc(o.text)}</p>
            </div>`
          )
          .join('')}
      </div>
    </div>
  </section>

  <section class="section">
    <div class="shell">
      ${sectionHead({ kicker: 'Этапы', title: 'Как проходит лечение' })}
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
      ${sectionHead({ kicker: 'Стоимость', title: 'Цены и что на них влияет', id: 'service-price' })}
      <div class="split">
        <div class="prose">
          <h3 style="margin-top:0">От чего зависит итоговая сумма</h3>
          ${list(service.priceFactors)}
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
      ${sectionHead({ kicker: 'Врачи', title: 'Кто ведёт это направление' })}
      <div class="grid grid--4">${serviceDoctors.map((d) => doctorCard(manifest, d)).join('')}</div>
    </div>
  </section>

  <section class="section section--bone">
    <div class="shell split">
      <div class="stack" style="--stack-gap:1rem">
        <span class="kicker">Ограничения</span>
        <h2 class="display t-h2">О чём важно знать заранее</h2>
        <p class="t-lead">Мы не обещаем результат заранее. Вот что реально влияет на прогноз.</p>
      </div>
      <div class="prose">${list(service.risks)}</div>
    </div>
  </section>

  <section class="section">
    <div class="shell shell--narrow" style="margin-inline:auto">
      ${faqBlock(service.faq, { idPrefix: `svc-${service.slug}` })}
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
    title: 'Запишитесь на диагностику',
    text: `${contacts.adminSla}. ${contacts.hoursDisplay}.`,
    context: `service-${service.slug}-footer`,
    message: `Здравствуйте. Хочу записаться на консультацию — «${service.navLabel}».`,
  })}`;
}

/* ---------------------------------------------------- membership (Care 12) */

/**
 * Expert Care 12 is a subscription product, not a treatment — it does not have symptoms,
 * pre-treatment diagnostics or clinical stages, so it gets its own layout instead of being
 * forced into `servicePage()`'s treatment-shaped sections. Prices come from
 * `prices.byDirection.care12` (PRICE_CATALOG.json) — this page never hardcodes a number.
 */
export function membershipPage({ manifest, membership, doctors, services, prices }) {
  const membershipDoctors = membership.doctors.map((slug) => doctors.find((d) => d.slug === slug)).filter(Boolean);
  const related = (membership.relatedServices || [])
    .map((slug) => services.find((s) => s.slug === slug))
    .filter(Boolean);
  const tierRows = prices.byDirection.care12 ? prices.byDirection.care12.items : [];

  return `
  <section class="section section--tight">
    <div class="shell">
      ${breadcrumbs([
        { href: '/', label: 'Главная' },
        { href: '/services/', label: 'Услуги и цены' },
        { href: `/services/${membership.slug}/`, label: membership.navLabel },
      ])}
      <div class="stack" style="--stack-gap:1.25rem;max-width:42rem">
        <span class="kicker">${esc(membership.kicker)}</span>
        <h1 class="display t-h1">${esc(membership.title)}</h1>
        <p class="t-lead">${esc(membership.lead)}</p>
        <div class="callout callout--note">
          <div class="callout__title">Не страховка</div>
          <p>${esc(membership.isInsuranceNote)}</p>
        </div>
        ${ctaPair({ context: `service-${membership.slug}`, message: membership.ctaMessage })}
      </div>
    </div>
  </section>

  <section class="section section--bone">
    <div class="shell split">
      <div class="prose">
        <h2 class="display t-h2">Что входит</h2>
        ${list(membership.includesGeneral)}
      </div>
      <div class="prose">
        <h2 class="display t-h2">Что не входит</h2>
        ${list(membership.excludesGeneral)}
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="care12-price">
    <div class="shell">
      ${sectionHead({ kicker: 'Тарифы', title: 'Expert Care 12 — цены', id: 'care12-price' })}
      ${tierRows.length ? priceBlock({ title: 'Тарифы Expert Care 12', rows: tierRows }) : ''}
      ${priceDisclaimer(prices)}
    </div>
  </section>

  <section class="section section--bone">
    <div class="shell prose">
      <h2 class="display t-h2">Правила доплат и лимитов</h2>
      ${list(membership.billingRules)}
    </div>
  </section>

  <section class="section">
    <div class="shell split">
      <div class="stack" style="--stack-gap:1rem">
        <span class="kicker">Кому подходит</span>
        <h2 class="display t-h2">Для кого этот абонемент</h2>
      </div>
      <div class="prose">${list(membership.suitableFor)}</div>
    </div>
  </section>

  ${
    membershipDoctors.length
      ? `<section class="section section--bone">
    <div class="shell">
      ${sectionHead({ kicker: 'Врачи', title: 'Кто ведёт профилактические визиты' })}
      <div class="grid grid--4">${membershipDoctors.map((d) => doctorCard(manifest, d)).join('')}</div>
    </div>
  </section>`
      : ''
  }

  <section class="section">
    <div class="shell shell--narrow" style="margin-inline:auto">
      ${faqBlock(membership.faq, { idPrefix: `svc-${membership.slug}` })}
    </div>
  </section>

  ${
    related.length
      ? `<section class="section section--tight">
    <div class="shell">
      <p class="kicker">Смежные направления</p>
      <div class="chip-row mt-1">
        ${related.map((r) => `<a class="chip" href="/services/${attr(r.slug)}/">${esc(r.navLabel)}</a>`).join('')}
      </div>
    </div>
  </section>`
      : ''
  }

  ${ctaBand({
    title: 'Оформить Expert Care 12',
    text: `${contacts.adminSla}. ${contacts.hoursDisplay}.`,
    context: `service-${membership.slug}-footer`,
    message: membership.ctaMessage,
  })}`;
}

/* --------------------------------------------------------------- doctors */

export function doctorsIndexPage({ manifest, doctors }) {
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
      <div class="grid grid--4">${rest.map((d) => doctorCard(manifest, d)).join('')}</div>
      <figure class="team-band mt-4" style="margin-inline:0">
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
  })}`;
}

export function doctorPage({ manifest, doctor, services, articles, prices }) {
  const consultation = prices.consultationByTier[doctor.consultationTier];
  const docServices = doctor.services.map((s) => services.find((x) => x.slug === s)).filter(Boolean);
  const authored = articles.filter((a) => a.author === doctor.slug || a.relatedDoctor === doctor.slug);

  const photo = doctor.photo
    ? archImage(manifest, doctor.photo, doctor.photoAlt, { sizes: '(min-width: 56rem) 30vw, 80vw', priority: true })
    : `<div class="arch" style="aspect-ratio:1"><div class="monogram">${esc(initials(doctor.name))}</div></div>`;

  return `
  <section class="section section--tight">
    <div class="shell">
      ${breadcrumbs([
        { href: '/', label: 'Главная' },
        { href: '/doctors/', label: 'Врачи' },
        { href: `/doctors/${doctor.slug}/`, label: doctor.name },
      ])}
      <div class="split" style="align-items:center">
        <div style="max-width:26rem">${photo}</div>
        <div class="stack" style="--stack-gap:1.15rem">
          <span class="kicker">${esc(doctor.role)}</span>
          <h1 class="display t-h1">${esc(doctor.name)}</h1>
          <p class="t-lead">${esc(doctor.lead)}</p>
          <dl class="info-list" style="grid-template-columns:repeat(auto-fit,minmax(9rem,1fr))">
            ${doctor.facts
              .map(
                (f) => `<div><dt>${esc(f.label)}</dt>
                  <dd class="info-list__value" style="margin:0">${esc(f.value)}</dd></div>`
              )
              .join('')}
          </dl>
          ${ctaPair({
            context: `doctor-${doctor.slug}`,
            message: `Здравствуйте. Хочу записаться на приём к врачу ${doctor.name}.`,
          })}
        </div>
      </div>
    </div>
  </section>

  <section class="section section--bone">
    <div class="shell split">
      <div class="stack" style="--stack-gap:1rem">
        <span class="kicker">Приём</span>
        <h2 class="display t-h2">С чем обращаются к врачу</h2>
      </div>
      <div class="prose">${list(doctor.treats)}</div>
    </div>
  </section>

  <section class="section">
    <div class="shell split">
      <div class="stack" style="--stack-gap:1rem">
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
        consultation
          ? `<div class="mt-4">${priceBlock({ title: 'Консультация', rows: [consultation] })}${priceDisclaimer(
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
    title: `Записаться к врачу ${doctor.shortName}`,
    text: `${contacts.adminSla}. ${contacts.hoursDisplay}.`,
    context: `doctor-${doctor.slug}-footer`,
    message: `Здравствуйте. Хочу записаться на приём к врачу ${doctor.name}.`,
  })}`;
}

/* --------------------------------------------------------- chief doctor page */

export function chiefPage({ manifest, doctor, services, articles, prices }) {
  const consultation = prices.consultationByTier[doctor.consultationTier];
  const chiefServices = chief.services.map((s) => services.find((x) => x.slug === s)).filter(Boolean);
  const reviewed = articles.filter((a) => a.reviewer === doctor.slug);

  return `
  <section class="section section--tight">
    <div class="shell">
      ${breadcrumbs([
        { href: '/', label: 'Главная' },
        { href: '/doctors/', label: 'Врачи' },
        { href: '/doctors/raimov-atabek/', label: 'Главный врач' },
      ])}
      <div class="split" style="align-items:center">
        <div style="max-width:26rem">
          ${archImage(manifest, doctor.photo, doctor.photoAlt, {
            sizes: '(min-width: 56rem) 30vw, 80vw',
            priority: true,
          })}
        </div>
        <div class="stack" style="--stack-gap:1.15rem">
          <span class="kicker">Главный врач и основатель клиники</span>
          <h1 class="display t-h1">${esc(doctor.name)}</h1>
          <p class="t-lead">${esc(chief.positioning)}</p>
          <div class="hero__facts" style="margin-top:1rem">
            ${chief.figures
              .map(
                (f) => `<div><div class="fact__value numeral">${esc(f.value)}</div>
                  <div class="fact__label">${esc(f.label)}<br><span class="t-small">${esc(f.source)}</span></div></div>`
              )
              .join('')}
          </div>
          ${ctaPair({ context: 'chief-hero', message: chief.whatsappMessage })}
        </div>
      </div>
    </div>
  </section>

  <section class="section section--forest fluted">
    <div class="shell shell--narrow" style="margin-inline:auto;text-align:center">
      <p class="chief__quote">«${esc(chief.quote)}»</p>
      <p class="t-small mt-2" style="color:rgba(247,244,239,.6)">${esc(chief.quoteNote)}</p>
    </div>
  </section>

  <section class="section">
    <div class="shell split">
      <div class="stack" style="--stack-gap:1rem">
        <span class="kicker">Подход</span>
        <h2 class="display t-h2">Прикус и сустав — одна система</h2>
      </div>
      <div class="prose">${chief.intro.map((p) => `<p>${inline(p)}</p>`).join('')}</div>
    </div>
  </section>

  <section class="section section--bone">
    <div class="shell split">
      <div class="stack" style="--stack-gap:1rem">
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
              rows: [consultation, prices.consultationByTier['atabek-mirali-gnatho']].filter(Boolean),
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
        <p class="t-small t-mute">Материалы подготовлены врачами Expert Dental Studio. Медицинские утверждения
          проверяет главный врач клиники.</p>
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
    <div class="shell">${postCard(manifest, feature, categories, { feature: true })}</div>
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
      <div class="grid grid--3">${articles.map((a) => postCard(manifest, a, categories)).join('')}</div>
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
          return `<p>${inline(b.text, { refs: references, used: usedRefs })}</p>`;
        case 'ul':
          return `<ul>${b.items
            .map((i) => `<li>${inline(i, { refs: references, used: usedRefs })}</li>`)
            .join('')}</ul>`;
        case 'ol':
          return `<ol>${b.items
            .map((i) => `<li>${inline(i, { refs: references, used: usedRefs })}</li>`)
            .join('')}</ol>`;
        case 'table':
          return `<div class="table-scroll"><table>
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
    : `<div class="monogram" style="font-size:1.4rem">${esc(initials(author.name))}</div>`;

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
      <span>Проверил: <strong>${esc(reviewer.name)}</strong></span>
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
      после осмотра, а при необходимости — по результатам снимков. Медицинскую проверку материала
      выполнил ${esc(reviewer.name)}, ${esc(reviewer.role.toLowerCase())}. Дата проверки — ${formatDate(
    article.updated
  )}.
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

    <div class="mt-4">${faqBlock(article.faq, { idPrefix: `art-${article.slug}` })}</div>
  </section>
  </article>

  ${ctaBand({
    title: 'Запишитесь на консультацию',
    text: `${contacts.adminSla}. ${contacts.hoursDisplay}.`,
    context: `article-${article.slug}`,
    message: `Здравствуйте. Я прочитал статью «${article.title}» и хочу записаться на консультацию.`,
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
      <div class="split" style="align-items:center">
        <div class="stack" style="--stack-gap:1.15rem">
          <span class="kicker">О клинике</span>
          <h1 class="display t-h1">Клиника, где план лечения составляют до его начала</h1>
          <p class="t-lead">Expert Dental Studio — стоматология в центре Бишкека. Мы работаем командой:
            ортодонт, гнатолог, хирург-имплантолог, ортопед и терапевты согласуют этапы между собой,
            а не лечат каждый свою часть отдельно.</p>
          ${ctaPair({ context: 'about-hero' })}
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
        <div class="step"><div class="step__title">Сустав учитывается всегда</div>
          <p class="step__text">Перед большим протезированием или ортодонтией проверяется положение нижней челюсти.</p></div>
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
  })}`;
}

export function contactsPage({ manifest }) {
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(contacts.mapQuery)}&output=embed&hl=ru`;
  return `
  <section class="section section--tight">
    <div class="shell">
      ${breadcrumbs([{ href: '/', label: 'Главная' }, { href: '/contacts/', label: 'Контакты' }])}
      <div class="split">
        <div class="stack" style="--stack-gap:1.5rem">
          <div>
            <span class="kicker">Контакты</span>
            <h1 class="display t-h1 mt-1">Как нас найти</h1>
          </div>
          <dl class="info-list">
            <div><dt>Адрес</dt><dd class="info-list__value" style="margin:0">${esc(contacts.addressFull)}<br>
              <span class="t-small t-mute">${esc(contacts.streetNote)}</span></dd></div>
            <div><dt>Телефон</dt><dd class="info-list__value" style="margin:0">
              <a href="${attr(telHref())}">${esc(contacts.phoneDisplay)}</a></dd></div>
            <div><dt>WhatsApp</dt><dd class="info-list__value" style="margin:0">
              <a href="${attr(waHref('Здравствуйте. Пишу с сайта Expert Dental Studio.'))}"
                 data-cta-context="contacts">${esc(contacts.phoneDisplay)}</a><br>
              <span class="t-small t-mute">${esc(contacts.whatsappNote)}. ${esc(contacts.adminSla)}.</span></dd></div>
            <div><dt>Часы работы</dt><dd class="info-list__value" style="margin:0">${esc(
              contacts.hoursDisplay
            )}</dd></div>
            <div><dt>Парковка</dt><dd class="info-list__value" style="margin:0">${esc(contacts.parking)}</dd></div>
          </dl>
          ${ctaPair({ context: 'contacts' })}
        </div>
        <div class="stack" style="--stack-gap:1rem">
          ${archImage(manifest, 'clinic/facade', 'Фасад здания, в котором находится Expert Dental Studio', {
            modifier: 'arch--sm',
            sizes: '(min-width: 56rem) 44vw, 92vw',
            priority: true,
          })}
          <div style="border:1px solid var(--line);border-radius:var(--radius);overflow:hidden">
            <iframe src="${attr(mapSrc)}" title="Карта: ${attr(contacts.addressFull)}" loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              style="border:0;width:100%;height:320px;display:block"></iframe>
          </div>
        </div>
      </div>
    </div>
  </section>

  ${ctaBand({
    title: 'Напишите — ответим быстро',
    text: `${contacts.whatsappNote}. ${contacts.adminSla}.`,
    context: 'contacts-footer',
  })}`;
}

export function legalPage({ kind }) {
  const isPrivacy = kind === 'privacy';
  const title = isPrivacy ? 'Политика конфиденциальности' : 'Правовая информация';
  const href = isPrivacy ? '/privacy/' : '/legal/';

  const privacyBody = `
    <h2>Какие данные мы получаем</h2>
    <p>Сайт не содержит форм регистрации и не создаёт личных кабинетов. Персональные данные вы передаёте
      добровольно, когда пишете в WhatsApp или звоните по указанному номеру: это имя, номер телефона
      и та информация о состоянии здоровья, которую вы сообщаете сами.</p>
    <h2>Зачем они нужны</h2>
    <ul>
      <li>Записать вас на приём и согласовать время.</li>
      <li>Ответить на вопрос о лечении или стоимости.</li>
      <li>Напомнить о назначенном визите.</li>
    </ul>
    <p>Данные не используются для рассылок без вашего согласия и не передаются третьим лицам,
      за исключением случаев, предусмотренных законодательством Кыргызской Республики.</p>
    <h2>Медицинская тайна</h2>
    <p>Сведения о вашем обращении, диагнозе и лечении составляют врачебную тайну. Клинические фотографии
      и материалы лечения публикуются только с отдельного письменного согласия пациента.</p>
    <h2>Аналитика</h2>
    <p>Для оценки работы сайта могут применяться сервисы веб-аналитики, собирающие обезличенные данные
      о посещениях: страницы, источник перехода, тип устройства. Эти данные не позволяют вас
      идентифицировать. Отключить сбор можно средствами браузера.</p>
    <h2>Как связаться</h2>
    <p>По вопросам обработки персональных данных напишите в WhatsApp на номер
      <a href="${attr(telHref())}">${esc(contacts.phoneDisplay)}</a> или обратитесь к администратору клиники
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
    <div class="shell shell--narrow" style="margin-inline:auto">
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
    <div class="shell shell--narrow" style="margin-inline:auto;text-align:center">
      <span class="kicker">Ошибка 404</span>
      <h1 class="display t-h1 mt-1">Такой страницы нет</h1>
      <p class="t-lead mt-2">Возможно, адрес изменился. Начните с главной или посмотрите услуги и цены.</p>
      <div class="btn-row mt-3" style="justify-content:center">
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
    <div class="shell shell--narrow" style="margin-inline:auto">
      <h1 class="display t-h1">Материалы, ожидаемые от клиники</h1>
      <p class="t-lead mt-2">Служебная страница. Пока перечисленное не получено, соответствующие блоки
        сайта не публикуются — вместо них не ставятся выдуманные данные.</p>
      <div class="prose mt-3">${list(pendingFromClinic)}</div>
    </div>
  </section>`;
}
