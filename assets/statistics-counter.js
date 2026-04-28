/*
  assets/statistics-counter.js
  Count-up animation for [data-statistics] sections.
  Parses value strings like "20,000+", "4.9", "98%" — skips non-numeric (#1, text).
  Uses IntersectionObserver (threshold 0.3) to trigger once on entry.
*/

(function () {
  var DURATION = 1800; // ms

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateValue(el, start, end, decimals, prefix, suffix) {
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / DURATION, 1);
      var eased    = easeOutQuart(progress);
      var current  = start + (end - start) * eased;
      el.textContent = prefix + formatNumber(current, decimals) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  function formatNumber(n, decimals) {
    // Preserve comma-thousands if the original had them
    var fixed = n.toFixed(decimals);
    if (decimals === 0 && n >= 1000) {
      return Math.round(n).toLocaleString();
    }
    return fixed;
  }

  function parseValue(raw) {
    // Match leading optional non-digit chars (prefix), then number, then suffix
    // e.g. "20,000+" → prefix:"", number:20000, suffix:"+"
    //      "4.9"     → prefix:"", number:4.9,   suffix:""
    //      "98%"     → prefix:"", number:98,     suffix:"%"
    //      "#1"      → no match → skip

    // Strip commas from number portion to allow comma-thousands
    var clean = raw.replace(/,/g, '');
    var match = clean.match(/^([^0-9]*)(\d+\.?\d*)(.*)$/);
    if (!match) return null;

    return {
      prefix:   match[1],
      number:   parseFloat(match[2]),
      suffix:   match[3],
      decimals: (match[2].indexOf('.') >= 0) ? match[2].split('.')[1].length : 0,
    };
  }

  function initSection(wrapper) {
    var shouldAnimate = wrapper.dataset.animate !== 'false';
    if (!shouldAnimate) return;

    var counters = Array.from(wrapper.querySelectorAll('[data-count]'));
    if (!counters.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);

          counters.forEach(function (el) {
            var raw    = el.dataset.count;
            var parsed = parseValue(raw);
            if (!parsed) return; // non-numeric value, leave as-is
            animateValue(el, 0, parsed.number, parsed.decimals, parsed.prefix, parsed.suffix);
          });
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(wrapper);
  }

  function init() {
    document.querySelectorAll('[data-statistics]').forEach(initSection);
  }

  document.addEventListener('shopify:section:load', function (e) {
    var wrapper = e.target.querySelector('[data-statistics]');
    if (wrapper) initSection(wrapper);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
