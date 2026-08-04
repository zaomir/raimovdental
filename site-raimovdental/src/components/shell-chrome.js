import { escapeHtml } from '../templates/lib/utils.js';

export function renderUtilityBar(ctx) {
  const { locale, path, hreflang } = ctx;
  return `<div class="utility-bar" data-analytics-section="utility-bar">
  <div class="container utility-bar__inner">
    <div class="utility-bar__contacts">
      <a href="${escapeHtml(ctx.contacts.phoneHref)}" data-analytics-click="phone_click">${escapeHtml(ctx.contacts.phone)}</a>
      <a href="${escapeHtml(ctx.contacts.whatsappHref)}" target="_blank" rel="noopener" data-analytics-click="whatsapp_click">WhatsApp</a>
      <span>${escapeHtml(ctx.contacts.hours)}</span>
    </div>
    <div class="utility-bar__lang" role="group" aria-label="Language">
      <a class="lang-switch" href="${escapeHtml(locale === 'ru' ? path : ctx.altPathRu || '/ru/')}" hreflang="ru" lang="ru" ${locale === 'ru' ? 'aria-current="true"' : ''} data-lang-switch="ru">RU</a>
      <a class="lang-switch" href="${escapeHtml(locale === 'en' ? path : hreflang || '/en/')}" hreflang="en" lang="en" ${locale === 'en' ? 'aria-current="true"' : ''} data-lang-switch="en">EN</a>
    </div>
  </div>
</div>`;
}

export function renderHeader(ctx) {
  const { locale, path } = ctx;
  const isEn = locale === 'en';
  const home = isEn ? '/en/' : '/ru/';
  // Patient primary nav — Academy out of primary until real offer (C2)
  const nav = [
    { label: isEn ? 'Services' : 'Услуги', href: isEn ? '/en/comprehensive-diagnostics/' : '/ru/kompleksnaya-diagnostika/' },
    { label: isEn ? 'First visit' : 'Первый визит', href: `${home}#first-visit` },
    { label: isEn ? 'Doctor' : 'О враче', href: isEn ? '/en/atabek-raimov/' : '/ru/atabek-raimov/' },
    { label: isEn ? 'Contacts' : 'Контакты', href: isEn ? '/en/contact/' : '/ru/kontakty/' },
  ];
  const navHtml = nav.map((item) => `<li class="nav-item"><a class="site-nav__link" href="${escapeHtml(item.href)}"${path === item.href ? ' aria-current="page"' : ''}>${escapeHtml(item.label)}</a></li>`).join('\n');
  const ctaHref = isEn ? '/en/comprehensive-diagnostics/#lead-form' : '/ru/kompleksnaya-diagnostika/#lead-form';
  const ctaLabel = isEn ? 'Book comprehensive diagnostics' : 'Записаться на комплексную диагностику';

  return `<header class="site-header">
  <div class="container site-header__inner">
    <a class="brand" href="${home}" aria-label="RAIMOV DENTAL">
      <span class="brand__mark" aria-hidden="true">R</span>
      <span class="brand__lockup"><span class="brand__name">RAIMOV</span><span class="brand__sub">DENTAL</span></span>
    </a>
    <nav class="site-nav" aria-label="${isEn ? 'Primary' : 'Основная'}"><ul class="site-nav__list">${navHtml}</ul></nav>
    <div class="header-actions"><a class="btn btn-primary" href="${ctaHref}" data-analytics-click="diagnostic_cta_click">${escapeHtml(ctaLabel)}</a></div>
    <button type="button" class="menu-toggle" data-drawer-toggle aria-expanded="false" aria-controls="mobile-nav" aria-label="${isEn ? 'Open menu' : 'Открыть меню'}"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.5"/></svg></button>
  </div>
</header>
<nav id="mobile-nav" class="site-nav site-nav--mobile" hidden aria-label="${isEn ? 'Mobile' : 'Мобильная'}"></nav>`;
}

export function renderFooter(ctx) {
  const { locale } = ctx;
  const isEn = locale === 'en';
  const prefix = isEn ? '/en' : '/ru';
  const year = new Date().getFullYear();
  const col = (title, links) => `<div><h2 class="site-footer__title">${escapeHtml(title)}</h2><ul class="site-footer__list">${links.map((link) => `<li><a href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></li>`).join('')}</ul></div>`;
  return `<footer class="site-footer"><div class="container">
    <div class="site-footer__intro">
      <p class="site-footer__brand">RAIMOV DENTAL</p>
      <p>${escapeHtml(isEn
        ? 'Comprehensive dentistry in Bishkek. Complex cases start with diagnostics.'
        : 'Комплексная стоматология в Бишкеке. Сложный случай начинается с диагностики.')}</p>
    </div>
    <div class="site-footer__grid">
      <div><h2 class="site-footer__title">RAIMOV DENTAL</h2><p><a href="${escapeHtml(ctx.contacts.phoneHref)}">${escapeHtml(ctx.contacts.phone)}</a><br>${escapeHtml(ctx.contacts.address)}</p><p><a href="${escapeHtml(ctx.contacts.mapsUrl)}" target="_blank" rel="noopener">${escapeHtml(isEn ? 'Open map' : 'Открыть карту')}</a></p><p>${escapeHtml(ctx.contacts.hours)}</p></div>
      ${col(isEn ? 'Patients' : 'Пациентам', [
        { label: isEn ? 'Comprehensive diagnostics' : 'Комплексная диагностика', href: `${prefix}${isEn ? '/comprehensive-diagnostics/' : '/kompleksnaya-diagnostika/'}` },
        { label: isEn ? 'Veneers and smile design' : 'Виниры и дизайн улыбки', href: `${prefix}${isEn ? '/veneers/' : '/viniry/'}` },
        { label: isEn ? 'Dental implants' : 'Имплантация', href: `${prefix}${isEn ? '/dental-implants/' : '/implantaciya/'}` },
        { label: isEn ? 'Full-mouth reconstruction' : 'Полное восстановление', href: `${prefix}${isEn ? '/full-mouth-reconstruction/' : '/polnoe-vosstanovlenie-zubov/'}` },
        { label: isEn ? 'Adult orthodontics' : 'Ортодонтия для взрослых', href: `${prefix}${isEn ? '/adult-orthodontics/' : '/ortodontiya-dlya-vzroslyh/'}` },
      ])}
      ${col(isEn ? 'Ecosystem' : 'Экосистема', [
        { label: isEn ? 'Ecosystem architecture' : 'Архитектура экосистемы', href: `${prefix}${isEn ? '/ecosystem/' : '/ekosistema/'}` },
        { label: 'Raimov System', href: `${prefix}/raimov-system/` },
        { label: 'Atabek Raimov', href: `${prefix}/atabek-raimov/` },
        { label: isEn ? 'Raimov Academy (for doctors)' : 'Raimov Academy (для врачей)', href: `${prefix}/academy/` },
      ])}
      ${col(isEn ? 'Clinic' : 'Клиника', [
        { label: isEn ? 'About RAIMOV DENTAL' : 'О RAIMOV DENTAL', href: `${prefix}${isEn ? '/about/' : '/o-klinike/'}` },
        { label: isEn ? 'International patients' : 'Международным пациентам', href: `${prefix}${isEn ? '/international-patients/' : '/mezhdunarodnym-pacientam/'}` },
        { label: isEn ? 'Contacts' : 'Контакты', href: `${prefix}${isEn ? '/contact/' : '/kontakty/'}` },
        { label: 'WhatsApp', href: ctx.contacts.whatsappHref },
      ])}
    </div>
    <div class="site-footer__bottom"><p>© ${year} RAIMOV DENTAL. ${escapeHtml(isEn ? 'Medical decisions require individual diagnostics. Raimov Academy · Raimov System are layers of the RAIMOV ecosystem.' : 'Медицинские решения принимаются только после индивидуальной диагностики. Raimov Academy · Raimov System — слои экосистемы RAIMOV.')}</p></div>
  </div></footer>`;
}
