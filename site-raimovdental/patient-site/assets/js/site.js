/*
 * Expert Dental Studio — patient site behaviour.
 *
 * Progressive enhancement only: the page is fully readable and every CTA works with
 * JavaScript disabled. FAQ answers render open in markup and are collapsed here, so a
 * no-JS visitor still sees the answers (and so does a crawler reading FAQPage schema).
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- analytics */

  // Real counter IDs arrive later. Until then events queue in dataLayer and are
  // picked up by whichever tag manager the clinic chooses, with nothing to rewire.
  window.dataLayer = window.dataLayer || [];

  function track(event, params) {
    window.dataLayer.push(Object.assign({ event: event }, params || {}));
    if (typeof window.gtag === 'function') window.gtag('event', event, params || {});
    if (typeof window.ym === 'function' && window.__ymId) window.ym(window.__ymId, 'reachGoal', event);
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    var context = link.dataset.ctaContext || document.body.dataset.page || 'unknown';

    if (href.indexOf('wa.me') > -1 || href.indexOf('whatsapp') > -1) {
      track('cta_whatsapp', { context: context, label: link.textContent.trim().slice(0, 80) });
    } else if (href.indexOf('tel:') === 0) {
      track('cta_call', { context: context });
    } else if (link.dataset.cta === 'booking') {
      track('cta_booking_form', { context: context });
    }
  });

  /* ------------------------------------------------------------------ drawer */

  var burger = document.querySelector('[data-drawer-toggle]');
  var drawer = document.querySelector('[data-drawer]');

  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      drawer.dataset.open = String(!open);
    });

    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        burger.setAttribute('aria-expanded', 'false');
        drawer.dataset.open = 'false';
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.dataset.open === 'true') {
        burger.setAttribute('aria-expanded', 'false');
        drawer.dataset.open = 'false';
        burger.focus();
      }
    });
  }

  /* --------------------------------------------------------------------- FAQ */

  Array.prototype.forEach.call(document.querySelectorAll('[data-faq]'), function (root) {
    Array.prototype.forEach.call(root.querySelectorAll('.faq__q'), function (btn, i) {
      var answer = document.getElementById(btn.getAttribute('aria-controls'));
      if (!answer) return;
      // Collapse everything except the first item once JS is available.
      var expanded = i === 0;
      btn.setAttribute('aria-expanded', String(expanded));
      answer.hidden = !expanded;

      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        answer.hidden = open;
      });
    });
  });

  /* ------------------------------------------------------------- read depth */

  var article = document.querySelector('[data-article-slug]');
  if (article && 'IntersectionObserver' in window) {
    var end = article.querySelector('[data-article-end]');
    if (end) {
      var seen = false;
      new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && !seen) {
              seen = true;
              track('article_read', { slug: article.dataset.articleSlug });
            }
          });
        },
        { threshold: 0.4 }
      ).observe(end);
    }
  }

  /* ------------------------------------------------------- active nav state */

  var path = window.location.pathname;
  Array.prototype.forEach.call(document.querySelectorAll('.nav a, .drawer a'), function (a) {
    var href = a.getAttribute('href');
    if (href === path || (href !== '/' && path.indexOf(href) === 0)) {
      a.setAttribute('aria-current', 'page');
    }
  });
})();
