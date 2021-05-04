'use strict';

(function () {
  var ZOOM_DEFAULT_VALUE = 100;
  var ZOOM_MAX = 100;
  var ZOOM_MIN = 25;
  var ZOOM_STEP = 25;
  var EFFECT_DEFAULT_DEPTH = 100;

  var uploadForm = document.querySelector('#upload-select-image');
  var zoomOutButton = uploadForm.querySelector('.scale__control--smaller');
  var zoomInButton = uploadForm.querySelector('.scale__control--bigger');
  var zoomValueInput = uploadForm.querySelector('.scale__control--value');
  var previewImage = uploadForm.querySelector('.img-upload__preview img');
  var effectLevel = uploadForm.querySelector('.img-upload__effect-level');
  var effectLevelInput = uploadForm.querySelector('.effect-level__value');
  var sliderPin = uploadForm.querySelector('.effect-level__pin');
  var effectLevelDepth = uploadForm.querySelector('.effect-level__depth');
  var effectLevelLine = document.querySelector('.effect-level__line');

  window.restoreEffectsDefaults = function () {
    zoomValueInput.value = ZOOM_DEFAULT_VALUE + '%';
    previewImage.removeAttribute('style');
    previewImage.removeAttribute('class');
    effectLevel.classList.add('hidden');
  };

  zoomValueInput.value = ZOOM_DEFAULT_VALUE + '%';
  effectLevel.classList.add('hidden');

  var setPinPosition = function (depth) {
    sliderPin.style.left = depth + '%';
    effectLevelDepth.style.width = depth + '%';
    effectLevelInput.value = parseInt(depth, 10);
  };

  setPinPosition(EFFECT_DEFAULT_DEPTH);

  var setScale = function (scaleValue) {
    var newScaleValue = scaleValue === 100 ? 1 : '0.' + scaleValue;
    previewImage.style.transform = 'scale(' + newScaleValue + ')';
  };

  var zoomIn = function () {
    var currentZoomValue = parseInt(zoomValueInput.value, 10);
    if (currentZoomValue < ZOOM_MAX) {
      var newZoomValue = currentZoomValue + ZOOM_STEP;
      zoomValueInput.value = newZoomValue + '%';
      setScale(newZoomValue);
    }
  };

  var zoomOut = function () {
    var currentZoomValue = parseInt(zoomValueInput.value, 10);
    if (currentZoomValue > ZOOM_MIN) {
      var newZoomValue = currentZoomValue - ZOOM_STEP;
      zoomValueInput.value = newZoomValue + '%';
      setScale(newZoomValue);
    }
  };

  zoomInButton.addEventListener('click', zoomIn);
  zoomOutButton.addEventListener('click', zoomOut);

  var onEffectChange = function (evt) {
    if (evt.target && evt.target.matches('.effects__radio')) {
      previewImage.className = '';
      var effectName = evt.target.value;
      var newEffectClass = 'effects__preview--' + effectName;
      previewImage.classList.add(newEffectClass);
      if (effectName !== 'none') {
        effectLevel.classList.remove('hidden');
      } else {
        effectLevel.classList.add('hidden');
      }

      var effect = Effect[effectName];
      previewImage.style.filter = effect.cb(effect.MAX_DEPTH);
      setPinPosition(EFFECT_DEFAULT_DEPTH);
    }
  };

  var Effect = {
    'none': {
      'cb': function () {
        return '';
      }
    },
    'chrome': {
      'MAX_DEPTH': 1,
      'cb': function (depth) {
        return 'grayscale(' + window.util.getProportion(depth, this.MAX_DEPTH) + ')';
      }
    },
    'sepia': {
      'MAX_DEPTH': 1,
      'cb': function (depth) {
        return 'sepia(' + window.util.getProportion(depth, this.MAX_DEPTH) + ')';
      }
    },
    'marvin': {
      'MAX_DEPTH': 100,
      'cb': function (depth) {
        return 'invert(' + window.util.getProportion(depth, this.MAX_DEPTH) + '%)';
      }
    },
    'phobos': {
      'MAX_DEPTH': 3,
      'cb': function (depth) {
        return 'blur(' + window.util.getProportion(depth, this.MAX_DEPTH) + 'px)';
      }
    },
    'heat': {
      'MAX_DEPTH': 3,
      'cb': function (depth) {
        return 'brightness(' + window.util.getProportion(depth, this.MAX_DEPTH) + ')';
      }
    }
  };

  var changeEffectDepth = function () {
    var depth = effectLevelInput.value;
    var effectButtons = uploadForm.querySelectorAll('.effects__radio');
    var selectedEffect = '';
    effectButtons.forEach(function (button) {
      if (button.checked) {
        selectedEffect = button.value;
      }
    });

    previewImage.style.filter = Effect[selectedEffect].cb(depth);
  };

  var setWithinLimits = function (value) {
    if (value > 100) {
      value = 100;
    } else if (value < 0) {
      value = 0;
    } else {
      setPinPosition(value);
    }
  };

  uploadForm.addEventListener('change', onEffectChange);
  sliderPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var effectLineWidth = effectLevelLine.offsetWidth;

    var startX = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shiftX = startX - moveEvt.clientX;
      startX = moveEvt.clientX;

      var value = (sliderPin.offsetLeft - shiftX) * 100 / effectLineWidth;

      setWithinLimits(value);

      changeEffectDepth();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      changeEffectDepth();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };


    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  });

  sliderPin.addEventListener('keydown', function (evt) {
    var value = parseInt(effectLevelInput.value, 10);
    if (window.util.isLeftKeyEvent(evt)) {
      setWithinLimits(value - 1);
      changeEffectDepth();
    }
    if (window.util.isRightKeyEvent(evt)) {
      setWithinLimits(value + 1);
      changeEffectDepth();
    }
  });
})();
