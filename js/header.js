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
    var body = document.body;
    var revealFab = body.classList.contains("fab-reveal");
    if (!header && !revealFab) return;

    var ticking = false;

    function update() {
      ticking = false;
      var y = window.scrollY;
      if (header) header.classList.toggle("header-scrolled", y > 8);
      if (revealFab) body.classList.toggle("fab-shown", y > 320);
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
