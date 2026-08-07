(() => {
  'use strict';

  const RULES_URL = '/assets/img/workspace/content/recontact-9.json?v=20260807-i74';
  const TASKS_KEY = 'expert-dental-recontact-tasks-v1';
  const HANDOFF_KEY = 'expert-dental-handoff-v2';
  const DEFAULT_OWNER = 'Администратор смены';

  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));

  let rules = [];
  let loadError = '';

  function readTasks() {
    try {
      const parsed = JSON.parse(localStorage.getItem(TASKS_KEY) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function writeTasks(items) {
    localStorage.setItem(TASKS_KEY, JSON.stringify(items.slice(0, 40)));
  }

  function resolveOwner(rule) {
    const raw = String(rule.owner_role || '').trim();
    if (!raw || /не указан/i.test(raw)) return DEFAULT_OWNER;
    return raw;
  }

  function resolveChannel(rule) {
    const raw = String(rule.channel || '').trim();
    if (!raw || /не указан/i.test(raw)) return 'WhatsApp';
    return raw;
  }

  async function loadRules() {
    try {
      const res = await fetch(RULES_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length !== 9) {
        throw new Error(`expected 9 rules, got ${Array.isArray(data) ? data.length : typeof data}`);
      }
      rules = data;
      loadError = '';
    } catch (err) {
      rules = [];
      loadError = err?.message || String(err);
    }
  }

  function pushHandoff(task) {
    let queue = [];
    try {
      queue = JSON.parse(localStorage.getItem(HANDOFF_KEY) || '[]');
      if (!Array.isArray(queue)) queue = [];
    } catch {
      queue = [];
    }
    queue.unshift({
      patient: task.patient || `Повторное касание · ${task.ruleId}`,
      result: task.result || `${task.situation} · ${task.channel}`,
      time: task.createdAtTime,
      due: task.due,
      owner: task.owner,
      priority: task.priority || 'Обычный',
      type: task.type || 'recontact',
      ruleId: task.ruleId,
    });
    localStorage.setItem(HANDOFF_KEY, JSON.stringify(queue.slice(0, 20)));
    document.dispatchEvent(new CustomEvent('ed-handoff-updated'));
  }

  function persistTask(task, toastText) {
    const items = readTasks();
    items.unshift(task);
    writeTasks(items);
    pushHandoff(task);
    if ($('recontactModal') && !$('recontactModal').classList.contains('hidden')) render();
    window.dispatchEvent(new CustomEvent('ed-toast', {
      detail: { text: toastText || `Задача: ${task.due} · ${task.channel} · ${task.owner}` },
    }));
    return task;
  }

  function createManualTask(input = {}) {
    const now = new Date();
    const task = {
      id: input.id || `task-${Date.now()}`,
      ruleId: input.ruleId || 'RET',
      situation: input.situation || input.title || 'Возврат в работу',
      goal: input.goal || '',
      due: input.due || 'Сегодня до конца смены',
      channel: input.channel || 'Телефон',
      owner: input.owner || DEFAULT_OWNER,
      script: input.script || '',
      source_ref: input.source_ref || 'journal',
      patient: input.patient || '',
      phone: input.phone || '',
      result: input.result || '',
      priority: input.priority || 'Обычный',
      type: input.type || 'return',
      journalId: input.journalId || '',
      createdAt: now.toISOString(),
      createdAtTime: now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      status: 'open',
    };
    return persistTask(task, input.toast || `Возврат в работу: ${task.due} · ${task.owner}`);
  }

  function createTask(ruleId) {
    const rule = rules.find((item) => item.id === ruleId);
    if (!rule) return;
    const now = new Date();
    const task = {
      id: `recontact-${Date.now()}`,
      ruleId: rule.id,
      situation: rule.situation || rule.rule,
      goal: rule.goal || '',
      due: rule.delay || 'По регламенту',
      channel: resolveChannel(rule),
      owner: resolveOwner(rule),
      script: rule.script && /^S\d{2}$/.test(rule.script) ? rule.script : '',
      source_ref: rule.source_ref || '',
      type: 'recontact',
      createdAt: now.toISOString(),
      createdAtTime: now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      status: 'open',
    };
    return persistTask(task, `Задача ${rule.id}: ${task.due} · ${task.channel} · ${task.owner}`);
  }

  function renderTasks() {
    const box = $('recontactTasks');
    if (!box) return;
    const items = readTasks();
    if (!items.length) {
      box.innerHTML = '<div class="recontact-empty">Демо-задач пока нет. Создайте из правила.</div>';
      return;
    }
    box.innerHTML = items.slice(0, 8).map((task) => `
      <article class="recontact-task">
        <div>
          <strong>${esc(task.ruleId)} · ${esc(task.situation)}</strong>
          <span>Срок: ${esc(task.due)} · Канал: ${esc(task.channel)} · Владелец: ${esc(task.owner)}</span>
        </div>
        <div class="recontact-task-badge">демо</div>
      </article>
    `).join('');
  }

  function renderList(filter = '') {
    const list = $('recontactList');
    const stats = $('recontactStats');
    const q = filter.trim().toLowerCase();
    if (!list || !stats) return;

    if (loadError) {
      stats.innerHTML = `<div><b>0</b><span>Ошибка</span></div>`;
      list.innerHTML = `<div class="recontact-empty">Не удалось загрузить recontact-9.json: ${esc(loadError)}</div>`;
      return;
    }

    const filtered = rules.filter((item) => {
      if (!q) return true;
      return [item.id, item.situation, item.goal, item.channel, item.delay, item.rule, item.script]
        .some((field) => String(field || '').toLowerCase().includes(q));
    });

    const openTasks = readTasks().filter((item) => item.status === 'open').length;
    stats.innerHTML = `
      <div><b>${rules.length}</b><span>Правил</span></div>
      <div><b>${filtered.length}</b><span>Показано</span></div>
      <div><b>${openTasks}</b><span>Демо-задач</span></div>
    `;

    if (!filtered.length) {
      list.innerHTML = '<div class="recontact-empty">Ничего не найдено.</div>';
      return;
    }

    list.innerHTML = filtered.map((item) => {
      const channel = resolveChannel(item);
      const owner = resolveOwner(item);
      const scriptBtn = item.script && /^S\d{2}$/.test(item.script)
        ? `<button class="secondary" type="button" data-open-script="${esc(item.script)}">${esc(item.script)}</button>`
        : '';
      return `
        <article class="recontact-row" data-rule-id="${esc(item.id)}">
          <div class="recontact-id">${esc(item.id)}</div>
          <div class="recontact-main">
            <h3>${esc(item.situation || item.id)}</h3>
            <p>${esc(item.goal || '')}</p>
            <p>Срок: ${esc(item.delay || '—')} · Лимит: ${esc(item.limit || '—')}</p>
          </div>
          <div class="recontact-meta">
            <span class="recontact-chip">${esc(channel)}</span>
            <span class="recontact-chip">${esc(owner)}</span>
            <div class="recontact-actions">
              ${scriptBtn}
              <button class="primary" type="button" data-create-task="${esc(item.id)}">Создать задачу</button>
            </div>
          </div>
        </article>
      `;
    }).join('');

    list.querySelectorAll('[data-create-task]').forEach((button) => {
      button.onclick = (event) => {
        event.preventDefault();
        createTask(button.dataset.createTask);
      };
    });
    list.querySelectorAll('[data-open-script]').forEach((button) => {
      button.onclick = (event) => {
        event.preventDefault();
        window.ExpertDentalScriptsCatalog?.openById?.(button.dataset.openScript);
      };
    });
  }

  function render() {
    renderList($('recontactSearch')?.value || '');
    renderTasks();
  }

  async function openRecontact() {
    const modal = $('recontactModal');
    if (!modal) return;
    if (!rules.length && !loadError) await loadRules();
    render();
    modal.classList.remove('hidden');
    $('recontactSearch')?.focus();
  }

  function closeRecontact() {
    $('recontactModal')?.classList.add('hidden');
  }

  function bind() {
    const openBtn = $('openRecontact');
    const closeBtn = $('closeRecontact');
    const search = $('recontactSearch');
    const modal = $('recontactModal');
    if (openBtn) openBtn.onclick = () => { openRecontact(); };
    if (closeBtn) closeBtn.onclick = () => { closeRecontact(); };
    if (search) search.oninput = () => renderList(search.value);
    if (modal) {
      modal.addEventListener('click', (event) => {
        if (event.target === modal) closeRecontact();
      });
    }
    document.addEventListener('keydown', (event) => {
      if (!modal || modal.classList.contains('hidden')) return;
      if (event.key === 'Escape') closeRecontact();
    });
    document.addEventListener('ed-toast', (event) => {
      const text = event.detail?.text;
      if (!text) return;
      const node = $('toast');
      if (!node) return;
      node.textContent = text;
      node.classList.remove('hidden');
      clearTimeout(node._timer);
      node._timer = setTimeout(() => node.classList.add('hidden'), 2200);
    });
    if (location.hash === '#recontact') openRecontact();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }

  window.ExpertDentalRecontact = {
    open: openRecontact,
    reload: loadRules,
    createTask,
    createManualTask,
    tasks: readTasks,
  };
})();
