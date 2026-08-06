/**
 * Expert Care 12 — profilactic membership.
 *
 * Canon: docs/ssot/EXPERT_DENTAL_PATIENT_MOTIVATION_SYSTEM.md (DEC-786) §5.
 * Prices/includes/exclusions are read from PRICE_CATALOG.json → direction `care12` at
 * build time (single source of numbers). Copy below only states what the product is,
 * not medical/insurance claims. Not insurance; not a discount on treatment.
 *
 * NOTE: this catalog direction is still tagged `status: proposed` in PRICE_CATALOG.json
 * (awaiting clinic sign-off on no-show rule) while already being rendered publicly on the
 * live price list. This page documents the product as published; it does not itself
 * confirm the pending clinic items (see `pendingNotes` — kept out of the public page body).
 */

export const care12 = {
  slug: 'care-12',
  navLabel: 'Expert Care 12',
  title: 'Expert Care 12 — профилактический абонемент на 12 месяцев',
  metaTitle: 'Expert Care 12 — абонемент на гигиену и профилактику в Бишкеке | Expert Dental Studio',
  metaDescription:
    'Expert Care 12 — годовой абонемент на профилактическую гигиену и контрольные осмотры в Expert Dental Studio. Не страховка и не скидка на лечение: что входит, что не входит и сколько стоит.',
  kicker: 'Профилактика на год вперёд',
  lead:
    'Expert Care 12 — это не страховка и не скидка на лечение. Это абонемент на профилактические визиты: гигиену и контрольные осмотры, которые легко отложить, если про них никто не напоминает.',
  isInsuranceNote: 'Expert Care 12 не является страховкой и не покрывает лечение, снимки, импланты, ортодонтию или хирургию — эти услуги всегда оплачиваются отдельно по прайсу.',
  includesGeneral: [
    'Профилактические осмотры и профгигиена лёгкой или средней степени — в лимите тарифа',
    'Ежегодное обновление Паспорта здоровья зубов',
    'Приоритетная запись при срочной проблеме в рамках duty-слотов клиники',
    'Напоминания о плановых визитах',
  ],
  excludesGeneral: [
    'Лечение, снимки, КТ, хирургия, ортопедия, имплантация, ортодонтия — всегда отдельно, по полному прайсу',
    'Тяжёлая гигиена — доплата к тарифу средней степени',
    'Безлимитные визиты: лимит указан в каждом тарифе',
  ],
  tierSkus: ['care12-adult', 'care12-family-addon', 'care12-kids'],
  billingRules: [
    'Показана тяжёлая гигиена — абонемент закрывает тариф средней степени, доплата — разница между тарифами',
    'Третий визит на гигиену в году — по полной цене прайса, вне абонемента',
    'Снимки, КТ, лечение, хирургия, ортопедия, импланты, ортодонтия — всегда отдельно, 0% скидки от абонемента',
  ],
  suitableFor: [
    'Пациентам, которые регулярно откладывают профгигиену и контрольный осмотр',
    'Семьям — тариф Family add-on распространяется на второго члена семьи на том же договоре',
    'Родителям детей в период смены прикуса — тариф Kids',
  ],
  faq: [
    {
      q: 'Expert Care 12 — это страховка?',
      a: 'Нет. Это профилактический абонемент на гигиену и контрольные осмотры. Лечение, снимки, хирургия, ортопедия, имплантация и ортодонтия в него не входят и всегда оплачиваются отдельно по прайсу.',
    },
    {
      q: 'Можно ли оплатить абонементом дорогое лечение со скидкой?',
      a: 'Нет. Абонемент не даёт скидки на лечение и high-ticket услуги — это отдельный профилактический продукт, не колонка скидок к прайсу.',
    },
    {
      q: 'Что если гигиена оказалась тяжёлой степени?',
      a: 'Абонемент закрывает тариф средней степени, пациент доплачивает разницу до тарифа тяжёлой гигиены по прайсу.',
    },
    {
      q: 'Что будет, если использовать лимит визитов раньше срока?',
      a: 'Дополнительные визиты сверх лимита оплачиваются по полной цене прайса — абонемент не безлимитный.',
    },
  ],
  doctors: ['kerimkulova-aiperi'],
  relatedServices: ['hygiene', 'diagnostics'],
  ctaMessage: 'Здравствуйте. Хочу узнать подробнее про Expert Care 12 и оформить абонемент.',
};
