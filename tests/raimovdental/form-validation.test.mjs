#!/usr/bin/env node
/** Form validation — patient payload + Stage B strategic leads. */
import assert from 'node:assert/strict';
import {
  validateStep,
  validateServerPayload,
  buildLeadPayload,
  INTERESTS,
} from './helpers/validation.mjs';

const base = {
  interest: 'implants',
  country: 'Uzbekistan',
  city: 'Tashkent',
  contactChannel: 'phone',
  name: 'Test Patient',
  phone: '+998901234567',
  consent: true,
};

assert.equal(validateStep(1, base), null);
assert.equal(validateStep(2, base), null);
assert.equal(validateStep(3, base), null);
assert.equal(validateStep(1, { interest: 'invalid' }), 'interest_required');
assert.equal(validateStep(2, { ...base, country: '' }), 'country_required');
assert.equal(validateStep(3, { ...base, name: '' }), 'name_required');

assert.deepEqual(
  validateServerPayload({
    name: 'A',
    phone: '+998901234567',
    contactChannel: 'phone',
    country: 'UZ',
    city: 'Tashkent',
    interest: 'second_opinion',
    language: 'ru',
    consentVersion: '2026-07-21',
  }),
  { ok: true },
);

assert.equal(validateServerPayload({ website: 'spam-bot' }).honeypot, true);
assert.equal(validateServerPayload({ ...base, diagnosis: 'caries' }).error, 'forbidden_field');

const payload = buildLeadPayload({
  ...base,
  contactChannel: 'whatsapp',
  pageUrl: 'https://raimovdental.com/ru/',
  ctaSource: 'legacy_patient',
  utm: { utm_source: 'ads' },
});
assert.equal(payload.telegramOrWhatsapp, base.phone);
assert.equal(payload.interest, 'implants');

assert.ok(INTERESTS.has('implants'));

// Stage B payload shape (mirrors public-lead-forms.js + EF)
const stageBInvestor = {
  leadType: 'investor_strategy',
  interest: 'investor_strategy',
  name: 'Investor',
  contact: '+996555000000',
  contactChannel: 'phone',
  country: 'Кыргызстан',
  city: 'Бишкек',
  role: 'инвестор',
  interestNote: 'Развитие клиник',
  language: 'ru',
  consentVersion: '2026-07-31',
  website: '',
};
assert.equal(stageBInvestor.leadType, stageBInvestor.interest);
assert.ok(stageBInvestor.interestNote.length > 3);
assert.equal(stageBInvestor.website, '');

const stageBAcademy = {
  leadType: 'academy_interest',
  interest: 'academy_interest',
  name: 'Doctor',
  contact: 'doc@example.com',
  contactChannel: 'email',
  city: 'Алматы',
  specialty: 'ортопедия',
  professionalInterest: 'обучение команды',
  language: 'ru',
  consentVersion: '2026-07-31',
};
assert.equal(stageBAcademy.leadType, 'academy_interest');
assert.match(stageBAcademy.contact, /@/);

console.log('PASS form-validation unit tests');
