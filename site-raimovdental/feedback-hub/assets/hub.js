/*
 * Review Hub — progressive enhancement only.
 *
 * Every control is a real form that works with JavaScript off. This file adds two things a
 * patient on a phone notices: a double-submit guard on the score (the plan forbids scoring
 * twice), and a confirmation before opting out of reminders.
 */
(function () {
  'use strict';

  var scale = document.querySelector('.scale');
  if (scale) {
    scale.addEventListener('submit', function () {
      // A second tap while the POST is in flight would otherwise land on the redirect target.
      Array.prototype.forEach.call(scale.querySelectorAll('button'), function (b) {
        b.disabled = true;
      });
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('.platform__btn'), function (btn) {
    btn.addEventListener('click', function () {
      btn.disabled = true;
      btn.textContent = 'Открываем…';
    });
  });

  var optOut = document.querySelector('.opt-out');
  if (optOut) {
    optOut.addEventListener('submit', function (e) {
      if (!window.confirm('Больше не напоминать вам об отзывах?')) e.preventDefault();
    });
  }
})();
