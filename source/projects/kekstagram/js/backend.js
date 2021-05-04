'use strict';

(function () {
  window.backend = (function () {
    var GET_DATA_URL = 'https://javascript.pages.academy/kekstagram/data';
    var SEND_DATA_URL = 'https://javascript.pages.academy/kekstagram';
    var StatusCode = {
      OK: 200
    };
    var TIMEOUT_IN_MS = 10000;

    var createRequest = function (onLoadCb, onErrorCb) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === StatusCode.OK) {
          onLoadCb(xhr.response);
        } else {
          onErrorCb('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });

      xhr.addEventListener('error', function () {
        onErrorCb('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onErrorCb('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = TIMEOUT_IN_MS;

      return xhr;
    };

    return {
      getData: function (onSuccess, onError) {
        var xhr = createRequest(onSuccess, onError);

        xhr.open('GET', GET_DATA_URL);
        xhr.send();
      },
      sendData: function (data, onSuccess, onError) {
        var xhr = createRequest(onSuccess, onError);

        xhr.open('POST', SEND_DATA_URL);
        xhr.send(data);
      }
    };
  })();
})();
