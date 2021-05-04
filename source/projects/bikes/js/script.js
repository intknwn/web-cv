'use strict';

(function () {
  var nav = document.querySelector('.site-nav');
  var navToggle = document.querySelector('.site-header__nav-toggle');
  var body = document.querySelector('body');

  nav.classList.remove('site-nav--nojs');
  nav.classList.add('site-nav--closed');
  navToggle.classList.add('site-header__nav-toggle--closed');

  navToggle.addEventListener('click', function () {
    if (nav.classList.contains('site-nav--closed')) {
      nav.classList.remove('site-nav--closed');
      nav.classList.add('site-nav--opened');
      body.classList.add('fixed');
      navToggle.classList.remove('site-header__nav-toggle--closed');
    } else {
      nav.classList.add('site-nav--closed');
      nav.classList.remove('site-nav--opened');
      body.classList.remove('fixed');
      navToggle.classList.add('site-header__nav-toggle--closed');
    }
  });
})();

(function () {
  var form = document.querySelector('.contact-form');
  var nameInput = document.querySelector('#name-input');
  var phoneInput = document.querySelector('#phone-input');

  form.noValidate = true;

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();

    if (nameInput.value.length === 0) {
      nameInput.setCustomValidity('Пожалуйста, укажите Ваше имя');
    } else {
      nameInput.setCustomValidity('');
    }

    if (phoneInput.validity.patternMismatch) {
      phoneInput.setCustomValidity('Ввод может содержать только цифры и символ "+": +123456789');
    } else {
      phoneInput.setCustomValidity('');
    }

    if (form.checkValidity()) {
      form.submit();
    } else {
      form.reportValidity();
    }
  });
})();
