import { escapeHtml } from '../lib/utils.js';
import { renderBreadcrumbs, sectionShell, renderStickyCta } from '../../components/sections.js';
import { leadFormMount } from '../../components/pending.js';
import { wrapPage } from '../layouts/page.js';
import { organizationJsonLd, profilePageJsonLd, breadcrumbJsonLd } from '../lib/jsonld.js';

const DRAFT_RE = /\bTBD\b|CONTENT PENDING|pending clinic|draft-only|verified cases pending|материалы готовятся|требуется медицинское утверждение/i;

export function editorialText(value = '') {
  return String(value)
    .replace(/Дental implantation/gi, 'Имплантация зубов')
    .replace(/\badentia\b/gi, 'полном отсутствии зубов')
    .replace(/дискомfort/gi, 'дискомфорт')
    .replace(/Ретainers/gi, 'Ретейнеры')
    .replace(/\s*[—–-]\s*(TBD|pending clinic confirmation).*$/i, '')
    .trim();
}

function usable(value) {
  const text = editorialText(value);
  return text && !DRAFT_RE.test(text) ? text : '';
}

function renderParagraphs(values) {
  const list = Array.isArray(values) ? values : values ? [values] : [];
  const paragraphs = list.map(usable).filter(Boolean);
  if (!paragraphs.length) return '';
  return `<div class="editorial-copy">${paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}</div>`;
}

function itemTitle(item) {
  return usable(typeof item === 'string' ? item : item?.title || item?.heading || item?.label || item?.question);
}

function itemText(item) {
  if (!item || typeof item === 'string') return '';
  return usable(item.text || item.description || item.summary || item.body || item.answer || item.benefit);
}

function renderIndex(items) {
  const ready = (items || []).map((item, index) => ({
    kicker: usable(item?.kicker || item?.step || String(index + 1).padStart(2, '0')),
    title: itemTitle(item),
    text: itemText(item),
    href: item?.href,
  })).filter((item) => item.title || item.text);
  if (!ready.length) return '';
  return `<div class="editorial-index">${ready.map((item) => `<article class="editorial-index__item">
    <div class="editorial-index__kicker">${escapeHtml(item.kicker)}</div>
    <div class="editorial-index__copy">
      ${item.title ? `<h3>${escapeHtml(item.title)}</h3>` : ''}
      ${item.text ? `<p>${escapeHtml(item.text)}</p>` : ''}
      ${item.href ? `<a class="editorial-link" href="${escapeHtml(item.href)}">${escapeHtml(item.title || item.href)} <span aria-hidden="true">→</span></a>` : ''}
    </div>
  </article>`).join('')}</div>`;
}

function renderSteps(items) {
  const ready = (items || []).map((item) => ({ title: itemTitle(item), text: itemText(item) })).filter((item) => item.title || item.text);
  if (!ready.length) return '';
  return `<ol class="editorial-steps">${ready.map((item, index) => `<li class="editorial-steps__item">
    <span class="editorial-steps__number">${String(index + 1).padStart(2, '0')}</span>
    <div>${item.title ? `<h3>${escapeHtml(item.title)}</h3>` : ''}${item.text ? `<p>${escapeHtml(item.text)}</p>` : ''}</div>
  </li>`).join('')}</ol>`;
}

function renderSplit(items) {
  const ready = (items || []).map((item) => ({ title: itemTitle(item), text: itemText(item), href: item?.href })).filter((item) => item.title || item.text);
  if (!ready.length) return '';
  return `<div class="editorial-split">${ready.map((item) => `<article class="editorial-split__item">
    ${item.title ? `<h3>${escapeHtml(item.title)}</h3>` : ''}
    ${item.text ? `<p>${escapeHtml(item.text)}</p>` : ''}
    ${item.href ? `<a class="editorial-link" href="${escapeHtml(item.href)}">${escapeHtml(item.title || item.href)} <span aria-hidden="true">→</span></a>` : ''}
  </article>`).join('')}</div>`;
}

function renderFaq(items) {
  const ready = (items || []).map((item) => ({ q: itemTitle(item), a: itemText(item) })).filter((item) => item.q && item.a);
  if (!ready.length) return '';
  return `<div class="editorial-faq">${ready.map((item) => `<details class="editorial-faq__item"><summary>${escapeHtml(item.q)}</summary><p>${escapeHtml(item.a)}</p></details>`).join('')}</div>`;
}

function renderLinks(items) {
  const ready = (items || []).map((item) => ({ title: itemTitle(item), text: itemText(item), href: item?.href })).filter((item) => item.title || item.text);
  if (!ready.length) return '';
  return `<div class="editorial-links">${ready.map((item) => `<a class="editorial-links__item" href="${escapeHtml(item.href || '#')}">
    <span><strong>${escapeHtml(item.title)}</strong>${item.text ? `<small>${escapeHtml(item.text)}</small>` : ''}</span><span aria-hidden="true">→</span>
  </a>`).join('')}</div>`;
}

function renderManifesto(section) {
  const body = Array.isArray(section.body) ? section.body : section.body ? [section.body] : [];
  const ready = body.map(usable).filter(Boolean);
  if (!ready.length) return '';
  return `<div class="editorial-manifesto">${ready.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}</div>`;
}

export function renderEditorialSection(section, index = 0) {
  if (!section || DRAFT_RE.test(String(section.status || ''))) return '';
  const type = section.type || 'narrative';
  let body = '';
  if (type === 'index') body = renderIndex(section.items);
  else if (type === 'steps') body = renderSteps(section.items);
  else if (type === 'split') body = renderSplit(section.items);
  else if (type === 'faq') body = renderFaq(section.items);
  else if (type === 'links') body = renderLinks(section.items);
  else if (type === 'manifesto') body = renderManifesto(section);
  else {
    body = `${renderParagraphs(section.body)}${section.items?.length ? renderIndex(section.items) : ''}`;
  }
  if (!body) return '';
  return sectionShell({
    id: section.id,
    eyebrow: usable(section.eyebrow),
    title: usable(section.title || section.heading),
    lead: usable(section.lead),
    body,
    surface: section.surface === true || (section.surface !== false && index % 2 === 1),
    narrow: type === 'narrative' || type === 'manifesto',
  });
}

function routeCrumbs(ctx, page) {
  return [
    { label: ctx.locale === 'en' ? 'Home' : 'Главная', href: ctx.locale === 'en' ? '/en/' : '/ru/' },
    { label: page.title, href: ctx.path },
  ];
}

function pageCtas(ctx, page) {
  const primary = page.cta;
  const secondary = page.secondaryCta;
  if (!primary && !secondary) return '';
  return `<div class="editorial-page__actions">
    ${primary ? `<a class="btn btn-primary" href="${escapeHtml(primary.href)}">${escapeHtml(primary.label)}</a>` : ''}
    ${secondary ? `<a class="btn btn-outline" href="${escapeHtml(secondary.href)}">${escapeHtml(secondary.label)}</a>` : ''}
    <a class="btn btn-ghost" href="${escapeHtml(ctx.contacts.whatsappHref)}" target="_blank" rel="noopener" data-analytics-click="whatsapp_click">WhatsApp</a>
  </div>`;
}

export function renderEditorialPage(ctx, routeDef, page, options = {}) {
  const meta = page.meta || {};
  const crumbs = routeCrumbs(ctx, page);
  const sections = (page.sections || []).map(renderEditorialSection).join('');
  const showPatientForm = page.showPatientForm !== false && options.showPatientForm !== false;
  const formTitle = page.formTitle || (ctx.locale === 'en' ? 'Book comprehensive diagnostics' : 'Записаться на комплексную диагностику');
  const bookHref = page.cta?.href || (ctx.locale === 'en' ? '/en/comprehensive-diagnostics/#lead-form' : '/ru/kompleksnaya-diagnostika/#lead-form');
  const body = `<header class="editorial-hero">
    <div class="container container--narrow">
      ${renderBreadcrumbs({ items: crumbs })}
      ${page.eyebrow ? `<p class="section__eyebrow">${escapeHtml(page.eyebrow)}</p>` : ''}
      <h1 class="editorial-hero__title">${escapeHtml(page.title)}</h1>
      <p class="editorial-hero__lead">${escapeHtml(page.lead || '')}</p>
      ${page.thesis ? `<p class="editorial-hero__thesis">${escapeHtml(page.thesis)}</p>` : ''}
      ${pageCtas(ctx, page)}
    </div>
  </header>
  ${sections}
  ${showPatientForm ? leadFormMount({ locale: ctx.locale, title: formTitle, ctaSource: `raimovdental_${routeDef.id}_${ctx.locale}` }) : ''}
  ${showPatientForm ? renderStickyCta({
    locale: ctx.locale,
    bookHref,
    waHref: ctx.contacts.whatsappHref,
    phoneHref: ctx.contacts.phoneHref,
    ctaBook: ctx.locale === 'en' ? 'Book comprehensive diagnostics' : 'Записаться на комплексную диагностику',
    ctaBookShort: ctx.locale === 'en' ? 'Book' : 'Записаться',
    ctaWa: 'WhatsApp',
    ctaCall: ctx.locale === 'en' ? 'Call' : 'Позвонить',
  }) : ''}`;

  const jsonLd = [organizationJsonLd({ locale: ctx.locale, path: ctx.path, description: meta.description || page.lead })];
  if (routeDef.id === 'doctor') jsonLd.unshift(profilePageJsonLd({ locale: ctx.locale }));
  jsonLd.push(breadcrumbJsonLd(crumbs.map((c) => ({ name: c.label, item: c.href }))));
  return wrapPage(ctx, {
    title: meta.title || page.title,
    description: meta.description || page.lead,
    jsonLd,
  }, body);
}

export function serviceToEditorialPage(service, ctx) {
  if (!service) return null;
  const sections = service.sections || {};
  const order = ['problem', 'fit', 'diagnostics', 'options', 'approach', 'stages', 'timeline', 'costFactors', 'risks', 'aftercare', 'faq'];
  const mapped = [];
  for (const key of order) {
    const source = sections[key];
    if (!source) continue;
    const heading = usable(source.heading || source.title);
    const text = usable(source.body || source.text || source.description);
    const note = usable(source.note);
    let items = source.items || source.points || [];
    if (key === 'faq') {
      mapped.push({ type: 'faq', title: heading, items });
      continue;
    }
    if (key === 'stages') {
      mapped.push({ type: 'steps', title: heading, lead: text, items });
      continue;
    }
    if (items.length) {
      mapped.push({ type: key === 'options' ? 'split' : 'index', title: heading, lead: text, items });
      continue;
    }
    if (text || note) mapped.push({ type: key === 'risks' ? 'manifesto' : 'narrative', title: heading, body: [text, note].filter(Boolean) });
  }
  return {
    eyebrow: ctx.locale === 'en' ? 'Patient care' : 'Пациентам',
    title: usable(service.title),
    lead: usable(service.shortDescription || service.lead || service.meta?.description),
    thesis: usable(service.positioning || service.thesis),
    sections: mapped,
    cta: {
      label: ctx.locale === 'en' ? 'Discuss this treatment' : 'Обсудить это лечение',
      href: `${ctx.path}#lead-form`,
    },
    secondaryCta: {
      label: ctx.locale === 'en' ? 'How RAIM SMILE SYSTEM works' : 'Как работает RAIM SMILE SYSTEM',
      href: ctx.locale === 'en' ? '/en/raimov-system/' : '/ru/raimov-system/',
    },
    meta: {
      title: usable(service.meta?.title) || usable(service.title),
      description: usable(service.meta?.description) || usable(service.shortDescription),
    },
    showPatientForm: true,
  };
}
