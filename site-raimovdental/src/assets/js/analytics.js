/**
 * RAIMOV DENTAL analytics — no PII to ad/analytics pixels (TASK-756 Lane C).
 */
(function (global) {
  const ALLOWED_EVENTS = new Set([
    'view_service',
    'view_case',
    'case_open',
    'view_doctor',
    'diagnostic_cta_click',
    'hero_cta_click',
    'jtbd_select',
    'first_visit_block_view',
    'second_opinion_click',
    'lead_form_start',
    'lead_step_complete',
    'lead_submit',
    'lead_saved',
    'lead_success',
    'lead_error',
    'whatsapp_opened',
    'phone_click',
    'telegram_click',
    'whatsapp_click',
    'maps_click',
    'language_switch',
    'international_patient_click',
    'investor_cta_click',
    'investor_form_start',
    'investor_form_submit',
    'academy_cta_click',
    'academy_form_start',
    'academy_form_submit',
  ]);

  const PII_KEYS = new Set([
    'name',
    'phone',
    'email',
    'message',
    'diagnosis',
    'interest',
    'interest_text',
    'interestText',
    'telegram',
    'whatsapp',
    'telegramOrWhatsapp',
    'contact',
    'body',
    'passport',
    'medical',
    'disease',
  ]);

  function currentLang() {
    const html = document.documentElement;
    return (html.getAttribute('lang') || 'ru').slice(0, 2);
  }

  function sanitizeProps(props) {
    const out = {};
    if (!props || typeof props !== 'object') return out;
    for (const [key, value] of Object.entries(props)) {
      if (PII_KEYS.has(key)) continue;
      if (typeof value === 'string' && value.length > 120) continue;
      out[key] = value;
    }
    return out;
  }

  function track(event, props) {
    if (!ALLOWED_EVENTS.has(event)) {
      if (global.__RAIMOV_ANALYTICS_DEBUG) {
        console.warn('[raimov-analytics] blocked unknown event', event);
      }
      return;
    }
    const payload = Object.assign(
      {
        event,
        ts: Date.now(),
        lang: currentLang(),
        path: global.location ? global.location.pathname : undefined,
      },
      sanitizeProps(props),
    );

    if (typeof global.gtag === 'function') {
      global.gtag('event', event, payload);
    }
    if (global.dataLayer && Array.isArray(global.dataLayer)) {
      global.dataLayer.push(payload);
    }
    if (global.__RAIMOV_ANALYTICS_DEBUG) {
      console.log('[raimov-analytics]', payload);
    }
  }

  function wireContactClicks() {
    document.addEventListener('click', function (e) {
      const el = e.target.closest('[data-analytics-click]');
      if (!el) return;
      const evt = el.getAttribute('data-analytics-click');
      if (!evt || !ALLOWED_EVENTS.has(evt)) return;
      const props = {};
      const service = el.getAttribute('data-service-slug');
      const caseSlug = el.getAttribute('data-case-slug');
      const doctor = el.getAttribute('data-doctor-slug');
      if (service) props.service_slug = service;
      if (caseSlug) props.case_slug = caseSlug;
      if (doctor) props.doctor_slug = doctor;
      track(evt, props);
    });
  }

  function wirePageIntents() {
    const body = document.body;
    if (!body) return;
    const view = body.getAttribute('data-analytics-view');
    if (view === 'service') {
      track('view_service', { service_slug: body.getAttribute('data-service-slug') || undefined });
    } else if (view === 'case') {
      track('view_case', { case_slug: body.getAttribute('data-case-slug') || undefined });
    } else if (view === 'doctor') {
      track('view_doctor', { doctor_slug: body.getAttribute('data-doctor-slug') || undefined });
    }
  }

  global.__raimovTrack = track;
  global.__raimovAnalytics = { track, sanitizeProps, ALLOWED_EVENTS, PII_KEYS };

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
      wireContactClicks();
      wirePageIntents();
    });
  }
})(typeof window !== 'undefined' ? window : globalThis);
