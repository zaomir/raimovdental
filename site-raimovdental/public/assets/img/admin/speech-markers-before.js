(() => {
  'use strict';

  const MARKERS_URL = '/assets/img/workspace/content/speech-markers-before.json?v=20260807-i111';
  const $ = (id) => document.getElementById(id);
  const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[char]));

  let payload = null;
  let markers = [];
  let loadError = '';
  let view = 'list';
  let selectedId = null;

  function markerIdFromHash() {
    const raw = String(location.hash || '').replace(/^#/, '');
    if (!raw.startsWith('markers')) return '';
    const match = raw.match(/^markers(?:=|\/)(MB\d{2})$/i);
    return match ? match[1].toUpperCase() : '';
  }

  async function loadMarkers() {
    try {
      const res = await fetch(MARKERS_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!data || !Array.isArray(data.markers) || data.markers.length < 3) {
        throw new Error(`expected ≥3 markers, got ${Array.isArray(data?.markers) ? data.markers.length : typeof data?.markers}`);
      }
      payload = data;
      markers = data.markers;
      loadError = '';
    } catch (err) {
      payload = null;
      markers = [];
      loadError = err?.message || String(err);
    }
  }

  function fieldBlock(label, value, { warn = false } = {}) {
    const text = String(value || '').trim();
    if (!text) return '';
    const cls = warn ? 'markers-field markers-field-warn' : 'markers-field';
    return `<section class="${cls}"><h4>${esc(label)}</h4><p>${esc(text)}</p></section>`;
  }

  function pendingPhrase(marker) {
    const draft = String(marker.phrase_draft || '').trim();
    if (draft) return draft;
    return `Черновик фразы пуст · статус ${marker.phrase_status || 'draft_pending_clinic'}. До утверждения клиники используйте «слушать» и уточняющие вопросы из patient-path.`;
  }

  function renderDetail(marker) {
    const detail = $('markersDetail');
    const listView = $('markersListView');
    const detailView = $('markersDetailView');
    const title = $('markersTitle');
    const eyebrow = $('markersEyebrow');
    if (!detail || !listView || !detailView || !title || !eyebrow) return;

    listView.classList.add('hidden');
    detailView.classList.remove('hidden');
    eyebrow.textContent = `I11.1 · ${marker.id}`;
    title.textContent = marker.route_title || marker.id;

    detail.innerHTML = `
      ${fieldBlock('Маршрут', `${marker.route_title || ''} (${marker.route || ''})`)}
      ${fieldBlock('Слушать (из patient-path)', marker.listen_for)}
      ${fieldBlock('Вопрос пациента', marker.patient_question)}
      ${fieldBlock('Уточнить', marker.clarify_questions)}
      ${fieldBlock('Что сказать (черновик)', pendingPhrase(marker), { warn: true })}
      ${fieldBlock('Чего не говорить', marker.dont_say_draft || '', { warn: true })}
      ${fieldBlock('Следующий шаг', marker.next_step_draft || '')}
      ${fieldBlock('Результат первого визита (канон пути)', marker.first_visit_result || '')}
      ${fieldBlock('Источник listen_for', marker.listen_for_source_ref || '')}
      ${fieldBlock('Статус контента', marker.phrase_status || payload?.status || 'draft_pending_clinic')}
    `;
  }

  function backToList() {
    view = 'list';
    selectedId = null;
    $('markersListView')?.classList.remove('hidden');
    $('markersDetailView')?.classList.add('hidden');
    $('markersEyebrow') && ($('markersEyebrow').textContent = 'I11.1 · до кресла');
    $('markersTitle') && ($('markersTitle').textContent = 'Маркеры');
    renderList($('markersSearch')?.value || '');
    $('markersSearch')?.focus();
  }

  function openDetail(id) {
    const marker = markers.find((item) => item.id === id);
    if (!marker) return;
    view = 'detail';
    selectedId = id;
    renderDetail(marker);
  }

  function renderList(filter = '') {
    const list = $('markersList');
    const stats = $('markersStats');
    const note = $('markersNote');
    const q = filter.trim().toLowerCase();
    if (!list || !stats) return;

    if (note) {
      const status = payload?.status || 'draft_pending_clinic';
      note.textContent = `Статус банка: ${status}. Готовые медфразы не заполнены — только каркас + сигналы из patient-path.json.`;
    }

    if (loadError) {
      stats.innerHTML = `<div><b>0</b><span>Ошибка загрузки</span></div>`;
      list.innerHTML = `<div class="markers-empty">Не удалось загрузить speech-markers-before.json: ${esc(loadError)}</div>`;
      return;
    }

    const filtered = markers.filter((item) => {
      if (!q) return true;
      return [item.id, item.route, item.route_title, item.listen_for, item.clarify_questions, item.next_step_draft]
        .some((field) => String(field || '').toLowerCase().includes(q));
    });

    stats.innerHTML = `
      <div><b>${markers.length}</b><span>Маркеров</span></div>
      <div><b>${filtered.length}</b><span>Показано</span></div>
      <div><b>3</b><span>Маршрута</span></div>
    `;

    if (!filtered.length) {
      list.innerHTML = '<div class="markers-empty">Ничего не найдено.</div>';
      return;
    }

    list.innerHTML = filtered.map((item) => `
      <article class="markers-row" data-atom="i111-speech-markers-before" data-marker-id="${esc(item.id)}" data-marker-route="${esc(item.route || '')}">
        <div class="markers-id">${esc(item.id)}</div>
        <div class="markers-main">
          <h3>${esc(item.route_title || item.route || item.id)}</h3>
          <p>${esc(item.listen_for || '')}</p>
        </div>
        <div class="markers-meta">
          <button class="secondary markers-open" type="button" data-marker-id="${esc(item.id)}">Открыть</button>
        </div>
      </article>
    `).join('');

    list.querySelectorAll('.markers-open, .markers-row').forEach((node) => {
      node.addEventListener('click', (event) => {
        const id = event.currentTarget.closest('[data-marker-id]')?.dataset.markerId
          || event.currentTarget.dataset.markerId;
        if (id) {
          event.preventDefault();
          openDetail(id);
        }
      });
    });
  }

  async function openMarkers() {
    const modal = $('markersModal');
    if (!modal) return;
    if (!markers.length && !loadError) await loadMarkers();
    view = 'list';
    selectedId = null;
    $('markersListView')?.classList.remove('hidden');
    $('markersDetailView')?.classList.add('hidden');
    $('markersEyebrow') && ($('markersEyebrow').textContent = 'I11.1 · до кресла');
    $('markersTitle') && ($('markersTitle').textContent = 'Маркеры');
    renderList($('markersSearch')?.value || '');
    modal.classList.remove('hidden');
    $('markersSearch')?.focus();
  }

  async function openById(id) {
    const markerId = String(id || '').trim().toUpperCase();
    if (!/^MB\d{2}$/.test(markerId)) return;
    const modal = $('markersModal');
    if (!modal) return;
    if (!markers.length && !loadError) await loadMarkers();
    modal.classList.remove('hidden');
    const marker = markers.find((item) => item.id === markerId);
    if (!marker) {
      view = 'list';
      selectedId = null;
      $('markersListView')?.classList.remove('hidden');
      $('markersDetailView')?.classList.add('hidden');
      renderList(markerId);
      return;
    }
    openDetail(markerId);
  }

  function closeMarkers() {
    view = 'list';
    selectedId = null;
    $('markersModal')?.classList.add('hidden');
  }

  function bind() {
    const openBtn = $('openMarkers');
    const closeBtn = $('closeMarkers');
    const backBtn = $('markersBack');
    const search = $('markersSearch');
    const modal = $('markersModal');
    if (openBtn) openBtn.onclick = () => { openMarkers(); };
    if (closeBtn) closeBtn.onclick = () => { closeMarkers(); };
    if (backBtn) backBtn.onclick = () => { backToList(); };
    if (search) search.oninput = () => {
      if (view === 'list') renderList(search.value);
    };
    if (modal) {
      modal.addEventListener('click', (event) => {
        if (event.target === modal) closeMarkers();
      });
    }
    document.addEventListener('keydown', (event) => {
      if (!modal || modal.classList.contains('hidden')) return;
      if (event.key !== 'Escape') return;
      if (view === 'detail') backToList();
      else closeMarkers();
    });
    const deepId = markerIdFromHash();
    if (deepId) openById(deepId);
    else if (location.hash === '#markers') openMarkers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }

  window.ExpertDentalSpeechMarkersBefore = {
    open: openMarkers,
    reload: loadMarkers,
    openDetail,
    openById,
  };
})();
