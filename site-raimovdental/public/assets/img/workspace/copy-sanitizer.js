(() => {
  'use strict';

  const replacements = [
    [/\bdraft_pending_clinic\b/gi, 'ожидает утверждения клиникой'],
    [/\bpatient-path(?:\.json)?\b/gi, 'путь пациента'],
    [/\bscripts-25\.json\b/gi, 'каталог сценариев'],
    [/\brecontact-9\.json\b/gi, 'правила повторных обращений'],
    [/\bspeech-markers-(?:before|chair)\.json\b/gi, 'банк речевых подсказок'],
    [/\binternal-marketing\.json\b/gi, 'правила внутренних направлений'],
    [/\badmin-feedback-sop\.json\b/gi, 'регламент обратной связи'],
    [/\bsources\.json\b/gi, 'справочник источников'],
    [/\bsource_ref\b/gi, 'источник'],
    [/\bnext action\b/gi, 'следующее действие'],
    [/\bnext step\b/gi, 'следующий шаг'],
    [/\binbox\b/gi, 'обращения'],
    [/\bSLA\b/g, 'срок ответа'],
    [/\bgate\b/gi, 'обязательное условие'],
    [/\bLive\b/gi, 'текущие данные'],
    [/\bKPI\b/g, 'показатели'],
    [/\bPHI\b/g, 'личные медицинские данные'],
    [/\blocalStorage\b/gi, 'память этого устройства'],
    [/\bclinic health\b/gi, 'состояние клиники'],
    [/\b(?:veneers|implants|ortho)\b/gi, 'направление лечения'],
    [/\bED-(?:MAT|LINK)-?\d*\b/gi, 'материал клиники'],
    [/\bI\d+(?:\.\d+)?\b/g, 'раздел'],
    [/\b(?:MB|MC|S|R|P)\d{1,3}\b/g, 'пример'],
    [/\/render\/(?:#[\w-]+)?/gi, 'модуль обращений'],
    [/\/assets\/img\/workspace\/[\w/-]*/gi, 'рабочая система'],
    [/\bAdmin\b/g, 'Администратор'],
    [/\bUI\b/g, 'интерфейс'],
    [/\bruntime\b/gi, 'рабочая версия'],
    [/\bnoindex\b/gi, 'закрыто от поисковых систем'],
  ];

  function clean(value) {
    return replacements.reduce((text, [pattern, replacement]) => text.replace(pattern, replacement), String(value || ''));
  }

  function sanitize(root = document.body) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      if (node.parentElement?.closest('script,style')) return;
      const next = clean(node.nodeValue);
      if (next !== node.nodeValue) node.nodeValue = next;
    });
    root.querySelectorAll?.('[placeholder],[title],[aria-label],[alt]').forEach((node) => {
      ['placeholder', 'title', 'aria-label', 'alt'].forEach((name) => {
        if (node.hasAttribute(name)) node.setAttribute(name, clean(node.getAttribute(name)));
      });
    });
  }

  let scheduled = false;
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(() => {
      scheduled = false;
      sanitize();
    });
  };

  window.ExpertDentalCopy = { sanitize, clean };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', sanitize);
  else sanitize();
  new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
})();
