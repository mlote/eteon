/* =========================================================================
   MicFi - reveal.js
   Scroll-in animations for content. No need to edit.
   Comment out the <script src="js/reveal.js"> tag in the pages to turn
   these animations off.
   ========================================================================= */
(function () {
  "use strict";
  var M = window.MicFi;

  M.initScrollReveal = function () {
    if (!document.documentElement.classList.contains("reveal-ready")) return;

    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      for (var j = 0; j < items.length; j++) items[j].classList.add("is-visible");
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        for (var k = 0; k < entries.length; k++) {
          if (entries[k].isIntersecting) {
            entries[k].target.classList.add("is-visible");
            io.unobserve(entries[k].target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    for (var i = 0; i < items.length; i++) io.observe(items[i]);
  };
})();
