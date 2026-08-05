(() => {
  'use strict';

  const STORAGE_KEY = 'expert-dental-home-care-log-v1';
  const DOCTOR_KEY = 'expert-dental-doctor-care-v1';

  function api() {
    return window.ExpertDentalHomeCare || null;
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    }[char]));
  }

  function readLog() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeLog(rows) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rows.slice(0, 80)));
  }

  function readDoctorMap() {
    try {
      return JSON.parse(localStorage.getItem(DOCTOR_KEY) || '{}') || {};
    } catch {
      return {};
    }
  }

  function writeDoctorMap(map) {
    localStorage.setItem(DOCTOR_KEY, JSON.stringify(map));
  }

  function toast(text) {
    const node = document.getElementById('toast');
    if (!node) {
      window.alert(text);
      return;
    }
    node.textContent = text;
    node.classList.remove('hidden');
    clearTimeout(node._timer);
    node._timer = setTimeout(() => node.classList.add('hidden'), 1800);
  }

  function ensureQuickButton() {
    const grid = document.querySelector('.quick-grid');
    if (!grid || grid.querySelector('[data-quick="homecare"]')) return;
    const button = document.createElement('button');
    button.className = 'quick';
    button.type = 'button';
    button.dataset.quick = 'homecare';
    button.textContent = '🪥 Визит · уход';
    grid.appendChild(button);
  }

  function renderAdminPanel(host, options = {}) {
    const hc = api();
    if (!hc || !host) return;
    const patient = options.patientName || 'Пациент демо';
    const preselect = options.procedure || '';
    const doctorMap = readDoctorMap();
    const doctorCodes = doctorMap[patient] || [];

    host.innerHTML = `
      <div class="home-care-panel" id="homeCarePanel">
        <p class="eyebrow">Закрытие визита · матрица ухода</p>
        <h3>Процедура → скрипт → корзина → памятка</h3>
        <label class="field-label" for="hcProcedureSearch">Найти процедуру прайса</label>
        <input id="hcProcedureSearch" class="input" placeholder="Например: гигиена, удаление, брекеты" value="">
        <label class="field-label" for="hcProcedure">Процедура</label>
        <select id="hcProcedure" class="input"></select>
        <div id="hcBody" class="home-care-body"></div>
      </div>`;

    const select = host.querySelector('#hcProcedure');
    const search = host.querySelector('#hcProcedureSearch');
    const body = host.querySelector('#hcBody');

    function fillSelect(query) {
      const rows = hc.search(query);
      select.innerHTML = rows
        .map(
          (row) =>
            `<option value="${esc(row.id)}" ${row.procedure === preselect ? 'selected' : ''}>${esc(row.direction_name)} · ${esc(row.procedure)}</option>`,
        )
        .join('');
      if (!select.value && rows[0]) select.value = rows[0].id;
      paint();
    }

    function paint() {
      const row = hc.mergeDoctorCare(hc.byId(select.value), doctorCodes);
      if (!row) {
        body.innerHTML = '<div class="empty-context">Процедура не найдена.</div>';
        return;
      }
      body.innerHTML = `
        <div class="home-care-card">
          <div class="home-care-kicker">Скрипт администратора</div>
          <p class="home-care-script">${esc(row.admin_script)}</p>
          <p class="home-care-hint">${esc(hc.matrix.scripts.admin_memo_handout)}</p>
        </div>
        <div class="home-care-card">
          <div class="home-care-kicker">Доп. процедура / следующий визит</div>
          <p><strong>${esc(row.next_visit)}</strong></p>
          <p class="muted">Когда: ${esc(row.next_visit_when)}</p>
          <label class="field-label" for="hcNextSlot">Записать слот</label>
          <select id="hcNextSlot" class="input">
            <option>Сегодня после оплаты · ресепшен</option>
            <option>Завтра, 11:00</option>
            <option>Через 7 дней, 16:00</option>
            <option>Через 3 месяца (recall)</option>
            <option>Пациент отложил запись</option>
          </select>
        </div>
        <div class="home-care-card">
          <div class="home-care-kicker">Корзина ухода</div>
          <div class="home-care-basket">
            ${
              row.care_basket.length
                ? row.care_basket
                    .map(
                      (item) => `<label class="check home-care-sku"><input type="checkbox" data-sku="${esc(item.code)}" ${item.default_checked ? 'checked' : ''}> <span>${esc(item.label)} <small>(${esc(item.where)})</small></span></label>`,
                    )
                    .join('')
                : '<p class="muted">Сегодня retail не предлагаем (или только по отметке врача).</p>'
            }
          </div>
          ${doctorCodes.length ? `<p class="home-care-doctor-note">Отметка врача: ${esc(doctorCodes.join(', '))}</p>` : '<p class="muted">Отметки врача по уходу пока нет.</p>'}
        </div>
        <div class="home-care-card">
          <div class="home-care-kicker">Памятка пациента</div>
          <p><code>${esc(row.memo_id)}</code></p>
          <p class="muted">Печатает администратор. В памятке — блок «Рецепт для памяти»: уход, препараты (если назначил врач), следующий визит. Файл: ${esc(row.memo_file || 'см. by-procedure')}</p>
          <label class="check"><input id="hcMemoPrinted" type="checkbox"> Памятка распечатана и выдана (с перечнем к покупке)</label>
        </div>
        <div class="actions home-care-actions">
          <button type="button" class="primary" id="hcSaveTaken">Закрыть визит · уход взят</button>
          <button type="button" class="secondary" id="hcSaveDeclined">Памятка выдана · уход отказан</button>
        </div>`;

      body.querySelector('#hcSaveTaken').onclick = () => commit(row, 'care_taken');
      body.querySelector('#hcSaveDeclined').onclick = () => commit(row, 'care_declined');
    }

    function commit(row, careStatus) {
      const memoPrinted = body.querySelector('#hcMemoPrinted')?.checked;
      if (!memoPrinted) {
        toast('Сначала отметьте: памятка распечатана и выдана');
        return;
      }
      const selected = [...body.querySelectorAll('[data-sku]:checked')].map((node) => node.dataset.sku);
      if (careStatus === 'care_taken' && row.care_basket.length && !selected.length) {
        toast('Отметьте позиции корзины или зафиксируйте отказ');
        return;
      }
      const nextSlot = body.querySelector('#hcNextSlot')?.value || row.next_visit_when;
      const record = {
        id: `hc-${Date.now()}`,
        at: new Date().toLocaleString('ru-RU'),
        patient,
        procedure: row.procedure,
        memo_id: row.memo_id,
        memo_printed: true,
        care_status: careStatus,
        care_sku: selected,
        next_visit: row.next_visit,
        next_slot: nextSlot,
        doctor_care: doctorCodes,
      };
      const log = readLog();
      log.unshift(record);
      writeLog(log);
      toast(careStatus === 'care_taken' ? 'Визит закрыт: памятка + уход в чеке' : 'Визит закрыт: памятка выдана, уход отклонён');
      if (typeof options.onSaved === 'function') options.onSaved(record);
    }

    search.addEventListener('input', () => fillSelect(search.value));
    select.addEventListener('change', paint);
    fillSelect('');
  }

  function openFromApp() {
    const screen = document.getElementById('screen');
    const title = document.getElementById('screenTitle');
    if (!screen || !title || !api()) return;
    title.textContent = 'Закрытие визита · уход и памятка';
    const patient = window.__edPatientName || document.querySelector('#patientContext strong')?.textContent || 'Пациент демо';
    renderAdminPanel(screen, {
      patientName: patient,
      onSaved: (record) => {
        if (window.__edHomeCareSaved) window.__edHomeCareSaved(record);
      },
    });
  }

  function doctorPanelHtml() {
    const hc = api();
    if (!hc) return '<p class="muted">Матрица ухода не загружена.</p>';
    const classes = hc.matrix.doctor_care_classes
      .map(
        (item) =>
          `<label class="check"><input type="checkbox" data-doc-care="${esc(item.code)}"> <span>${esc(item.label)}</span></label>`,
      )
      .join('');
    return `
      <div class="home-care-doctor">
        <h3>Рекомендация ухода (без брендов)</h3>
        <p class="muted">${esc(hc.matrix.scripts.doctor_no_brand)}</p>
        <label class="field-label" for="docPatient">Пациент</label>
        <input id="docPatient" class="input" value="Мария Ивановна">
        <label class="field-label" for="docProcedure">Процедура визита</label>
        <select id="docProcedure" class="input">
          ${hc.matrix.procedures
            .slice(0, 40)
            .concat(hc.matrix.procedures.filter((row) => /гигиен|удален|брекет|канал|коронк|имплант/i.test(row.procedure)).slice(0, 20))
            .filter((row, index, arr) => arr.findIndex((x) => x.id === row.id) === index)
            .map((row) => `<option value="${esc(row.id)}">${esc(row.procedure)}</option>`)
            .join('')}
        </select>
        <div id="docSay" class="home-care-card" style="margin-top:10px"></div>
        <div class="stack" style="margin-top:10px">${classes}</div>
        <button type="button" class="btn primary" id="docSendCare" style="margin-top:12px">Передать на ресепшен</button>
        <div id="docResult" class="muted" style="margin-top:10px"></div>
      </div>`;
  }

  function bindDoctorPanel(rootEl) {
    const hc = api();
    if (!hc || !rootEl) return;
    const select = rootEl.querySelector('#docProcedure');
    const say = rootEl.querySelector('#docSay');
    const paint = () => {
      const row = hc.byId(select.value);
      if (!row) return;
      say.innerHTML = `<div class="home-care-kicker">Что сказать у кресла (30 сек)</div><p>${esc(row.doctor_say)}</p><p class="muted">Дальше: ${esc(row.next_visit)} · ${esc(row.next_visit_when)}</p><p class="muted">Памятку печатает администратор: <code>${esc(row.memo_id)}</code></p>`;
    };
    select.addEventListener('change', paint);
    paint();
    rootEl.querySelector('#docSendCare').onclick = () => {
      const patient = rootEl.querySelector('#docPatient').value.trim() || 'Пациент';
      const codes = [...rootEl.querySelectorAll('[data-doc-care]:checked')].map((node) => node.dataset.docCare);
      const map = readDoctorMap();
      map[patient] = codes.length ? codes : ['none'];
      writeDoctorMap(map);
      const row = hc.byId(select.value);
      rootEl.querySelector('#docResult').textContent = `Передано администратору: ${patient} · ${row?.procedure || ''} · уход: ${map[patient].join(', ')}`;
    };
  }

  window.ExpertDentalHomeCareUI = {
    openFromApp,
    renderAdminPanel,
    doctorPanelHtml,
    bindDoctorPanel,
    readLog,
    ensureQuickButton,
  };

  document.addEventListener('DOMContentLoaded', () => {
    ensureQuickButton();
  });
  ensureQuickButton();
})();
