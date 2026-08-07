import { escapeHtml } from '../lib/utils.js';
import { sectionShell, renderSystemSteps } from '../../components/sections.js';
import { leadFormMount } from '../../components/pending.js';
import { wrapPage } from '../layouts/page.js';
import { organizationJsonLd } from '../lib/jsonld.js';
import { defaultPageMeta } from '../lib/i18n-defaults.js';
import { renderHomePage } from './home.js';
import { editorialText, renderEditorialPage, renderEditorialSection, serviceToEditorialPage } from './editorial.js';

function extensionSections(ctx, routeDef) {
  return ctx.data?.extensions?.pages?.[routeDef.id] || [];
}

function withExtensions(ctx, routeDef, page) {
  if (!page) return null;
  return {
    ...page,
    sections: [...(page.sections || []), ...extensionSections(ctx, routeDef)],
  };
}

function editorialPage(ctx, routeDef) {
  return withExtensions(ctx, routeDef, ctx.data?.editorial?.pages?.[routeDef.id] || null);
}

function findService(ctx, routeDef) {
  const services = ctx.data?.services?.services || ctx.data?.services?.items || [];
  return services.find?.((service) => service.path === ctx.path)
    || services.find?.((service) => service.slug === routeDef.serviceKey)
    || services.find?.((service) => service.key === routeDef.serviceKey)
    || null;
}

export function renderServicePage(ctx, routeDef) {
  const override = editorialPage(ctx, routeDef);
  if (override) return renderEditorialPage(ctx, routeDef, override);
  const page = withExtensions(ctx, routeDef, serviceToEditorialPage(findService(ctx, routeDef), ctx));
  if (page) return renderEditorialPage(ctx, routeDef, page);
  return renderMinimalPage(ctx, routeDef);
}

export function renderStandardPage(ctx, routeDef) {
  const override = editorialPage(ctx, routeDef);
  if (override) return renderEditorialPage(ctx, routeDef, override, { showPatientForm: override.showPatientForm !== false });

  const key = routeDef.pageKey;
  const source = key ? ctx.data?.[key] : null;
  const meta = source?.meta || defaultPageMeta(ctx.locale, routeDef.id);
  const title = editorialText(source?.intro?.heading || source?.title || meta.title);
  const lead = editorialText(source?.intro?.body || source?.lead || meta.description);
  const body = `<header class="editorial-hero"><div class="container container--narrow"><h1 class="editorial-hero__title">${escapeHtml(title)}</h1><p class="editorial-hero__lead">${escapeHtml(lead)}</p></div></header>`;
  return wrapPage(ctx, { title: meta.title || title, description: meta.description || lead, jsonLd: [organizationJsonLd({ locale: ctx.locale, path: ctx.path, description: lead })] }, body);
}

export function renderDoctorPage(ctx, routeDef) {
  const override = editorialPage(ctx, routeDef);
  const doctor = ctx.data?.doctor || {};
  const photoHtml = doctor.photo?.publishable === true && doctor.photo?.src
    ? `<div class="container doctor-page__media"><figure class="doctor-page__photo"><img src="${escapeHtml(doctor.photo.src)}" alt="${escapeHtml(doctor.photo.alt || doctor.publicName || '')}" width="480" height="600" loading="eager" decoding="async"></figure></div>`
    : '';
  if (override) {
    const html = renderEditorialPage(ctx, routeDef, override);
    if (!photoHtml) return html;
    return html.replace('</header>', `</header>\n  ${photoHtml}`);
  }
  return renderMinimalPage(ctx, routeDef);
}

export function renderSystemPage(ctx, routeDef) {
  const source = ctx.data?.system || {};
  const isEn = ctx.locale === 'en';

  // C1: patient pathway from system.json + keep non-steps editorial depth
  if (source.steps?.length) {
    const override = editorialPage(ctx, routeDef);
    const meta = source.meta || override?.meta || defaultPageMeta(ctx.locale, 'raimov-system');
    const title = editorialText(override?.title || source.intro?.heading || 'RAIM SMILE SYSTEM');
    const lead = editorialText(override?.lead || source.intro?.body || meta.description || '');
    const thesis = editorialText(override?.thesis || '');
    const bookHref = source.cta?.href || (isEn ? '/en/comprehensive-diagnostics/#lead-form' : '/ru/kompleksnaya-diagnostika/#lead-form');
    const bookLabel = source.cta?.label || (isEn ? 'Book comprehensive diagnostics' : 'Записаться на комплексную диагностику');
    const stepsBody = renderSystemSteps(source.steps, ctx.locale);
    const extraSections = (override?.sections || []).filter((section) => section?.type !== 'steps');
    const extraHtml = extraSections.map((section, idx) => renderEditorialSection(section, idx + 1)).join('');
    const body = `
  <header class="editorial-hero">
    <div class="container container--narrow">
      <p class="section__eyebrow">RAIM SMILE SYSTEM</p>
      <h1 class="editorial-hero__title">${escapeHtml(title)}</h1>
      <p class="editorial-hero__lead">${escapeHtml(lead)}</p>
      ${thesis ? `<p class="editorial-hero__thesis">${escapeHtml(thesis)}</p>` : ''}
      <div class="editorial-page__actions">
        <a class="btn btn-primary" href="${escapeHtml(bookHref)}" data-analytics-click="diagnostic_cta_click">${escapeHtml(bookLabel)}</a>
        <a class="btn btn-outline" href="${isEn ? '/en/' : '/ru/'}#first-visit">${escapeHtml(isEn ? 'What the first visit includes' : 'Что входит в первый визит')}</a>
      </div>
    </div>
  </header>
  ${sectionShell({
    id: 'system-pathway',
    title: isEn ? 'Patient pathway' : 'Путь пациента',
    lead: isEn
      ? 'Each step: what the team does, and what you leave with. Exact fees are agreed after diagnostics.'
      : 'На каждом шаге: что делает команда и что получаете вы. Точные суммы — после диагностики.',
    body: stepsBody,
  })}
  ${extraHtml}
  ${sectionShell({
    id: 'system-cta',
    surface: true,
    title: isEn ? 'Start with diagnostics' : 'Начните с диагностики',
    body: `<a class="btn btn-primary" href="${escapeHtml(bookHref)}" data-analytics-click="diagnostic_cta_click">${escapeHtml(bookLabel)}</a>`,
  })}
  ${leadFormMount({ locale: ctx.locale, title: bookLabel, ctaSource: `raimovdental_system_${ctx.locale}` })}`;
    return wrapPage(
      ctx,
      {
        title: meta.title || title,
        description: meta.description || lead,
        jsonLd: [organizationJsonLd({ locale: ctx.locale, path: ctx.path, description: meta.description || lead })],
      },
      body,
    );
  }

  const override = editorialPage(ctx, routeDef);
  if (override) return renderEditorialPage(ctx, routeDef, override);
  return renderMinimalPage(ctx, routeDef);
}

export function renderContactPage(ctx, routeDef) {
  const override = editorialPage(ctx, routeDef);
  const editorial = override ? renderEditorialPage(ctx, routeDef, { ...override, showPatientForm: false }, { showPatientForm: false }) : null;
  if (editorial) {
    const contactBlock = sectionShell({
      id: 'direct-contacts',
      title: ctx.locale === 'en' ? 'Direct contacts' : 'Прямые контакты',
      surface: true,
      body: `<div class="contact-actions">
        <a class="contact-actions__phone" href="${escapeHtml(ctx.contacts.phoneHref)}" data-analytics-click="phone_click">${escapeHtml(ctx.contacts.phone)}</a>
        <a class="btn btn-primary" href="${escapeHtml(ctx.contacts.whatsappHref)}" target="_blank" rel="noopener" data-analytics-click="whatsapp_click">WhatsApp</a>
        <a class="btn btn-outline" href="${escapeHtml(ctx.contacts.mapsUrl)}" target="_blank" rel="noopener" data-analytics-click="maps_click">${escapeHtml(ctx.locale === 'en' ? 'Open map' : 'Открыть карту')}</a>
        <p>${escapeHtml(ctx.contacts.address)} · ${escapeHtml(ctx.contacts.hours)}</p>
      </div>`,
    });
    const form = leadFormMount({ locale: ctx.locale, title: ctx.locale === 'en' ? 'Patient request' : 'Обращение пациента', ctaSource: `raimovdental_contact_${ctx.locale}` });
    return editorial.replace('</main>', `${contactBlock}${form}</main>`);
  }
  return renderMinimalPage(ctx, routeDef);
}

function renderMinimalPage(ctx, routeDef) {
  const meta = defaultPageMeta(ctx.locale, routeDef.id);
  const title = meta.title.split('|')[0].trim();
  const body = `<div class="page-hero"><div class="container"><h1 class="page-hero__title">${escapeHtml(title)}</h1><p class="section__lead">${escapeHtml(meta.description)}</p></div></div>`;
  return wrapPage(ctx, { ...meta, jsonLd: [organizationJsonLd({ locale: ctx.locale, path: ctx.path, description: meta.description })] }, body);
}

export function renderRoutePage(ctx, routeDef) {
  const next = { ...ctx, indexable: routeDef.indexable === true };
  switch (routeDef.type) {
    case 'home': return renderHomePage(next);
    case 'service': return renderServicePage(next, routeDef);
    case 'doctor': return renderDoctorPage(next, routeDef);
    case 'system': return renderSystemPage(next, routeDef);
    case 'contact': return renderContactPage(next, routeDef);
    case 'editorial': return renderStandardPage(next, routeDef);
    default: return renderStandardPage(next, routeDef);
  }
}

export const renderCaseDetail = () => '';
export const renderBlogDetail = () => '';
export { renderHomePage };
