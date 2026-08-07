/**
 * Expert Dental Studio — patient site configuration.
 *
 * Canon: docs/ssot/EXPERT_DENTAL_WEBSITE_SSOT.md
 * Facts here are clinic-confirmed. Anything unconfirmed belongs in `pendingFromClinic`,
 * never in page copy.
 */

export const brand = {
  name: 'Expert Dental Studio',
  nameRu: 'Эксперт дентал студия',
  legalName: 'Эксперт Дентал Студия ОсОО',
  legalNote: 'Стоматологическая клиника, Бишкек',
  tagline: 'Виниры и эстетика по RAIM SMILE SYSTEM · Бишкек',
  founded: 2023,
  /**
   * Licence number as supplied by the clinic. The spacing inside the number is unusual for
   * KG registries, so it stays flagged in `pendingFromClinic` until someone checks it against
   * the paper document — a wrong licence number is a legal defect, not a typo.
   */
  // Temporary staging display supplied with TASK-785. It does not satisfy the production
  // legal gate until the format is checked against the original document.
  license: 'НГМУ 3333',
  licenseVerified: false,
};

export const contacts = {
  phone: '+996555255455',
  phoneDisplay: '+996 555 255 455',
  whatsapp: '996555255455',
  whatsappNote: 'WhatsApp принимает сообщения круглосуточно',
  email: null,
  street: 'улица Киевская, 88',
  streetNote: 'пересечение с бульваром Эркиндик',
  city: 'Бишкек',
  country: 'Кыргызстан',
  countryCode: 'KG',
  addressFull: 'Бишкек, улица Киевская, 88',
  postalCode: '720040',
  // Clinic-confirmed in the final TASK-785 homepage specification.
  hours: { opens: '08:00', closes: '19:00', days: 'пн–пт', schemaSpec: 'Mo-Fr 08:00-19:00' },
  hoursDisplay: 'Пн–пт, 08:00–19:00',
  hoursShort: '08–19',
  parking: 'Бесплатная парковка на улице рядом с клиникой',
  adminSla: 'Администратор отвечает в рабочие часы',
  // Точные координаты клиника ещё не подтвердила — карта ведёт по текстовому адресу.
  geo: null,
  mapQuery: 'Expert Dental Studio, улица Киевская 88, Бишкек',
};

export const social = {
  instagram: 'https://www.instagram.com/expert_dental_studio/',
  instagramHandle: '@expert_dental_studio',
  /** Личный профиль главного врача — ведёт клинические разборы и обучение. */
  chiefInstagram: 'https://www.instagram.com/doctor_raimov/',
  telegram: 'https://t.me/doctor_raimov',
  telegramHandle: '@doctor_raimov',
};

/** Map profiles. 2GIS is also the only source the site quotes a rating from. */
/**
 * Map profiles. `*Reviews` is the deep link the Review Hub sends a patient to, so it lands
 * on the review tab rather than the profile overview. Registered in
 * docs/raimov/operations/expert-dental/LINKS_REGISTER.md (ED-LINK-008/009/010).
 */
export const maps = {
  twoGis: 'https://2gis.kg/bishkek/firm/70000001089655879',
  twoGisReviews: 'https://2gis.kg/bishkek/firm/70000001089655879/tab/reviews',
  google: 'https://maps.app.goo.gl/GSsMuQfJ7hkY59cj8',
  // Short profile link supplied by the clinic; a writereview deep link needs the place id,
  // which is still outstanding, so the patient taps "Оставить отзыв" on the profile.
  googleReviews: 'https://maps.app.goo.gl/GSsMuQfJ7hkY59cj8',
  yandex: 'https://yandex.ru/maps/org/ekspert_dental_studiya/222117460907/',
  yandexReviews: 'https://yandex.ru/maps/org/ekspert_dental_studiya/222117460907/reviews/',
};

/**
 * Hosts. The site ships first to the staging subdomain, then moves to the production
 * domain without changing a single route.
 */
export const hosts = {
  staging: {
    id: 'staging',
    origin: 'https://clinic.raimovdental.com',
    indexable: false,
    banner: 'Предварительная версия сайта. Публикуется для проверки перед переносом на expertdental.kg.',
  },
  production: {
    id: 'production',
    origin: 'https://expertdental.kg',
    indexable: true,
    banner: null,
  },
};

/**
 * Production-only publication approvals. Each gate needs both an affirmative decision and
 * a traceable evidence reference; staging may render without them because it is noindex.
 */
export const publicationGates = {
  legalPacket: { approved: false, evidence: null },
  medicalServiceCopy: { approved: false, evidence: null },
  medicalAdvertisingCounsel: { approved: false, evidence: null },
};

/**
 * Analytics. Real counter IDs arrive from the clinic later; until then every slot is
 * `null` and the builder emits no third-party script at all. Events still fire into
 * `window.dataLayer`, so nothing needs rewiring when the IDs land.
 */
export const analytics = {
  ga4MeasurementId: null,
  yandexMetrikaId: null,
  metaPixelId: null,
  // Conversion events emitted by assets/js/site.js.
  events: [
    'cta_whatsapp',
    'cta_call',
    'cta_booking_form',
    'form_submit',
    'article_read',
    'preview_cta_click',
    'router_row_click',
    'price_page_click',
    'whatsapp_click',
    'reviews_outbound_click',
  ],
};

/**
 * Top navigation. Anchors point at the home page so the same bar works from any route;
 * all links use the homepage section map from the clinic-approved v2 specification.
 * «Цены» → canonical catalog `/services/` (not homepage #prices).
 */
export const nav = [
  { href: '/#preview', label: 'Примерка' },
  { href: '/#approach', label: 'Подход' },
  { href: '/#raim-smile-system', label: 'Система' },
  { href: '/#work', label: 'Работы' },
  { href: '/doctors/', label: 'Врачи' },
  { href: '/services/', label: 'Цены' },
  { href: '/#reviews', label: 'Отзывы' },
  { href: '/#contacts', label: 'Контакты' },
];

export const footerNav = [
  {
    title: 'Направления',
    links: [
      { href: '/services/gnathology/', label: 'Гнатология и ВНЧС' },
      { href: '/services/orthodontics/', label: 'Ортодонтия' },
      { href: '/services/implantation/', label: 'Имплантация' },
      { href: '/services/veneers/', label: 'Виниры' },
      { href: '/services/pediatric-dentistry/', label: 'Детская стоматология' },
      { href: '/services/care-12/', label: 'Expert Care 12' },
      { href: '/services/', label: 'Все услуги и цены' },
    ],
  },
  {
    title: 'Клиника',
    links: [
      { href: '/about/', label: 'О клинике' },
      { href: '/doctors/', label: 'Врачи' },
      { href: '/doctors/raimov-atabek/', label: 'Главный врач' },
      { href: '/contacts/', label: 'Контакты' },
    ],
  },
  {
    title: 'Информация',
    links: [
      { href: '/blog/', label: 'Блог' },
      { href: '/privacy/', label: 'Политика конфиденциальности' },
      { href: '/legal/', label: 'Правовая информация' },
    ],
  },
];

export const cta = {
  primary: 'Цифровая примерка улыбки — 0 сом',
  secondary: 'Услуги и цены',
  whatsapp: 'Написать в WhatsApp',
  call: 'Позвонить',
};

/**
 * Material still owed by the clinic. Referenced by the pre-launch checklist so no page
 * silently ships with invented content in place of a missing fact.
 */
export const pendingFromClinic = [
  'Парные фото «до/после» для блока «Работы»: согласия на кейсы получены, но снимков в архиве нет — '
    + 'нужны 2–3 случая виниров в одном освещении и ракурсе.',
  'Формат временного номера лицензии «НГМУ 3333» не сверен с оригиналом документа. '
    + 'Проверить до переноса на expertdental.kg.',
  'Орган, выдавший лицензию, и дата выдачи — для страницы /legal/.',
  'ИНН юридического лица «Эксперт Дентал Студия ОсОО», если решено публиковать его в подвале.',
  'Точные координаты для карты и Google Business Profile.',
  'ID счётчиков аналитики (GA4 / Яндекс.Метрика).',
  'Первичный источник по «ОртоКомьюнити»: официальное название, ссылка, роль основателя.',
  'Программа ортодонтических офис-курсов и статус спикера «Деммед» — подтверждение с датами.',
  'Полный список выступлений главного врача, кроме конгресса DemMed 2024 (он уже опубликован).',
  'Сертификаты Дуйшеевой Айдай в блоке #rec883441984 не найдены — прислать отдельно, если есть.',
  '4 неразмеченных скана из «Квалификация врачей» (credentials-archive/unassigned) — назвать владельца.',
  'Официальная публичная должность главного врача — «главный врач» или «основатель».',
  'OrthoDay 29.03.2026: роль (спикер/модератор/организатор) и тема — см. chief.practice «Спикер OrthoDay» (verified: false) и FOUNDER_LAUNCH_CHECKLIST B3.',
  'MEAW / Kim Jeong-Il: год курса и право публикации сертификата (FOUNDER_LAUNCH_CHECKLIST B2).',
  'Медицинская проверка 9 статей блога (reviewedAt + reviewEvidence) — блокер §33.1 до переноса на expertdental.kg.',
];
