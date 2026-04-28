/*
  assets/testimonials-carousel.js
  Multi-card sliding carousel. Uses translateX on the flex track.
  Card width is set by CSS (section-scoped flex-basis); JS reads
  offsetWidth at runtime so it respects all breakpoints automatically.
*/

(function () {
  var GAP = 24; // must match the gap in CSS (.testimonials__track gap)

  function getGap(track) {
    var computed = getComputedStyle(track).gap || getComputedStyle(track).columnGap;
    var px = parseFloat(computed);
    return isNaN(px) ? GAP : px;
  }

  function initCarousel(wrapper) {
    var track   = wrapper.querySelector('[data-testimonials-track]');
    var cards   = track ? Array.from(track.querySelectorAll('.testimonials__card')) : [];
    var dots    = Array.from(wrapper.querySelectorAll('[data-testimonials-dot]'));
    var btnPrev = wrapper.querySelector('[data-testimonials-prev]');
    var btnNext = wrapper.querySelector('[data-testimonials-next]');

    if (!track || cards.length < 2) return;

    var total      = cards.length;
    var autoplay   = wrapper.dataset.autoplay !== 'false';
    var speed      = parseInt(wrapper.dataset.autoplaySpeed, 10) || 5000;
    var current    = 0;
    var timer      = null;
    var touchStart = 0;

    function cardWidth() {
      return cards[0].offsetWidth;
    }

    function visibleCount() {
      var wrapW = track.parentElement.offsetWidth;
      var cw    = cardWidth();
      var gap   = getGap(track);
      return Math.max(1, Math.floor((wrapW + gap) / (cw + gap)));
    }

    function maxIndex() {
      return Math.max(0, total - visibleCount());
    }

    function applyTransform(index) {
      var cw  = cardWidth();
      var gap = getGap(track);
      track.style.transform = 'translateX(-' + (index * (cw + gap)) + 'px)';
    }

    function updateDots(index) {
      dots.forEach(function (dot, i) {
        var active = i === index;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', String(active));
      });
    }

    function goTo(index) {
      current = Math.max(0, Math.min(index, maxIndex()));
      applyTransform(current);
      updateDots(current);
    }

    function next() {
      goTo(current >= maxIndex() ? 0 : current + 1);
    }

    function prev() {
      goTo(current <= 0 ? maxIndex() : current - 1);
    }

    function startAutoplay() {
      if (!autoplay) return;
      timer = setInterval(next, speed);
    }

    function stopAutoplay() {
      clearInterval(timer);
    }

    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', function () { prev(); restartAutoplay(); });
    }
    if (btnNext) {
      btnNext.addEventListener('click', function () { next(); restartAutoplay(); });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        goTo(parseInt(dot.dataset.testimonialsDot, 10));
        restartAutoplay();
      });
    });

    // Touch swipe
    wrapper.addEventListener('touchstart', function (e) {
      touchStart = e.changedTouches[0].clientX;
    }, { passive: true });

    wrapper.addEventListener('touchend', function (e) {
      var delta = e.changedTouches[0].clientX - touchStart;
      if (Math.abs(delta) > 50) {
        delta < 0 ? next() : prev();
        restartAutoplay();
      }
    }, { passive: true });

    // Pause on hover
    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);

    // Recalculate on resize (debounced)
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        goTo(Math.min(current, maxIndex()));
      }, 120);
    });

    // Initial state
    goTo(0);
    startAutoplay();
  }

  function init() {
    document.querySelectorAll('[data-testimonials]').forEach(initCarousel);
  }

  document.addEventListener('shopify:section:load', function (e) {
    var wrapper = e.target.querySelector('[data-testimonials]');
    if (wrapper) initCarousel(wrapper);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
