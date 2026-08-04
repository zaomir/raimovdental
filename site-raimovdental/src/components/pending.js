import { escapeHtml } from '../templates/lib/utils.js';

export function contentPending() {
  return '';
}

export function leadFormMount(opts) {
  return `<section class="section section--surface" id="lead-form" aria-labelledby="lead-form-title">
  <div class="container container--narrow">
    <h2 id="lead-form-title">${escapeHtml(opts.title || (opts.locale === 'en' ? 'Discuss your treatment plan' : 'Обсудить план лечения'))}</h2>
    <p class="section__lead">${escapeHtml(opts.locale === 'en' ? 'Answer three short questions and continue in WhatsApp.' : 'Ответьте на три коротких вопроса и продолжите общение в WhatsApp.')}</p>
    <div id="lead-form-root" class="lead-form-root" data-lead-form-root data-cta-source="${escapeHtml(opts.ctaSource || `raimovdental_form_${opts.locale || 'ru'}`)}" data-analytics-section="lead-form" data-analytics-locale="${escapeHtml(opts.locale)}"></div>
  </div>
</section>`;
}
