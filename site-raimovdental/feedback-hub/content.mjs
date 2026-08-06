/**
 * Review Hub — every string the patient sees.
 *
 * Canon: docs/raimov/operations/expert-dental/reputation/POST_VISIT_FEEDBACK_LOOP.md §5, §7
 *        docs/raimov/operations/expert-dental/reputation/IMPLEMENTATION_PLAN_ATOMIC.md фаза B
 *
 * Two rules govern this copy and the gate in scripts/raimov/check-feedback-hub.mjs enforces
 * both. There is no reward for leaving a review, and there is no pre-filter that sends only
 * happy patients to the maps: every patient sees the same neutral 1–5 question first, and
 * the low branch is a real recovery path rather than a dead end.
 */

export const clinic = {
  name: 'Expert Dental Studio',
  phoneDisplay: '+996 555 255 455',
  phone: '+996555255455',
};

export const intro = {
  title: 'Как прошёл ваш визит?',
  lead: 'Оцените приём — это займёт полминуты. Честная оценка помогает нам становиться лучше.',
  scaleLow: 'Плохо',
  scaleHigh: 'Отлично',
  legend: 'Оценка визита от 1 до 5',
  submitHint: 'Выберите оценку',
};

/** The same neutral map options are available after every score — never gated by sentiment. */
export const promoter = {
  title: 'Спасибо за оценку',
  lead:
    'Если хотите, оставьте публичный отзыв там, где его увидят другие пациенты. ' +
    'Площадки, где вы уже оставили отзыв, станут серыми.',
  doneLabel: 'Отзыв оставлен',
  alreadyLabel: 'Я уже оставил отзыв на этой карте',
  doneHint: 'Спасибо! Если захотите, можно добавить отзыв и на другой площадке.',
  allDone: 'Вы прошли все три площадки. Спасибо — это правда помогает клинике.',
  disclaimer:
    'Мы не проверяем, что именно вы написали, и не просим ставить пять звёзд. ' +
    'Публикация отзыва зависит от модерации самой площадки.',
};

/** 1–3: recovery runs independently from the same neutral public-review options. */
export const detractor = {
  title: 'Спасибо за честность — нам важно это исправить',
  lead:
    'Расскажите коротко, что пошло не так. Управляющий свяжется с вами в рабочие часы ' +
    'клиники, чтобы разобраться.',
  topicsLabel: 'Что было не так',
  topics: [
    { id: 'service', label: 'Сервис и отношение' },
    { id: 'waiting', label: 'Ожидание и запись' },
    { id: 'communication', label: 'Объяснения и коммуникация' },
    { id: 'cleanliness', label: 'Чистота и комфорт' },
    { id: 'stage-result', label: 'Результат этапа лечения' },
    { id: 'price', label: 'Стоимость и расчёт' },
    { id: 'other', label: 'Другое' },
  ],
  commentLabel: 'Что произошло',
  commentHint: 'необязательно, до 500 знаков',
  commentSafety:
    'Не указывайте диагноз, лекарства, медицинские документы, телефон, email или другие личные данные. ' +
    'Если нужен клинический разбор, отметьте согласие на контакт — управляющий свяжется отдельно.',
  privacyConsentLabel:
    'Согласен на обработку этой оценки и комментария клиникой для разбора обращения',
  contactConsentLabel: 'Можно связаться со мной по WhatsApp',
  privacyNote:
    'Комментарий хранится до 60 дней в защищённом журнале клиники. В уведомление управляющему '
    + 'уходит только номер обращения — без текста, врача, услуги и оценки.',
  submit: 'Отправить управляющему',
  thanksTitle: 'Мы получили ваше сообщение',
  thanksLead:
    'Управляющий свяжется в рабочие часы клиники. Если вопрос срочный — напишите нам в WhatsApp ' +
    `${clinic.phoneDisplay}.`,
};

export const optOut = {
  label: 'Не напоминать об отзывах',
  confirmTitle: 'Больше не напомним',
  confirmLead:
    'Мы не будем писать вам про отзывы. Запись и лечение это не затрагивает — ' +
    'по любым вопросам пишите в WhatsApp как обычно.',
};

export const landing = {
  title: 'Будем благодарны за ваш отзыв',
  lead:
    'Расскажите, как прошёл визит в Expert Dental Studio. Честное впечатление на карте помогает ' +
    'другим пациентам выбрать клинику, а нам — улучшать работу. Это займёт пару минут.',
  teamAlt: 'Команда врачей Expert Dental Studio',
  mapsTitle: 'Выберите удобную площадку',
  whatsappLabel: 'Написать клинике в WhatsApp',
};

export const footerNote =
  'Оценка не влияет на лечение, стоимость и очередь. Мы не даём скидок и бонусов за отзывы.';
