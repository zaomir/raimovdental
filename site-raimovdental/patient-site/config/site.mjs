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
  legalNote: 'Стоматологическая клиника, Бишкек',
  tagline: 'Стоматология комплексного лечения в Бишкеке',
  founded: 2021,
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
  // Clinic-confirmed: одинаковые часы семь дней в неделю.
  hours: { opens: '08:00', closes: '20:00', days: 'ежедневно' },
  hoursDisplay: 'Ежедневно, 08:00–20:00',
  parking: 'Бесплатная парковка на улице рядом с клиникой',
  adminSla: 'Администратор отвечает в WhatsApp в среднем за минуту',
  // Точные координаты клиника ещё не подтвердила — карта ведёт по текстовому адресу.
  geo: null,
  mapQuery: 'Expert Dental Studio, улица Киевская 88, Бишкек',
};

export const social = {
  instagram: 'https://www.instagram.com/expert.dental.studio/',
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
 * Analytics. Real counter IDs arrive from the clinic later; until then every slot is
 * `null` and the builder emits no third-party script at all. Events still fire into
 * `window.dataLayer`, so nothing needs rewiring when the IDs land.
 */
export const analytics = {
  ga4MeasurementId: null,
  yandexMetrikaId: null,
  metaPixelId: null,
  // Conversion events emitted by assets/js/site.js.
  events: ['cta_whatsapp', 'cta_call', 'cta_booking_form', 'form_submit', 'article_read'],
};

export const nav = [
  { href: '/services/', label: 'Услуги и цены' },
  { href: '/doctors/', label: 'Врачи' },
  { href: '/doctors/raimov-atabek/', label: 'Главный врач' },
  { href: '/blog/', label: 'Блог' },
  { href: '/about/', label: 'О клинике' },
  { href: '/contacts/', label: 'Контакты' },
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
  primary: 'Записаться на диагностику',
  secondary: 'Посмотреть врачей',
  whatsapp: 'Написать в WhatsApp',
  call: 'Позвонить',
};

/**
 * Material still owed by the clinic. Referenced by the pre-launch checklist so no page
 * silently ships with invented content in place of a missing fact.
 */
export const pendingFromClinic = [
  'Портрет Грибановой М. Н. — на Tilda фотография отсутствует, на сайте стоит монограмма.',
  'Согласия пациентов на публикацию клинических кейсов — до получения раздел /cases/ не публикуется.',
  'Верифицированные отзывы с внешних площадок — до получения блок отзывов не публикуется.',
  'Номер лицензии и орган выдачи для страницы /legal/.',
  'Точные координаты для карты и Google Business Profile.',
  'ID счётчиков аналитики (GA4 / Яндекс.Метрика).',
  'Подтверждение стажа и дипломов каждого врача в едином формате.',
];
