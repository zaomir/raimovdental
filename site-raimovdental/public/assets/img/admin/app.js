(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  const JOURNAL_KEY = 'expert-dental-contact-journal-v2';
  const HANDOFF_KEY = 'expert-dental-handoff-v2';

  const patients = [
    {
      id: 'maria', name: 'Мария Ивановна', phone: '+996 555 24 18 06',
      tags: ['Повторный пациент', 'После хирургии', 'Высокий приоритет'],
      history: [
        ['Вчера, 16:30', 'Удаление зуба мудрости', 'Хирург · рекомендации выданы'],
        ['12 мая 2026', 'Профессиональная гигиена', 'Визит завершён']
      ]
    },
    {
      id: 'aibek', name: 'Айбек Нурланович', phone: '+996 700 41 22 11',
      tags: ['План лечения', 'Имплантация'],
      history: [
        ['28 июля 2026', 'Консультация имплантолога', 'План лечения сформирован'],
        ['14 июня 2026', 'КТ-диагностика', 'Снимок в карте']
      ]
    },
    {
      id: 'elena', name: 'Елена Сергеевна', phone: '+996 777 09 31 44',
      tags: ['Ортодонтия', 'Повторный пациент'],
      history: [['20 июля 2026', 'Коррекция брекет-системы', 'Плановый визит через 4 недели']]
    }
  ];

  const outcomes = [
    'Записан на приём', 'Предварительная бронь', 'Передан врачу',
    'Назначен обратный звонок', 'Пациент думает', 'Нет подходящего времени',
    'Запись перенесена', 'Запись отменена', 'Внутреннее направление',
    'Отказ пациента', 'Не удалось связаться', 'Жалоба зарегистрирована',
    'Решено без записи'
  ];

  const demoJournal = [
    { id: 'demo-1', at: '31.07.2026, 09:15', patient: 'Айбек Нурланович', phone: '+996 700 41 22 11', service: 'Имплантация', outcome: 'Предварительная бронь', reason: 'Нужно согласовать время', owner: 'Администратор смены', next: 'Позвонить сегодня в 15:00', duration: 236 },
    { id: 'demo-2', at: '31.07.2026, 08:42', patient: 'Мария Ивановна', phone: '+996 555 24 18 06', service: 'Кровь / отёк после удаления', outcome: 'Передан врачу', reason: 'Послеоперационная жалоба', owner: 'Дежурный врач', next: 'Связаться в течение 30 минут', duration: 189 },
    { id: 'demo-3', at: '30.07.2026, 18:20', patient: 'Елена Сергеевна', phone: '+996 777 09 31 44', service: 'Ортодонтия', outcome: 'Записан на приём', reason: 'Плановая коррекция', owner: 'Администратор смены', next: 'Визит завтра в 11:00', duration: 144 }
  ];

  const demoHandoff = [
    { patient: 'Мария Ивановна', result: 'Ожидает звонка дежурного врача', time: '09:15' },
    { patient: 'Айбек Нурланович', result: 'Подтвердить бронь на имплантацию', time: '15:00' }
  ];

  const state = {
    screen: 'start', training: true, patient: null, notes: {}, startedAt: Date.now(), timer: null,
    proposedOutcome: '', proposedNext: ''
  };

  const progress = ['Контакт', 'Идентификация', 'Потребность', 'Уточнение', 'Следующий шаг', 'Фиксация'];

  function readJson(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) || 'null');
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function journal() {
    const existing = readJson(JOURNAL_KEY, []);
    if (existing.length) return existing;
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(demoJournal));
    return demoJournal.slice();
  }

  function handoff() {
    const existing = readJson(HANDOFF_KEY, []);
    if (existing.length) return existing;
    localStorage.setItem(HANDOFF_KEY, JSON.stringify(demoHandoff));
    return demoHandoff.slice();
  }

  function toast(text) {
    const node = $('toast');
    if (!node) return;
    node.textContent = text;
    node.classList.remove('hidden');
    clearTimeout(node._timer);
    node._timer = setTimeout(() => node.classList.add('hidden'), 1800);
  }

  function currentStep() {
    if (state.screen === 'start') return 0;
    if (['search', 'confirm', 'new'].includes(state.screen)) return 1;
    if (['need', 'consult', 'price', 'booking'].includes(state.screen)) return 2;
    if (state.screen.startsWith('triage')) return 3;
    if (['urgent', 'callback', 'slot'].includes(state.screen)) return 4;
    return 5;
  }

  function startTimer() {
    clearInterval(state.timer);
    state.startedAt = Date.now();
    state.timer = setInterval(() => {
      const seconds = Math.floor((Date.now() - state.startedAt) / 1000);
      const node = $('timer');
      if (node) node.textContent = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    }, 1000);
  }

  function script(text, tip = '') {
    return `<div class="question-number"><span>${currentStep() + 1}</span> Следуйте формулировке</div>
      <div class="script"><div class="script-label">Что говорит администратор</div><p class="script-text">${text}</p></div>
      ${state.training && tip ? `<div class="helper"><strong>Подсказка новичку</strong>${tip}</div>` : ''}`;
  }

  function options(items) {
    return `<div class="options">${items.map((item) => `<button class="option" ${item.attr}="${esc(item.value)}"><strong>${item.title}</strong><span>${item.description}</span></button>`).join('')}</div>`;
  }

  function setScreen(title, html) {
    $('screenTitle').textContent = title;
    $('screen').innerHTML = html;
    bindScreen();
    renderSidebars();
  }

  function go(screen) {
    state.screen = screen;
    render();
  }

  function resetCall() {
    state.screen = 'start';
    state.patient = null;
    state.notes = {};
    state.proposedOutcome = '';
    state.proposedNext = '';
    $('freeNote').value = '';
    startTimer();
    render();
    toast('Новый звонок');
  }

  function render() {
    if (state.screen === 'start') {
      return setScreen('Начало разговора', script(
        'Здравствуйте! Вы позвонили в клинику «Эксперт Дентал». Подскажите, пожалуйста, вы уже наш пациент?',
        'Сначала определяем, есть ли история лечения.'
      ) + options([
        { attr: 'data-go', value: 'search', title: 'Да, уже пациент', description: 'Найти карточку и увидеть контекст' },
        { attr: 'data-go', value: 'new', title: 'Нет, обращается впервые', description: 'Квалифицировать потребность' }
      ]));
    }

    if (state.screen === 'search') {
      return setScreen('Идентификация пациента', script(
        'Представьтесь, пожалуйста, или назовите номер телефона, который указан в вашей карте.',
        'Для поиска достаточно фамилии или номера телефона.'
      ) + `<label class="field-label">Телефон или фамилия</label><input id="patientSearch" class="input" placeholder="+996 или фамилия"><div id="searchResults" class="search-results"></div><div class="actions"><button class="secondary" data-go="start">Назад</button></div>`);
    }

    if (state.screen === 'confirm') {
      return setScreen('Подтверждение личности', script(
        `Это вы, ${esc(state.patient.name)}? Я вижу, что последний визит был: ${esc(state.patient.history[0][1].toLowerCase())}. Что произошло и чем я могу помочь?`,
        'Не раскрывайте подробности истории до подтверждения личности.'
      ) + options([
        { attr: 'data-go', value: 'need', title: 'Да, это пациент', description: 'Перейти к причине обращения' },
        { attr: 'data-go', value: 'search', title: 'Нет, другая карта', description: 'Вернуться к поиску' }
      ]));
    }

    if (state.screen === 'new') {
      return setScreen('Новый пациент', script(
        'Подскажите, пожалуйста, что случилось: у вас срочная ситуация, либо вы хотите получить консультацию или записаться на приём?',
        'Сначала разделите срочный и плановый запрос.'
      ) + options([
        { attr: 'data-go', value: 'triage-pain', title: 'Срочная ситуация', description: 'Боль, кровь, отёк, поломка' },
        { attr: 'data-go', value: 'consult', title: 'Нужна консультация', description: 'Определить направление' },
        { attr: 'data-go', value: 'booking', title: 'Записаться', description: 'Предложить конкретное время' },
        { attr: 'data-go', value: 'price', title: 'Узнать стоимость', description: 'Корректно объяснить диапазон' }
      ]));
    }

    if (state.screen === 'need') {
      return setScreen('Причина обращения', script(
        'Расскажите, пожалуйста, что произошло или какой вопрос вы хотели решить сегодня?',
        'Зафиксируйте формулировку пациента.'
      ) + options([
        { attr: 'data-go', value: 'triage-bleeding', title: 'Кровь / отёк', description: 'После лечения или самостоятельно' },
        { attr: 'data-go', value: 'triage-pain', title: 'Острая боль', description: 'Проверить красные флаги' },
        { attr: 'data-go', value: 'triage-restoration', title: 'Пломба / коронка', description: 'Выпала, сломалась, мешает' },
        { attr: 'data-go', value: 'triage-braces', title: 'Брекеты', description: 'Дуга, замок, натирание' },
        { attr: 'data-go', value: 'consult', title: 'Консультация', description: 'Виниры, имплантация, ортодонтия' },
        { attr: 'data-go', value: 'booking', title: 'Запись / перенос', description: 'Организационный вопрос' }
      ]));
    }

    if (state.screen === 'consult') {
      return setScreen('Выбор направления', script(
        'Какой результат вы хотели бы получить или какая проблема беспокоит больше всего?',
        'Продаём следующий шаг — диагностику и консультацию.'
      ) + options(['Виниры и эстетика', 'Имплантация', 'Ортодонтия', 'Общая диагностика'].map((name) => ({
        attr: 'data-service', value: name, title: name, description: 'Выбрать профильного специалиста'
      }))) + `<div class="actions"><button class="secondary" data-go="${state.patient ? 'need' : 'new'}">Назад</button></div>`);
    }

    if (state.screen === 'price') {
      return setScreen('Запрос стоимости', script(
        'Стоимость зависит от состояния зубов и плана лечения. Подскажите, пожалуйста, о какой услуге идёт речь?',
        'Не называйте окончательную стоимость без диагностики.'
      ) + `<div class="form-grid"><div class="form-group wide"><label class="field-label">Услуга</label><select id="priceService" class="input"><option value="">Выберите</option><option>Виниры и эстетика</option><option>Имплантация</option><option>Ортодонтия</option><option>Лечение зуба</option></select></div><div class="form-group wide"><label class="field-label">Что спрашивает пациент</label><textarea id="priceQuestion" class="input"></textarea></div></div><div class="alert info">Пациент должен понять принцип формирования цены и получить конкретное предложение записи. Каталог: S05 · при выборе услуги откроются S02–S04.</div><div class="actions"><button class="secondary" data-go="${state.patient ? 'need' : 'new'}">Назад</button><button type="button" class="secondary" data-open-script="S05">Открыть скрипт S05</button><button id="priceNext" class="primary">Предложить консультацию</button></div>`);
    }

    if (state.screen === 'fear') {
      return setScreen('Страх лечения', script(
        'Спасибо, что сказали об этом. Страх перед лечением — частая причина откладывать визит. Что именно вас больше всего беспокоит: боль, анестезия, результат или сам процесс?',
        'Не обещать «совсем не больно» как гарантию.'
      ) + options([
        { attr: 'data-open-script', value: 'S08', title: 'Страх боли', description: 'Открыть скрипт S08' },
        { attr: 'data-open-script', value: 'S09', title: 'Страх имплантации', description: 'Открыть скрипт S09' },
        { attr: 'data-open-script', value: 'S10', title: 'Страх обточки под виниры', description: 'Открыть скрипт S10' },
      ]) + `<div class="actions"><button class="secondary" data-go="${state.patient ? 'need' : 'new'}">Назад</button><button class="primary" data-go="consult">К консультации</button></div>`);
    }

    if (state.screen === 'booking') {
      return setScreen('Запись или перенос', script(
        'К какому врачу или по какой услуге вы хотите записаться? Я посмотрю ближайшие варианты.',
        'Предложите два конкретных окна.'
      ) + `<label class="field-label">Услуга</label><select id="bookingService" class="input"><option>Консультация по винирам</option><option>Консультация имплантолога</option><option>Консультация ортодонта</option><option>Лечение</option><option>Контрольный осмотр</option></select>` + options([
        { attr: 'data-slot', value: 'Сегодня, 17:30', title: 'Сегодня · 17:30', description: 'Ближайшее окно' },
        { attr: 'data-slot', value: 'Завтра, 11:00', title: 'Завтра · 11:00', description: 'Утреннее окно' }
      ]));
    }

    if (state.screen === 'triage-bleeding') return renderTriage('Кровь или отёк', 'Уточню несколько важных деталей. После какой процедуры это началось и когда?', ['Дыхание или глотание затруднено', 'Кровотечение не уменьшается', 'Температура или быстро растущий отёк']);
    if (state.screen === 'triage-pain') return renderTriage('Острая боль', 'Оцените боль от 0 до 10. Есть ли отёк, температура или затруднение дыхания и глотания?', ['Затруднено дыхание или глотание', 'Температура или растущий отёк', 'Боль 8–10 из 10']);
    if (state.screen === 'triage-restoration') return renderTriage('Пломба или коронка', 'Пломба или коронка выпала полностью? Есть ли сильная боль, острый край или травма тканей?', ['Сильная боль', 'Травма мягких тканей']);
    if (state.screen === 'triage-braces') return renderTriage('Поломка брекетов', 'Что произошло: отклеился замок, сместилась дуга, появилась боль или конструкция травмирует щёку?', ['Выраженная боль', 'Конструкция травмирует ткани']);

    if (state.screen === 'urgent') {
      return setScreen('Срочная эскалация', script(
        'Спасибо, что сразу сообщили. Сейчас я передам информацию дежурному врачу как срочную. Пожалуйста, оставайтесь на связи.',
        'Не ставить диагноз и не менять назначения.'
      ) + `<div class="alert danger"><strong>Высокий приоритет.</strong> Немедленно передать врачу.</div><label class="field-label">Телефон для связи</label><input id="callbackPhone" class="input" value="${esc(state.patient?.phone || '+996 ')}"><div class="actions"><button class="secondary" data-go="${state.patient ? 'need' : 'new'}">Назад</button><button id="urgentFinish" class="danger-btn">Перейти к фиксации</button></div>`);
    }

    if (state.screen === 'callback') {
      return setScreen('Передача врачу', script(
        `Я зафиксировала симптомы и передам информацию врачу. Мы свяжемся с вами по номеру ${esc(state.patient?.phone || 'который вы назвали')}.`,
        'Создайте задачу и проконтролируйте выполнение.'
      ) + `<div class="alert success">Администратор не даёт медицинскую интерпретацию.</div><label class="field-label">Срок связи</label><select id="callbackWindow" class="input"><option>Как можно скорее</option><option>В течение 30 минут</option><option>В течение часа</option><option>Сегодня до конца смены</option></select><div class="actions"><button class="secondary" data-go="${state.patient ? 'need' : 'new'}">Назад</button><button id="callbackFinish" class="primary">Перейти к фиксации</button></div>`);
    }

    if (state.screen === 'slot') {
      return setScreen('Подбор времени', script(
        `Для направления «${esc(state.notes.Направление)}» есть два варианта: сегодня в 17:30 или завтра в 11:00. Какой удобнее?`,
        'Два варианта повышают вероятность записи.'
      ) + options([
        { attr: 'data-slot', value: 'Сегодня, 17:30', title: 'Сегодня · 17:30', description: 'Предложить пациенту' },
        { attr: 'data-slot', value: 'Завтра, 11:00', title: 'Завтра · 11:00', description: 'Предложить пациенту' }
      ]));
    }

    if (state.screen === 'outcome') return renderOutcome();
  }

  function renderTriage(label, question, flags) {
    state.notes.Сценарий = label;
    return setScreen(label, script(question, 'Цель — найти красные флаги и передать врачу, а не поставить диагноз.') + options([
      ...flags.map((flag) => ({ attr: 'data-flag', value: flag, title: flag, description: 'Срочная эскалация' })),
      { attr: 'data-safe', value: 'Нет выраженных красных флагов', title: 'Нет перечисленных признаков', description: 'Передать врачу в обычном приоритете' }
    ]) + `<div class="actions"><button class="secondary" data-go="${state.patient ? 'need' : 'new'}">Назад</button></div>`);
  }

  function renderOutcome() {
    const patientName = state.patient?.name || 'Новый пациент';
    const phone = state.patient?.phone || '+996 ';
    const service = state.notes.Услуга || state.notes.Направление || state.notes.Сценарий || 'Обращение';
    return setScreen('Результат разговора', script(
      'Подтверждаю договорённость. Сейчас я зафиксирую итог и следующий шаг, чтобы обращение не потерялось.',
      'Разговор нельзя завершить без результата, ответственного и следующего действия.'
    ) + `<div class="form-grid">
      <div class="form-group wide"><label class="field-label">Результат разговора</label><select id="outcomeSelect" class="input"><option value="">Выберите результат</option>${outcomes.map((item) => `<option${item === state.proposedOutcome ? ' selected' : ''}>${item}</option>`).join('')}</select></div>
      <div class="form-group"><label class="field-label">Пациент</label><input id="outcomePatient" class="input" value="${esc(patientName)}"></div>
      <div class="form-group"><label class="field-label">Телефон</label><input id="outcomePhone" class="input" value="${esc(phone)}"></div>
      <div class="form-group wide"><label class="field-label">Услуга / тема</label><input id="outcomeService" class="input" value="${esc(service)}"></div>
      <div class="form-group"><label class="field-label">Причина / подстатус</label><input id="outcomeReason" class="input" value="${esc(state.notes['Красный флаг'] || state.notes.Симптомы || '')}" placeholder="Почему такой результат"></div>
      <div class="form-group"><label class="field-label">Ответственный</label><select id="outcomeOwner" class="input"><option>Администратор смены</option><option>Старший администратор</option><option${state.proposedOutcome === 'Передан врачу' ? ' selected' : ''}>Дежурный врач</option></select></div>
      <div class="form-group wide"><label class="field-label">Следующее действие</label><input id="outcomeNext" class="input" value="${esc(state.proposedNext)}" placeholder="Запись, звонок врача, подтверждение, отправка информации"></div>
      <div class="form-group wide"><label class="field-label">Итоговый комментарий</label><textarea id="outcomeComment" class="input">${esc($('freeNote').value || '')}</textarea></div>
    </div><div class="actions"><button id="copySummary" class="secondary">Скопировать саммари</button><button id="saveOutcome" class="primary">Сохранить в журнал</button></div>`);
  }

  function bindScreen() {
    document.querySelectorAll('[data-go]').forEach((button) => { button.onclick = () => go(button.dataset.go); });
    document.querySelectorAll('[data-service]').forEach((button) => {
      button.onclick = () => { state.notes.Направление = button.dataset.service; go('slot'); };
    });
    document.querySelectorAll('[data-slot]').forEach((button) => {
      button.onclick = () => {
        const service = $('bookingService')?.value || state.notes.Направление || 'Консультация';
        state.notes.Услуга = service;
        state.notes.Время = button.dataset.slot;
        state.proposedOutcome = 'Записан на приём';
        state.proposedNext = `Визит: ${button.dataset.slot}`;
        go('outcome');
      };
    });
    document.querySelectorAll('[data-flag]').forEach((button) => {
      button.onclick = () => { state.notes['Красный флаг'] = button.dataset.flag; go('urgent'); };
    });
    document.querySelectorAll('[data-safe]').forEach((button) => {
      button.onclick = () => { state.notes.Симптомы = button.dataset.safe; go('callback'); };
    });

    const search = $('patientSearch');
    if (search) {
      search.onfocus = () => { if (!search.value) search.value = '+996 '; };
      search.oninput = () => {
        const query = search.value.trim().toLowerCase();
        const digits = query.replace(/\D/g, '');
        const matches = patients.filter((patient) => query.length >= 2 && (
          patient.name.toLowerCase().includes(query) || (digits.length >= 3 && patient.phone.replace(/\D/g, '').includes(digits))
        ));
        $('searchResults').innerHTML = matches.length ? matches.map((patient) => `<button class="patient-result" data-patient="${patient.id}"><strong>${esc(patient.name)}</strong><small>${esc(patient.phone)} · ${esc(patient.tags.join(' · '))}</small></button>`).join('') : '<div class="empty-context">Демо: Мария, Айбек или Елена.</div>';
        document.querySelectorAll('[data-patient]').forEach((button) => {
          button.onclick = () => {
            state.patient = patients.find((patient) => patient.id === button.dataset.patient);
            state.notes.Пациент = state.patient.name;
            state.notes.Телефон = state.patient.phone;
            go('confirm');
          };
        });
      };
    }

    $('priceService')?.addEventListener('change', () => {
      const selected = $('priceService').value || '';
      const map = {
        'Имплантация': 'S02',
        'Виниры и эстетика': 'S03',
        'Ортодонтия': 'S04',
        'Лечение зуба': 'S05',
      };
      const id = map[selected] || 'S05';
      window.ExpertDentalScriptsCatalog?.openById?.(id);
    });
    $('priceNext')?.addEventListener('click', () => {
      const service = $('priceService').value;
      if (!service) return toast('Выберите услугу');
      state.notes.Направление = service;
      state.notes['Запрос цены'] = $('priceQuestion').value || 'Общий вопрос';
      go('slot');
    });

    $('urgentFinish')?.addEventListener('click', () => {
      state.notes.Телефон = $('callbackPhone').value;
      state.proposedOutcome = 'Передан врачу';
      state.proposedNext = 'Срочно связаться с пациентом';
      go('outcome');
    });

    $('callbackFinish')?.addEventListener('click', () => {
      const windowValue = $('callbackWindow').value;
      state.notes['Срок связи'] = windowValue;
      state.proposedOutcome = 'Передан врачу';
      state.proposedNext = `Связаться: ${windowValue.toLowerCase()}`;
      go('outcome');
    });

    $('saveOutcome')?.addEventListener('click', saveOutcome);
    $('copySummary')?.addEventListener('click', copySummary);
  }

  function saveOutcome() {
    const outcome = $('outcomeSelect').value;
    const next = $('outcomeNext').value.trim();
    if (!outcome) return toast('Выберите результат разговора');
    if (!next) return toast('Укажите следующее действие');
    const record = {
      id: `call-${Date.now()}`,
      at: new Date().toLocaleString('ru-RU'),
      patient: $('outcomePatient').value.trim() || 'Новый пациент',
      phone: $('outcomePhone').value.trim(),
      service: $('outcomeService').value.trim() || 'Обращение',
      outcome,
      reason: $('outcomeReason').value.trim(),
      owner: $('outcomeOwner').value,
      next,
      comment: $('outcomeComment').value.trim(),
      duration: Math.round((Date.now() - state.startedAt) / 1000)
    };
    const items = journal();
    items.unshift(record);
    localStorage.setItem(JOURNAL_KEY, JSON.stringify(items.slice(0, 200)));
    if (['Передан врачу', 'Предварительная бронь', 'Назначен обратный звонок', 'Пациент думает', 'Нет подходящего времени', 'Жалоба зарегистрирована'].includes(outcome)) {
      const queue = handoff();
      queue.unshift({ patient: record.patient, result: `${record.outcome}: ${record.next}`, time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) });
      localStorage.setItem(HANDOFF_KEY, JSON.stringify(queue.slice(0, 20)));
    }
    renderJournal();
    renderSidebars();
    toast('Обращение сохранено в журнал');
    setTimeout(resetCall, 700);
  }

  async function copySummary() {
    const text = [`Пациент: ${$('outcomePatient')?.value || state.patient?.name || 'Новый пациент'}`, ...Object.entries(state.notes).map(([key, value]) => `${key}: ${value}`), `Длительность: ${$('timer').textContent}`].join('\n');
    try { await navigator.clipboard.writeText(text); toast('Саммари скопировано'); } catch { toast('Не удалось скопировать'); }
  }

  function renderSidebars() {
    $('progress').innerHTML = progress.map((name, index) => `<div class="progress-item ${index < currentStep() ? 'done' : index === currentStep() ? 'active' : ''}"><div class="step-dot">${index < currentStep() ? '✓' : index + 1}</div><div>${name}</div></div>`).join('');

    const context = $('patientContext');
    if (state.patient) {
      context.className = '';
      context.innerHTML = `<div class="patient-head"><div class="avatar">${esc(state.patient.name.split(' ').map((part) => part[0]).slice(0, 2).join(''))}</div><div><h3>${esc(state.patient.name)}</h3><p>${esc(state.patient.phone)}</p></div></div><div class="tags">${state.patient.tags.map((tag) => `<span class="tag">${esc(tag)}</span>`).join('')}</div><div class="history">${state.patient.history.map((item) => `<div class="history-item"><strong>${esc(item[0])} · ${esc(item[1])}</strong><span>${esc(item[2])}</span></div>`).join('')}</div>`;
    } else {
      context.className = 'empty-context';
      context.textContent = 'Найдите пациента — здесь появится доступная администратору история.';
    }

    const noteEntries = Object.entries(state.notes);
    $('notesLog').innerHTML = noteEntries.length ? noteEntries.map(([key, value]) => `<div class="note-row"><b>${esc(key)}:</b> ${esc(value)}</div>`).join('') : '<div class="note-row">Данные ещё не собраны.</div>';

    const queue = handoff();
    $('handoffQueue').innerHTML = queue.length ? queue.map((item) => {
      const due = item.due ? ` · срок ${esc(item.due)}` : '';
      const owner = item.owner ? ` · ${esc(item.owner)}` : '';
      return `<div class="queue-item"><strong>${esc(item.patient)}</strong><span>${esc(item.result)} · ${esc(item.time)}${due}${owner}</span></div>`;
    }).join('') : '<div class="empty-context">Очередь пуста.</div>';
  }

  function renderJournal() {
    const query = ($('journalSearch')?.value || '').toLowerCase();
    const status = $('journalStatus')?.value || '';
    const items = journal().filter((item) => (!status || item.outcome === status) && (!query || `${item.patient} ${item.phone} ${item.service}`.toLowerCase().includes(query)));
    const all = journal();
    $('journalStats').innerHTML = `<div class="stat-card"><strong>${all.length}</strong><span>Всего обращений</span></div><div class="stat-card"><strong>${all.filter((item) => item.outcome === 'Записан на приём').length}</strong><span>Записано</span></div><div class="stat-card"><strong>${all.filter((item) => item.outcome === 'Передан врачу').length}</strong><span>Передано врачу</span></div>`;
    $('journalList').innerHTML = items.length ? items.map((item) => `<article class="journal-item"><div class="journal-item-head"><div><strong>${esc(item.patient)}</strong><span>${esc(item.at)} · ${esc(item.phone || '')}</span></div><span class="result-badge">${esc(item.outcome)}</span></div><div class="journal-meta"><span><b>Тема:</b> ${esc(item.service)}</span><span><b>Ответственный:</b> ${esc(item.owner)}</span><span><b>Следующий шаг:</b> ${esc(item.next)}</span>${item.reason ? `<span><b>Причина:</b> ${esc(item.reason)}</span>` : ''}</div></article>`).join('') : '<div class="empty-context">Обращения не найдены.</div>';
  }

  function openApp() {
    sessionStorage.setItem('ed-admin', '1');
    $('login').classList.add('hidden');
    $('app').classList.remove('hidden');
    journal();
    handoff();
    startTimer();
    render();
    renderJournal();
  }

  $('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    if ($('password').value === 'admin') openApp();
    else $('loginError').textContent = 'Неверный пароль.';
  });
  $('logout').onclick = () => { sessionStorage.removeItem('ed-admin'); location.reload(); };
  $('newCallTop').onclick = resetCall;
  $('trainingSwitch').onclick = () => { state.training = !state.training; $('trainingSwitch').classList.toggle('on', state.training); render(); };
  $('saveNote').onclick = () => {
    const note = $('freeNote').value.trim();
    if (!note) return toast('Введите заметку');
    state.notes.Комментарий = note;
    renderSidebars();
    toast('Заметка сохранена');
  };
  document.querySelectorAll('[data-quick]').forEach((button) => {
    button.onclick = () => {
      const key = button.dataset.quick;
      const route = {
        bleeding: 'triage-bleeding',
        pain: 'triage-pain',
        restoration: 'triage-restoration',
        braces: 'triage-braces',
        price: 'price',
        fear: 'fear',
        booking: 'booking',
      }[key];
      state.notes['Быстрый сценарий'] = button.textContent.trim();
      go(route);
      const scriptMap = { price: 'S05', fear: 'S08' };
      const scriptId = scriptMap[key];
      if (scriptId) {
        window.setTimeout(() => {
          window.ExpertDentalScriptsCatalog?.openById?.(scriptId);
        }, 80);
      }
    };
  });
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-open-script]');
    if (!trigger) return;
    event.preventDefault();
    const id = trigger.dataset.openScript;
    if (id) window.ExpertDentalScriptsCatalog?.openById?.(id);
  });
  $('openJournal').onclick = () => { renderJournal(); $('journalModal').classList.remove('hidden'); };
  $('closeJournal').onclick = () => $('journalModal').classList.add('hidden');
  $('journalSearch').oninput = renderJournal;
  $('journalStatus').innerHTML = '<option value="">Все результаты</option>' + outcomes.map((item) => `<option>${item}</option>`).join('');
  $('journalStatus').onchange = renderJournal;
  document.addEventListener('ed-handoff-updated', () => {
    if (!$('app')?.classList.contains('hidden')) renderSidebars();
  });

  if (sessionStorage.getItem('ed-admin') === '1') openApp();
})();
