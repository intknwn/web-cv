'use strict';

(function () {
  var COMMENTS_TO_SHOW = 5;
  var picturesListElement = document.querySelector('.pictures');
  var bigPictureSection = document.querySelector('.big-picture');
  var bigPictureImage = document.querySelector('.big-picture__img').children[0];
  var likesCount = document.querySelector('.likes-count');
  var commentsCounter = document.querySelector('.social__comment-count');
  var commentsLoader = document.querySelector('.comments-loader');
  var commentsCount = document.querySelector('.comments-count');
  var commentsList = document.querySelector('.social__comments');
  var photoDescription = document.querySelector('.social__caption');
  var commentTemplate = document.querySelector('#comment')
    .content
    .querySelector('.social__comment');
  var body = document.querySelector('body');
  var closeModalButton = document.querySelector('.big-picture__cancel');

  var getSrc = function (target) {
    if (target.matches('.picture')) {
      return target.querySelector('.picture__img').getAttribute('src');
    }
    if (target.matches('.picture__img')) {
      return target.getAttribute('src');
    }

    return '';
  };

  var renderComments = function (comments) {
    var commentElements = comments.map(function (comment) {
      var commentElement = commentTemplate.cloneNode(true);
      var avatarElement = commentElement.querySelector('.social__picture');
      avatarElement.src = comment.avatar;
      avatarElement.alt = comment.name;
      commentElement.querySelector('.social__text').textContent = comment.message;

      return commentElement;
    });

    window.util.appendChildren(commentsList, commentElements);
  };

  var restComments = [];
  var commentsTotal = 0;

  var onClickLoadComments = function () {
    loadComments(restComments);
  };

  var updateCommentsCounter = function () {
    var comments = document.querySelectorAll('.social__comment');
    commentsCounter.textContent = comments.length + ' из ' + commentsTotal + ' комментариев';
  };

  var loadComments = function (comments) {
    commentsLoader.classList.remove('hidden');
    commentsLoader.addEventListener('click', onClickLoadComments);
    if (comments.length > COMMENTS_TO_SHOW) {

      var firstFiveComments = comments.slice(0, 5);
      restComments = comments.slice(5, comments.length);

      renderComments(firstFiveComments);
      updateCommentsCounter();
    } else {
      renderComments(comments);
      updateCommentsCounter();
      commentsLoader.removeEventListener('click', onClickLoadComments);
      commentsLoader.classList.add('hidden');
    }
  };

  picturesListElement.addEventListener('click', function (evt) {
    var targetSrc = getSrc(evt.target);
    if (targetSrc) {
      bigPictureSection.classList.remove('hidden');
      document.addEventListener('keydown', onModalEscPress);

      var photoData = window.photos.find(function (obj) {
        return obj.url === targetSrc;
      });

      bigPictureImage.src = photoData.url;
      likesCount.textContent = photoData.likes;
      commentsCount.textContent = photoData.comments.length;
      commentsTotal = photoData.comments.length;
      photoDescription.textContent = photoData.description;

      commentsList.textContent = '';
      loadComments(photoData.comments);

      body.classList.add('modal-open');
    }
  });

  var closeModal = function () {
    bigPictureSection.classList.add('hidden');
    body.classList.remove('modal-open');
    document.removeEventListener('keydown', onModalEscPress);
  };

  var onModalEscPress = function (evt) {
    if (window.util.isEscEvent(evt)) {
      closeModal();
    }
  };

  closeModalButton.addEventListener('click', closeModal);

})();
