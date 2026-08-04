import { escapeHtml } from '../templates/lib/utils.js';

export function renderBreadcrumbs(data) {
  const items = data.items || [];
  if (!items.length) return '';
  const lis = items.map((item, idx) => {
    const isLast = idx === items.length - 1;
    if (isLast) return `<li aria-current="page">${escapeHtml(item.label)}</li>`;
    return `<li><a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a></li>`;
  }).join('');
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${lis}</ol></nav>`;
}

export function sectionShell(opts) {
  const body = String(opts.body || '').trim();
  const lead = String(opts.lead || '').trim();
  if (!body && !lead) return '';
  return `<section class="section${opts.surface ? ' section--surface' : ''}"${opts.id ? ` id="${escapeHtml(opts.id)}"` : ''}${opts.labelledby ? ` aria-labelledby="${escapeHtml(opts.labelledby)}"` : ''} data-analytics-section="${escapeHtml(opts.analytics || opts.id || 'section')}">
  <div class="container${opts.narrow ? ' container--narrow' : ''}">
    ${opts.eyebrow ? `<p class="section__eyebrow">${escapeHtml(opts.eyebrow)}</p>` : ''}
    ${opts.title ? `<h2${opts.labelledby ? ` id="${escapeHtml(opts.labelledby)}"` : ''}>${escapeHtml(opts.title)}</h2>` : ''}
    ${lead ? `<p class="section__lead">${escapeHtml(lead)}</p>` : ''}
    ${body}
  </div>
</section>`;
}

export function renderMetrics(metrics) {
  if (!metrics?.length) return '';
  return `<div class="grid grid--4">${metrics.map((m) => `<article class="metric card card--flat"><div class="metric__value">${escapeHtml(m.value)}</div><div class="metric__label">${escapeHtml(m.label)}</div></article>`).join('')}</div>`;
}

export function renderCards(items) {
  if (!items?.length) return '';
  return `<div class="grid grid--3">${items.map((item) => `<article class="card">${item.href ? `<a href="${escapeHtml(item.href)}" class="card__link">` : ''}<h3 class="card__title">${escapeHtml(item.title)}</h3>${item.summary ? `<p>${escapeHtml(item.summary)}</p>` : ''}${item.href ? '</a>' : ''}</article>`).join('')}</div>`;
}

export function renderFaq(items) {
  if (!items?.length) return '';
  return `<div class="faq-list">${items.map((item) => `<article class="faq-item"><h3 class="faq-item__q">${escapeHtml(item.question || item.q)}</h3><p class="faq-item__a">${escapeHtml(item.answer || item.a)}</p></article>`).join('')}</div>`;
}

export function renderTaskChooser(tasks) {
  if (!tasks?.length) return '';
  return `<div class="task-chooser">${tasks.map((task) => {
    const attrs = [
      `class="task-chooser__item"`,
      `href="${escapeHtml(task.href)}"`,
    ];
    if (task.external) attrs.push('target="_blank"', 'rel="noopener"');
    if (task.analytics) attrs.push(`data-analytics-click="${escapeHtml(task.analytics)}"`);
    if (task.interest) attrs.push(`data-interest-slug="${escapeHtml(task.interest)}"`);
    return `<a ${attrs.join(' ')}><span>${escapeHtml(task.title)}</span><span aria-hidden="true">→</span></a>`;
  }).join('')}</div>`;
}

export function renderTrustFacts(facts) {
  if (!facts?.length) return '';
  return `<ul class="trust-facts">${facts.map((f) => `<li class="trust-facts__item"><span class="trust-facts__value">${escapeHtml(f.value)}</span><span class="trust-facts__label">${escapeHtml(f.label)}</span></li>`).join('')}</ul>`;
}

export function renderSystemSteps(steps, locale = 'ru') {
  if (!steps?.length) return '';
  const isEn = locale === 'en';
  const patientLabel = isEn ? 'For the patient:' : 'Для пациента:';
  return `<ol class="system-steps">${steps.map((step, idx) => {
    const team = step.benefit || step.description || '';
    const patient = (isEn && step.patientOutcomeEn) ? step.patientOutcomeEn : (step.patientOutcome || step.patientResult || '');
    return `<li class="system-steps__item">
    <span class="system-steps__n" aria-hidden="true">${idx + 1}</span>
    <div>
      <h3 class="system-steps__title">${escapeHtml(step.title)}</h3>
      ${team ? `<p class="system-steps__benefit">${escapeHtml(team)}</p>` : ''}
      ${patient ? `<p class="system-steps__patient"><span class="system-steps__patient-label">${escapeHtml(patientLabel)}</span> ${escapeHtml(patient)}</p>` : ''}
    </div>
  </li>`;
  }).join('')}</ol>`;
}

function confirmedText(field) {
  return field && field.status === 'confirmed' && field.text ? field.text : null;
}

export function renderFirstVisit(fv, opts = {}) {
  const isEn = opts.locale === 'en';
  const includes = (fv.includes || []).filter((x) => x.status === 'confirmed' && x.text);
  const receives = (fv.patientReceives || []).filter((x) => x.status === 'confirmed' && x.text);
  const conductedBy = confirmedText(fv.conductedBy);
  const duration = confirmedText(fv.duration);
  const credited = confirmedText(fv.priceCreditedToTreatment);
  const staged = confirmedText(fv.stagedTreatmentAllowed);
  const nextStep = confirmedText(fv.nextStepAfterDiagnostics);
  const responseSla = confirmedText(fv.responseSla);
  const band = opts.priceBand;
  const pricePublished = band && band.status === 'published' && band.fromAmount != null;

  const happens = includes.length
    ? includes.map((x) => `<li>${escapeHtml(x.text)}</li>`).join('')
    : `<li>${escapeHtml(isEn
      ? 'Diagnostics and alignment on goals before treatment starts'
      : 'Диагностика и согласование целей до начала лечения')}</li>
       <li>${escapeHtml(isEn
      ? 'Discussion of options, sequence, and staging'
      : 'Обсуждение вариантов, последовательности и этапности')}</li>`;

  const gets = receives.length
    ? receives.map((x) => `<li>${escapeHtml(x.text)}</li>`).join('')
    : `<li>${escapeHtml(isEn
      ? 'Clear next steps after the visit'
      : 'Понятный следующий шаг после визита')}</li>
       <li>${escapeHtml(isEn
      ? 'A path toward an agreed treatment plan and staged budget'
      : 'Путь к согласованному плану лечения и этапному бюджету')}</li>`;

  return `<div class="first-visit" data-analytics-view="first-visit">
  <div class="first-visit__schema grid grid--2">
    <div class="first-visit__col card card--flat">
      <h3>${escapeHtml(isEn ? 'What happens' : 'Что происходит')}</h3>
      <ul>${happens}</ul>
      ${conductedBy ? `<p class="first-visit__meta">${escapeHtml(conductedBy)}</p>` : ''}
      ${duration ? `<p class="first-visit__meta">${escapeHtml(duration)}</p>` : ''}
    </div>
    <div class="first-visit__col card card--flat">
      <h3>${escapeHtml(isEn ? 'What you leave with' : 'Что получает пациент')}</h3>
      <ul>${gets}</ul>
      ${nextStep ? `<p class="first-visit__meta">${escapeHtml(nextStep)}</p>` : ''}
    </div>
  </div>
  <div class="first-visit__footer">
    ${pricePublished
      ? `<p class="first-visit__price">${escapeHtml(isEn ? band.labelEn : band.labelRu)}: ${escapeHtml(String(band.fromAmount))} ${escapeHtml(band.currency || '')}</p>`
      : `<p class="first-visit__price first-visit__price--soft">${escapeHtml(isEn
        ? 'Visit fee is confirmed with the clinic after the request — not published here yet.'
        : 'Стоимость визита подтверждается клиникой после запроса — сумма на сайте пока не публикуется.')}</p>`}
    ${credited ? `<p class="first-visit__meta">${escapeHtml(credited)}</p>` : ''}
    ${staged ? `<p class="first-visit__meta">${escapeHtml(staged)}</p>` : ''}
    ${responseSla ? `<p class="first-visit__meta">${escapeHtml(responseSla)}</p>` : ''}
    ${opts.bookHref ? `<a class="btn btn-primary" href="${escapeHtml(opts.bookHref)}" data-analytics-click="hero_cta_click">${escapeHtml(opts.ctaLabel || (isEn ? 'Get a treatment plan' : 'Получить план лечения'))}</a>` : ''}
  </div>
</div>`;
}

export function renderDoctorBlock(doctor, locale) {
  const isEn = locale === 'en';
  const role = doctor.role?.publishable === true ? doctor.role.text : null;
  const competencies = (doctor.competencies || []).filter((c) => c.publishable === true && c.text);
  const photo = doctor.photo?.publishable === true && doctor.photo.src
    ? `<img class="doctor-block__photo" src="${escapeHtml(doctor.photo.src)}" alt="${escapeHtml(doctor.photo.alt || doctor.name || '')}" width="480" height="600" loading="lazy" decoding="async">`
    : '';
  return `<div class="doctor-block${photo ? ' doctor-block--with-photo' : ''}">
  ${photo}
  <div class="doctor-block__copy">
    ${role ? `<p class="doctor-block__role">${escapeHtml(role)}</p>` : ''}
    ${doctor.body ? `<p>${escapeHtml(doctor.body)}</p>` : ''}
    ${competencies.length ? `<ul class="doctor-block__list">${competencies.map((c) => `<li>${escapeHtml(c.text)}</li>`).join('')}</ul>` : ''}
    ${doctor.profileHref ? `<a class="btn btn-outline" href="${escapeHtml(doctor.profileHref)}">${escapeHtml(isEn ? 'Doctor profile' : 'Профиль врача')}</a>` : ''}
  </div>
</div>`;
}

export function renderCaseRail(cases, locale) {
  if (!cases?.length) return '';
  const isEn = locale === 'en';
  return `<div class="case-rail" role="region" aria-label="${escapeHtml(isEn ? 'Clinical cases' : 'Клинические кейсы')}">
  <div class="case-rail__track">
    ${cases.map((c) => {
      const before = (c.beforeImages || [])[0];
      const after = (c.afterImages || [])[0];
      const id = escapeHtml(c.slug || c.title);
      return `<article class="case-card card" data-analytics-click="case_open" data-case-slug="${id}">
        <h3 class="card__title">${escapeHtml(c.title)}</h3>
        ${c.problem ? `<p class="case-card__problem">${escapeHtml(c.problem)}</p>` : ''}
        ${before || after ? `<div class="before-after" data-before-after>
          <div class="before-after__frames">
            ${before ? `<figure class="before-after__frame is-active" data-frame="before"><img src="${escapeHtml(before.src)}" alt="${escapeHtml(before.alt || (isEn ? 'Before' : 'До'))}" loading="lazy" decoding="async"><figcaption>${escapeHtml(isEn ? 'Before' : 'До')}</figcaption></figure>` : ''}
            ${after ? `<figure class="before-after__frame" data-frame="after" hidden><img src="${escapeHtml(after.src)}" alt="${escapeHtml(after.alt || (isEn ? 'After' : 'После'))}" loading="lazy" decoding="async"><figcaption>${escapeHtml(isEn ? 'After' : 'После')}</figcaption></figure>` : ''}
          </div>
          ${before && after ? `<div class="before-after__toggle" role="group" aria-label="${escapeHtml(isEn ? 'Before or after' : 'До или после')}">
            <button type="button" class="btn btn-outline is-active" data-show="before" aria-pressed="true">${escapeHtml(isEn ? 'Before' : 'До')}</button>
            <button type="button" class="btn btn-outline" data-show="after" aria-pressed="false">${escapeHtml(isEn ? 'After' : 'После')}</button>
          </div>` : ''}
        </div>` : ''}
        ${c.result ? `<p class="case-card__result">${escapeHtml(c.result)}</p>` : ''}
        ${c.durationRange ? `<p class="card__meta">${escapeHtml(c.durationRange)}</p>` : ''}
      </article>`;
    }).join('')}
  </div>
</div>`;
}

export function renderReviews(reviews) {
  if (!reviews?.length) return '';
  return `<div class="grid grid--3">${reviews.map((r) => `<article class="card review-card">
    <p class="review-card__quote">${escapeHtml(r.quote)}</p>
    <p class="review-card__author">${escapeHtml(r.authorDisplay || '')}</p>
    ${r.sourceUrl ? `<p class="card__meta"><a href="${escapeHtml(r.sourceUrl)}" target="_blank" rel="noopener">${escapeHtml(r.platform || 'source')}</a></p>` : ''}
  </article>`).join('')}</div>`;
}

export function renderGallery(items) {
  if (!items?.length) return '';
  return `<div class="gallery-grid">${items.map((item) => `<figure class="gallery-grid__item">
    <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt || '')}" loading="lazy" decoding="async">
  </figure>`).join('')}</div>`;
}

export function secondOpinionWhatsAppHref(waHref, locale) {
  const isEn = locale === 'en';
  const base = String(waHref || 'https://wa.me/996555255455').split('?')[0];
  const text = isEn
    ? 'Hello! I would like a second opinion on an existing treatment plan at RAIMOV DENTAL. I will share documents only in this private chat — not via the website form.'
    : 'Здравствуйте! Нужно второе мнение по уже готовому плану лечения в RAIMOV DENTAL. Документы передам только в этом личном чате — не через форму на сайте.';
  return `${base}?text=${encodeURIComponent(text)}`;
}

export function renderStickyCta(opts) {
  const isEn = opts.locale === 'en';
  const bookLabel = opts.ctaBookShort || opts.ctaBook || (isEn ? 'Book' : 'Записаться');
  const bookTitle = opts.ctaBook || (isEn ? 'Book comprehensive diagnostics' : 'Записаться на комплексную диагностику');
  const waLabel = opts.ctaWa || 'WhatsApp';
  const callLabel = opts.ctaCall || (isEn ? 'Call' : 'Позвонить');
  const phoneHref = opts.phoneHref || 'tel:+996555255455';
  return `<div class="sticky-cta" role="region" aria-label="${escapeHtml(isEn ? 'Quick actions' : 'Быстрые действия')}">
  <a class="btn btn-primary sticky-cta__book" href="${escapeHtml(opts.bookHref)}" title="${escapeHtml(bookTitle)}" data-analytics-click="hero_cta_click">${escapeHtml(bookLabel)}</a>
  <a class="btn btn-outline sticky-cta__wa" href="${escapeHtml(opts.waHref)}" target="_blank" rel="noopener" data-analytics-click="whatsapp_click">${escapeHtml(waLabel)}</a>
  <a class="btn btn-ghost sticky-cta__call" href="${escapeHtml(phoneHref)}" data-analytics-click="phone_click">${escapeHtml(callLabel)}</a>
</div>`;
}
