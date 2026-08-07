/** Default UI chrome when Lane B i18n JSON is missing */

/** @param {'ru'|'en'} locale */
export function defaultI18n(locale) {
  if (locale === 'en') {
    return {
      nav: {
        services: 'Services',
        results: 'Results',
        doctor: 'Dr. Atabek Raimov',
        team: 'Team',
        system: 'RAIM SMILE SYSTEM',
        international: 'International patients',
        cost: 'Cost & payment',
        about: 'About clinic',
        reviews: 'Reviews',
        contact: 'Contact',
        academy: 'Raimov Academy',
        blog: 'Blog',
      },
      cta: {
        book: 'Book comprehensive diagnostics',
        contact: 'Contact clinic',
      },
      utility: {
        phone: 'Phone',
        hours: 'Clinic hours',
        langRu: 'RU',
        langEn: 'EN',
      },
      footer: {
        tagline: 'Comprehensive dentistry with a structured treatment plan.',
        legal: 'Information on this site does not replace an in-person consultation.',
        services: 'Services',
        clinic: 'Clinic',
        resources: 'Resources',
      },
      pending: '[CONTENT PENDING]',
      form: {
        mountNote: 'Lead form mount point — Lane C implements POST handler.',
      },
      skip: 'Skip to main content',
    };
  }

  return {
    nav: {
      services: 'Услуги',
      results: 'Результаты',
      doctor: 'Атабек Раимов',
      team: 'Команда',
      system: 'RAIM SMILE SYSTEM',
      international: 'Иностранным пациентам',
      cost: 'Стоимость и оплата',
      about: 'О клинике',
      reviews: 'Отзывы',
      contact: 'Контакты',
      academy: 'Raimov Academy',
      blog: 'Блог',
    },
    cta: {
      book: 'Записаться на комплексную диагностику',
      contact: 'Связаться с клиникой',
    },
    utility: {
      phone: 'Телефон',
      hours: 'Часы работы',
      langRu: 'RU',
      langEn: 'EN',
    },
    footer: {
      tagline: 'Комплексная стоматология с понятным планом лечения.',
      legal: 'Информация на сайте не заменяет очную консультацию.',
      services: 'Услуги',
      clinic: 'Клиника',
      resources: 'Материалы',
    },
    pending: '[CONTENT PENDING]',
    form: {
      mountNote: 'Точка монтирования формы — обработчик POST реализует Lane C.',
    },
    skip: 'Перейти к основному содержимому',
  };
}

/** @param {'ru'|'en'} locale @param {object|null} laneB */
export function mergeI18n(locale, laneB) {
  const base = defaultI18n(locale);
  if (!laneB) return base;
  return {
    ...base,
    ...laneB,
    nav: {
      ...base.nav,
      ...(laneB.nav || {}),
      book: laneB.nav?.bookCta || base.cta?.book,
    },
    cta: {
      ...base.cta,
      book: laneB.nav?.bookCta || laneB.cta?.book || base.cta.book,
      contact: laneB.nav?.contact || base.cta.contact,
    },
    utility: {
      ...base.utility,
      phone: laneB.utilityBar?.phone ? base.utility.phone : base.utility.phone,
      hours: laneB.utilityBar?.hours ? base.utility.hours : base.utility.hours,
      langRu: base.utility.langRu,
      langEn: laneB.utilityBar?.languageSwitch || base.utility.langEn,
    },
    footer: { ...base.footer, ...(laneB.footer || {}) },
    form: {
      ...base.form,
      ...(laneB.form || {}),
      mountNote: laneB.form?.note || base.form.mountNote,
    },
    skip: laneB.a11y?.skipLink || base.skip,
    utilityValues: {
      phone: laneB.utilityBar?.phone || null,
      hours: laneB.utilityBar?.hours || null,
    },
  };
}

/** @param {'ru'|'en'} locale @param {string} id */
export function defaultPageMeta(locale, id) {
  const ruTitles = {
    home: 'RAIMOV DENTAL — стоматология полного цикла',
    diagnostics: 'Комплексная диагностика | RAIMOV DENTAL',
    veneers: 'Виниры | RAIMOV DENTAL',
    implants: 'Имплантация | RAIMOV DENTAL',
    'full-mouth': 'Полное восстановление зубов | RAIMOV DENTAL',
    orthodontics: 'Ортодонтия для взрослых | RAIMOV DENTAL',
    results: 'Результаты лечения | RAIMOV DENTAL',
    doctor: 'Атабек Раимов — основатель RAIMOV DENTAL',
    team: 'Команда | RAIMOV DENTAL',
    system: 'RAIM SMILE SYSTEM | RAIMOV DENTAL',
    international: 'Иностранным пациентам | RAIMOV DENTAL',
    cost: 'Стоимость и оплата | RAIMOV DENTAL',
    about: 'О клинике | RAIMOV DENTAL',
    reviews: 'Отзывы | RAIMOV DENTAL',
    contact: 'Контакты | RAIMOV DENTAL',
    academy: 'Raimov Academy | RAIMOV DENTAL',
    blog: 'Блог | RAIMOV DENTAL',
  };
  const enTitles = {
    home: 'RAIMOV DENTAL — comprehensive dentistry',
    diagnostics: 'Comprehensive diagnostics | RAIMOV DENTAL',
    veneers: 'Veneers | RAIMOV DENTAL',
    implants: 'Dental implants | RAIMOV DENTAL',
    'full-mouth': 'Full mouth reconstruction | RAIMOV DENTAL',
    orthodontics: 'Adult orthodontics | RAIMOV DENTAL',
    results: 'Treatment results | RAIMOV DENTAL',
    doctor: 'Atabek Raimov — founder of RAIMOV DENTAL',
    team: 'Team | RAIMOV DENTAL',
    system: 'RAIM SMILE SYSTEM | RAIMOV DENTAL',
    international: 'International patients | RAIMOV DENTAL',
    cost: 'Cost and payment | RAIMOV DENTAL',
    about: 'About the clinic | RAIMOV DENTAL',
    reviews: 'Reviews | RAIMOV DENTAL',
    contact: 'Contact | RAIMOV DENTAL',
    academy: 'Raimov Academy | RAIMOV DENTAL',
    blog: 'Blog | RAIMOV DENTAL',
  };
  const titles = locale === 'en' ? enTitles : ruTitles;
  return {
    title: titles[id] || `RAIMOV DENTAL`,
    description: locale === 'en'
      ? 'Structured dentistry led by Atabek Raimov. Comprehensive diagnostics and treatment planning.'
      : 'Структурированная стоматология под руководством Атабека Раимова. Комплексная диагностика и план лечения.',
  };
}
