import { escapeHtml } from '../lib/utils.js';
import {
  sectionShell,
  renderTaskChooser,
  renderCards,
  renderFaq,
  renderFirstVisit,
  renderStickyCta,
  renderDoctorBlock,
  renderSystemSteps,
  renderCaseRail,
  renderReviews,
  renderGallery,
  secondOpinionWhatsAppHref,
} from '../../components/sections.js';
import { leadFormMount } from '../../components/pending.js';
import { wrapPage } from '../layouts/page.js';
import { organizationJsonLd, breadcrumbJsonLd } from '../lib/jsonld.js';
import { defaultPageMeta } from '../lib/i18n-defaults.js';

/** Canonical patient booking CTA — see CTA_COPY_CONTRACT.md */
export const CTA = {
  ru: {
    book: 'Записаться на комплексную диагностику',
    bookShort: 'Записаться',
    wa: 'Написать в WhatsApp',
    call: 'Позвонить',
    bookHref: '/ru/kompleksnaya-diagnostika/#lead-form',
  },
  en: {
    book: 'Book comprehensive diagnostics',
    bookShort: 'Book',
    wa: 'Message on WhatsApp',
    call: 'Call',
    bookHref: '/en/comprehensive-diagnostics/#lead-form',
  },
};

function publishedOnly(items) {
  return (items || []).filter((item) => item && item.publishable === true);
}

function publishedCases(home, casesBundle) {
  const slugs = home?.cases?.items || [];
  if (!slugs.length) return [];
  const all = casesBundle?.cases || casesBundle?.items || casesBundle?.verifiedCases || [];
  return all.filter((c) => c && c.publishable === true && c.status === 'verified' && slugs.includes(c.slug));
}

function publishedReviews(home, reviewsBundle) {
  const fromHome = (home?.reviews?.items || []).filter((r) => r && r.publishable === true && r.sourceUrl);
  if (fromHome.length) return fromHome;
  const listed = reviewsBundle?.reviews;
  const pool = (Array.isArray(listed) && listed.length ? listed : null)
    || reviewsBundle?.homeTeaserItems
    || [];
  return pool.filter((r) => r && r.publishable === true && r.quote && r.sourceUrl);
}

function publishedGallery(home) {
  return (home?.clinicGallery?.items || []).filter((i) => i && i.publishable === true && i.src);
}

/**
 * Patient-first home. Canonical data: `home.{locale}.json`.
 * Editorial ecosystem content lives on `/ekosistema/` — not on `/`.
 */
export function renderHomePage(ctx) {
  const { locale, i18n, data, path, hreflang, pricingBands = [] } = ctx;
  const isEn = locale === 'en';
  const copy = isEn ? CTA.en : CTA.ru;
  const home = data?.home || {};
  const doctorProfile = data?.doctor || {};
  const meta = home.meta || defaultPageMeta(locale, 'home');
  const hero = home.hero || {};
  const waHref = ctx.contacts?.whatsappHref || '#';
  const phoneHref = ctx.contacts?.phoneHref || 'tel:+996555255455';
  const rawBook = hero.primaryCta?.href || copy.bookHref;
  const normalizedBook = rawBook.includes('#')
    ? rawBook
    : `${String(rawBook).replace(/\/?$/, '/') }#lead-form`;
  const ctaBook = hero.primaryCta?.label || copy.book;
  const ctaWa = hero.secondaryCta?.label || copy.wa;
  const waTarget = (hero.secondaryCta?.href && hero.secondaryCta.href.includes('wa.me'))
    ? hero.secondaryCta.href
    : waHref;

  const goals = (home.patientGoals?.items || []).map((item) => {
    if (item.interest === 'second_opinion' || item.id === 'second_opinion') {
      return {
        title: item.label,
        href: secondOpinionWhatsAppHref(waHref, locale),
        external: true,
        analytics: 'second_opinion_click',
        interest: item.interest,
      };
    }
    return { title: item.label, href: item.href, analytics: 'jtbd_select', interest: item.interest };
  });

  const firstVisit = home.firstVisit || {};
  const showFirstVisit = firstVisit.publishable === true || firstVisit.heading || firstVisit.publicName;
  const priceBand = pricingBands.find((band) => band.id === (firstVisit.priceBandId || 'first_visit'));
  const flagship = (home.flagshipServices?.items || []).map((item) => ({
    title: item.title,
    summary: item.description,
    href: item.href,
  }));
  const faqItems = publishedOnly(home.faq?.items).map((item) => ({
    q: item.q || item.question,
    a: item.a || item.answer,
  }));

  const system = home.raimovSystem || {};
  const doctorHome = {
    ...home.doctor,
    name: home.doctor?.name || doctorProfile.publicName,
    role: home.doctor?.role?.publishable
      ? home.doctor.role
      : (doctorProfile.role?.publishable
        ? { text: doctorProfile.role.title, publishable: true }
        : home.doctor?.role),
    competencies: (home.doctor?.competencies || []).some((c) => c.publishable)
      ? home.doctor.competencies
      : (doctorProfile.focusAreas?.publishable
        ? (doctorProfile.focusAreas.items || []).map((text) => ({ text, publishable: true }))
        : home.doctor?.competencies),
    body: home.doctor?.body || doctorProfile.clinicalPhilosophy?.body,
    profileHref: home.doctor?.profileHref || doctorProfile.path,
    photo: home.doctor?.photo,
  };

  const cases = publishedCases(home, data?.cases);
  const reviews = publishedReviews(home, data?.reviews);
  const gallery = publishedGallery(home);
  const final = home.finalCta || {};

  const body = `
  <header class="patient-hero" data-analytics-section="hero">
    <div class="container">
      <p class="section__eyebrow">${escapeHtml(isEn ? 'RAIMOV DENTAL · Bishkek' : 'RAIMOV DENTAL · Бишкек')}</p>
      <h1 class="patient-hero__title">${escapeHtml(hero.h1 || meta.title)}</h1>
      <p class="patient-hero__lead">${escapeHtml(hero.subtitle || meta.description)}</p>
      <div class="hero__actions">
        <a class="btn btn-primary" href="${escapeHtml(normalizedBook)}" data-analytics-click="hero_cta_click">${escapeHtml(ctaBook)}</a>
        <a class="btn btn-outline" href="${escapeHtml(waTarget)}" target="_blank" rel="noopener" data-analytics-click="whatsapp_click">${escapeHtml(ctaWa)}</a>
        <a class="btn btn-ghost" href="${escapeHtml(phoneHref)}" data-analytics-click="phone_click">${escapeHtml(copy.call)}</a>
      </div>
      <p class="patient-hero__note">${escapeHtml(isEn
        ? 'Complex cases start with diagnostics — not with choosing a procedure.'
        : 'Сложный случай начинается с диагностики — не с выбора процедуры.')}</p>
    </div>
  </header>
  ${sectionShell({
    id: 'task-chooser',
    analytics: 'task-chooser',
    surface: true,
    eyebrow: isEn ? 'Your task' : 'Ваша задача',
    title: home.patientGoals?.heading || (isEn ? 'What do you need to solve?' : 'С какой задачей вы пришли?'),
    lead: isEn
      ? 'Start with the problem. The treatment format is chosen after diagnostics.'
      : 'Начните с проблемы. Формат лечения выбирается после диагностики.',
    body: renderTaskChooser(goals),
  })}
  ${showFirstVisit ? sectionShell({
    id: 'first-visit',
    eyebrow: isEn ? 'Entry product' : 'Вход в лечение',
    title: firstVisit.heading || (isEn ? 'First visit / comprehensive diagnostics' : 'Первый визит / комплексная диагностика'),
    lead: isEn
      ? 'The goal of the first visit is clarity: options, sequence, and a staged path — not selling a procedure in the first conversation.'
      : 'Задача первого визита — ясность: варианты, последовательность и этапный путь — не продажа процедуры в первом разговоре.',
    body: renderFirstVisit(firstVisit, {
      locale,
      priceBand,
      bookHref: normalizedBook,
      ctaLabel: ctaBook,
    }),
  }) : ''}
  ${flagship.length ? sectionShell({
    id: 'patient-services',
    surface: true,
    eyebrow: isEn ? 'Flagship directions' : 'Флагманские направления',
    title: home.flagshipServices?.heading || (isEn ? 'Core treatment directions' : 'Ключевые направления'),
    lead: isEn
      ? 'Veneers, implants and orthodontics serve one agreed plan — they do not compete for the patient.'
      : 'Виниры, имплантация и ортодонтия работают в одном согласованном плане — не конкурируют за пациента.',
    body: renderCards(flagship),
  }) : ''}
  ${system.steps?.length ? sectionShell({
    id: 'system-preview',
    eyebrow: 'Raimov System',
    title: system.heading || 'Raimov System',
    lead: isEn
      ? 'How the team turns a complex case into a controlled pathway.'
      : 'Как команда превращает сложный случай в управляемый маршрут.',
    body: `${renderSystemSteps(system.steps, locale)}
      <p class="editorial-teaser"><a class="editorial-link" href="${escapeHtml(system.cta?.href || (isEn ? '/en/raimov-system/' : '/ru/raimov-system/'))}">${escapeHtml(system.cta?.label || (isEn ? 'How the system works' : 'Как устроена система'))} <span aria-hidden="true">→</span></a>
      · <a class="editorial-link" href="${isEn ? '/en/ecosystem/' : '/ru/ekosistema/'}">${escapeHtml(isEn ? 'RAIMOV ecosystem' : 'Экосистема RAIMOV')} <span aria-hidden="true">→</span></a></p>`,
  }) : ''}
  ${doctorHome?.name ? sectionShell({
    id: 'doctor-preview',
    surface: true,
    eyebrow: isEn ? 'Lead doctor' : 'Ведущий врач',
    title: doctorHome.heading || doctorHome.name,
    body: renderDoctorBlock(doctorHome, locale),
  }) : ''}
  ${cases.length ? sectionShell({
    id: 'cases',
    title: home.cases?.heading || (isEn ? 'Treatment results' : 'Результаты лечения'),
    body: renderCaseRail(cases, locale),
  }) : ''}
  ${reviews.length ? sectionShell({
    id: 'reviews',
    surface: true,
    title: home.reviews?.heading || (isEn ? 'Patient reviews' : 'Отзывы пациентов'),
    body: renderReviews(reviews),
  }) : ''}
  ${gallery.length ? sectionShell({
    id: 'clinic-gallery',
    title: home.clinicGallery?.heading || (isEn ? 'Clinic' : 'Клиника'),
    body: renderGallery(gallery),
  }) : ''}
  ${faqItems.length ? sectionShell({
    id: 'faq',
    title: home.faq?.heading || 'FAQ',
    body: renderFaq(faqItems),
  }) : ''}
  ${sectionShell({
    id: 'final-cta',
    surface: true,
    eyebrow: isEn ? 'Next step' : 'Следующий шаг',
    title: final.heading || (isEn ? 'Book comprehensive diagnostics' : 'Записаться на комплексную диагностику'),
    lead: final.body || (isEn
      ? 'Describe the task. The coordinator will confirm the visit format.'
      : 'Опишите задачу. Координатор подтвердит формат визита.'),
    body: `<div class="final-cta__actions">
      <a class="btn btn-primary" href="${escapeHtml(normalizedBook)}" data-analytics-click="hero_cta_click">${escapeHtml(final.primaryCta?.label || ctaBook)}</a>
      <a class="btn btn-outline" href="${escapeHtml(secondOpinionWhatsAppHref(waHref, locale))}" target="_blank" rel="noopener" data-analytics-click="second_opinion_click">${escapeHtml(final.secondOpinion?.label || (isEn ? 'Second opinion' : 'Нужно второе мнение'))}</a>
      <a class="btn btn-ghost" href="${escapeHtml(waHref)}" target="_blank" rel="noopener" data-analytics-click="whatsapp_click">WhatsApp</a>
    </div>`,
  })}
  ${leadFormMount({
    locale,
    title: ctaBook,
    ctaSource: `raimovdental_home_${locale}`,
  })}
  ${renderContactsSection({ locale, contacts: ctx.contacts })}
  <p class="home-ecosystem-footnote container">${escapeHtml(isEn
    ? 'RAIMOV DENTAL · Raimov System · Raimov Academy — clinical, methodological and educational layers of one ecosystem.'
    : 'RAIMOV DENTAL · Raimov System · Raimov Academy — клинический, методологический и образовательный слои одной экосистемы.')}</p>
  ${renderStickyCta({
    locale,
    bookHref: normalizedBook,
    waHref,
    phoneHref,
    ctaBook,
    ctaBookShort: copy.bookShort,
    ctaWa,
    ctaCall: copy.call,
  })}`;

  return wrapPage(
    ctx,
    {
      title: meta.title || hero.h1,
      description: meta.description || hero.subtitle,
      jsonLd: [
        organizationJsonLd({ locale, path, description: meta.description || hero.subtitle }),
        breadcrumbJsonLd([{ name: meta.title || hero.h1, item: path }]),
      ],
    },
    body,
  );
}

function renderContactsSection({ locale, contacts }) {
  const isEn = locale === 'en';
  const email = contacts.email ? `<p><a href="mailto:${escapeHtml(contacts.email)}">${escapeHtml(contacts.email)}</a></p>` : '';
  return sectionShell({
    id: 'contacts',
    title: isEn ? 'Clinic contacts' : 'Контакты клиники',
    body: `<div class="contacts-block grid grid--2">
      <div class="contacts-block__info">
        <p class="contacts-block__phone"><a href="${escapeHtml(contacts.phoneHref)}" data-analytics-click="phone_click">${escapeHtml(contacts.phone)}</a></p>
        <p><a href="${escapeHtml(contacts.whatsappHref)}" target="_blank" rel="noopener" data-analytics-click="whatsapp_click">WhatsApp</a></p>
        ${email}
        <p>${escapeHtml(contacts.address)}</p>
        <p class="contacts-block__hours">${escapeHtml(contacts.hours)}</p>
      </div>
      <a class="contacts-block__map-link" href="${escapeHtml(contacts.mapsUrl)}" target="_blank" rel="noopener" data-analytics-click="maps_click">${escapeHtml(isEn ? 'Open clinic on the map' : 'Открыть клинику на карте')}</a>
    </div>`,
  });
}
