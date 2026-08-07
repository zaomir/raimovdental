/*
 * Review Hub — progressive enhancement only.
 *
 * Every control is a real form that works with JavaScript off. This file adds two things a
 * patient on a phone notices: a double-submit guard on the score (the plan forbids scoring
 * twice), and a confirmation before opting out of reminders.
 */
(function () {
  'use strict';

  /** Disable only after the browser has started the navigation — sync `disabled` aborts submit. */
  function armBusy(button, label) {
    if (label) button.textContent = label;
    button.setAttribute('aria-busy', 'true');
    setTimeout(function () {
      button.disabled = true;
    }, 0);
  }

  var scale = document.querySelector('.scale');
  if (scale) {
    scale.addEventListener('submit', function (e) {
      // Disabled controls are skipped by form encoding. The score lives on the clicked
      // submitter, so copy it into a hidden field before the double-submit guard runs —
      // otherwise the POST arrives without `score`, the hub redirects back to the same
      // intro page, and the now-disabled buttons look like "nothing happened".
      var submitter = e.submitter || document.activeElement;
      if (submitter && submitter.name === 'score') {
        var prior = scale.querySelector('input[type="hidden"][name="score"]');
        if (prior) prior.parentNode.removeChild(prior);
        var hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.name = 'score';
        hidden.value = submitter.value;
        scale.appendChild(hidden);
      }
      Array.prototype.forEach.call(scale.querySelectorAll('button'), function (b) {
        armBusy(b);
      });
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('.platform__btn'), function (btn) {
    var form = btn.closest('form');
    if (!form) return;
    // Must listen on submit, not click: disabling the submitter in click cancels the POST
    // in WebKit/Blink, leaving the button stuck on "Открываем…".
    form.addEventListener('submit', function () {
      armBusy(btn, 'Открываем…');
    });
  });

  var optOut = document.querySelector('.opt-out');
  if (optOut) {
    optOut.addEventListener('submit', function (e) {
      if (!window.confirm('Больше не напоминать вам об отзывах?')) e.preventDefault();
    });
  }
})();
