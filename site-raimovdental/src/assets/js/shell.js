/** Nav / hreflang helpers only — Lane C owns forms & analytics POST */

function qs(sel, root = document) {
  return root.querySelector(sel);
}

function setDrawer(open) {
  const toggle = qs('[data-drawer-toggle]');
  const nav = qs('#mobile-nav');
  if (!toggle || !nav) return;
  toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  nav.hidden = !open;
  if (open) {
    const desktop = qs('.site-nav:not(.site-nav--mobile) .site-nav__list');
    if (desktop && !nav.innerHTML.trim()) {
      nav.innerHTML = `<ul class="site-nav__list">${desktop.innerHTML}</ul>`;
    }
  }
}

function initDrawer() {
  const toggle = qs('[data-drawer-toggle]');
  if (!toggle) return;
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    setDrawer(!expanded);
  });
}

function initLangSwitch() {
  document.querySelectorAll('[data-lang-switch]').forEach((el) => {
    el.addEventListener('click', () => {
      const lang = el.getAttribute('data-lang-switch');
      if (lang) {
        try {
          localStorage.setItem('raimovdental-lang-pref', lang);
        } catch {
          /* ignore */
        }
      }
    });
  });
}

function initAnalyticsHooks() {
  document.querySelectorAll('[data-analytics-event]').forEach((el) => {
    el.addEventListener('click', () => {
      document.dispatchEvent(
        new CustomEvent('raimovdental:analytics', {
          detail: {
            event: el.getAttribute('data-analytics-event'),
            section: el.closest('[data-analytics-section]')?.getAttribute('data-analytics-section') || null,
          },
        }),
      );
    });
  });
}


function wireBeforeAfter() {
  document.querySelectorAll('[data-before-after]').forEach(function (root) {
    root.querySelectorAll('[data-show]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var which = btn.getAttribute('data-show');
        root.querySelectorAll('.before-after__frame').forEach(function (f) {
          var on = f.getAttribute('data-frame') === which;
          f.hidden = !on;
          f.classList.toggle('is-active', on);
        });
        root.querySelectorAll('[data-show]').forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
      });
    });
  });
}

function wireFirstVisitView() {
  var el = document.querySelector('[data-analytics-view="first-visit"]');
  if (!el || typeof window.__raimovTrack !== 'function') return;
  window.__raimovTrack('first_visit_block_view', {});
}

document.addEventListener('DOMContentLoaded', () => {
  initDrawer();
  initLangSwitch();
  initAnalyticsHooks();
  wireBeforeAfter();
  wireFirstVisitView();
});
