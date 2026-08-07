/**
 * Chief doctor page content — Раимов Атабек Саидович.
 *
 * The clinic's positioning rests on one clinical idea: bite and joint are treated as one
 * system. That idea has an author, and the site says so explicitly instead of hiding him
 * in a grid of eight identical portraits.
 *
 * Provenance rules (SSOT §10 + WEBSITE_STUDIO_STANDARD §9.4):
 *  - `verified: true`  — stated by the clinic on expertdental.kg or confirmed by the founder;
 *  - `verified: false` — held back from the page until a document or link is supplied.
 * Nothing is invented here. Superlatives from the source bio are dropped.
 */

export const chief = {
  slug: 'raimov-atabek',
  title: 'Главный врач',
  metaTitle: 'Раимов Атабек Саидович — главный врач | Expert Dental',
  metaDescription:
    'Раимов Атабек — ортодонт-гнатолог, главный врач Expert Dental Studio. ВНЧС, ортодонтия и функциональная диагностика в Бишкеке.',

  positioning: 'Ортодонт-гнатолог. Лечит прикус и височно-нижнечелюстной сустав как одну систему.',

  quote:
    'Прикус, жевательные мышцы и сустав оцениваем вместе. План лечения строим только после функциональной диагностики и очного осмотра.',
  quoteNote: 'Клинический принцип, на котором построен приём в Expert Dental Studio',

  intro: [
    'Атабек Саидович ведёт ортодонтический и гнатологический приём. Это означает, что прикус, жевательные мышцы и височно-нижнечелюстной сустав рассматриваются вместе: положение зубов меняет работу сустава, а состояние сустава ограничивает то, как можно перемещать зубы.',
    'Такой подход определяет и порядок работы клиники. Прежде чем начинать протезирование или ортодонтическое лечение, врач проверяет, стабильно ли положение нижней челюсти — иначе новая конструкция закрепит существующую проблему.',
  ],

  /* Клинический профиль */
  focus: {
    title: 'С чем работает',
    items: [
      'Дисфункция височно-нижнечелюстного сустава: щелчки, боль, ограниченное открывание рта',
      'Неправильный прикус у подростков и взрослых',
      'Стираемость зубов и хроническое напряжение жевательных мышц',
      'Подготовка прикуса перед имплантацией и протезированием',
      'Сложные случаи, где нужен план на несколько специалистов сразу',
    ],
  },

  methods: {
    title: 'Методы',
    items: [
      {
        name: 'Функциональная диагностика ВНЧС',
        text: 'Оценка траектории движения нижней челюсти, включая электронную аксиографию — цифровую запись движений суставных головок.',
      },
      {
        name: 'Брекет-системы и элайнеры',
        text: 'Выбор аппарата после диагностики, а не по запросу пациента: разные задачи требуют разных инструментов.',
      },
      {
        name: 'Нёбное расширение',
        text: 'Аппараты MARPE и Марко Росса при узкой верхней челюсти — в том числе там, где иначе обсуждалось бы удаление зубов.',
      },
      {
        name: 'Междисциплинарное планирование',
        text: 'Совместный план с хирургом-имплантологом и ортопедом клиники, когда задача не решается одним направлением.',
      },
    ],
  },

  /* Профессиональная деятельность вне приёма. Всё — из публикаций клиники. */
  /**
   * `verified: false` items stay in the file but do not render. They are on the clinic's
   * own Tilda bio, yet none has a primary source, so they are classified `unverified` in
   * research/raimov-profile/FACT_REGISTER.csv (F-003) and docs/ssot/RAIMOV_PUBLIC_PROFILE.md
   * P-004. They flip to true when the clinic packet lands — see CLINIC_PENDING_PACKET §3.
   */
  practice: [
    {
      title: 'Основатель клиник',
      text: 'Expert Dental Clinic и Expert Dental Studio в Бишкеке.',
      verified: true,
    },
    {
      title: 'Основатель «ОртоКомьюнити»',
      text: 'Сообщество ортодонтов Кыргызстана: обмен клиническими случаями и разборы среди практикующих врачей.',
      verified: false,
    },
    {
      title: 'Спикер учебной платформы «Деммед»',
      text: 'Выступления для практикующих стоматологов.',
      verified: false,
    },
    {
      title: 'Ортодонтические офис-курсы',
      text: 'Проводит обучающие курсы для врачей на базе клиники.',
      verified: false,
    },
    {
      title: 'Участие в семинарах и конгрессах',
      text: 'Регулярные выступления на профессиональных мероприятиях.',
      verified: false,
    },
    {
      /**
       * Source: research/raimov-profile/briefs/atabek-bio-growth-2026-08/
       * (DUrwwBhCCmZ / DWggvq0DUJ5, visual_strong — on-stage mic). Render gate: verified.
       * Flip after GAPS_AND_QUESTIONS.md §8 (role + talk topic). DEC-788.
       */
      title: 'Спикер OrthoDay',
      text:
        'Выступление на конференции OrthoDay в Бишкеке, 29.03.2026 — тема доклада и роль '
        + 'уточняются у клиники.',
      verified: false,
    },
  ],

  /*
   * Цифры публикуются только со ссылкой на источник — иначе это vanity counter.
   * «400+ завершённых работ» снято: клиника публикует это у себя, но это метрика
   * результата лечения, а такие на пациентском сайте не публикуются —
   * FACT_EDITORIAL_CLASSIFICATION.md §3 и RAIMOV_PUBLIC_PROFILE.md P-004.
   */
  figures: [
    { value: '2', label: 'клиники основаны в Бишкеке', source: 'Expert Dental Clinic, Expert Dental Studio' },
    { value: '3', label: 'направления приёма', source: 'ортодонтия, гнатология, функциональная стоматология' },
  ],

  /**
   * Дипломы и сертификаты главного врача. Источник — блок «Квалификация врачей»
   * (#rec883441984) на expertdental.kg; нормализованные файлы в assets/img/credentials/.
   * Полный реестр по всем врачам: content/credentials.mjs.
   */
  credentialsFallback:
    'Дипломы, сертификаты и подтверждения квалификации предоставляются по запросу на приёме в клинике.',

  /**
   * Только выступления с первичным источником. SPK-001 — `public_ready`
   * (research/raimov-profile/RAIMOV_PUBLIC_PROFILE.md F-SPK-001).
   */
  talks: [
    {
      title: 'Микроимпланты в ортодонтии (минивинты)',
      venue: 'Стоматологический конгресс DemMed, Ош и Бишкек',
      date: '2024',
      url: 'https://bishkek.events/event/stomatologicheskij-kongress/',
    },
  ],

  services: ['gnathology', 'orthodontics', 'diagnostics'],

  /** knowsAbout для schema.org Physician. */
  knowsAbout: [
    'Ортодонтия',
    'Гнатология',
    'Дисфункция височно-нижнечелюстного сустава',
    'Электронная аксиография',
    'Нёбное расширение MARPE',
  ],

  whatsappMessage:
    'Здравствуйте. Хочу записаться на консультацию к Атабеку Саидовичу (ортодонтия / ВНЧС).',
};
