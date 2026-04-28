/*
  assets/header-sticky.js
  Adds/removes .elixir-header--scrolled on .header-wrapper at 50px scroll.
  Dawn's own StickyHeader element handles show/hide logic — this only
  controls the glassmorphism visual state.
*/

(function () {
  var headerWrapper = document.querySelector('.header-wrapper');
  if (!headerWrapper) return;

  var SCROLL_THRESHOLD = 50;
  var ticking = false;

  function updateHeader() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      headerWrapper.classList.add('elixir-header--scrolled');
    } else {
      headerWrapper.classList.remove('elixir-header--scrolled');
    }
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  // Run on load in case page is already scrolled (e.g. browser back)
  updateHeader();
})();
