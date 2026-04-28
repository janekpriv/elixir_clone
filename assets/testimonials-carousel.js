/*
  assets/testimonials-carousel.js
  Vanilla-JS testimonials carousel: prev/next, autoplay, touch swipe, dot sync.
*/

(function () {
  function initCarousel(wrapper) {
    var track    = wrapper.querySelector('[data-testimonials-track]');
    var cards    = Array.from(track ? track.querySelectorAll('.testimonials__card') : []);
    var dots     = Array.from(wrapper.querySelectorAll('[data-testimonials-dot]'));
    var btnPrev  = wrapper.querySelector('[data-testimonials-prev]');
    var btnNext  = wrapper.querySelector('[data-testimonials-next]');

    if (!track || cards.length < 2) return;

    var current     = 0;
    var total       = cards.length;
    var autoplay    = wrapper.dataset.autoplay !== 'false';
    var speed       = parseInt(wrapper.dataset.autoplaySpeed, 10) || 5000;
    var timer       = null;
    var touchStartX = 0;

    function goTo(index) {
      cards[current].classList.remove('is-active');
      cards[current].setAttribute('aria-hidden', 'true');
      if (dots[current]) {
        dots[current].classList.remove('is-active');
        dots[current].setAttribute('aria-selected', 'false');
      }

      current = (index + total) % total;

      cards[current].classList.add('is-active');
      cards[current].setAttribute('aria-hidden', 'false');
      if (dots[current]) {
        dots[current].classList.add('is-active');
        dots[current].setAttribute('aria-selected', 'true');
      }
    }

    function startAutoplay() {
      if (!autoplay) return;
      timer = setInterval(function () {
        goTo(current + 1);
      }, speed);
    }

    function stopAutoplay() {
      clearInterval(timer);
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', function () {
        stopAutoplay();
        goTo(current - 1);
        startAutoplay();
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', function () {
        stopAutoplay();
        goTo(current + 1);
        startAutoplay();
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        stopAutoplay();
        goTo(parseInt(dot.dataset.testimonialsDot, 10));
        startAutoplay();
      });
    });

    // Touch swipe support
    wrapper.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    wrapper.addEventListener('touchend', function (e) {
      var delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 50) {
        stopAutoplay();
        goTo(delta < 0 ? current + 1 : current - 1);
        startAutoplay();
      }
    }, { passive: true });

    // Pause autoplay on hover
    wrapper.addEventListener('mouseenter', stopAutoplay);
    wrapper.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
  }

  function init() {
    document.querySelectorAll('[data-testimonials]').forEach(initCarousel);
  }

  // Re-init on Theme Editor section load
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
