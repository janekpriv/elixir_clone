/*
  assets/announcement-bar.js
  Close button hides the bar and persists the state in sessionStorage.
  On page load, if the bar was closed this session it is hidden immediately
  (before paint) to prevent flash.
*/

(function () {
  var STORAGE_KEY_PREFIX = 'elixir-bar-closed-';

  function hideBar(bar, sectionId) {
    bar.style.display = 'none';
    try {
      sessionStorage.setItem(STORAGE_KEY_PREFIX + sectionId, '1');
    } catch (e) {
      // sessionStorage unavailable (private mode etc.) — silent fail
    }
  }

  function initBar(bar) {
    var sectionId = bar.dataset.announcementBar !== undefined
      ? bar.id.replace('elixir-bar-', '')
      : null;

    if (!sectionId) return;

    // Hide immediately if closed this session
    try {
      if (sessionStorage.getItem(STORAGE_KEY_PREFIX + sectionId) === '1') {
        bar.style.display = 'none';
        return;
      }
    } catch (e) {}

    // Wire close button
    var closeBtn = bar.querySelector('[data-announcement-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        hideBar(bar, sectionId);
      });
    }
  }

  function init() {
    document.querySelectorAll('[data-announcement-bar]').forEach(initBar);
  }

  // Re-init on Theme Editor section load
  document.addEventListener('shopify:section:load', function (e) {
    var bar = e.target.querySelector('[data-announcement-bar]');
    if (bar) initBar(bar);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
