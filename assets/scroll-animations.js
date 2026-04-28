/*
  assets/scroll-animations.js
  Adds .is-visible to .animate-on-scroll elements when they enter the viewport.
  Uses IntersectionObserver — no scroll event listeners.

  Design Mode: in Shopify Theme Editor all elements are revealed immediately
  and re-observed when sections are added/reordered.
*/

(function () {
  var SELECTOR = '.animate-on-scroll, .animate-on-scroll--stagger';

  // In Theme Editor reveal everything immediately — no animation needed
  if (window.Shopify && window.Shopify.designMode) {
    function revealAll() {
      document.querySelectorAll(SELECTOR).forEach(function (el) {
        el.classList.add('is-visible');
      });
    }

    revealAll();

    // Re-reveal when a section is added, moved, or selected in the editor
    document.addEventListener('shopify:section:load',   revealAll);
    document.addEventListener('shopify:section:reorder', revealAll);
    return;
  }

  // No IntersectionObserver support — reveal all immediately
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll(SELECTOR).forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px',
    }
  );

  function observe() {
    document.querySelectorAll(SELECTOR).forEach(function (el) {
      // Skip elements already visible
      if (!el.classList.contains('is-visible')) {
        observer.observe(el);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observe);
  } else {
    observe();
  }
})();
