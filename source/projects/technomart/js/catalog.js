var cartLink = document.querySelector(".cart");
var bookmarksLink = document.querySelector(".bookmarks");
var addToCartLinks = document.getElementsByClassName("add-to-cart");
var addToBookmarksLinks = document.getElementsByClassName("add-to-bookmarks");
var items = document.querySelector(".items-counter");
var bookmarks = document.querySelector(".bookmarks-counter");
var itemsCounter = 0;
var bookmarksCounter = 0;

var addToCartPopUp = document.querySelector(".add-to-cart-popup");
var addToCartPopUpClose = document.querySelector(".add-to-cart-close");

for (var i = 0; i < addToCartLinks.length; i++) {
  (function (i) {
    addToCartLinks[i].addEventListener("click", function(evt) {
      evt.preventDefault();
      cartLink.classList.add("cart-not-empty");
      addToCartPopUp.classList.add("popup-show");
      itemsCounter++;
      items.textContent = itemsCounter;
     })
  })(i);
}

for (var i = 0; i < addToBookmarksLinks.length; i++) {
  (function (i) {
    addToBookmarksLinks[i].addEventListener("click", function(evt) {
      evt.preventDefault();
      bookmarksLink.classList.add("bookmarks-not-empty");
      bookmarksCounter++;
      bookmarks.textContent = bookmarksCounter;
     })
  })(i);
}

addToCartPopUpClose.addEventListener("click", function (evt) {
  evt.preventDefault();
  addToCartPopUp.classList.remove("popup-show");
});

window.addEventListener("keydown", function (evt) {
  if (evt.keyCode === 27) {
    evt.preventDefault();

    if (addToCartPopUp.classList.contains("popup-show")) {
      addToCartPopUp.classList.remove("popup-show");
    }
  }
});
