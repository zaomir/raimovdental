/**
 * RAIMOV DENTAL — Stage B public lead forms (#investor-form, #academy-form).
 * Waits for /assets/site-config.js (injected by build) before submitting.
 */
(function (global) {
  const CONSENT_VERSION_FALLBACK = '2026-07-31';
  const SUBMIT_TIMEOUT_MS = 12000;
  const SITE_CONFIG_WAIT_MS = 4000;

  function track(event, props) {
    if (typeof global.__raimovTrack === 'function') global.__raimovTrack(event, props || {});
  }

  function clip(value, max) {
    return String(value == null ? '' : value).trim().slice(0, max || 200);
  }

  function waitForSiteConfig(maxWaitMs) {
    return new Promise((resolve) => {
      const start = Date.now();
      (function poll() {
        if (global.siteConfig && global.siteConfig.supabase) {
          resolve(global.siteConfig);
          return;
        }
        if (Date.now() - start >= maxWaitMs) {
          resolve(global.siteConfig || null);
          return;
        }
        setTimeout(poll, 100);
      })();
    });
  }

  function collectUtm() {
    let params;
    try {
      params = new URLSearchParams(global.location.search);
    } catch {
      return {};
    }
    const utm = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((key) => {
      const value = clip(params.get(key), 120);
      if (value) utm[key] = value;
    });
    return utm;
  }

  function resolveSubmitUrl(cfg) {
    if (!cfg) return null;
    const path = cfg.leadForm && cfg.leadForm.submitPath;
    if (!path) return null;
    if (/^https?:\/\//i.test(String(path))) return String(path);
    const base = (cfg.supabase && cfg.supabase.url) || '';
    if (!base) return null;
    return `${String(base).replace(/\/$/, '')}${String(path).startsWith('/') ? path : `/${path}`}`;
  }

  function setFieldError(input, hasError) {
    const field = input.closest('.field');
    if (field) field.classList.toggle('has-error', !!hasError);
    input.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  }

  function showStatus(statusEl, message, isError) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove('is-error', 'is-success');
    statusEl.classList.add(isError ? 'is-error' : 'is-success', 'is-visible');
  }

  function hideStatus(statusEl) {
    if (!statusEl) return;
    statusEl.classList.remove('is-visible', 'is-error', 'is-success');
    statusEl.textContent = '';
  }

  function initForm(form) {
    const formType = form.id === 'investor-form' ? 'investor' : 'academy';
    const leadType = formType === 'investor' ? 'investor_strategy' : 'academy_interest';
    const ctaSource = form.getAttribute('data-cta-source') || formType;
    const statusEl = form.querySelector('[data-status-for="' + form.id + '"]');
    const submitBtn = form.querySelector('button[type="submit"]');
    const submitLabel = submitBtn ? submitBtn.textContent : 'Отправить';

    let started = false;
    let submitting = false;
    let succeeded = false;

    function markStarted() {
      if (started) return;
      started = true;
      track(formType + '_form_start', { cta_source: ctaSource });
    }

    form.addEventListener('focusin', markStarted);

    function requiredInputs() {
      return Array.from(form.querySelectorAll('[required]'));
    }

    function validate() {
      let firstInvalid = null;
      requiredInputs().forEach((input) => {
        let invalid;
        if (input.type === 'checkbox') {
          invalid = !input.checked;
        } else {
          invalid = !String(input.value || '').trim();
        }
        setFieldError(input, invalid);
        if (invalid && !firstInvalid) firstInvalid = input;
      });
      return firstInvalid;
    }

    function buildPayload(cfg) {
      const fd = new FormData(form);
      const consentVersion =
        (cfg && cfg.leadForm && cfg.leadForm.consentVersion) || CONSENT_VERSION_FALLBACK;

      const payload = {
        leadType,
        interest: leadType,
        name: clip(fd.get('name'), 120),
        contact: clip(fd.get('contact'), 160),
        contactChannel: clip(fd.get('contact_channel'), 30) || undefined,
        language: 'ru',
        pageUrl: global.location.href,
        ctaSource,
        referrer: document.referrer || null,
        consentVersion,
        utm: collectUtm(),
        website: clip(fd.get('website'), 200),
      };

      if (formType === 'investor') {
        payload.country = clip(fd.get('country'), 120);
        payload.city = clip(fd.get('city'), 120);
        payload.role = clip(fd.get('role'), 60);
        payload.interestNote = clip(fd.get('interest_note'), 800);
      } else {
        payload.city = clip(fd.get('city'), 120);
        payload.specialty = clip(fd.get('specialty'), 120);
        payload.professionalInterest = clip(fd.get('professional_interest'), 800);
      }

      return payload;
    }

    async function submitLead(payload, cfg) {
      const url = resolveSubmitUrl(cfg);
      if (!url) {
        const err = new Error('submit_unconfigured');
        err.code = 'submit_unconfigured';
        throw err;
      }

      const headers = { 'Content-Type': 'application/json' };
      const anonKey = cfg && cfg.supabase && cfg.supabase.anonKey;
      if (anonKey) {
        headers.apikey = anonKey;
        headers.Authorization = `Bearer ${anonKey}`;
      }

      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS) : null;

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: controller ? controller.signal : undefined,
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
          throw err;
        }

        return data;
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (submitting || succeeded) return;

      const invalidInput = validate();
      if (invalidInput) {
        showStatus(statusEl, 'Проверьте, пожалуйста, отмеченные поля.', true);
        invalidInput.focus();
        return;
      }

      submitting = true;
      if (submitBtn) submitBtn.setAttribute('disabled', 'disabled');
      hideStatus(statusEl);
      track(formType + '_form_submit', { cta_source: ctaSource });

      try {
        const cfg = await waitForSiteConfig(SITE_CONFIG_WAIT_MS);
        const payload = buildPayload(cfg);
        await submitLead(payload, cfg);

        succeeded = true;
        const successMessage =
          formType === 'investor'
            ? 'Заявка получена. Представитель RAIMOV DENTAL свяжется с вами.'
            : 'Запрос получен. Представитель RAIMOV DENTAL свяжется с вами.';
        showStatus(statusEl, successMessage, false);
        if (submitBtn) {
          submitBtn.textContent = 'Отправлено';
          submitBtn.setAttribute('disabled', 'disabled');
        }
      } catch {
        submitting = false;
        if (submitBtn) {
          submitBtn.removeAttribute('disabled');
          submitBtn.textContent = submitLabel;
        }
        showStatus(
          statusEl,
          'Не удалось отправить заявку. Проверьте связь с интернетом и попробуйте ещё раз.',
          true,
        );
      }
    });
  }

  function wireCtaTracking() {
    document.addEventListener('click', (event) => {
      const el = event.target.closest('[data-analytics-click]');
      if (!el) return;
      const evt = el.getAttribute('data-analytics-click');
      if (!evt) return;
      track(evt, { cta_source: el.getAttribute('data-cta-source') || undefined });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    wireCtaTracking();
    document.querySelectorAll('#investor-form, #academy-form').forEach(initForm);
  });
})(typeof window !== 'undefined' ? window : globalThis);
