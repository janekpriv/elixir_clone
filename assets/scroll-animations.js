/*
  assets/scroll-animations.js
  Adds .is-visible to .animate-on-scroll elements when they enter the viewport.
  Uses IntersectionObserver — no scroll event listeners.
*/

(function () {
  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything immediately
    document.querySelectorAll('.animate-on-scroll, .animate-on-scroll--stagger').forEach(function (el) {
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
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  function observe() {
    document.querySelectorAll('.animate-on-scroll, .animate-on-scroll--stagger').forEach(function (el) {
      observer.observe(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observe);
  } else {
    observe();
  }
})();
