'use strict';

(function () {
  window.filters = (function () {
    var RANDOM_PHOTOS_AMOUNT = 10;

    return {
      show: function () {
        var filters = document.querySelector('.img-filters');
        filters.classList.remove('img-filters--inactive');

        var filterDefault = filters.querySelector('#filter-default');
        var filterRandom = filters.querySelector('#filter-random');
        var filterDiscussed = filters.querySelector('#filter-discussed');

        var removePictures = function () {
          document.querySelectorAll('.picture').forEach(function (el) {
            el.remove();
          });
        };

        var makeButtonActive = function (target) {
          var activeClass = 'img-filters__button--active';
          var currentActive = filters.querySelector('.' + activeClass);
          currentActive.classList.remove(activeClass);
          target.classList.add(activeClass);
        };

        var sortByComments = function (left, right) {
          return right.comments.length - left.comments.length;
        };

        filterRandom.addEventListener('click', function () {
          makeButtonActive(filterRandom);
          var randomPhotos = window.util.takeSome([], window.photos, RANDOM_PHOTOS_AMOUNT);
          removePictures();
          window.util.debounce(window.render(randomPhotos));
        });

        filterDefault.addEventListener('click', function () {
          makeButtonActive(filterDefault);
          removePictures();
          window.util.debounce(window.render(window.photos));
        });

        filterDiscussed.addEventListener('click', function () {
          makeButtonActive(filterDiscussed);
          removePictures();
          var mostDiscussed = window.photos.slice();
          window.util.debounce((window.render(mostDiscussed.sort(sortByComments))));
        });
      }
    };

  })();
})();

