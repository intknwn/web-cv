'use strict';

(function () {
  var pictureTemplate = document.querySelector('#picture')
    .content
    .querySelector('.picture');
  var picturesListElement = document.querySelector('.pictures');

  window.render = function (photos) {
    var photoElements = photos.map(function (photo) {
      var photoElement = pictureTemplate.cloneNode(true);
      photoElement.querySelector('.picture__img').src = photo.url;
      photoElement.querySelector('.picture__comments').textContent = photo.comments.length;
      photoElement.querySelector('.picture__likes').textContent = photo.likes;

      return photoElement;
    });

    window.util.appendChildren(picturesListElement, photoElements);
  };

  var successHandler = function (data) {
    window.photos = data;
    window.render(data);
    window.filters.show();
  };

  window.backend.getData(successHandler, window.util.errorHandler);
})();
