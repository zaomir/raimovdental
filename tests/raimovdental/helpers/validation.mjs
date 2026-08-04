/** Shared validation mirroring submit-raimovdental-lead + lead-form.js */
export const INTERESTS = new Set([
  'veneers',
  'implants',
  'orthodontics',
  'full_rehabilitation',
  'diagnostics',
  'second_opinion',
  'other',
]);

export const CONTACT_CHANNELS = new Set(['phone', 'telegram', 'whatsapp']);

export function clip(v, max) {
  return String(v ?? '').trim().slice(0, max);
}

export function normalizePhone(v) {
  return clip(v, 40).replace(/[^\d+()\-\s]/g, '');
}

export function resolveSecondaryContact(data) {
  const channel = clip(data.contactChannel, 40).toLowerCase();
  const phone = normalizePhone(data.phone);
  let secondary = clip(data.telegramOrWhatsapp, 120);
  if (channel === 'whatsapp' && !secondary) secondary = phone;
  return secondary;
}

export function validateStep(step, data) {
  if (step === 1) {
    if (!INTERESTS.has(data.interest)) return 'interest_required';
    return null;
  }
  if (step === 2) {
    if (!clip(data.country, 120)) return 'country_required';
    if (!clip(data.city, 120)) return 'city_required';
    if (!CONTACT_CHANNELS.has(data.contactChannel)) return 'contact_channel_required';
    return null;
  }
  if (step === 3) {
    if (!clip(data.name, 200)) return 'name_required';
    if (!normalizePhone(data.phone)) return 'phone_required';
    if (data.contactChannel === 'telegram' && !clip(data.telegramOrWhatsapp, 120)) {
      return 'secondary_contact_required';
    }
    if (!data.consent) return 'consent_required';
    return null;
  }
  return 'invalid_step';
}

export function validateServerPayload(body) {
  const honeypot = clip(body.website, 500);
  if (honeypot) return { ok: true, honeypot: true };

  const forbidden = ['diagnosis', 'medical_history', 'passport', 'message', 'symptoms'];
  for (const key of forbidden) {
    if (body[key] != null && String(body[key]).trim() !== '') {
      return { ok: false, error: 'forbidden_field', field: key };
    }
  }

  const name = clip(body.name, 200);
  const phone = normalizePhone(body.phone);
  const contactChannel = clip(body.contactChannel, 40).toLowerCase();
  const country = clip(body.country, 120);
  const city = clip(body.city, 120);
  const interest = clip(body.interest, 80).toLowerCase();
  const language = clip(body.language, 10).toLowerCase() || 'ru';
  const secondary = resolveSecondaryContact(body);

  if (!name) return { ok: false, error: 'name_required' };
  if (!phone || phone.replace(/\D/g, '').length < 7) return { ok: false, error: 'phone_required' };
  if (!CONTACT_CHANNELS.has(contactChannel)) return { ok: false, error: 'invalid_contact_channel' };
  if (!country) return { ok: false, error: 'country_required' };
  if (!city) return { ok: false, error: 'city_required' };
  if (!INTERESTS.has(interest)) return { ok: false, error: 'invalid_interest' };
  if (!['ru', 'en'].includes(language)) return { ok: false, error: 'invalid_language' };
  if (contactChannel === 'telegram' && !secondary) {
    return { ok: false, error: 'secondary_contact_required' };
  }

  return { ok: true };
}

export function buildLeadPayload(input) {
  const contactChannel = clip(input.contactChannel, 40).toLowerCase() || 'whatsapp';
  const phone = normalizePhone(input.phone);
  const payload = {
    name: clip(input.name, 200),
    phone,
    contactChannel,
    country: clip(input.country, 120),
    city: clip(input.city, 120),
    interest: clip(input.interest, 80).toLowerCase(),
    language: clip(input.language, 10).toLowerCase() || 'ru',
    pageUrl: clip(input.pageUrl, 500) || null,
    ctaSource: clip(input.ctaSource, 120) || null,
    referrer: clip(input.referrer, 500) || null,
    consentVersion: clip(input.consentVersion, 40) || '2026-07-21',
    utm: input.utm && typeof input.utm === 'object' ? input.utm : {},
    website: '',
  };
  const secondary = resolveSecondaryContact({ ...input, contactChannel, phone });
  if (secondary) payload.telegramOrWhatsapp = secondary;
  return payload;
}
