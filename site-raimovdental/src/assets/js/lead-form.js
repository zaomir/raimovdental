/** RAIMOV DENTAL — privacy-conscious three-step lead form (EF → analytics → WhatsApp). */
(function (global) {
  const INTERESTS = [
    'veneers',
    'implants',
    'orthodontics',
    'full_rehabilitation',
    'diagnostics',
    'second_opinion',
    'other',
  ];
  const CHANNELS = ['phone', 'whatsapp'];
  const COPY = {
    ru: {
      step1: 'Что вас интересует?', step2: 'Откуда вы обращаетесь?', step3: 'Как с вами связаться?',
      interests: {
        veneers: 'Виниры и эстетика улыбки',
        implants: 'Имплантация и протезирование',
        orthodontics: 'Ортодонтия и прикус',
        full_rehabilitation: 'Полная реабилитация',
        diagnostics: 'Диагностика и план лечения',
        second_opinion: 'Второе мнение',
        other: 'Другой вопрос',
      },
      country: 'Страна', city: 'Город', channel: 'Предпочитаемый канал связи',
      channels: { phone: 'Телефон', whatsapp: 'WhatsApp' }, name: 'Имя', phone: 'Телефон',
      consent: 'Я согласен(на) на обработку данных для связи с клиникой',
      next: 'Далее', back: 'Назад', submit: 'Отправить заявку',
      submitRetry: 'Повторить отправку',
      whatsappFallback: 'Продолжить в WhatsApp без сохранения',
      submitError: 'Не удалось сохранить заявку. Попробуйте ещё раз или перейдите в WhatsApp.',
      errors: {
        interest: 'Выберите задачу', location: 'Укажите страну и город', channel: 'Выберите способ связи',
        contact: 'Укажите имя и телефон', consent: 'Нужно согласие на обработку данных',
      },
      messageTitle: 'Здравствуйте! Хочу обсудить лечение в RAIMOV DENTAL.',
      messageLabels: { interest: 'Задача', location: 'Город', name: 'Имя', phone: 'Телефон', channel: 'Предпочтительный канал' },
    },
    en: {
      step1: 'What would you like to discuss?', step2: 'Where are you based?', step3: 'How can we contact you?',
      interests: {
        veneers: 'Veneers and smile aesthetics',
        implants: 'Implants and prosthetics',
        orthodontics: 'Orthodontics and bite',
        full_rehabilitation: 'Full mouth rehabilitation',
        diagnostics: 'Diagnostics and treatment plan',
        second_opinion: 'Second opinion',
        other: 'Other question',
      },
      country: 'Country', city: 'City', channel: 'Preferred contact channel',
      channels: { phone: 'Phone', whatsapp: 'WhatsApp' }, name: 'Name', phone: 'Phone',
      consent: 'I agree to data processing so the clinic can contact me',
      next: 'Continue', back: 'Back', submit: 'Submit request',
      submitRetry: 'Try again',
      whatsappFallback: 'Continue in WhatsApp without saving',
      submitError: 'Could not save your request. Please try again or continue in WhatsApp.',
      errors: {
        interest: 'Select a goal', location: 'Enter your country and city', channel: 'Select a contact channel',
        contact: 'Enter your name and phone number', consent: 'Consent is required',
      },
      messageTitle: 'Hello! I would like to discuss treatment at RAIMOV DENTAL.',
      messageLabels: { interest: 'Goal', location: 'Location', name: 'Name', phone: 'Phone', channel: 'Preferred channel' },
    },
  };

  const clip = (value, max = 160) => String(value || '').trim().slice(0, max);
  const locale = () => (document.documentElement.lang || 'ru').slice(0, 2) === 'en' ? 'en' : 'ru';
  const copy = () => COPY[locale()] || COPY.ru;
  const config = () => global.siteConfig || global.__raimovSiteConfig || {};
  const track = (event, props) => {
    if (typeof global.__raimovTrack === 'function') global.__raimovTrack(event, props || {});
  };

  function collectUtm() {
    const params = new URLSearchParams(global.location.search);
    const utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((key) => {
      const value = clip(params.get(key), 120);
      if (value) utm[key] = value;
    });
    return utm;
  }

  function resolveSubmitUrl() {
    const cfg = config();
    const path = cfg.leadForm?.submitPath;
    if (!path) return null;
    if (/^https?:\/\//i.test(String(path))) return String(path);
    const base = cfg.supabase?.url || '';
    if (!base) return null;
    return `${String(base).replace(/\/$/, '')}${String(path).startsWith('/') ? path : `/${path}`}`;
  }

  function node(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text != null) el.textContent = text;
    return el;
  }

  function field(labelText, name, type = 'text') {
    const wrap = node('div', 'field');
    const label = node('label', '', labelText);
    const input = node('input', 'input');
    input.name = name;
    input.type = type;
    input.required = true;
    input.autocomplete = name === 'name' ? 'name' : name === 'phone' ? 'tel' : 'on';
    label.appendChild(input);
    wrap.appendChild(label);
    return { wrap, input };
  }

  function choiceGroup(values, labels, name) {
    const wrap = node('div', 'choice-grid');
    values.forEach((value) => {
      const label = node('label', 'field field--choice');
      const input = document.createElement('input');
      input.type = 'radio'; input.name = name; input.value = value;
      label.appendChild(input); label.appendChild(document.createTextNode(labels[value] || value));
      wrap.appendChild(label);
    });
    return wrap;
  }

  function buildWhatsappUrl(state) {
    const c = copy();
    const cfg = config();
    const raw = cfg.leadForm?.whatsappE164 || cfg.contacts?.whatsappE164 || '+996555255455';
    const number = String(raw).replace(/\D/g, '');
    const lines = [
      c.messageTitle,
      `${c.messageLabels.interest}: ${c.interests[state.interest] || state.interest}`,
      `${c.messageLabels.location}: ${state.city}, ${state.country}`,
      `${c.messageLabels.name}: ${state.name}`,
      `${c.messageLabels.phone}: ${state.phone}`,
      `${c.messageLabels.channel}: ${c.channels[state.channel] || state.channel}`,
      `Page: ${global.location.pathname}`,
    ];
    return `https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`;
  }

  function buildPayload(state, ctaSource) {
    const cfg = config();
    const payload = {
      name: state.name,
      phone: state.phone,
      contactChannel: state.channel,
      country: state.country,
      city: state.city,
      interest: state.interest,
      language: locale(),
      pageUrl: global.location.href,
      ctaSource,
      referrer: document.referrer || null,
      consentVersion: cfg.leadForm?.consentVersion || '2026-07-21',
      utm: collectUtm(),
      website: '',
    };
    if (state.channel === 'whatsapp') {
      payload.telegramOrWhatsapp = state.phone;
    }
    return payload;
  }

  async function submitLead(state, ctaSource) {
    const url = resolveSubmitUrl();
    if (!url) {
      const err = new Error('submit_unconfigured');
      err.code = 'submit_unconfigured';
      throw err;
    }

    const cfg = config();
    const headers = { 'Content-Type': 'application/json' };
    const anonKey = cfg.supabase?.anonKey;
    if (anonKey) {
      headers.apikey = anonKey;
      headers.Authorization = `Bearer ${anonKey}`;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(buildPayload(state, ctaSource)),
    });

    let data = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      const err = new Error(data.error || 'submit_failed');
      err.status = res.status;
      err.requestId = data.request_id;
      throw err;
    }

    return data;
  }

  function mount(root) {
    const c = copy();
    const state = { step: 1, interest: '', country: '', city: '', channel: 'whatsapp', name: '', phone: '', consent: false };
    const ctaSource = root.getAttribute('data-cta-source') || `raimovdental_form_${locale()}`;
    const form = node('form', 'lead-form__form');
    form.noValidate = true;

    const honeypotWrap = node('div', 'lead-form__honeypot');
    honeypotWrap.hidden = true;
    honeypotWrap.setAttribute('aria-hidden', 'true');
    const honeypot = node('input', 'input');
    honeypot.name = 'website';
    honeypot.tabIndex = -1;
    honeypot.autocomplete = 'off';
    honeypotWrap.appendChild(honeypot);
    form.appendChild(honeypotWrap);

    const progress = node('div', 'lead-form__progress');
    [1, 2, 3].forEach((n) => { const p = node('span', 'lead-form__progress-step'); p.dataset.progressStep = String(n); progress.appendChild(p); });
    form.appendChild(progress);

    const steps = [];
    const s1 = node('section', 'lead-form__step'); s1.appendChild(node('h3', 'lead-form__title', c.step1)); s1.appendChild(choiceGroup(INTERESTS, c.interests, 'interest')); steps.push(s1);
    const s2 = node('section', 'lead-form__step'); s2.hidden = true; s2.appendChild(node('h3', 'lead-form__title', c.step2));
    const country = field(c.country, 'country'); const city = field(c.city, 'city');
    s2.appendChild(country.wrap); s2.appendChild(city.wrap); s2.appendChild(node('p', 'lead-form__hint', c.channel)); s2.appendChild(choiceGroup(CHANNELS, c.channels, 'channel')); steps.push(s2);
    const s3 = node('section', 'lead-form__step'); s3.hidden = true; s3.appendChild(node('h3', 'lead-form__title', c.step3));
    const name = field(c.name, 'name'); const phone = field(c.phone, 'phone', 'tel');
    s3.appendChild(name.wrap); s3.appendChild(phone.wrap);
    const consentLabel = node('label', 'field field--check'); const consent = document.createElement('input'); consent.type = 'checkbox'; consent.name = 'consent'; consentLabel.appendChild(consent); consentLabel.appendChild(document.createTextNode(c.consent)); s3.appendChild(consentLabel); steps.push(s3);
    steps.forEach((s) => form.appendChild(s));

    const error = node('div', 'lead-form__error'); error.hidden = true; error.setAttribute('role', 'alert'); form.appendChild(error);
    const actions = node('div', 'lead-form__actions');
    const back = node('button', 'btn btn-outline', c.back); back.type = 'button'; back.hidden = true;
    const next = node('button', 'btn btn-primary', c.next); next.type = 'button';
    const submit = node('button', 'btn btn-primary', c.submit); submit.type = 'submit'; submit.hidden = true;
    const whatsappFallback = node('button', 'btn btn-outline lead-form__whatsapp-fallback', c.whatsappFallback);
    whatsappFallback.type = 'button';
    whatsappFallback.hidden = true;
    actions.append(back, next, submit, whatsappFallback); form.appendChild(actions); root.replaceChildren(form);

    let submitAttempted = false;

    function sync() {
      steps.forEach((s, i) => { s.hidden = i + 1 !== state.step; });
      progress.querySelectorAll('[data-progress-step]').forEach((p, i) => { p.classList.toggle('is-active', i + 1 === state.step); p.classList.toggle('is-done', i + 1 < state.step); });
      if (!submitAttempted) error.hidden = true;
      submit.textContent = submitAttempted ? c.submitRetry : c.submit;
    }

    function read() {
      const fd = new FormData(form);
      state.interest = clip(fd.get('interest'), 80);
      state.country = clip(fd.get('country'), 120);
      state.city = clip(fd.get('city'), 120);
      state.channel = clip(fd.get('channel'), 30) || 'whatsapp';
      state.name = clip(fd.get('name'), 120);
      state.phone = clip(fd.get('phone'), 40).replace(/[^\d+()\-\s]/g, '');
      state.consent = fd.get('consent') === 'on';
    }

    function validate() {
      read();
      if (state.step === 1 && !INTERESTS.includes(state.interest)) return c.errors.interest;
      if (state.step === 2 && (!state.country || !state.city)) return c.errors.location;
      if (state.step === 2 && !CHANNELS.includes(state.channel)) return c.errors.channel;
      if (state.step === 3 && (!state.name || !state.phone)) return c.errors.contact;
      if (state.step === 3 && !state.consent) return c.errors.consent;
      return '';
    }

    function openWhatsapp(skipSavedEvents) {
      const url = buildWhatsappUrl(state);
      if (!skipSavedEvents) {
        track('whatsapp_opened', { cta_source: ctaSource, contact_channel: state.channel });
      } else {
        track('whatsapp_opened', { cta_source: ctaSource, contact_channel: state.channel, fallback: true });
      }
      global.location.href = url;
    }

    whatsappFallback.addEventListener('click', () => {
      openWhatsapp(true);
    });

    next.addEventListener('click', () => {
      const message = validate();
      if (message) {
        error.textContent = message;
        error.hidden = false;
        track('lead_error', { reason: 'validation', step: state.step, cta_source: ctaSource });
        return;
      }
      if (state.step === 1) {
        track('jtbd_select', { interest_slug: state.interest, cta_source: ctaSource });
      }
      track('lead_step_complete', { step: state.step, contact_channel: state.channel, cta_source: ctaSource });
      state.step += 1;
      sync();
    });
    back.addEventListener('click', () => { state.step = Math.max(1, state.step - 1); sync(); });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const message = validate();
      if (message) {
        error.textContent = message;
        error.hidden = false;
        track('lead_error', { reason: 'validation', step: 3, cta_source: ctaSource });
        return;
      }

      track('lead_submit', { contact_channel: state.channel, cta_source: ctaSource });
      submit.disabled = true;
      next.disabled = true;
      submitAttempted = true;
      sync();

      try {
        const result = await submitLead(state, ctaSource);
        track('lead_saved', { lead_id: result.id, cta_source: ctaSource });
        track('lead_success', { delivery: 'ef_then_whatsapp', contact_channel: state.channel, cta_source: ctaSource });
        openWhatsapp(false);
      } catch (err) {
        error.textContent = c.submitError;
        error.hidden = false;
        whatsappFallback.hidden = false;
        track('lead_error', {
          reason: err.message || 'submit_failed',
          status: err.status,
          cta_source: ctaSource,
        });
        submit.disabled = false;
        next.disabled = false;
      }
    });

    track('lead_form_start', { cta_source: ctaSource });
    sync();
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-lead-form-root]').forEach((root) => mount(root));
  });
})(typeof window !== 'undefined' ? window : globalThis);
