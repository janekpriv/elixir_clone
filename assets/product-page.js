/*
  assets/product-page.js
  Elixir product page interactions:
  - Gallery thumbnail click → update main image
  - Product tabs toggle
  - Delivery date calculation (business days)
  - Elixir ATC variant ID sync from Dawn's variant picker
*/

(function () {
  /* ── Gallery ──────────────────────────────────────────── */
  function initGalleries() {
    document.querySelectorAll('[data-elixir-gallery]').forEach(function (gallery) {
      var mainImg = gallery.querySelector('.elixir-gallery__main-img');
      if (!mainImg) return;

      gallery.querySelectorAll('.elixir-gallery__thumb').forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          gallery.querySelectorAll('.elixir-gallery__thumb').forEach(function (t) {
            t.classList.remove('is-active');
          });
          thumb.classList.add('is-active');
          mainImg.src = thumb.dataset.src;
          mainImg.setAttribute('srcset', '');
        });
      });
    });
  }

  /* ── Product tabs ─────────────────────────────────────── */
  function initTabs() {
    document.querySelectorAll('[data-elixir-tabs]').forEach(function (tabs) {
      var btns   = Array.from(tabs.querySelectorAll('.elixir-tabs__tab'));
      var panels = Array.from(tabs.querySelectorAll('.elixir-tabs__panel'));

      btns.forEach(function (btn, i) {
        btn.addEventListener('click', function () {
          btns.forEach(function (b) {
            b.classList.remove('is-active');
            b.setAttribute('aria-selected', 'false');
          });
          panels.forEach(function (p) { p.classList.remove('is-active'); });
          btn.classList.add('is-active');
          btn.setAttribute('aria-selected', 'true');
          if (panels[i]) panels[i].classList.add('is-active');
        });
      });
    });
  }

  /* ── Delivery date ────────────────────────────────────── */
  function addBusinessDays(date, days) {
    var result = new Date(date);
    var added  = 0;
    while (added < days) {
      result.setDate(result.getDate() + 1);
      var dow = result.getDay();
      if (dow !== 0 && dow !== 6) added++;
    }
    return result;
  }

  function formatDeliveryDate(date) {
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return months[date.getMonth()] + ' ' + date.getDate();
  }

  function initDelivery() {
    document.querySelectorAll('[data-elixir-delivery]').forEach(function (el) {
      var days    = parseInt(el.dataset.days || '3', 10);
      var dateEl  = el.querySelector('[data-delivery-date]');
      if (!dateEl) return;
      var delivery = addBusinessDays(new Date(), days);
      dateEl.textContent = formatDeliveryDate(delivery);
    });
  }

  /* ── Elixir ATC variant sync ──────────────────────────── */
  function initAtcSync() {
    document.querySelectorAll('[data-elixir-atc]').forEach(function (atcEl) {
      var sectionId  = atcEl.dataset.section;
      var atcInput   = atcEl.querySelector('input[name="id"]');
      if (!atcInput || !sectionId) return;

      // Watch Dawn's main product form input for variant changes
      var mainInput = document.querySelector(
        '#product-form-' + sectionId + ' input[name="id"]'
      );
      if (mainInput) {
        mainInput.addEventListener('change', function () {
          atcInput.value = mainInput.value;
        });
      }
    });
  }

  /* ── Re-init on Theme Editor section load ─────────────── */
  document.addEventListener('shopify:section:load', function (e) {
    if (e.target.querySelector('[data-elixir-gallery]')) initGalleries();
    if (e.target.querySelector('[data-elixir-tabs]'))    initTabs();
    if (e.target.querySelector('[data-elixir-delivery]')) initDelivery();
    if (e.target.querySelector('[data-elixir-atc]'))     initAtcSync();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initGalleries();
      initTabs();
      initDelivery();
      initAtcSync();
    });
  } else {
    initGalleries();
    initTabs();
    initDelivery();
    initAtcSync();
  }
})();
