/*
  assets/header-elixir.js
  Elixir header: sticky glassmorphism background after 80px scroll.
  Reads data-transparent-on-top from .header-wrapper to decide
  whether header starts transparent or always shows dark bg.
*/

(function () {
  var header = document.querySelector('.header-wrapper');
  if (!header) return;

  var SCROLL_THRESHOLD = 80;
  var transparentOnTop = header.dataset.transparentOnTop !== 'false';

  function updateHeader() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('is-sticky');
    } else {
      header.classList.remove('is-sticky');
    }
  }

  if (!transparentOnTop) {
    header.classList.add('is-sticky');
  } else {
    updateHeader();
  }

  window.addEventListener('scroll', updateHeader, { passive: true });

  document.addEventListener('shopify:section:load', function (e) {
    if (e.target.querySelector('.header-wrapper')) {
      header = document.querySelector('.header-wrapper');
      if (!header) return;
      transparentOnTop = header.dataset.transparentOnTop !== 'false';
      if (!transparentOnTop) {
        header.classList.add('is-sticky');
      } else {
        updateHeader();
      }
    }
  });
})();
