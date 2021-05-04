'use strict';

(function () {
  var MAX_HASHTAG_LENGTH = 20;

  var uploadForm = document.querySelector('#upload-select-image');
  var editorModal = uploadForm.querySelector('.img-upload__overlay');
  var hashtagInput = uploadForm.querySelector('.text__hashtags');
  var submitButton = uploadForm.querySelector('.img-upload__submit');
  var successModal = document.querySelector('#success')
    .content
    .querySelector('.success')
    .cloneNode(true);
  var successModalButton = successModal.querySelector('.success__button');
  var errorModal = document.querySelector('#error')
    .content
    .querySelector('.error')
    .cloneNode(true);
  var errorModalButton = errorModal.querySelector('.error__button');
  var main = document.querySelector('main');
  var body = document.querySelector('body');

  var normalizeHashtags = function (hashtags) {
    return hashtags.map(function (tag) {
      return tag.toLowerCase();
    });
  };


  hashtagInput.addEventListener('input', function (evt) {
    var target = evt.target;
    target.setCustomValidity('');
    var hashtags = evt.target.value
      .split(' ')
      .filter(function (hashtag) {
        return hashtag;
      });
    var tags = normalizeHashtags(hashtags);

    tags.forEach(function (tag) {

      var noHashString = tag.substr(1, tag.length);
      if (tag[0] !== '#') {
        target.setCustomValidity('Хеш-теги должны начинаться с символа решетки');
      } else if (!noHashString) {
        target.setCustomValidity('Хеш-теги не могут состоять только из одной решётки');
      } else if (noHashString.includes('#')) {
        target.setCustomValidity('Хэш-теги должны быть разделены пробелами');
      } else if (!noHashString.match(/^[а-яёa-z0-9]+$/i)) {
        target.setCustomValidity('Хеш-теги должны состоять из букв и чисел и не могут содержать пробелы, спецсимволы (#, @, $ и т.п.), символы пунктуации (тире, дефис, запятая и т.п.), эмодзи и т.д.');
      } else if (!window.util.isUnique(tag, tags)) {
        target.setCustomValidity('Один и тот же хэш-тег не может быть использован дважды');
      } else if (tags.length > 5) {
        target.setCustomValidity('Допускается использование не больше пяти хеш-тегов');
      } else if (tag.length > MAX_HASHTAG_LENGTH) {
        target.setCustomValidity('Максимальная длина одного хэш-тега не должна превышать 20 символов, включая решётку');
      }
    });

    if (!target.checkValidity()) {
      hashtagInput.style.border = '2px solid red';
    } else {
      hashtagInput.removeAttribute('style');
    }
  });

  var closeModal = function (modal, cb) {
    main.removeChild(modal);
    body.classList.remove('modal-open');
    document.removeEventListener('keydown', cb);
  };

  var onModalEscPress = function (modal, cb) {
    return function (evt) {
      if (window.util.isEscEvent(evt)) {
        closeModal(modal, cb);
      }
    };
  };

  var onOutsideClick = function (modal, cb) {
    return function (evt) {
      if (evt.target === modal) {
        closeModal(modal, cb);
      }
    };
  };

  var onSuccessEscPress = onModalEscPress(successModal, onSuccessEscPress);
  var onErrorEscPress = onModalEscPress(errorModal, onErrorEscPress);
  var onClickSuccessClose = function () {
    closeModal(successModal, onSuccessEscPress);
  };
  var onClickErrorClose = function () {
    closeModal(errorModal, onErrorEscPress);
  };
  var onSuccessOutsideClick = onOutsideClick(successModal, onSuccessEscPress);
  var onErrorOutsideClick = onOutsideClick(errorModal, onErrorEscPress);


  var onSuccessUpload = function () {
    uploadForm.reset();
    window.restoreEffectsDefaults();

    submitButton.textContent = 'Опубликовать';
    submitButton.disabled = false;

    editorModal.classList.add('hidden');

    document.addEventListener('keydown', onSuccessEscPress);
    document.addEventListener('click', onSuccessOutsideClick);
    successModalButton.addEventListener('click', onClickSuccessClose);

    main.appendChild(successModal);
  };

  var onErrorUpload = function () {
    submitButton.textContent = 'Опубликовать';
    submitButton.disabled = false;

    document.addEventListener('keydown', onErrorEscPress);
    document.addEventListener('click', onErrorOutsideClick);
    errorModalButton.addEventListener('click', onClickErrorClose);

    main.appendChild(errorModal);
  };

  var onFormSubmit = function (evt) {
    submitButton.textContent = 'Данные отправляются...';
    submitButton.disabled = true;
    window.backend.sendData(new FormData(uploadForm), onSuccessUpload, onErrorUpload);
    evt.preventDefault();
  };

  uploadForm.addEventListener('submit', onFormSubmit);
})();
