/**
 * Home page copy — Expert Dental Studio.
 *
 * Source: clinic-approved home page specification v2, 2026-08-07. The copy in this module is
 * final and is rendered verbatim; nothing here is generated at build time.
 *
 * Two conventions matter when editing:
 *
 * `locked: true` marks a passage that passed medical or legal review and protects the clinic
 * in a specific situation — the free/paid boundary, the ban on promising a result, the
 * clinical protocol, the price disclaimer, the contraindication line. A locked passage may
 * not be shortened, paraphrased, set in small print, or hidden inside a collapsed accordion.
 * `scripts/raimov/check-patient-site.mjs` fails the build if one goes missing from the HTML.
 *
 * `{{price:sku}}` resolves against docs/raimov/operations/expert-dental/pricing/PRICE_CATALOG.json
 * at render time. Prices are never typed into copy: one number, one source. An unknown SKU
 * throws during the build rather than shipping a stale figure.
 */

/* ------------------------------------------------------------------ block 1 */

export const hero = {
  title: 'Сначала покажем вашу будущую улыбку на экране. Потом найдём путь к ней.',
  titleEm: 'будущую улыбку',
  lead:
    'Эстетическая и общая стоматология в Бишкеке. Начните с примерки — 20 минут, без обязательств. '
    + 'Или выберите, с чего начать в вашей ситуации.',
  primaryLabel: 'Примерка улыбки — 0 сом',
  secondaryLabel: 'Общая стоматология',
  secondaryHref: '/#start',
  /** Protects the free/paid boundary — the single biggest source of conflict at reception. */
  note: {
    locked: true,
    text:
      '20 минут: обзорные фото, разбор запроса, один визуальный вариант на экране. Без обточки. '
      + 'Это не лечение и не постановка диагноза — если понадобится диагностика, назовём стоимость '
      + 'до того, как вы согласитесь.',
  },
  location: 'Бишкек, ул. Киевская, 88 (пер. бульвар Эркиндик) · Приём по записи',
};

/* ------------------------------------------------------------------ block 2 */

export const trust = {
  stats: [
    { value: '4,9 / 5', label: '133 отзыва на 2ГИС, срез 21.07.2026', source: 'twoGisReviews' },
    { value: '8', label: 'врачей в команде' },
    { value: '11', label: 'направлений в одной клинике' },
    { value: 'Киевская, 88', label: 'Бишкек, центр' },
  ],
  // Equipment is named by capability, never by brand: brands are not confirmed.
  infrastructure:
    'КТ, электронная аксиография ВНЧС, работа под микроскопом, внутриротовое сканирование, '
    + 'коффердам, Air Flow и УЗ',
};

/* ------------------------------------------------------------------ block 3 */

export const preview = {
  id: 'preview',
  kicker: 'Первый шаг',
  title: 'Цифровая примерка улыбки — 0 сом',
  lead: 'Прежде чем менять что-то необратимо, посмотрите на вариант',
  columns: [
    {
      title: 'Что входит',
      items: [
        'Обзорные фото вашей улыбки',
        'Разбор того, что именно вас не устраивает',
        'Один визуальный вариант формы на экране',
        'Честный ответ, можно ли получить нужный вид без виниров',
      ],
    },
    {
      title: 'Что не входит',
      tone: 'exclusion',
      items: [
        'Обточка зубов и временные виниры',
        'Компьютерная томография и сканирование',
        'Постановка диагноза и план лечения с ценами',
        'Подбор финального оттенка под фиксацию',
      ],
    },
    {
      title: 'Сколько занимает',
      items: ['20 минут', 'Один раз, именной сертификат', 'Действует 30 дней с момента записи'],
    },
    {
      title: 'Что дальше',
      items: [
        'Подходят виниры — записываем на эстетическую диагностику, {{price:aesthetic-diagnostics}}',
        'Нужны лечение или ортодонтия — скажем прямо и назовём порядок',
        'Задача решается проще и дешевле — тоже скажем',
      ],
    },
  ],
  /** Bans the promise of a result. Must stay visible, not folded into small print. */
  note: {
    locked: true,
    text:
      'Цифровая примерка показывает вариант формы, а не итоговый результат. Она не передаёт оттенок '
      + 'и прозрачность керамики, и окончательный вид зависит от состояния зубов, десны и работы '
      + 'зубного техника. Мы обсудим эти отличия на приёме.',
  },
  ctaLabel: 'Записаться на примерку — 0 сом',
};

/* ------------------------------------------------------------------ block 4 */

/**
 * The router. One row per way a patient arrives, each with its own first step, its own price
 * and its own WhatsApp draft — the administrator reads the message and already knows the case.
 */
export const router = {
  id: 'start',
  kicker: 'С чего начать',
  title: 'Выберите, с чего начать в вашей ситуации',
  lead: 'У каждого запроса — свой первый шаг и своя стоимость. Ниже — 8 вариантов. Кликните своё.',
  rows: [
    {
      situation: 'Хочу изменить форму и цвет улыбки',
      step: 'Цифровая примерка улыбки',
      price: '{{price:screening-smile-preview}}',
      free: true,
      highlight: true,
      wa: 'Здравствуйте! Хочу изменить форму и цвет зубов',
      href: '/services/smile-preview/',
    },
    {
      situation: 'Давно не был у врача, хочу проверить зубы',
      step: 'Именной чек-ап',
      price: '{{price:screening-checkup}}',
      free: true,
      wa: 'Здравствуйте! Хочу записаться на чек-ап',
      href: '/services/named-checkup/',
    },
    {
      situation: 'Болит, скололось, выпала пломба',
      step: 'Приём врача по записи',
      price: 'от {{price:consult-general}}',
      wa: 'Здравствуйте! Беспокоит зуб, нужна запись',
      href: '/services/caries-treatment/',
    },
    {
      situation: 'Кривые зубы, думаю про брекеты или элайнеры',
      step: 'Приём ортодонта',
      price: 'от {{price:consult-atabek-ortho}}',
      wa: 'Здравствуйте! Хочу консультацию ортодонта',
      href: '/services/orthodontics/',
    },
    {
      situation: 'Щёлкает или болит челюсть',
      step: 'Приём гнатолога',
      price: '{{price:consult-gnathology}}',
      wa: 'Здравствуйте! Хочу записаться к гнатологу',
      href: '/services/gnathology/',
    },
    {
      situation: 'Нет одного или нескольких зубов',
      step: 'Приём ортопеда-имплантолога',
      price: '{{price:consult-mir-ali-prostho-implant}}',
      wa: 'Здравствуйте! Хочу консультацию по имплантации',
      href: '/services/implantation/',
    },
    {
      situation: 'Ребёнку нужен стоматолог',
      step: 'Приём детского врача',
      price: 'от {{price:consult-general}}',
      wa: 'Здравствуйте! Хочу записать ребёнка к стоматологу',
      href: '/services/pediatric-dentistry/',
    },
    {
      situation: 'Мне назначили план в другой клинике',
      step: 'Разбор плана без лечения',
      price: '{{price:second-opinion}}',
      wa: 'Здравствуйте! Хочу разбор плана из другой клиники',
      href: '/services/diagnostics/',
    },
  ],
};

/* ------------------------------------------------------------------ block 5 */

export const approach = {
  id: 'approach',
  kicker: 'Подход',
  title: 'Почему мы оцениваем прикус до эстетики',
  paragraphs: [
    'Виниры меняют внешний вид передних зубов. Они не меняют то, как зубы смыкаются и как работает '
      + 'челюстной сустав. Если поставить их поверх нестабильного прикуса, керамика принимает на себя '
      + 'нагрузку, для которой не предназначена, — и результат живёт меньше, чем мог бы.',
    'Поэтому в нашей клинике эстетический этап идёт после оценки прикуса. При выраженной скученности '
      + 'мы предлагаем сначала ортодонтический этап — и часть пациентов после него обнаруживает, что '
      + 'виниры им уже не нужны. Мы считаем это нормальным исходом, а не потерей.',
    'Гнатология и функциональная диагностика ВНЧС — профильное направление клиники. Электронная '
      + 'аксиография доступна по показаниям.',
  ],
  link: { label: 'Подробнее о гнатологии и ВНЧС', href: '/services/gnathology/' },
};

/* ------------------------------------------------------------------ block 6 */

export const process = {
  id: 'process',
  kicker: 'Как это проходит',
  title: 'Пять шагов — и два из них до необратимого',
  steps: [
    {
      title: 'Цифровая примерка',
      meta: '{{price:screening-smile-preview}} · 20 минут',
      text:
        'Обзорные фото, разбор запроса, один вариант формы на экране. Без обточки. Здесь же честный '
        + 'фильтр: подходят ли виниры вообще.',
    },
    {
      title: 'Эстетическая диагностика',
      meta: '{{price:aesthetic-diagnostics}} · 40–60 минут',
      text:
        'Клинический фотопротокол, внутриротовое сканирование, лабораторный wax-up и мокап во рту — '
        + 'модель будущей формы наносится композитом без обточки и без анестезии. Вы разговариваете, '
        + 'улыбаетесь, фотографируетесь. Мокап снимается за 10–15 минут. На выходе — письменный план '
        + 'лечения с ценами по этапам.',
    },
    {
      title: 'Подготовка',
      meta: 'по показаниям',
      text:
        'Лечение, профгигиена, отбеливание. При выраженной скученности или нестабильном прикусе — '
        + 'ортодонтический этап. Это условие, не опция.',
    },
    {
      title: 'Препарирование и слепки',
      text:
        'Обработка эмали — необратимая процедура. Объём называет врач на осмотре; единой цифры '
        + '«для всех» нет. На период изготовления устанавливаются временные виниры '
        + '({{price:veneer-temporary}} за комплект, уточняется у администратора в зависимости от '
        + 'количества зубов).',
    },
    {
      title: 'Примерка готового винира и фиксация',
      text: 'Проверка формы, цвета и смыкания перед постоянной фиксацией.',
    },
  ],
  /** Clinical protocol. Also the clinic's position when a chipped veneer is reviewed later. */
  notes: [
    {
      locked: true,
      title: 'Отбеливание проводится до виниров, а не после.',
      text:
        'Керамика не отбеливается: если осветлить зубы после установки, соседние станут светлее '
        + 'реставраций. Оттенок виниров подбирается под уже отбелённые зубы.',
    },
    {
      locked: true,
      title: 'При признаках бруксизма защитная ночная каппа входит в план обязательно.',
      text:
        'Без неё керамика принимает ночную нагрузку напрямую, и срок службы сокращается.',
    },
  ],
  term:
    'Срок: обычно несколько визитов за 2–4 недели. С ортодонтической подготовкой — дольше, срок '
    + 'называется после диагностики.',
};

/* ------------------------------------------------------------------ block 7 */

export const work = {
  id: 'work',
  kicker: 'Работы',
  title: 'Наши работы',
  lead: 'Выдуманных пар «до/после» у нас нет.',
  /**
   * Photo pairs are not published yet: consents exist, the paired shots do not. Until the
   * clinic supplies them this block shows the verified treatment pathways and says so plainly,
   * which is exactly what the lead above promises.
   */
  pendingNote:
    'Парные снимки «до/после» готовим к публикации: снимаем в одном освещении и ракурсе, '
    + 'анонимно, без имён, возраста и стоимости. Пока показываем разбор самих маршрутов лечения.',
};

/* ------------------------------------------------------------------ block 8 */

export const methods = {
  id: 'methods',
  kicker: 'Сравнение',
  title: 'Не уверены, что нужны виниры? Вот как выбрать',
  columns: ['Метод', 'Задача', 'Обратимость', 'Цена'],
  rows: [
    {
      method: 'Профгигиена (Air Flow + УЗ)',
      task: 'Налёт, камень, окрашивание',
      reversibility: 'Полная',
      price: '{{price:hygiene-light}}–{{price:hygiene-heavy}}',
      href: '/services/hygiene/',
    },
    {
      method: 'Отбеливание офисное',
      task: 'Осветление на несколько тонов, форму не меняет',
      reversibility: 'Полная',
      price: '{{price:whitening-office}}',
    },
    {
      method: 'Композитная эстетическая реставрация',
      task: 'Скол или дефект формы, 1–2 зуба',
      reversibility: 'Условная',
      price: '{{price:composite-aesthetic}} за зуб',
      href: '/services/veneers/',
    },
    {
      method: 'Элайнеры / брекеты',
      task: 'Кривизна, скученность — двигают зубы, не трогают эмаль',
      reversibility: 'Полная',
      price: 'Элайнеры {{price:ortho-aligners}} · брекеты {{price:ortho-braces}}',
      href: '/services/orthodontics/',
    },
    {
      method: 'Керамические виниры E-max',
      task: 'Форма, цвет и промежутки одновременно',
      reversibility: 'Необратимо',
      price: '{{price:veneer-emax}} за зуб',
      href: '/services/veneers/',
      highlight: true,
    },
    {
      method: 'Коронка',
      task: 'Зуб разрушен более чем наполовину или депульпирован',
      reversibility: 'Необратимо',
      price:
        'E-max {{price:crown-emax}} · цирконий {{price:crown-zirconia}} · металлокерамика '
        + '{{price:crown-metal-ceramic}} · рефрактор {{price:crown-refractor}}',
      href: '/services/prosthodontics/',
    },
    {
      method: 'Имплантация',
      task: 'Отсутствующий зуб без обточки соседних',
      reversibility: 'Хирургия',
      price:
        'Megagen {{price:implant-megagen-anyone}} / {{price:implant-megagen-anyridge}} · '
        + 'Straumann {{price:implant-straumann}}',
      href: '/services/implantation/',
    },
  ],
  guidance: [
    'Зубы ровные, но потемнели: начните с профгигиены и отбеливания. Виниры не нужны.',
    'Зубы кривые, цвет устраивает: элайнеры или брекеты решают задачу без обточки эмали.',
    'Скол или дефект на одном-двух зубах: композитная реставрация. Это не метод преображения всей '
      + 'улыбки — срок службы 3–5 лет.',
    'Активный кариес, воспаление дёсен или нестабильный прикус: сначала санация и ортодонтический этап, виниры — после.',
    'Зуб депульпирован или разрушен больше чем наполовину: винир не выдержит нагрузку, нужна коронка.',
  ],
};

/* ------------------------------------------------------------------ block 9 */

export const pricing = {
  id: 'prices',
  kicker: 'Цены',
  title: 'Что бесплатно, а что нет — без мелкого шрифта',
  groups: [
    {
      label: '0 сом',
      tone: 'free',
      text: 'цифровая примерка улыбки · именной чек-ап · чек-ап после срочного приёма',
    },
    {
      label: 'Приёмы',
      text:
        'терапевт, ортодонт, ортопед, хирург — {{price:consult-general}} · д-р Мир-Али — '
        + '{{price:consult-mir-ali-prostho-implant}} · д-р Атабек — {{price:consult-atabek-ortho}} · '
        + 'гнатология — {{price:consult-gnathology}} · разбор чужого плана — {{price:second-opinion}}',
    },
    {
      label: 'Эстетика',
      text:
        'эстетическая диагностика (сканирование, wax-up, мокап во рту, план) — '
        + '{{price:aesthetic-diagnostics}} · керамический винир E-max — {{price:veneer-emax}} за зуб · '
        + 'композитная эстетическая реставрация — {{price:composite-aesthetic}} за зуб · отбеливание '
        + 'офисное — {{price:whitening-office}} · домашнее отбеливание — {{price:whitening-home}} · '
        + 'защитная ночная каппа — {{price:night-guard}} · временные виниры — '
        + '{{price:veneer-temporary}} · снятие старых виниров/реставраций — '
        + '{{price:restoration-removal}} за зуб',
    },
    {
      label: 'Ориентир по объёму',
      text:
        '6 виниров — от {{price-mult:veneer-emax:6}} · 8 виниров — от '
        + '{{price-mult:veneer-emax:8}} · 10 виниров — от {{price-mult:veneer-emax:10}}',
      derivedFrom: 'veneer-emax',
    },
  ],
  /** Holds up the "honest prices" positioning: the veneer figure is not the bill. */
  note: {
    locked: true,
    text:
      'Это стоимость самих виниров. Подготовка — лечение, гигиена, отбеливание, при необходимости '
      + 'ортодонтический этап — считается отдельно и зависит от исходной ситуации. Стоимость снятия '
      + 'прежних реставраций и временных виниров также считается отдельно и указывается в плане '
      + 'лечения. Итоговая сумма фиксируется в плане после диагностики и в процессе не меняется.',
  },
  other:
    'Другие направления: профгигиена {{price:hygiene-light}}–{{price:hygiene-heavy}} · лечение '
    + 'кариеса {{price:therapy-caries-front}} · имплантация {{price:implant-megagen-anyone}}–'
    + '{{price:implant-straumann}} · ортодонтия {{price:ortho-braces}} · аксиография ВНЧС '
    + '{{price:diagnostics-axiography-tmj}}',
  ctaLabel: 'Полный прайс',
  ctaHref: '/price',
  payment: 'Поэтапная оплата возможна по согласованному плану — детали уточняются при записи.',
};

/* ----------------------------------------------------------------- block 10 */

export const team = {
  id: 'doctors',
  kicker: 'Врачи',
  title: 'Кто будет работать с вами',
  quote: {
    text:
      'Лечение строится на точной диагностике, междисциплинарном плане и долгосрочном наблюдении — '
      + 'без обещаний результата до осмотра.',
    author: 'Атабек Раимов',
  },
};

/* ----------------------------------------------------------------- block 11 */

export const reviewsBlock = {
  id: 'reviews',
  kicker: 'Отзывы',
  title: 'Что пишут пациенты',
  ctaLabel: 'Все отзывы на 2ГИС',
};

/* ----------------------------------------------------------------- block 12 */

export const faq = [
  {
    q: 'Правда бесплатно? В чём подвох?',
    a:
      'Подвоха нет, но и приём другой. На примерке мы смотрим и показываем вариант — без снимков, '
      + 'без диагноза и без плана лечения. Это 20 минут. Если после неё нужна полноценная '
      + 'диагностика, она платная, и мы называем стоимость сразу. Никакое лечение бесплатным не бывает.',
  },
  {
    q: 'Виниры портят зубы?',
    a:
      'Под винир снимается часть эмали, и вернуть её нельзя — процедура необратима. При правильных '
      + 'показаниях, здоровых дёснах и уходе реставрация служит долго и защищает зуб от дальнейших '
      + 'сколов.',
  },
  {
    q: 'Можно поставить виниры вместо брекетов?',
    a:
      'При выраженной скученности или неправильном прикусе виниры не решают задачу, а маскируют её. '
      + 'В таких случаях врач предлагает сначала [ортодонтический этап](/services/orthodontics/).',
  },
  {
    q: 'Сколько служат виниры?',
    /** Public position of the clinic: no guaranteed lifetime in years, ever. */
    locked: true,
    a:
      'Единого срока службы не существует. Он зависит от материала, качества фиксации, прикуса, '
      + 'бруксизма, гигиены и привычек — врач объяснит, что влияет именно в вашем случае.',
  },
  {
    q: 'Можно ли поставить виниры при кариесе или воспалении дёсен?',
    a: 'Нет. Только на здоровые зубы и дёсны, санация идёт первым этапом.',
  },
  {
    q: 'Чем виниры отличаются от коронки?',
    a:
      'Винир закрывает переднюю поверхность зуба, коронка — зуб целиком. Винир для эстетики живого '
      + 'зуба, коронка при сильном разрушении или после депульпирования.',
  },
  {
    q: 'Как выбирают цвет?',
    a:
      'Оттенок подбирают при дневном свете, ориентируясь на соседние зубы, тон кожи и возраст. '
      + 'Слишком светлый выглядит искусственно, цель — естественность.',
  },
  {
    q: 'А вдруг мне не понравится результат?',
    a:
      'Перед необратимым этапом мы делаем мокап: наносим модель будущей формы композитом без обточки '
      + 'и без анестезии. С ней можно походить, сфотографироваться, показать близким. Если решите не '
      + 'продолжать — мокап снимается за 10–15 минут, зубы остаются в исходном состоянии. Мокап '
      + 'показывает форму, но не передаёт оттенок и прозрачность керамики.',
  },
];

/* ----------------------------------------------------------------- block 13 */

export const servicesBlock = {
  id: 'services',
  kicker: 'Направления',
  title: 'Все услуги клиники',
  lead: 'Одиннадцать направлений в одной клинике — план согласуют между собой профильные врачи.',
};

/* ----------------------------------------------------------------- block 14 */

export const finalCta = {
  id: 'book',
  title: 'Начните с примерки',
  lead:
    '20 минут, 0 сом. Покажем вариант формы на экране и честно скажем, что вам подходит — даже если '
    + 'это не виниры.',
  fields: [
    { name: 'name', label: 'Имя', type: 'text', required: true, autocomplete: 'name' },
    { name: 'phone', label: 'Телефон', type: 'tel', required: true, autocomplete: 'tel' },
    {
      name: 'topic',
      label: 'Что вас беспокоит',
      type: 'textarea',
      required: false,
      optional: true,
    },
  ],
  submitLabel: 'Записаться',
  note: 'Ответим в WhatsApp в рабочие часы клиники.',
};

/* ----------------------------------------------------------------- block 15 */

export const contactsBlock = {
  id: 'contacts',
  kicker: 'Контакты',
  title: 'Как нас найти',
  /** Required by KG advertising law for medical services. Reviewed by counsel. */
  disclaimer: {
    locked: true,
    text: 'Имеются противопоказания. Необходима консультация специалиста.',
  },
};

/* ------------------------------------------------------- §5.2 WhatsApp drafts */

export const waPrefills = {
  hero: 'Здравствуйте! Хочу записаться на цифровую примерку улыбки',
  preview: 'Здравствуйте! Записываюсь на примерку — 0 сом',
  process: 'Здравствуйте! Записываюсь на примерку — 0 сом',
  methods: 'Здравствуйте! Записываюсь на примерку',
  final: 'Здравствуйте! Записываюсь на примерку',
  sticky: 'Здравствуйте! Хочу записаться на цифровую примерку улыбки',
};

/**
 * Every locked passage on the page, normalised to `{ text }` for the pre-ship gate in
 * scripts/raimov/check-patient-site.mjs. If one stops appearing in the rendered HTML the
 * build fails rather than quietly shipping a shortened disclaimer.
 */
export const lockedPassages = [
  hero.note,
  preview.note,
  ...process.notes,
  pricing.note,
  ...faq.filter((f) => f.locked).map((f) => ({ text: f.a })),
  contactsBlock.disclaimer,
].filter((n) => n?.text);
