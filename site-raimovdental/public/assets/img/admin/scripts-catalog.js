(() => {
  'use strict';

  const SCRIPTS_URL = '/assets/img/workspace/content/scripts-25.json?v=20260807-i73';
  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));

  let scripts = [];
  let loadError = '';
  let view = 'list';
  let selectedId = null;

  function scriptIdFromHash() {
    const raw = String(location.hash || '').replace(/^#/, '');
    if (!raw.startsWith('scripts')) return '';
    const match = raw.match(/^scripts(?:=|\/)(S\d{2})$/i) || raw.match(/^scripts=(S\d{2})$/i);
    return match ? match[1].toUpperCase() : '';
  }

  async function loadScripts() {
    try {
      const res = await fetch(SCRIPTS_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length !== 25) {
        throw new Error(`expected 25 scripts, got ${Array.isArray(data) ? data.length : typeof data}`);
      }
      scripts = data;
      loadError = '';
    } catch (err) {
      scripts = [];
      loadError = err?.message || String(err);
    }
  }

  function fieldBlock(label, value, { warn = false } = {}) {
    const text = String(value || '').trim();
    if (!text) return '';
    const cls = warn ? 'scripts-field scripts-field-warn' : 'scripts-field';
    return `<section class="${cls}"><h4>${esc(label)}</h4><p>${esc(text)}</p></section>`;
  }

  function renderDetail(script) {
    const detail = $('scriptsDetail');
    const listView = $('scriptsListView');
    const detailView = $('scriptsDetailView');
    const title = $('scriptsTitle');
    const eyebrow = $('scriptsEyebrow');
    if (!detail || !listView || !detailView || !title || !eyebrow) return;

    listView.classList.add('hidden');
    detailView.classList.remove('hidden');
    eyebrow.textContent = `Пункт 7 · ${script.id}`;
    title.textContent = script.title || script.id;

    detail.innerHTML = `
      ${fieldBlock('Цель', script.goal)}
      ${fieldBlock('Что сказать', script.body)}
      ${fieldBlock('Следующий шаг', script.next_action)}
      ${fieldBlock('Чего не говорить', script.dont_say || script.do_not_say, { warn: true })}
      ${fieldBlock('Источник', script.source_ref)}
    `;
  }

  function backToList() {
    view = 'list';
    selectedId = null;
    $('scriptsListView')?.classList.remove('hidden');
    $('scriptsDetailView')?.classList.add('hidden');
    $('scriptsEyebrow') && ($('scriptsEyebrow').textContent = 'Пункт 7 · каталог');
    $('scriptsTitle') && ($('scriptsTitle').textContent = 'Скрипты');
    renderList($('scriptsSearch')?.value || '');
    $('scriptsSearch')?.focus();
  }

  function openDetail(id) {
    const script = scripts.find((item) => item.id === id);
    if (!script) return;
    view = 'detail';
    selectedId = id;
    renderDetail(script);
  }

  function renderList(filter = '') {
    const list = $('scriptsList');
    const stats = $('scriptsStats');
    const q = filter.trim().toLowerCase();
    if (!list || !stats) return;

    if (loadError) {
      stats.innerHTML = `<div><b>0</b><span>Ошибка загрузки</span></div>`;
      list.innerHTML = `<div class="scripts-empty">Не удалось загрузить scripts-25.json: ${esc(loadError)}</div>`;
      return;
    }

    const filtered = scripts.filter((item) => {
      if (!q) return true;
      return [item.id, item.title, item.goal, item.body, item.next_action, item.dont_say, item.do_not_say]
        .some((field) => String(field || '').toLowerCase().includes(q));
    });

    stats.innerHTML = `
      <div><b>${scripts.length}</b><span>Всего скриптов</span></div>
      <div><b>${filtered.length}</b><span>Показано</span></div>
      <div><b>I7.3</b><span>Сценарии</span></div>
    `;

    if (!filtered.length) {
      list.innerHTML = '<div class="scripts-empty">Ничего не найдено.</div>';
      return;
    }

    list.innerHTML = filtered.map((item) => `
      <article class="scripts-row" data-script-id="${esc(item.id)}">
        <div class="scripts-id">${esc(item.id)}</div>
        <div class="scripts-main">
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.goal || '')}</p>
        </div>
        <div class="scripts-meta">
          <button class="secondary scripts-open" type="button" data-script-id="${esc(item.id)}">Открыть</button>
        </div>
      </article>
    `).join('');

    list.querySelectorAll('.scripts-open, .scripts-row').forEach((node) => {
      node.addEventListener('click', (event) => {
        const id = event.currentTarget.closest('[data-script-id]')?.dataset.scriptId
          || event.currentTarget.dataset.scriptId;
        if (id) {
          event.preventDefault();
          openDetail(id);
        }
      });
    });
  }

  async function openScripts() {
    const modal = $('scriptsModal');
    if (!modal) return;
    if (!scripts.length && !loadError) await loadScripts();
    view = 'list';
    selectedId = null;
    $('scriptsListView')?.classList.remove('hidden');
    $('scriptsDetailView')?.classList.add('hidden');
    $('scriptsEyebrow') && ($('scriptsEyebrow').textContent = 'Пункт 7 · каталог');
    $('scriptsTitle') && ($('scriptsTitle').textContent = 'Скрипты');
    renderList($('scriptsSearch')?.value || '');
    modal.classList.remove('hidden');
    $('scriptsSearch')?.focus();
  }

  async function openById(id) {
    const scriptId = String(id || '').trim().toUpperCase();
    if (!/^S\d{2}$/.test(scriptId)) return;
    const modal = $('scriptsModal');
    if (!modal) return;
    if (!scripts.length && !loadError) await loadScripts();
    modal.classList.remove('hidden');
    const script = scripts.find((item) => item.id === scriptId);
    if (!script) {
      view = 'list';
      selectedId = null;
      $('scriptsListView')?.classList.remove('hidden');
      $('scriptsDetailView')?.classList.add('hidden');
      $('scriptsEyebrow') && ($('scriptsEyebrow').textContent = 'Пункт 7 · каталог');
      $('scriptsTitle') && ($('scriptsTitle').textContent = 'Скрипты');
      renderList(scriptId);
      return;
    }
    openDetail(scriptId);
  }

  function closeScripts() {
    view = 'list';
    selectedId = null;
    $('scriptsModal')?.classList.add('hidden');
  }

  function bind() {
    const openBtn = $('openScripts');
    const closeBtn = $('closeScripts');
    const backBtn = $('scriptsBack');
    const search = $('scriptsSearch');
    const modal = $('scriptsModal');
    if (openBtn) openBtn.onclick = () => { openScripts(); };
    if (closeBtn) closeBtn.onclick = () => { closeScripts(); };
    if (backBtn) backBtn.onclick = () => { backToList(); };
    if (search) search.oninput = () => {
      if (view === 'list') renderList(search.value);
    };
    if (modal) {
      modal.addEventListener('click', (event) => {
        if (event.target === modal) closeScripts();
      });
    }
    document.addEventListener('keydown', (event) => {
      if (!modal || modal.classList.contains('hidden')) return;
      if (event.key !== 'Escape') return;
      if (view === 'detail') backToList();
      else closeScripts();
    });
    const deepId = scriptIdFromHash();
    if (deepId) openById(deepId);
    else if (location.hash === '#scripts') openScripts();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }

  window.ExpertDentalScriptsCatalog = {
    open: openScripts,
    reload: loadScripts,
    openDetail,
    openById,
  };
})();
