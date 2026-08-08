(function () {
  var PASSWORD = '0726';
  var STORAGE_KEY = 'nogiVRukiAuditUnlocked';
  var body = document.body;
  var form = document.getElementById('audit-gate-form');
  var input = document.getElementById('audit-password');
  var button = document.getElementById('audit-unlock');
  var error = document.getElementById('audit-gate-error');

  function normalize(value) {
    return String(value || '')
      .replace(/[\u200B-\u200D\uFEFF]/g, '')
      .trim()
      .replace(/\s+/g, '');
  }

  function unlock() {
    if (!body) return;
    body.classList.remove('audit-locked');
    body.classList.add('audit-unlocked');
    if (error) error.classList.remove('is-visible');
    try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
  }

  function check() {
    if (normalize(input && input.value) === PASSWORD) {
      unlock();
      return;
    }
    if (error) error.classList.add('is-visible');
    if (input) {
      input.focus();
      input.select();
    }
  }

  try {
    if (sessionStorage.getItem(STORAGE_KEY) === '1') unlock();
  } catch (e) {}

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      check();
    });
  }

  if (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      check();
    });
  }

  if (input) {
    input.addEventListener('input', function () {
      if (error) error.classList.remove('is-visible');
    });
    input.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        check();
      }
    });
    if (body && body.classList.contains('audit-locked')) {
      try { input.focus(); } catch (e) {}
    }
  }
})();
