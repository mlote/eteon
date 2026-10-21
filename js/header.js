/* =========================================================================
   MicFi - header.js
   Adds a frosted background to the header once the page is scrolled.
   No need to edit.
   ========================================================================= */
(function () {
  "use strict";
  var M = window.MicFi;

  M.initHeader = function () {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var ticking = false;

    function update() {
      ticking = false;
      var scrolled = window.scrollY > 8;
      header.classList.toggle("header-scrolled", scrolled);
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
  };
})();
