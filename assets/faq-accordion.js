/*
  assets/faq-accordion.js
  Accessible accordion: toggle via max-height animation, aria-expanded sync.
*/

(function () {
  function initFaq(wrapper) {
    var items     = Array.from(wrapper.querySelectorAll('.faq__item'));
    var onlyOne   = wrapper.dataset.onlyOne === 'true';

    if (!items.length) return;

    function open(item) {
      var btn    = item.querySelector('.faq__question');
      var answer = item.querySelector('.faq__answer');
      if (!btn || !answer) return;

      item.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      answer.setAttribute('aria-hidden', 'false');
      // Set explicit max-height to the scrollHeight so CSS transition fires
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }

    function close(item) {
      var btn    = item.querySelector('.faq__question');
      var answer = item.querySelector('.faq__answer');
      if (!btn || !answer) return;

      item.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      answer.setAttribute('aria-hidden', 'true');
      answer.style.maxHeight = '0';
    }

    function toggle(item) {
      var isOpen = item.classList.contains('is-open');

      if (onlyOne && !isOpen) {
        items.forEach(function (other) {
          if (other !== item) close(other);
        });
      }

      isOpen ? close(item) : open(item);
    }

    // Wire up click handlers
    items.forEach(function (item) {
      var btn = item.querySelector('.faq__question');
      if (!btn) return;

      btn.addEventListener('click', function () {
        toggle(item);
      });

      // If item is pre-opened via Liquid class, sync max-height
      if (item.classList.contains('is-open')) {
        var answer = item.querySelector('.faq__answer');
        if (answer) {
          // Use rAF so the element is painted and scrollHeight is accurate
          requestAnimationFrame(function () {
            answer.style.maxHeight = answer.scrollHeight + 'px';
          });
        }
      }
    });
  }

  function init() {
    document.querySelectorAll('[data-faq]').forEach(initFaq);
  }

  document.addEventListener('shopify:section:load', function (e) {
    var wrapper = e.target.querySelector('[data-faq]');
    if (wrapper) initFaq(wrapper);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
